import { PGlite } from '@electric-sql/pglite'
import { readFile, readdir } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'

const db = new PGlite()
const ids = { ana: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', joao: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', buyer: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', carrier: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', outsider: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee' }
await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key,email text);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`)
for (const [name, id] of Object.entries(ids)) await db.query('insert into auth.users values($1,$2)', [id, `${name === 'buyer' ? 'comprador' : name === 'carrier' ? 'transporte' : name}@conexa.invalid`])
for (const file of (await readdir('supabase/migrations')).filter(f => f.endsWith('.sql')).sort()) await db.exec(await readFile(`supabase/migrations/${file}`, 'utf8'))
await db.exec(await readFile('supabase/seed.sql', 'utf8'))
await db.query("insert into public.participants(id,display_name,role) values($1,'Outro comprador','buyer')", [ids.outsider])
async function as(name) { await db.exec(`reset role; select set_config('request.jwt.claim.sub','${ids[name] || ''}',false); set role authenticated;`) }
const api = async (action, payload = {}) => (await db.query('select public.site_chat($1,$2::jsonb) result', [action, JSON.stringify(payload)])).rows[0].result

try {
  await as('ana')
  const bot = (await api('inbox')).conversations[0]
  assert.equal(bot.kind, 'bot')
  assert.equal((await api('inbox')).conversations[0].id, bot.id)
  assert.equal((await api('inbox')).contacts.length, 3)
  const direct = await api('open_direct', { peer_id: ids.buyer })
  const producers = await api('open_direct', { peer_id: ids.joao })
  assert.notEqual(direct.id, producers.id)
  assert.equal((await api('open_direct', { peer_id: ids.buyer })).id, direct.id)
  for (const peer_id of [ids.ana, ids.carrier, randomUUID()]) await assert.rejects(api('open_direct', { peer_id }))
  const key = randomUUID()
  const payload = { conversation_id: direct.id, client_send_id: key, body: '  Olá, parceria fictícia!  ', sender_id: ids.buyer }
  const message = await api('send', payload)
  assert.equal(message.sender_id, ids.ana)
  assert.equal(message.body, 'Olá, parceria fictícia!')
  assert.equal((await api('send', payload)).id, message.id)
  await assert.rejects(api('send', { ...payload, body: 'Outro texto' }), /outro conteúdo/)
  await assert.rejects(api('send', { ...payload, conversation_id: producers.id }), /outro conteúdo/)
  for (const body of ['', ' ', 'x'.repeat(2001)]) await assert.rejects(api('send', { ...payload, client_send_id: randomUUID(), body }))
  await assert.rejects(api('send', { ...payload, conversation_id: bot.id }), /preparação/)
  for (let i = 0; i < 44; i++) await api('send', { ...payload, client_send_id: randomUUID(), body: `Mensagem ${i}` })
  const newest = await api('messages', { conversation_id: direct.id })
  assert.equal(newest.messages.length, 40)
  assert.equal(newest.has_more, true)
  const older = await api('messages', { conversation_id: direct.id, before_seq: newest.messages[0].seq })
  assert.equal(older.messages.length, 5)
  assert.equal(older.has_more, false)
  const all = [...older.messages, ...newest.messages]
  assert.equal(new Set(all.map(m => m.id)).size, 45)
  assert.ok(all.every((m, i) => !i || BigInt(m.seq) > BigInt(all[i - 1].seq)))
  const forward = await api('messages', { conversation_id: direct.id, after_seq: '0' })
  assert.equal(forward.messages.length, 40)
  assert.equal(forward.messages[0].id, message.id)
  assert.equal(forward.has_more, true)
  const rest = await api('messages', { conversation_id: direct.id, after_seq: forward.messages.at(-1).seq })
  assert.equal(rest.messages.length, 5)
  assert.equal(rest.has_more, false)
  await assert.rejects(api('messages', { conversation_id: direct.id, before_seq: '50', after_seq: '1' }))

  await as('buyer')
  assert.equal((await api('open_direct', { peer_id: ids.ana })).id, direct.id)
  await assert.rejects(api('open_direct', { peer_id: ids.outsider }))
  assert.equal((await api('inbox')).conversations.find(c => c.id === direct.id).unread, 45)
  await api('read', { conversation_id: direct.id, seq: all.at(-1).seq, participant_id: ids.ana })
  await api('read', { conversation_id: direct.id, seq: all[0].seq })
  assert.equal((await api('inbox')).conversations.find(c => c.id === direct.id).unread, 0)
  await assert.rejects(api('read', { conversation_id: direct.id, seq: '999999' }), /inválido/)
  assert.equal((await db.query('select * from public.site_messages')).rows.length, 45)
  const buyerReply = await api('send', { conversation_id: direct.id, client_send_id: randomUUID(), body: '<script>não executa HTML</script>' })
  assert.equal(buyerReply.sender_id, ids.buyer)

  await as('joao')
  assert.deepEqual((await db.query('select * from public.site_messages')).rows, [])
  assert.equal((await db.query('select * from public.site_conversation_members where conversation_id=$1', [direct.id])).rows.length, 0)
  assert.equal((await db.query('select * from public.site_conversations where id=$1', [direct.id])).rows.length, 0)
  for (const action of ['messages', 'send', 'read']) await assert.rejects(api(action, { ...payload, seq: message.seq }), /indisponível/)
  await assert.rejects(db.query('insert into public.site_conversation_members values($1,$2,0)', [direct.id, ids.joao]))
  await assert.rejects(db.query('insert into public.site_messages(conversation_id,sender_id,client_send_id,body) values($1,$2,$3,$4)', [direct.id, ids.ana, randomUUID(), 'forjado']))
  await assert.rejects(db.query('update public.site_messages set body=$1', ['adulterado']))
  await assert.rejects(db.query('delete from public.site_messages'))
  await assert.rejects(db.query('update public.site_conversation_members set last_read_seq=1000'))
  await as('ana')
  assert.equal((await api('inbox')).conversations.find(c => c.id === direct.id).unread, 1)
  assert.equal((await api('messages', { conversation_id: direct.id })).messages.at(-1).id, buyerReply.id)
  // State survives a fresh simulated identity session; not browser F5 or remote Auth.
  await as('unknown')
  await assert.rejects(api('inbox'))
  await as('ana')
  assert.equal((await api('messages', { conversation_id: direct.id })).messages.at(-1).id, buyerReply.id)
  await as('carrier')
  await assert.rejects(api('inbox'))
  await db.exec('reset role; set role anon')
  await assert.rejects(api('inbox'))
  await assert.rejects(db.query('select * from public.site_messages'))
  console.log('PASS Conversas PGlite: pares únicos, identidade, RLS, escrita direta bloqueada, chave/conteúdo, paginação, leitura monotônica e isolamento. Sem Supabase real ou websocket.')
} finally { await db.close() }
