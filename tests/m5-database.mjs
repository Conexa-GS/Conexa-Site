import { PGlite } from '@electric-sql/pglite'
import { readFile, readdir } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import assert from 'node:assert/strict'

const db = new PGlite()
const ids = { ana: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', joao: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', buyer: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', carrier: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', outsider: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', otherCarrier: 'ffffffff-ffff-4fff-8fff-ffffffffffff' }
await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key,email text);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`)
for (const [name, id] of Object.entries(ids)) await db.query('insert into auth.users values($1,$2)', [id, `${name === 'buyer' ? 'comprador' : name === 'carrier' ? 'transporte' : name}@conexa.invalid`])
for (const file of (await readdir('supabase/migrations')).filter(f => f.endsWith('.sql')).sort()) await db.exec(await readFile(`supabase/migrations/${file}`, 'utf8'))
await db.exec(await readFile('supabase/seed.sql', 'utf8'))
for (const [name, role] of [['outsider', 'buyer'], ['otherCarrier', 'carrier']]) await db.query('insert into public.participants(id,display_name,role,is_demo) values($1,$2,$3,true)', [ids[name], name, role])
async function as(name) { await db.exec(`reset role; select set_config('request.jwt.claim.sub','${ids[name] || ''}',false); set role authenticated;`) }
const api = async (module, action, payload = {}) => (await db.query(`select public.${module}($1,$2::jsonb) result`, [action, JSON.stringify(payload)])).rows[0].result
const m2 = (action, payload) => api('m2', action, payload), m3 = (action, payload) => api('m3', action, payload), m5 = (action, payload) => api('m5', action, payload)
const pay = (load, outcome, key = randomUUID()) => m5('pay', { ...load, outcome, idempotency_key: key, amount_cents: 1 })
const current = async load => (await m5('list')).loads.find(l => l.id === load.id)
const balance = async () => Number((await m2('balances')).find(o => o.id === '30000000-0000-4000-8000-000000000002').quantity_free)
await as('buyer')
const destination = (await db.query('select id from public.locations where owner_id=auth.uid()')).rows[0].id
const date = (await db.query("select ((now() at time zone 'America/Sao_Paulo')::date+3)::text d")).rows[0].d
await as('carrier')
const vehicle = await m3('save_vehicle', { description: 'Utilitário M5 fictício', capacity_kg: 500, vehicle_category: 'van', conservation_conditions: 'ambient' })
await as('otherCarrier')
const alternativeVehicle = await m3('save_vehicle', { description: 'Alternativa fictícia', capacity_kg: 500, vehicle_category: 'van', conservation_conditions: 'ambient' })
async function prepare(tiny = false) {
  let tinyOffer
  if (tiny) {
    await as('ana')
    tinyOffer = (await db.query(`select public.save_offer(jsonb_build_object(
      'product_id',product_id,'pickup_location_id',pickup_location_id,'quantity_total',1,
      'unit_price_cents',1,'minimum_net_unit_cents',0,'available_from',available_from,
      'available_until',available_until)) result from public.offers where id='30000000-0000-4000-8000-000000000001'`)).rows[0].result
  }
  await as('buyer')
  const demand = await m2('save_demand', { product_id: '10000000-0000-4000-8000-000000000001', quantity: tiny ? 0.001 : 50, desired_date: date, destination_id: destination })
  const items = tiny ? [{ offer_id: tinyOffer.id, quantity: 0.001 }] : [{ offer_id: '30000000-0000-4000-8000-000000000001', quantity: 30 }, { offer_id: '30000000-0000-4000-8000-000000000002', quantity: 20 }]
  const load = { ...await m2('draft', { ...demand, items, hours: 24 }), version: 1 }
  await assert.rejects(pay(load, 'approved'), /fora de ordem/)
  await m2('submit', load)
  for (const name of tiny ? ['ana'] : ['ana', 'joao']) { await as(name); await m2('respond', { ...load, decision: 'accepted' }) }
  await as('carrier')
  const quoteInput = { ...load, vehicle_id: vehicle.id, total_cents: 8000, departure_address: 'Saída fictícia', departure_time: `${date}T10:00:00-03:00`, delivery_time: `${date}T12:00:00-03:00`, expires_at: new Date(Date.now() + 3600000).toISOString(), conservation_required: 'ambient', services_included: { fuel: true, tolls: true, pickups: true, unloading: true } }
  const quote = await m3('quote', quoteInput)
  await as('otherCarrier'); await m3('quote', { ...quoteInput, vehicle_id: alternativeVehicle.id, total_cents: 9000 })
  await as('buyer'); await m3('select_quote', { ...load, quote_id: quote.id }); load.version = 2
  await assert.rejects(pay(load, 'approved'), /fora de ordem/)
  for (const name of tiny ? ['ana', 'carrier', 'buyer'] : ['ana', 'joao', 'carrier', 'buyer']) { await as(name); await m3('confirm', load) }
  return { ...load, demand_id: demand.id, demand_version: 1 }
}
const first = await prepare()
await assert.rejects(m5('receive', first), /viagem/)
await assert.rejects(m5('start', first), /transportador/)
for (const outcome of ['pending', 'declined']) {
  const key = randomUUID(), attempt = await pay(first, outcome, key)
  assert.equal(attempt.amount_cents, 33000)
  assert.deepEqual(await pay(first, outcome, key), attempt)
  assert.equal((await current(first)).status, 'awaiting_payment')
  assert.equal(await balance(), 5)
  await as('carrier'); await assert.rejects(m5('start', first), /agendamento/); await as('buyer')
}
await assert.rejects(pay(first, 'invalid'), /resultado/)
await assert.rejects(pay({ ...first, version: 1 }, 'approved'), /alterada/)
await assert.rejects(m5('pay', { ...first, outcome: 'approved' }), /chave/)
// Revalidate server snapshots, final approvals and reservation expiry at payment time.
for (const [sql, pattern] of [
  ["delete from public.confirmations where load_id=$1 and participant_id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' and proposal_version=2", /Aceites/],
  ["update public.reservations set expires_at=now()-interval '1 second' where load_item_id in(select id from public.load_items where load_id=$1)", /Reserva/],
  ["update public.load_items set minimum_cents=gross_cents+1 where load_id=$1", /mínimo/],
  ["update public.load_items set unit='caixa' where load_id=$1", /Peso/],
  ["update public.transport_quotes set expires_at=now()-interval '1 second' where id=(select selected_quote_id from public.loads where id=$1)", /vencida/],
]) {
  await db.exec('reset role; begin'); await db.query(sql, [first.id]); await as('buyer')
  await assert.rejects(pay(first, 'approved'), pattern)
  await db.exec('rollback'); await as('buyer')
}
for (const name of ['ana', 'carrier', 'otherCarrier', 'outsider']) {
  await as(name); await assert.rejects(pay(first, 'approved')); await assert.rejects(m5('cancel', { ...first, reason: 'Indevido' }))
}
await as('buyer')
const approvedKey = randomUUID(), approved = await pay(first, 'approved', approvedKey)
assert.equal(approved.amount_cents, 33000)
assert.equal((await current(first)).status, 'scheduled')
await assert.rejects(m2('archive_demand', { id: first.demand_id, version: first.demand_version }), /Cancele/)
assert.equal(await balance(), 5)
assert.deepEqual(await pay(first, 'approved', approvedKey), approved)
await assert.rejects(pay(first, 'declined', approvedKey), /Chave/)
await assert.rejects(pay(first, 'approved'), /fora de ordem/)
await assert.rejects(m2('cancel', { ...first, reason: 'Não contornar M5' }), /permitido/)
await db.exec('reset role')
assert.equal((await db.query("select count(*)::int n from public.reservations r join public.load_items i on i.id=r.load_item_id where i.load_id=$1 and r.status='committed'", [first.id])).rows[0].n, 2)
// Paid commitments must survive the old reservation deadline and M2/M3 expiry cleanup.
await db.query("update public.loads set expires_at=now()-interval '1 second' where id=$1", [first.id])
await as('buyer'); assert.equal((await current(first)).status, 'scheduled'); assert.equal(await balance(), 5)
// Clean receipt path, rolled back so the same committed stock can exercise cancellation next.
await db.exec('reset role; begin')
await as('carrier'); await m5('start', first)
await as('buyer'); await m5('receive', first)
assert.equal((await current(first)).payouts.length, 3)
await db.exec('rollback'); await as('buyer')
await assert.rejects(m5('cancel', { ...first, reason: ' ' }), /motivo/)
await m5('cancel', { ...first, reason: 'Replanejamento fictício' })
const cancelled = await current(first)
assert.equal(cancelled.status, 'cancelled')
assert.equal(cancelled.payments.find(p => p.id === approved.id).status, 'refunded')
assert.equal(cancelled.payouts.length, 0)
assert.equal(await balance(), 25)
const refunded = await pay(first, 'approved', approvedKey)
assert.equal(refunded.id, approved.id); assert.equal(refunded.status, 'refunded')
await m5('cancel', { ...first, reason: 'Repetição' })
assert.deepEqual((await current(first)).payments, cancelled.payments)

const second = await prepare()
await assert.rejects(pay(second, 'approved', approvedKey), /Chave/)
await pay(second, 'approved')
for (const name of ['ana', 'buyer', 'otherCarrier']) { await as(name); await assert.rejects(m5('start', second)) }
await as('carrier'); await m5('start', second); await m5('start', second)
assert.equal((await current(second)).status, 'in_transit')
await as('buyer')
const report = { ...second, reason: 'Solicitação após saída fictícia', idempotency_key: randomUUID() }
await m5('cancel', report); await m5('cancel', report)
assert.equal((await current(second)).status, 'delivery_review')
assert.equal((await current(second)).occurrences.length, 1)
assert.equal((await current(second)).payments[0].status, 'approved')
assert.equal(await balance(), 5)
await assert.rejects(m5('receive', second), /ocorrências/)
await m5('discrepancy', { ...second, reason: 'Caixa danificada fictícia', idempotency_key: randomUUID() })
let occurrences = (await current(second)).occurrences
assert.equal(occurrences.length, 2)
assert.equal((await current(second)).payouts.length, 0)
await as('carrier'); assert.equal((await current(second)).occurrences.length, 2)
await assert.rejects(m5('resolve', { ...second, occurrence_id: occurrences[0].id, resolution: 'Indevido' }), /comprador/)
await assert.rejects(m5('receive', second), /comprador/)
await as('buyer')
for (const occurrence of occurrences) {
  const payload = { ...second, occurrence_id: occurrence.id, resolution: 'Conferência fictícia concluída; entrega aceita.' }
  await m5('resolve', payload); await m5('resolve', payload)
}
assert.equal((await current(second)).status, 'delivery_review')
assert.equal((await current(second)).payouts.length, 0)
await m5('receive', second); await m5('receive', second)
const delivered = await current(second)
assert.equal(delivered.status, 'delivered')
assert.equal(delivered.payouts.length, 3)
assert.deepEqual(delivered.payouts.map(p => p.amount_cents).sort((a,b) => a-b), [8000,10000,15000])
assert.equal(delivered.payouts.reduce((sum,p) => sum+p.amount_cents, 0), 33000)
assert.equal(await balance(), 5)
await assert.rejects(m5('cancel', { ...second, reason: 'Entrega já concluída' }), /fora de ordem/)
await assert.rejects(m5('report', { ...second, reason: 'Fora de ordem', idempotency_key: randomUUID() }), /iniciado/)
for (const name of ['ana', 'joao', 'carrier']) {
  await as(name)
  const visible = await current(second)
  assert.equal(visible.status, 'delivered'); assert.equal(visible.payments.length, 0)
  assert.equal(visible.payouts.length, 1); assert.equal(visible.payouts[0].recipient_id, ids[name])
  assert.equal((await db.query('select * from public.payment_attempts')).rows.length, 0)
  assert.equal((await db.query('select * from public.simulated_payouts')).rows.length, 1)
  assert.equal((await db.query('select * from public.delivery_occurrences')).rows.length, 2)
  for (const table of ['payment_attempts', 'simulated_payouts', 'delivery_occurrences']) await assert.rejects(db.query(`delete from public.${table}`))
}
for (const name of ['outsider', 'otherCarrier']) {
  await as(name)
  const visible = await current(second)
  if (name === 'outsider') assert.equal(visible, undefined)
  else {
    assert.equal(visible.events.length, 0); assert.equal(visible.occurrences.length, 0)
    assert.equal(visible.payments.length, 0); assert.equal(visible.payouts.length, 0)
    assert.equal((await m3('list')).loads.find(l => l.id === second.id).events.length, 0)
  }
  for (const table of ['payment_attempts', 'simulated_payouts', 'delivery_occurrences']) assert.equal((await db.query(`select * from public.${table}`)).rows.length, 0)
  await assert.rejects(m5('receive', second))
}
await as('unknown'); await assert.rejects(m5('list'), /autorizado/)
await db.exec('reset role; set role anon'); await assert.rejects(m5('list'))
const tiny = await prepare(true)
await pay(tiny, 'approved')
await as('carrier'); await m5('start', tiny)
await as('buyer'); await m5('receive', tiny); await m5('receive', tiny)
const tinyDelivered = await current(tiny)
assert.equal(tinyDelivered.status, 'delivered')
assert.equal(tinyDelivered.payouts.length, 2)
assert.deepEqual(tinyDelivered.payouts.map(p => p.amount_cents).sort((a,b) => a-b), [0,8000])
await db.exec('reset role')
await assert.rejects(db.query('update public.simulated_payouts set amount_cents=-1 where load_id=$1', [tiny.id]), /check constraint/)
console.log('PASS D027 local: alimento arredondado a zero preserva parcela de produtor, recebimento/replay concluem uma vez, negativos rejeitados.')
console.log('PASS M5 local: AC18–21, três perfis, total 330, idempotência sequencial, reserva→compromisso sem dupla baixa, validade/aceites/mínimos, cancelamento/estorno único, trânsito com ocorrência sem liberar estoque, divergência/resolução/recebimento e três repasses únicos, RLS e anonimato. PGlite com identidade simulada; sem concorrência real nem Supabase remoto.')
await db.close()
