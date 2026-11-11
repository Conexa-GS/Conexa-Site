import { PGlite } from '@electric-sql/pglite'
import { readFile, readdir } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import assert from 'node:assert/strict'
import { interpretSiteBot } from '../src/domain/site-bot.js'

const db = new PGlite()
const ids = { ana: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', joao: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', buyer: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', carrier: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd' }
await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key,email text);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`)
for (const [name, id] of Object.entries(ids)) await db.query('insert into auth.users values($1,$2)', [id, `${name === 'buyer' ? 'comprador' : name === 'carrier' ? 'transporte' : name}@conexa.invalid`])
for (const file of (await readdir('supabase/migrations')).filter(f => f.endsWith('.sql')).sort()) await db.exec(await readFile(`supabase/migrations/${file}`, 'utf8'))
await db.exec(await readFile('supabase/seed.sql', 'utf8'))
async function as(name) { await db.exec(`reset role; select set_config('request.jwt.claim.sub','${ids[name] || ''}',false); set role authenticated;`) }
const rpc = async (fn, action, payload = {}) => (await db.query(`select public.${fn}($1,$2::jsonb) result`, [action, JSON.stringify(payload)])).rows[0].result
const chat = (action, payload) => rpc('site_chat', action, payload)
let cid
const bot = (action, payload = {}) => rpc('site_bot', action, { conversation_id: cid, ...payload })
const state = () => bot('state')
async function turn(text, extra = {}) {
  const context = await state()
  const proposal = interpretSiteBot(text, { ...context, role: 'producer' })
  assert.equal(proposal.error, undefined, text)
  const offer = context.offers.find(o => o.id === proposal.target_id)
  const payload = { request_id: randomUUID(), revision: context.draft?.revision || 0, body: text, ...proposal, offer_version: offer?.version || null, ...extra }
  delete payload.reply
  return { result: await bot('turn', payload), payload }
}
const confirm = revision => bot('confirm', { revision, request_id: randomUUID() })
const write = async (data, id = null, version = null, archive = false) => (await db.query('select public.save_offer($1::jsonb,$2::uuid,$3::integer,$4::boolean) result', [JSON.stringify(data), id, version, archive])).rows[0].result

try {
  await as('ana'); cid = (await chat('inbox')).conversations[0].id
  const initial = await state(), baseline = initial.offers.length
  await assert.rejects(bot('turn', { request_id: randomUUID(), revision: 0, body: 'criar', intent: 'create', fields: { price: { sql: 'forjado' } } }), /respostas de oferta em texto/)
  await turn('criar alface')
  const date = (await db.query("select ((now() at time zone 'America/Sao_Paulo')::date+5)::text d")).rows[0].d
  for (const answer of ['20,125', '5,07', '4,00', date, date, 'não sei', initial.catalog.locations[0].id]) await turn(answer)
  assert.equal((await state()).offers.length, baseline, 'prévia não cria oferta')
  const createRevision = (await state()).draft.revision
  const key = randomUUID(), request = { revision: createRevision, request_id: key }
  const created = await bot('confirm', request)
  assert.equal(created.draft.status, 'applied'); assert.ok(created.offer.id)
  assert.equal(Number(created.offer.quantity_total), 20.125); assert.equal(created.offer.unit_price_cents, 507)
  assert.deepEqual(await bot('confirm', request), created, 'timeout/reenvio devolve mesmo resultado')
  await assert.rejects(bot('confirm', { ...request, revision: 999 }), /outro conteúdo/)
  await assert.rejects(confirm(createRevision), /Nenhuma revisão/)
  assert.equal((await state()).offers.length, baseline + 1)
  const history = await bot('messages'); assert.ok(history.messages.some(m => m.speaker === 'bot')); assert.equal(new Set(history.messages.map(m => m.seq)).size, history.messages.length)
  const replayTurn = await turn('consultar')
  assert.deepEqual(await bot('turn', replayTurn.payload), replayTurn.result)
  await assert.rejects(bot('turn', { ...replayTurn.payload, body: 'outro texto' }), /outro conteúdo/)
  // Duas ofertas de alface: selecionar ID explicitamente, sem alvo implícito.
  const first = await turn(`editar ${created.offer.id} total 21 kg`)
  const corrected = await turn('total 22 kg')
  await assert.rejects(confirm(first.result.draft.revision), /Rascunho mudou/)
  const edited = await confirm(corrected.result.draft.revision)
  assert.equal(Number(edited.offer.quantity_total), 22)
  // Edição concorrente pelo mesmo gateway utilizado pelo formulário.
  await turn(`editar ${created.offer.id} preço 6,00`)
  const before = (await state()).offers.find(o => o.id === created.offer.id)
  await write({ ...before, unit_price_cents: 650 }, before.id, before.version)
  const conflict = await confirm((await state()).draft.revision)
  assert.equal(conflict.draft.status, 'conflict'); assert.equal(conflict.offer, null)
  assert.equal(conflict.draft.fields.price, '6,00')
  // Rebase explicitamente confirmado preserva correção; não aplica durante prévia.
  await turn(`editar ${created.offer.id} preço 6,00`)
  assert.equal((await confirm((await state()).draft.revision)).offer.unit_price_cents, 600)
  await turn(`arquivar ${created.offer.id}`); await turn('cancelar')
  assert.ok((await state()).offers.some(o => o.id === created.offer.id))
  await assert.rejects(confirm((await state()).draft.revision))
  await turn(`arquivar ${created.offer.id}`)
  assert.equal((await confirm((await state()).draft.revision)).offer.status, 'archived')
  // Falha definitiva conserva rascunho; forjar mínimo não contorna checks do banco.
  const template = initial.offers[0]
  const invalid = await bot('turn', { request_id: randomUUID(), revision: (await state()).draft.revision, body: 'Payload inválido de teste', intent: 'create', fields: { product_id: template.product_id, pickup_location_id: template.pickup_location_id, quantity_total: '1', price: '1,00', minimum: '2,00', available_from: date, available_until: date, expires_on: '' } })
  const rejected = await confirm(invalid.draft.revision)
  assert.equal(rejected.draft.status, 'conflict'); assert.equal(rejected.offer, null)
  assert.equal((await state()).offers.length, baseline)
  await assert.rejects(write({ ...template, quantity_total: '0.0001' }), /milésimos/)
  await assert.rejects(write({ ...template, unit_price_cents: '1.5' }), /centavos/)
  // Reservas reais no PostgreSQL local; confirmar saldo obsoleto não escreve.
  await as('buyer')
  const destination = (await db.query('select id from public.locations where owner_id=auth.uid()')).rows[0].id
  const demand = await rpc('m2', 'save_demand', { product_id: template.product_id, quantity: 10, desired_date: date, destination_id: destination })
  const load = await rpc('m2', 'draft', { ...demand, items: [{ offer_id: template.id, quantity: 10 }], hours: 24 })
  await as('ana'); await turn(`editar ${template.id} total 25 kg`)
  await as('buyer'); await rpc('m2', 'submit', { ...load, version: 1 })
  await as('ana')
  const balanceConflict = await confirm((await state()).draft.revision)
  assert.equal(balanceConflict.draft.status, 'conflict'); assert.equal(balanceConflict.offer, null)
  await turn(`editar ${template.id} total 5 kg`)
  const protectedStock = await confirm((await state()).draft.revision)
  assert.equal(protectedStock.offer, null); assert.match(protectedStock.reply, /reservado|comprometido/)
  // Fixture administrativa local: exercício do mesmo bloqueio com compromisso.
  // O fluxo real reserva→pagamento é coberto pela suíte M5 separada.
  await db.exec('reset role')
  await db.query("update public.reservations set status='committed' where load_item_id in (select id from public.load_items where load_id=$1)", [load.id])
  await as('ana'); await turn(`editar ${template.id} total 5 kg`)
  assert.equal((await confirm((await state()).draft.revision)).offer, null)
  const snapshotBefore = (await db.query('select * from public.load_items where load_id=$1', [load.id])).rows
  await turn(`editar ${template.id} preço 8,00`)
  // Reset quantity after rejected reduction before explicit new preview.
  await turn('total 30 kg')
  assert.equal((await confirm((await state()).draft.revision)).offer.unit_price_cents, 800)
  assert.deepEqual((await db.query('select * from public.load_items where load_id=$1', [load.id])).rows, snapshotBefore)
  const anaCid = cid
  const direct = await chat('open_direct', { peer_id: ids.joao })
  await assert.rejects(rpc('site_bot', 'state', { conversation_id: direct.id }), /indisponível/)
  await as('buyer'); cid = (await chat('inbox')).conversations[0].id
  assert.ok((await state()).offers.some(o => o.id === template.id && o.unit_price_cents === 800))
  await assert.rejects(bot('turn', { request_id: randomUUID(), revision: 0, intent: 'edit', fields: {}, target_id: template.id, body: 'editar' }), /apenas consultar/)
  await assert.rejects(write(template, template.id, template.version), /Somente produtores/)
  await as('joao')
  assert.equal((await db.query('select * from public.site_bot_drafts')).rows.length, 0)
  assert.equal((await db.query('select * from public.site_bot_requests')).rows.length, 0)
  await assert.rejects(rpc('site_bot', 'state', { conversation_id: anaCid }), /indisponível/)
  cid = (await chat('inbox')).conversations[0].id
  await assert.rejects(bot('turn', { request_id: randomUUID(), revision: 0, intent: 'edit', fields: {}, target_id: template.id, offer_version: 1, body: 'editar' }), /indisponível/)
  await assert.rejects(db.query('update public.site_bot_drafts set status=$1', ['applied']))
  await assert.rejects(db.query('delete from public.site_bot_requests'))
  await as('ana'); cid = anaCid
  assert.ok((await state()).draft.revision > 0, 'rascunho permanece após troca de identidade simulada')
  for (let i = 0; i < 22; i++) await turn('consultar')
  const latest = await bot('messages')
  assert.equal(latest.messages.length, 40); assert.equal(latest.has_more, true)
  const earlier = await bot('messages', { before_seq: latest.messages[0].seq })
  assert.ok(BigInt(earlier.messages.at(-1).seq) < BigInt(latest.messages[0].seq))
  let cursor = '0', recovered = [], page
  do { page = await bot('messages', { after_seq: cursor }); recovered.push(...page.messages); cursor = page.messages.at(-1)?.seq || cursor } while (page.has_more)
  assert.equal(recovered.length, Number((await db.query('select count(*) n from public.site_messages where conversation_id=$1', [cid])).rows[0].n))
  assert.equal(new Set(recovered.map(m => m.id)).size, recovered.length)
  await assert.rejects(bot('messages', { before_seq: '10', after_seq: '1' }), /Cursor/)
  await as('carrier'); await assert.rejects(state(), /não autorizado/)
  await db.exec('reset role; set role anon'); await assert.rejects(state())
  console.log('Bot PostgreSQL local: prévia, CRUD compartilhado, revisões, replay, conflito de versão/saldo, mínimo, snapshot e RLS aprovados. Sem Auth remoto ou concorrência real.')
} finally { await db.close() }
