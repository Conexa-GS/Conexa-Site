import { PGlite } from '@electric-sql/pglite'
import { readFile, readdir } from 'node:fs/promises'
import assert from 'node:assert/strict'

const db = new PGlite()
const ids = { ana: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', joao: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', buyer: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', carrier: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd' }
await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key,email text);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`)
for (const [name,id] of Object.entries(ids)) await db.query('insert into auth.users values($1,$2)', [id,`${name === 'buyer' ? 'comprador' : name === 'carrier' ? 'transporte' : name}@conexa.invalid`])
for (const file of (await readdir('supabase/migrations')).filter(f=>f.endsWith('.sql')).sort()) await db.exec(await readFile(`supabase/migrations/${file}`,'utf8'))
await db.exec(await readFile('supabase/seed.sql','utf8'))
async function as(name) { await db.exec(`reset role; select set_config('request.jwt.claim.sub','${ids[name]}',false); set role authenticated;`) }
const api = async (module, action, payload={}) => (await db.query(`select public.${module}($1,$2::jsonb) result`,[action,JSON.stringify(payload)])).rows[0].result
const m2 = (action,payload) => api('m2',action,payload), m3 = (action,payload) => api('m3',action,payload)
await as('buyer')
const destination = (await db.query('select id from public.locations where owner_id=auth.uid()')).rows[0].id
const date = (await db.query("select ((now() at time zone 'America/Sao_Paulo')::date+3)::text d")).rows[0].d
const demand = await m2('save_demand',{product_id:'10000000-0000-4000-8000-000000000001',quantity:50,desired_date:date,destination_id:destination})
const load = {...await m2('draft',{...demand,items:[{offer_id:'30000000-0000-4000-8000-000000000001',quantity:30},{offer_id:'30000000-0000-4000-8000-000000000002',quantity:20}],hours:24}),version:1}
await m2('submit',load)
for (const name of ['ana','joao']) { await as(name); await m2('respond',{...load,decision:'accepted'}) }
await as('ana')
const indication = await m3('indicate',{...load,carrier_id:ids.carrier,total_cents:8000})
await assert.rejects(m3('quote',load))
await assert.rejects(m3('save_vehicle',{description:'forged'}))
await as('buyer')
await assert.rejects(m3('select_quote',{...load,quote_id:indication.id}))
await as('carrier')
assert.equal((await m3('list')).loads.length,1)
await assert.rejects(db.query('insert into public.vehicles(carrier_id,description,capacity_kg,vehicle_category,conservation_conditions) values(auth.uid(),$1,100,$1,$2)',['forged','ambient']))
const vehicle = await m3('save_vehicle',{description:'Utilitário fictício',capacity_kg:500,vehicle_category:'van',conservation_conditions:'refrigerated'})
const small = await m3('save_vehicle',{description:'Pequeno',capacity_kg:20,vehicle_category:'van',conservation_conditions:'refrigerated'})
const quoteInput = {...load,vehicle_id:vehicle.id,indication_id:indication.id,total_cents:8000,departure_address:'Saída fictícia',departure_time:`${date}T10:00:00-03:00`,delivery_time:`${date}T12:00:00-03:00`,expires_at:new Date(Date.now()+3600000).toISOString(),conservation_required:'refrigerated',services_included:{fuel:true,tolls:true,pickups:true,unloading:true}}
await assert.rejects(m3('quote',{...quoteInput,services_included:{fuel:true}}))
await assert.rejects(m3('quote',{...quoteInput,expires_at:new Date(Date.now()-1000).toISOString()}))
await assert.rejects(m3('quote',{...quoteInput,vehicle_id:small.id}))
await assert.rejects(m3('quote',{...quoteInput,conservation_required:'ambient'}))
const quote = await m3('quote',quoteInput)
await assert.rejects(m3('select_quote',{...load,quote_id:quote.id}))
await as('buyer')
await assert.rejects(m3('confirm',load))
await db.exec('reset role')
await db.query("update public.transport_quotes set expires_at=now()-interval '1 second' where id=$1",[quote.id])
await as('buyer')
await assert.rejects(m3('select_quote',{...load,quote_id:quote.id}),/vencida/)
await db.exec('reset role')
await db.query("update public.transport_quotes set expires_at=now()+interval '1 hour' where id=$1",[quote.id])
await db.query("update public.load_items set unit='caixa' where load_id=$1",[load.id])
await as('buyer')
await assert.rejects(m3('select_quote',{...load,quote_id:quote.id}),/Peso/)
await db.exec('reset role')
await db.query("update public.load_items set unit='kg' where load_id=$1",[load.id])
await db.query('update public.load_items set minimum_cents=10001 where load_id=$1 and producer_id=$2',[load.id,ids.joao])
await as('buyer')
await assert.rejects(m3('select_quote',{...load,quote_id:quote.id}),/Mínimo/)
await db.exec('reset role')
await db.query('update public.load_items set minimum_cents=round(quantity*minimum_net_unit_cents) where load_id=$1',[load.id])
await as('buyer')
await m3('select_quote',{...load,quote_id:quote.id})
let current = (await m3('list')).loads[0]
assert.equal(current.version,2)
assert.equal(current.status,'awaiting_final_approval')
assert.equal(Number(current.total_cents),33000)
assert.equal(Number(current.freight_cents),8000)
assert.equal(Number(current.platform_fee_cents),0)
assert.equal(current.confirmations.filter(c=>c.proposal_version===2).length,0)
assert.equal(Number(current.subtotal_cents)+Number(current.quotes.find(q=>q.id===current.selected_quote_id).total_cents),33000)
await assert.rejects(m3('confirm',load))
for (const name of ['buyer','ana','joao','carrier']) { await as(name); await m3('confirm',{...load,version:2}) }
await assert.rejects(m3('confirm',{...load,version:2}))
assert.equal((await m3('list')).loads[0].status,'awaiting_payment')
await as('buyer')
await assert.rejects(m2('draft',{...demand,items:[],hours:24}))
await m2('cancel',{...load,version:2,reason:'Alterar coleta exige nova proposta'})
assert.equal((await m2('balances')).find(o=>o.id==='30000000-0000-4000-8000-000000000002').quantity_free,25)
const rebuilt={...await m2('draft',{...demand,items:[{offer_id:'30000000-0000-4000-8000-000000000001',quantity:30},{offer_id:'30000000-0000-4000-8000-000000000002',quantity:20}],hours:24}),version:1}
await m2('submit',rebuilt)
assert.equal((await m2('list')).loads.find(l=>l.id===rebuilt.id).confirmations.length,0)
assert.equal((await m2('list')).loads.find(l=>l.id===rebuilt.id).selected_quote_id,null)
await db.exec('reset role')
await db.query("update public.loads set status='awaiting_final_approval',expires_at=now()-interval '1 second' where id=$1",[rebuilt.id])
await as('buyer')
assert.equal((await m3('list')).loads.find(l=>l.id===rebuilt.id).status,'expired')
assert.equal((await m2('balances')).find(o=>o.id==='30000000-0000-4000-8000-000000000002').quantity_free,25)
await db.exec('reset role; set role anon')
await assert.rejects(m3('list'))
console.log('PASS M3 local: AC10–14/21, indicação, autorização/RLS, capacidade, conservação, validade, mínimo individual, total 330, versão/aceites, cancelamento/liberação. Desconto testado por adulteração administrativa; sem descontos na UI.')
await db.close()
