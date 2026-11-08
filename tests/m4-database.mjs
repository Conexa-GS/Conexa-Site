import { PGlite } from '@electric-sql/pglite'
import { readFile, readdir } from 'node:fs/promises'
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
// Administrative local fixture only: normal updates correctly preserve creation time.
await db.exec("alter table public.offers disable trigger validate_offer; update public.offers set created_at=now()-interval '5 days' where producer_id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'; alter table public.offers enable trigger validate_offer;")
async function as(name) { await db.exec(`reset role; select set_config('request.jwt.claim.sub','${ids[name] || ''}',false); set role authenticated;`) }
const api = async (module, action, payload = {}) => (await db.query(`select public.${module}($1,$2::jsonb) result`, [action, JSON.stringify(payload)])).rows[0].result
const m2 = (action, payload) => api('m2', action, payload), m3 = (action, payload) => api('m3', action, payload), m4 = (action, payload) => api('m4', action, payload)
await as('buyer')
const destination = (await db.query('select id from public.locations where owner_id=auth.uid()')).rows[0].id
const date = (await db.query("select ((now() at time zone 'America/Sao_Paulo')::date+3)::text d")).rows[0].d
const demand = await m2('save_demand', { product_id: '10000000-0000-4000-8000-000000000001', quantity: 50, desired_date: date, destination_id: destination })
const candidates = await m4('candidates', demand)
assert.equal(candidates.length, 2)
assert.ok(candidates.every(o => o.completed_sales === 0))
assert.ok(candidates.find(o => o.producer_id === ids.ana).waiting_days >= 5)
for (const name of ['ana', 'carrier', 'outsider']) { await as(name); await assert.rejects(m4('candidates', demand)) }
await as('buyer')
const load = { ...await m2('draft', { ...demand, items: candidates.map(o => ({ offer_id: o.id, quantity: o.producer_id === ids.ana ? 30 : 20 })), hours: 24 }), version: 1 }

// Local, rolled-back fixture anticipates M5's delivered state; production constraints stay intact.
await db.exec('reset role; begin; alter table public.loads drop constraint loads_status_check;')
await db.query("update public.loads set status='delivered' where id=$1", [load.id])
await as('buyer')
assert.ok((await m4('candidates', demand)).every(o => o.completed_sales === 1))
await db.exec('reset role; rollback;')
await as('buyer')
await m2('submit', load)
for (const name of ['ana', 'joao']) { await as(name); await m2('respond', { ...load, decision: 'accepted' }) }
await as('carrier')
const vehicle = await m3('save_vehicle', { description: 'Teste M4', capacity_kg: 500, vehicle_category: 'van', conservation_conditions: 'ambient' })
const quote = await m3('quote', { ...load, vehicle_id: vehicle.id, total_cents: 8000, departure_address: 'Saída fictícia', return_address: 'Retorno fictício', departure_time: `${date}T10:00:00-03:00`, delivery_time: `${date}T12:00:00-03:00`, expires_at: new Date(Date.now() + 3600000).toISOString(), conservation_required: 'ambient', services_included: { fuel: true, tolls: true, pickups: true, unloading: true } })
const request = { ...load, quote_id: quote.id }
const route = await m4('route', request)
assert.deepEqual(route.stops.map(s => s.kind), ['departure', 'pickup', 'pickup', 'destination', 'return'])
assert.deepEqual(route.stops.filter(s => s.kind === 'pickup').map(s => s.itemId), [...route.stops.filter(s => s.kind === 'pickup').map(s => s.itemId)].sort())
for (const field of ['distanceMeters', 'drivingSeconds', 'stopSeconds', 'tollAmountCents', 'provider']) assert.equal(route[field], null)
assert.equal(route.freightCents, 8000)
assert.equal(route.isSimulated, false)
assert.equal(route.status, 'manual')
await as('buyer')
const before = (await m3('list')).loads[0]
assert.deepEqual(await m4('route', request), route)
assert.deepEqual((await m3('list')).loads[0], before)
await assert.rejects(m4('route', { ...request, version: 2 }), /alterada/)
await assert.rejects(m4('route', { ...request, quote_id: ids.ana }), /indisponível/)
for (const name of ['ana', 'outsider', 'otherCarrier']) { await as(name); await assert.rejects(m4('route', request), /indisponível/) }
await as('buyer')
await m3('select_quote', { ...load, quote_id: quote.id })
await assert.rejects(m4('route', request), /alterada/)
const current = (await m3('list')).loads[0]
assert.equal((await m4('route', { id: load.id, version: current.version, quote_id: current.selected_quote_id })).freightCents, 8000)
assert.equal(Number(current.total_cents), 33000)
await as('unknown')
await assert.rejects(m4('candidates', demand), /autorizado/)
await db.exec('reset role; set role anon')
await assert.rejects(m4('route', request))
console.log('PASS M4 local: histórico/espera, propriedade e perfis, roteiro com todas as coletas/retorno, nulos explícitos, frete sem dupla soma, isolamento e versão. Sem API externa nem teste remoto.')
await db.close()
