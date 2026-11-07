// Restrito ao demo autorizado. Credenciais ficam em memória; relatório contém apenas IDs fictícios.
import { createClient } from '@supabase/supabase-js'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { today, futureDate } from '../src/domain/offers.js'
process.loadEnvFile('.env')
const url = process.env.VITE_SUPABASE_URL
if (new URL(url).hostname !== 'ppbneiusqlitvewwoact.supabase.co') throw new Error('Projeto não autorizado.')
const clients={}, users={}, report={offers:[],demands:[],loads:[],vehicles:[],checks:[]}
const check=({data,error})=>{if(error) throw new Error(`${error.code}: ${error.message}`);return data}
const api=async(name,module,action,payload={})=>check(await clients[name].rpc(module,{action,payload}))
const fail=async(name,module,action,payload={})=>assert.ok((await clients[name].rpc(module,{action,payload})).error)
try {
 for(const [name,env,fallback] of [['ana','ANA','ana'],['joao','JOAO','joao'],['buyer','BUYER','comprador'],['carrier','CARRIER','transporte']]) {
  const client=createClient(url,process.env.VITE_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}})
  users[name]=check(await client.auth.signInWithPassword({email:process.env[`VITE_DEMO_${env}_EMAIL`]||`${fallback}@conexa.invalid`,password:process.env.VITE_DEMO_PASSWORD})).user.id
  clients[name]=client
 }
 const product=check(await clients.buyer.from('products').select('id').eq('name','Alface').single()).id
 for(const [name,amount,minimum] of [['ana',30,400],['joao',25,450]]) {
  const loc=check(await clients[name].from('locations').select('id').eq('owner_id',users[name]).limit(1).single()).id
  report.offers.push(check(await clients[name].from('offers').insert({product_id:product,pickup_location_id:loc,quantity_total:amount,unit_price_cents:500,minimum_net_unit_cents:minimum,available_from:today(),available_until:futureDate(7)}).select('id').single()).id)
 }
 const destination=check(await clients.buyer.from('locations').select('id').eq('owner_id',users.buyer).limit(1).single()).id
 const demand=await api('buyer','m2','save_demand',{product_id:product,quantity:50,desired_date:futureDate(3),destination_id:destination});report.demands.push(demand.id)
 const load={...await api('buyer','m2','draft',{...demand,items:report.offers.map((offer_id,i)=>({offer_id,quantity:i?20:30})),hours:24}),version:1};report.loads.push(load.id)
 await api('buyer','m2','submit',load)
 for(const name of ['ana','joao']) await api(name,'m2','respond',{...load,decision:'accepted'})
 const indication=await api('ana','m3','indicate',{...load,carrier_id:users.carrier,total_cents:8000})
 await fail('buyer','m3','select_quote',{...load,quote_id:indication.id})
 await fail('ana','m3','quote',load)
 await fail('buyer','m3','save_vehicle',{description:'forged'})
 const small=await api('carrier','m3','save_vehicle',{description:'Teste M3 · 20 kg',capacity_kg:20,vehicle_category:'van fictícia',conservation_conditions:'refrigerated'});report.vehicles.push(small.id)
 const vehicle=await api('carrier','m3','save_vehicle',{description:'Teste M3 · 500 kg',capacity_kg:500,vehicle_category:'van fictícia',conservation_conditions:'refrigerated'});report.vehicles.push(vehicle.id)
 const input={...load,indication_id:indication.id,vehicle_id:vehicle.id,total_cents:8000,departure_address:'Base fictícia · teste M3',departure_time:`${futureDate(3)}T10:00:00-03:00`,delivery_time:`${futureDate(3)}T12:00:00-03:00`,expires_at:new Date(Date.now()+3600000).toISOString(),conservation_required:'refrigerated',services_included:{fuel:true,tolls:true,pickups:true,unloading:true}}
 await fail('carrier','m3','quote',{...input,expires_at:new Date(Date.now()-1000).toISOString()})
 await fail('carrier','m3','quote',{...input,services_included:{fuel:true}})
 await fail('carrier','m3','quote',{...input,vehicle_id:small.id})
 await fail('carrier','m3','quote',{...input,conservation_required:'ambient'})
 const quote=await api('carrier','m3','quote',input)
 await fail('carrier','m3','select_quote',{...load,quote_id:quote.id})
 await fail('buyer','m3','confirm',load)
 await api('buyer','m3','select_quote',{...load,quote_id:quote.id})
 let current=(await api('buyer','m3','list')).loads.find(l=>l.id===load.id)
 assert.equal(current.version,2);assert.equal(current.status,'awaiting_final_approval')
 assert.equal(Number(current.total_cents),33000);assert.equal(Number(current.freight_cents),8000);assert.equal(Number(current.platform_fee_cents),0)
 assert.equal(current.confirmations.filter(c=>c.proposal_version===2).length,0)
 assert.deepEqual(current.items.map(i=>Number(i.minimum_cents)).sort((a,b)=>a-b),[9000,12000])
 assert.equal(Number(current.subtotal_cents)+Number(current.quotes.find(q=>q.id===current.selected_quote_id).total_cents),33000)
 await fail('ana','m3','confirm',load)
 assert.ok((await clients.carrier.from('vehicles').update({capacity_kg:999}).eq('id',vehicle.id)).error)
 assert.equal(check(await clients.ana.from('vehicles').select('*')).length,0)
 for(const name of ['buyer','ana','joao','carrier']) await api(name,'m3','confirm',{...load,version:2})
 await fail('carrier','m3','confirm',{...load,version:2})
 current=(await api('buyer','m3','list')).loads.find(l=>l.id===load.id)
 assert.equal(current.status,'awaiting_payment')
 assert.equal((await api('ana','m3','list')).loads.find(l=>l.id===load.id).items.length,1)
 const anonymous=createClient(url,process.env.VITE_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false}})
 assert.ok((await anonymous.rpc('m3',{action:'list'})).error)
 report.checks.push('Auth/RLS e escritas diretas bloqueadas; indicação não selecionável; cotação somente pelo transportador; capacidade/conservação, validade e serviços; total R$330 e mínimos R$120/R$90; v2 sem aceites herdados; quatro aceites finais levam somente a awaiting_payment; repetição e versão antiga rejeitadas.')
 await api('buyer','m2','cancel',{...load,version:2,reason:'Teste M3 concluído; liberar fixtures'})
 assert.equal((await api('buyer','m2','balances')).find(o=>o.id===report.offers[1]).quantity_free,25)
 for(const [i,name] of ['ana','joao'].entries()) check(await clients[name].from('offers').update({status:'archived'}).eq('id',report.offers[i]))
 await api('buyer','m2','archive_demand',{...demand,version:1})
 report.checks.push('Cancelamento M3 via M2 libera saldo; ofertas/demanda de teste arquivadas; histórico e veículos de teste preservados.')
 console.log('PASS M3 remoto: '+report.checks.join(' '))
} finally {
 await mkdir('artifacts',{recursive:true});await writeFile('artifacts/m3-remote.local.json',JSON.stringify(report,null,2))
 for(const client of Object.values(clients)) await client.auth.signOut()
}
