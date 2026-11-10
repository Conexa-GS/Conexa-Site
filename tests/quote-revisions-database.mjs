import { PGlite } from '@electric-sql/pglite'
import { readFile, readdir } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import assert from 'node:assert/strict'

const db = new PGlite()
const ids = { ana: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', joao: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', buyer: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', carrier: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', outsider: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', other: 'ffffffff-ffff-4fff-8fff-ffffffffffff' }
await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key,email text);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`)
for (const [name, id] of Object.entries(ids)) await db.query('insert into auth.users values($1,$2)', [id, `${name === 'buyer' ? 'comprador' : name === 'carrier' ? 'transporte' : name}@conexa.invalid`])
for (const file of (await readdir('supabase/migrations')).filter(f => f.endsWith('.sql')).sort()) await db.exec(await readFile(`supabase/migrations/${file}`, 'utf8'))
await db.exec(await readFile('supabase/seed.sql', 'utf8'))
await db.query("insert into public.participants(id,display_name,role,is_demo) values($1,'Comprador alheio','buyer',true),($2,'Outra transportadora','carrier',true)", [ids.outsider, ids.other])
async function as(name) { await db.exec(`reset role; select set_config('request.jwt.claim.sub','${ids[name] || ''}',false); set role authenticated;`) }
const api = async (module, action, payload = {}) => (await db.query(`select public.${module}($1,$2::jsonb) result`, [action, JSON.stringify(payload)])).rows[0].result
const m2 = (a,p) => api('m2',a,p), m3 = (a,p) => api('m3',a,p), m5 = (a,p) => api('m5',a,p), updates = (a,p) => api('transport_updates',a,p)
const current = async () => (await m5('list')).loads.find(l => l.id === load.id)
await as('ana')
await db.query("update public.offers set expires_on=available_until+1 where id='30000000-0000-4000-8000-000000000001'")
await as('buyer')
const date = (await db.query("select ((now() at time zone 'America/Sao_Paulo')::date+3)::text d")).rows[0].d
const destination = (await db.query('select id from public.locations where owner_id=auth.uid()')).rows[0].id
const demand = await m2('save_demand', { product_id: '10000000-0000-4000-8000-000000000001', quantity: 50, desired_date: date, destination_id: destination })
const load = { ...await m2('draft', { ...demand, items: [{ offer_id: '30000000-0000-4000-8000-000000000001', quantity: 30 }, { offer_id: '30000000-0000-4000-8000-000000000002', quantity: 20 }], hours: 24 }), version: 1 }
await m2('submit', load)
for (const name of ['ana', 'joao']) { await as(name); await m2('respond', { ...load, decision: 'accepted' }) }
await as('carrier')
const vehicle = await m3('save_vehicle', { description: 'Veículo A', capacity_kg: 500, vehicle_category: 'van', conservation_conditions: 'ambient' })
const vehicle2 = await m3('save_vehicle', { description: 'Veículo B', capacity_kg: 500, vehicle_category: 'van', conservation_conditions: 'ambient' })
const small = await m3('save_vehicle', { description: 'Pequeno', capacity_kg: 1, vehicle_category: 'van', conservation_conditions: 'ambient' })
const input = { ...load, vehicle_id: vehicle.id, total_cents: 8000, departure_address: 'Base fictícia', departure_time: `${date}T10:00:00-03:00`, delivery_time: `${date}T12:00:00-03:00`, expires_at: new Date(Date.now() + 3600000).toISOString(), conservation_required: 'ambient', services_included: { fuel: true, tolls: true, pickups: true, unloading: true } }
const first = await m3('quote', input)
assert.equal((await m3('list')).quoteRevisionAvailable, true)
await assert.rejects(m3('quote', { ...input, total_cents: 9900 }), /já confirmada/)
let edit = { ...load, quote_id: first.id, vehicle_id: vehicle2.id, departure_time: `${date}T09:00:00-03:00`, delivery_time: input.delivery_time, expires_at: input.expires_at, reason: 'Troca de veículo e saída' }
for (const name of ['buyer', 'ana', 'other', 'outsider']) { await as(name); await assert.rejects(updates('revise', edit), /Somente/); await assert.rejects(updates('request_price', { ...edit, proposed_cents: 9000, direct_contact: true }), /Somente/) }
await as('carrier')
await assert.rejects(updates('revise', { ...edit, total_cents: 9000 }), /bloqueado/)
await assert.rejects(updates('revise', { ...edit, vehicle_id: small.id }), /incompatível/)
await assert.rejects(updates('revise', { ...edit, delivery_time: `${date}T08:00:00-03:00` }), /Revise/)
await assert.rejects(updates('revise', { ...edit, expires_at: new Date(Date.now() + 48*3600000).toISOString() }), /Revise/)
await assert.rejects(updates('revise', { ...edit, departure_address: 'Roteiro adulterado' }), /somente/)
let result = await updates('revise', edit)
assert.equal(result.version, 1)
await assert.rejects(updates('revise', edit), /alterada/)
let record = await current(), quote = record.quotes.find(q => q.id === result.quote_id)
assert.equal(quote.revision, 2); assert.equal(Number(quote.total_cents), 8000)
assert.equal(record.quotes.some(q => q.id === first.id), false)
let buyerNotificationId
for (const name of ['buyer', 'ana', 'joao']) {
  await as(name); const notices = (await updates('list')).notifications
  assert.equal(notices.length, 1); assert.equal(notices[0].changes.after.vehicle, 'Veículo B')
  assert.equal(notices[0].changes.before.total_cents, 8000)
  if (name === 'buyer') { buyerNotificationId = notices[0].id; await updates('read', { notification_id: notices[0].id }); assert.ok((await updates('list')).notifications[0].read_at) }
  else await assert.rejects(updates('read', { notification_id: buyerNotificationId }), /indisponível/)
}
await as('outsider'); assert.equal((await updates('list')).notifications.length, 0)
// Choosing another carrier closes an unrelated pending negotiation without charging a fee.
await db.exec('reset role; begin')
await as('other')
const temporaryVehicle = await m3('save_vehicle', { description: 'Alternativa temporária', capacity_kg: 500, vehicle_category: 'van', conservation_conditions: 'ambient' })
const temporaryQuote = await m3('quote', { ...input, vehicle_id: temporaryVehicle.id })
await as('carrier'); await updates('request_price', { ...load, quote_id: quote.id, proposed_cents: 9000, reason: 'Negociação anterior à escolha', direct_contact: true })
await as('buyer'); await m3('select_quote', { ...load, quote_id: temporaryQuote.id })
assert.equal((await current()).negotiations[0].status, 'superseded')
assert.equal((await current()).cancellation_fees.length, 0)
await db.exec('rollback')
await as('buyer'); await m3('select_quote', { ...load, quote_id: quote.id }); load.version = 2
record = await current(); quote = record.quotes.find(q => q.id === record.selected_quote_id)
assert.equal(quote.revision, 2)
const expirySnapshot = record.items.find(i => i.producer_id === ids.ana).product_expires_on
assert.ok(expirySnapshot)
await as('ana'); await db.query("update public.offers set expires_on=expires_on+1 where id='30000000-0000-4000-8000-000000000001'")
await as('buyer'); assert.equal((await current()).items.find(i => i.producer_id === ids.ana).product_expires_on, expirySnapshot)
await m3('confirm', load)
await as('carrier')
result = await updates('revise', { ...edit, ...load, quote_id: quote.id, departure_time: `${date}T08:00:00-03:00` })
load.version = 3; record = await current(); quote = record.quotes.find(q => q.id === record.selected_quote_id)
assert.equal(record.version, 3); assert.equal(record.status, 'awaiting_final_approval')
assert.equal(record.confirmations.some(c => c.proposal_version === 3), false)
await assert.rejects(m3('confirm', { ...load, version: 2 }), /alterada/)
for (const name of ['buyer', 'ana', 'joao', 'carrier']) { await as(name); await m3('confirm', load) }
assert.equal((await current()).status, 'awaiting_payment')
const base = () => ({ ...load, quote_id: quote.id, reason: 'Conversa direta sobre novo valor', proposed_cents: 9000, direct_contact: true })
await assert.rejects(updates('request_price', { ...base(), direct_contact: false }), /conversa direta/)
let negotiation = await updates('request_price', base())
await assert.rejects(updates('request_price', base()), /unique|duplicate/)
await as('buyer'); assert.equal(Number((await current()).freight_cents), 8000)
await assert.rejects(m5('pay', { ...load, outcome: 'approved', idempotency_key: randomUUID() }), /negociação/)
await as('ana'); await assert.rejects(updates('approve_price', { ...base(), negotiation_id: negotiation.id }), /Somente/)
await as('buyer'); await updates('reject_price', { ...base(), negotiation_id: negotiation.id })
await as('carrier'); await updates('keep_price', { ...base(), negotiation_id: negotiation.id })
assert.equal(Number((await current()).freight_cents), 8000)
negotiation = await updates('request_price', { ...base(), proposed_cents: 10007 })
await as('buyer'); await updates('approve_price', { ...base(), negotiation_id: negotiation.id, proposed_cents: 1 })
load.version = 4; record = await current(); quote = record.quotes.find(q => q.id === record.selected_quote_id)
assert.equal(Number(record.freight_cents), 10007); assert.equal(Number(record.total_cents), 35007)
assert.equal(record.status, 'awaiting_final_approval'); assert.equal(record.confirmations.some(c => c.proposal_version === 4), false)
await as('carrier'); negotiation = await updates('request_price', { ...base(), proposed_cents: 11000 })
await as('buyer'); await updates('reject_price', { ...base(), negotiation_id: negotiation.id })
await as('other'); const substituteVehicle = await m3('save_vehicle', { description: 'Substituto compatível', capacity_kg: 500, vehicle_category: 'van', conservation_conditions: 'ambient' })
await as('carrier')
for (const [hours, expected] of [[96,5], [48,15], [12,30]]) {
  await db.exec('reset role; begin')
  await db.query(`update public.transport_quotes set delivery_time=clock_timestamp()+interval '${hours} hours',departure_time=clock_timestamp()+interval '1 hour' where id=$1`, [quote.id])
  await db.query('update public.load_items set product_expires_on=null where load_id=$1', [load.id])
  await as('carrier'); const preview = await updates('preview_fee', { ...base(), negotiation_id: negotiation.id })
  assert.equal(preview.rate_percent, expected); assert.equal(preview.amount_cents, Math.round(10007*expected/100)); assert.equal(preview.expiry_missing, true)
  await db.exec('rollback'); await as('carrier')
}
await db.exec('reset role; begin')
await db.query("update public.transport_quotes set delivery_time=clock_timestamp()+interval '96 hours' where id=$1", [quote.id])
await db.query("update public.load_items set product_expires_on=(clock_timestamp() at time zone 'America/Sao_Paulo')::date where load_id=$1", [load.id])
await as('carrier'); assert.equal((await updates('preview_fee', { ...base(), negotiation_id: negotiation.id })).rate_percent, 30)
await db.exec('rollback'); await as('carrier')
const preview = await updates('preview_fee', { ...base(), negotiation_id: negotiation.id })
const withdraw = { ...base(), negotiation_id: negotiation.id, expected_fee_cents: preview.amount_cents, expected_rate_percent: preview.rate_percent, accept_fee: true }
await assert.rejects(updates('withdraw', { ...withdraw, expected_fee_cents: 0 }), /taxa mudou/)
// No compatible alternative: do not invent one or approve a fictitious quote.
await db.exec('reset role; begin')
await db.query('update public.vehicles set capacity_kg=1 where carrier_id=$1', [ids.other])
await as('carrier'); assert.equal((await updates('withdraw', withdraw)).replacement_carrier_id, null)
await db.exec('rollback'); await as('carrier')
result = await updates('withdraw', withdraw)
assert.equal(result.replacement_carrier_id, ids.other)
load.version = 5; record = await current()
assert.equal(record.status, 'awaiting_quotes'); assert.equal(record.selected_quote_id, null); assert.equal(record.total_cents, null)
assert.equal(record.confirmations.filter(c => c.proposal_version === 5).length, 2)
assert.equal(record.cancellation_fees.length, 1)
const fee = record.cancellation_fees[0]
assert.equal(Number(fee.amount_cents), preview.amount_cents)
assert.equal(fee.shares.reduce((sum,s) => sum+Number(s.amount_cents),0), preview.amount_cents)
assert.equal(fee.shares.find(s => s.kind === 'buyer').amount_cents, preview.amount_cents-Math.floor(preview.amount_cents/2))
await assert.rejects(updates('withdraw', withdraw), /alterada/)
await assert.rejects(m3('quote', { ...input, ...load }), /desistiu/)
await as('buyer'); assert.equal((await m2('balances')).find(o => o.id === '30000000-0000-4000-8000-000000000002').quantity_free,25-20)
await as('other'); const replacementNotices = (await updates('list')).notifications
assert.equal(replacementNotices.length, 1); assert.equal(replacementNotices[0].changes.before, undefined)
assert.equal((await current()).negotiations.length, 0); assert.equal((await current()).cancellation_fees.length, 0)
const replacement = await m3('quote', { ...input, ...load, vehicle_id: substituteVehicle.id, total_cents: 8500 })
await as('buyer'); await m3('select_quote', { ...load, quote_id: replacement.id }); load.version = 6
for (const name of ['buyer','ana','joao','other']) { await as(name); await m3('confirm', load) }
await as('buyer'); await m5('pay', { ...load, outcome: 'approved', idempotency_key: randomUUID() })
await as('other'); record = await current(); quote = record.quotes.find(q => q.id === record.selected_quote_id)
await assert.rejects(updates('revise', { ...edit, ...load, quote_id: quote.id, vehicle_id: substituteVehicle.id }), /antes do pagamento/)
for (const name of ['ana','joao']) { await as(name); assert.equal((await db.query('select * from public.carrier_fee_shares')).rows.length, 1); await assert.rejects(db.query('update public.carrier_fee_shares set amount_cents=99999'), /permission denied/) }
await as('outsider')
for (const table of ['transport_notifications','freight_negotiations','carrier_cancellation_fees','carrier_fee_shares']) assert.equal((await db.query(`select * from public.${table}`)).rows.length,0)
await db.exec('reset role; set role anon'); await assert.rejects(updates('list'), /permission denied/)
console.log('PASS quote revisions local: snapshots/version/acceptances; immutable freight; buyer negotiation; 5/15/30 urgency fees and exact shares; compatible/no-carrier forwarding; stock preserved; recipient RLS and no direct writes. PGlite, no remote validation.')
await db.close()
