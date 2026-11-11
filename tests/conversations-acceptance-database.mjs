import { PGlite } from '@electric-sql/pglite'
import { readFile, readdir } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { verifyConversations } from './helpers/conversations-acceptance.mjs'

const db = new PGlite()
const ids = { ana: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', joao: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', buyer: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', carrier: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd' }
await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key,email text);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`)
for (const [name, id] of Object.entries(ids)) await db.query('insert into auth.users values($1,$2)', [id, `${{ buyer: 'comprador', carrier: 'transporte' }[name] || name}@conexa.invalid`])
for (const file of (await readdir('supabase/migrations')).filter(f => f.endsWith('.sql')).sort()) await db.exec(await readFile(`supabase/migrations/${file}`, 'utf8'))
await db.exec(await readFile('supabase/seed.sql', 'utf8'))
// One local connection: serialize entire identity+query blocks. Promise.all in
// the scenario does NOT constitute a real concurrency test on this adapter.
let queue = Promise.resolve()
const run = (who, query) => {
  const operation = queue.then(async () => {
    const identity = ids[who === 'ana2' ? 'ana' : who] || ''
    await db.exec(`reset role; select set_config('request.jwt.claim.sub','${identity}',false); set role ${who === 'anonymous' ? 'anon' : 'authenticated'};`)
    return query()
  })
  queue = operation.catch(() => {})
  return operation
}
const allowed = new Set(['site_bot_requests', 'site_bot_drafts', 'site_conversations', 'site_conversation_members', 'site_messages', 'offers'])
const report = { run_id: 'pglite-local', checks: [], offers: [], messages: [], conversations: [], archived: [] }
try {
  const adapter = {
    ids,
    rpc: (who, fn, action, payload) => run(who, async () => {
      if (!['site_chat', 'site_bot'].includes(fn)) throw new Error('RPC inesperada')
      return (await db.query(`select public.${fn}($1,$2::jsonb) result`, [action, JSON.stringify(payload)])).rows[0].result
    }),
    select: (who, table, filters) => run(who, async () => {
      if (!allowed.has(table) || Object.keys(filters).some(k => !['id', 'conversation_id', 'request_id'].includes(k))) throw new Error('Consulta inesperada')
      const where = Object.keys(filters).map((key, i) => `${key}=$${i + 1}`).join(' and ')
      return (await db.query(`select * from public.${table} where ${where}`, Object.values(filters))).rows
    }),
    writeOffer: (who, data, id, version, archive = false) => run(who, async () => (await db.query('select public.save_offer($1::jsonb,$2::uuid,$3::integer,$4::boolean) result', [JSON.stringify(data), id, version, archive])).rows[0].result),
  }
  await verifyConversations(adapter, report)
  // Simulate lost HTTP response AFTER a committed create. Cleanup must inspect
  // audit and archive only that fixture, without confirming again.
  const recovery = { run_id: 'pglite-lost-result', checks: [], offers: [], messages: [], conversations: [], archived: [] }
  let dropped = false, confirmations = 0
  await assert.rejects(verifyConversations({ ...adapter, rpc: async (who, fn, action, payload) => {
    const lose = fn === 'site_bot' && action === 'confirm' && !dropped
    if (fn === 'site_bot' && action === 'confirm') confirmations++
    if (lose) dropped = true
    const result = await adapter.rpc(who, fn, action, payload)
    if (lose) throw Object.assign(new Error('Resposta perdida simulada após commit local.'), { code: 'TEST_LOST' })
    return result
  } }, recovery), { code: 'TEST_LOST' })
  assert.equal(confirmations, 2, 'Limpeza não repete confirmação')
  assert.equal(recovery.offers.length, 1)
  assert.deepEqual(recovery.archived, recovery.offers)
  assert.notEqual(recovery.offers[0], report.offers[0])
  assert.equal((await adapter.select('ana', 'offers', { id: report.offers[0] }))[0].status, 'archived')
  console.log(`PASS T41: ${report.checks.length} grupos e limpeza após resposta perdida exercitados no PGlite. Identidade simulada/conexão serial; sem Auth, concorrência real, websocket ou F5.`)
} finally { await db.close() }
