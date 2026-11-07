// Executar somente no projeto demo autorizado. Usa .env sem imprimir credenciais.
// Cria fixtures próprias; o relatório permite limpeza administrativa limitada a esses IDs.
import { createClient } from '@supabase/supabase-js'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { futureDate, today } from '../src/domain/offers.js'

process.loadEnvFile('.env')
const url = process.env.VITE_SUPABASE_URL
if (new URL(url).hostname !== 'ppbneiusqlitvewwoact.supabase.co') throw new Error('Teste limitado ao projeto demo autorizado.')
const reportPath = 'artifacts/m2-remote.local.json'
const report = { offers: [], demands: [], loads: [], checks: [] }
const clients = {}
const users = {}
const check = ({ data, error }) => { if (error) throw new Error(`Supabase ${error.code || error.status}: ${error.message}`); return data }
const api = async (name, action, payload = {}) => check(await clients[name].rpc('m2', { action, payload }))
async function setup() {
  for (const [name, env, fallback] of [['ana','ANA','ana'],['joao','JOAO','joao'],['buyer','BUYER','comprador'],['carrier','CARRIER','transporte']]) {
    const client = createClient(url, process.env.VITE_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
    const data = check(await client.auth.signInWithPassword({ email: process.env[`VITE_DEMO_${env}_EMAIL`] || `${fallback}@conexa.invalid`, password: process.env.VITE_DEMO_PASSWORD }))
    clients[name] = client; users[name] = data.user.id
  }
}
async function createDemand(product, quantity = 50) {
  const destination = check(await clients.buyer.from('locations').select('id').eq('owner_id', users.buyer).limit(1).single()).id
  const data = await api('buyer','save_demand', { product_id: product, quantity, desired_date: futureDate(3), destination_id: destination })
  report.demands.push(data.id)
  return data
}
async function draft(demand) {
  const data = await api('buyer','draft', { ...demand, items: [{ offer_id: report.offers[0], quantity: 30 }, { offer_id: report.offers[1], quantity: 20 }], hours: 24 })
  report.loads.push(data.id)
  return { ...data, version: 1 }
}
try {
  await setup()
  if (process.argv.includes('--verify-expiration')) {
    const previous = JSON.parse(await readFile(reportPath, 'utf8'))
    Object.assign(report, previous)
    const load = report.expirationLoad
    assert.equal((await api('buyer','list')).loads.find(l => l.id === load.id).status, 'expired')
    assert.equal((await api('buyer','balances')).find(o => o.id === report.offers[0]).quantity_free, 30)
    const forbidden = await clients.ana.rpc('m2', { action: 'respond', payload: { ...load, decision: 'accepted' } })
    assert.ok(forbidden.error)
    check(await clients.ana.from('offers').update({status:'archived'}).eq('id',report.offers[0]))
    assert.equal(check(await clients.buyer.from('offers').select('id').eq('id',report.offers[0])).length,0)
    assert.ok((await api('buyer','list')).loads.find(l=>l.id===load.id).items.some(i=>i.offer_id===report.offers[0]))
    report.checks.push('Expiração real: status expirado, saldo livre e resposta tardia rejeitada (prazo antecipado administrativamente para o teste).')
    report.checks.push('Oferta vinculada arquivada: removida da busca do comprador e snapshot preservado no histórico.')
    console.log('PASS: expiração remota, liberação e bloqueio de resposta tardia.')
  } else {
    const product = check(await clients.buyer.from('products').select('id').eq('name','Alface').single()).id
    for (const [name, amount] of [['ana',30],['joao',25]]) {
      const location = check(await clients[name].from('locations').select('id').eq('owner_id',users[name]).limit(1).single()).id
      const offer = check(await clients[name].from('offers').insert({ product_id:product,pickup_location_id:location,quantity_total:amount,unit_price_cents:500,minimum_net_unit_cents:400,available_from:today(),available_until:futureDate(7) }).select('id').single())
      report.offers.push(offer.id)
    }
    const d1 = await createDemand(product), d2 = await createDemand(product)
    const l1 = await draft(d1), l2 = await draft(d2)
    const results = await Promise.all([clients.buyer.rpc('m2',{action:'submit',payload:l1}),clients.buyer.rpc('m2',{action:'submit',payload:l2})])
    assert.equal(results.filter(r => !r.error).length,1)
    const winner = results[0].error ? l2 : l1
    const loser = results[0].error ? l1 : l2
    const reservations = check(await clients.buyer.from('reservations').select('*,load_items!inner(load_id)').in('load_items.load_id',[l1.id,l2.id]))
    assert.equal(reservations.filter(r => r.load_items.load_id === winner.id).length,2)
    assert.equal(reservations.filter(r => r.load_items.load_id === loser.id).length,0)
    assert.equal((await api('buyer','balances')).find(o => o.id === report.offers[1]).quantity_free,5)
    report.checks.push('Concorrência real: duas submissões simultâneas; uma aceita, outra rejeitada; zero reservas parciais na perdedora; João mantém 5 kg.')
    assert.ok((await clients.buyer.rpc('m2',{action:'respond',payload:{...winner,decision:'accepted'}})).error)
    assert.ok((await clients.carrier.rpc('m2',{action:'list'})).error)
    assert.equal(check(await clients.carrier.from('loads').select('id').in('id',report.loads)).length,0)
    assert.equal((await api('ana','list')).loads.find(l=>l.id===winner.id).items.length,1)
    const cross = check(await clients.joao.from('offers').update({quantity_total:1}).eq('id',report.offers[0]).select('id'))
    assert.equal(cross.length,0)
    assert.ok((await clients.ana.from('offers').update({quantity_total:1}).eq('id',report.offers[0]).select('id')).error)
    assert.ok((await clients.buyer.from('loads').update({status:'awaiting_quotes'}).eq('id',winner.id)).error)
    const anonymous = createClient(url,process.env.VITE_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false}})
    assert.ok((await anonymous.rpc('m2',{action:'list'})).error)
    report.checks.push('Auth real e RLS: comprador não responde como produtor; transportador e anônimo não acessam M2; outro produtor não altera oferta; escrita direta em carga bloqueada; reserva impede redução do total.')
    check(await clients.ana.from('offers').update({unit_price_cents:600}).eq('id',report.offers[0]))
    assert.equal((await api('buyer','list')).loads.find(l=>l.id===winner.id).items.find(i=>i.offer_id===report.offers[0]).unit_price_cents,500)
    assert.ok((await clients.ana.from('offers').delete().eq('id',report.offers[0])).error)
    report.checks.push('Preço posterior preserva snapshot de R$ 5; exclusão de oferta vinculada impedida por FK.')
    await api('ana','respond',{...winner,decision:'accepted'})
    await api('joao','respond',{...winner,decision:'accepted'})
    assert.equal((await api('buyer','list')).loads.find(l=>l.id===winner.id).status,'awaiting_quotes')
    await api('buyer','cancel',{...winner,reason:'Teste M2: cancelamento de fixture.'})
    assert.equal((await api('buyer','balances')).find(o=>o.id===report.offers[0]).quantity_free,30)
    await api('buyer','cancel',{...loser,reason:'Teste M2: descarte do rascunho concorrente.'})
    const refused = await draft(d1)
    await api('buyer','submit',refused)
    await api('ana','respond',{...refused,decision:'rejected'})
    assert.equal((await api('buyer','list')).loads.find(l=>l.id===refused.id).status,'cancelled')
    assert.equal((await api('buyer','balances')).find(o=>o.id===report.offers[0]).quantity_free,30)
    report.checks.push('Aceites de ambos avançam a aguardando cotação; cancelamento e recusa liberam reservas integralmente.')
    const expiration = await draft(d1)
    await api('buyer','submit',expiration)
    report.expirationLoad = expiration
    // Nova sessão comprova persistência independente do cliente original.
    const fresh = createClient(url,process.env.VITE_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false}})
    check(await fresh.auth.signInWithPassword({email:process.env.VITE_DEMO_BUYER_EMAIL || 'comprador@conexa.invalid',password:process.env.VITE_DEMO_PASSWORD}))
    assert.ok(check(await fresh.rpc('m2',{action:'list'})).loads.some(l=>l.id===expiration.id))
    const removable = await createDemand(product,5)
    const destination = check(await clients.buyer.from('locations').select('id').eq('owner_id',users.buyer).limit(1).single()).id
    await api('buyer','save_demand',{...removable,version:1,product_id:product,quantity:6,desired_date:futureDate(3),destination_id:destination})
    await api('buyer','remove_demand',{...removable,version:2})
    assert.ok((await clients.buyer.rpc('m2',{action:'remove_demand',payload:{...d1,version:1}})).error)
    await api('buyer','archive_demand',{...d2,version:1})
    report.checks.push('CRUD real de demanda; exclusão vinculada rejeitada; arquivo preservado; operação visível após nova autenticação.')
    console.log('PASS: CRUD/Auth/RLS remotos, snapshots, concorrência real, aceite/recusa/cancelamento. Expiração aguarda antecipação administrativa do prazo da fixture.')
  }
} finally {
  await mkdir('artifacts',{recursive:true})
  await writeFile(reportPath,JSON.stringify(report,null,2))
  // Relatório contém somente UUIDs de fixtures e resultados; nenhuma credencial.
}
