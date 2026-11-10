// Mutates only fixtures created by this run, on the explicitly authorized demo.
// Run manually; excluded from npm test and from the local PGlite suite.
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { today, futureDate } from '../src/domain/offers.js'

process.loadEnvFile('.env')
const url = process.env.VITE_SUPABASE_URL
if (new URL(url).hostname !== 'ppbneiusqlitvewwoact.supabase.co') throw new Error('Projeto não autorizado.')
const clients = {}, users = {}, fixtures = []
const report = { started_at: new Date().toISOString(), project: 'ppbneiusqlitvewwoact', checks: [], fixtures, cleanup: [], limitations: ['API only; no connected browser reload or visual evaluation.', 'No second carrier account; forwarding without a replacement is tested.'] }
const freshClient = () => createClient(url, process.env.VITE_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
const check = ({ data, error }) => { if (error) throw new Error(`${error.code}: ${error.message}`); return data }
const api = async (name, module, action, payload = {}) => check(await clients[name].rpc(module, { action, payload }))
const fail = async (name, module, action, payload = {}, pattern) => {
  const { error } = await clients[name].rpc(module, { action, payload })
  assert.ok(error, `${module}/${action} should fail`)
  if (pattern) assert.match(error.message, pattern)
}
const passed = message => { report.checks.push(message); console.log(`PASS ${message}`) }
const getLoad = async (f, name = 'buyer') => (await api(name, 'm5', 'list')).loads.find(l => l.id === f.id)
const base = f => ({ id: f.id, version: f.version, quote_id: f.quote?.id })
const edit = (f, time = '09:00:00') => ({ ...base(f), vehicle_id: vehicle2.id, departure_time: `${f.date}T${time}-03:00`, delivery_time: `${f.date}T12:00:00-03:00`, expires_at: f.expires_at, reason: 'Teste remoto fictício: troca de veículo/horário, frete preservado.' })
const sync = async f => { const l = await getLoad(f); f.version = l.version; f.quote = l.quotes.find(q => q.id === l.selected_quote_id) || l.quotes.find(q => q.carrier_id === users.carrier); return l }
const oneWinner = responses => { assert.equal(responses.filter(r => !r.error).length, 1); assert.equal(responses.filter(r => r.error).length, 1) }
let product, destination, vehicle, vehicle2

async function login(name, account = name) {
  const client = freshClient()
  const env = account.toUpperCase()
  const fallback = { buyer: 'comprador', carrier: 'transporte' }[account] || account
  users[name] = check(await client.auth.signInWithPassword({ email: process.env[`VITE_DEMO_${env}_EMAIL`] || `${fallback}@conexa.invalid`, password: process.env.VITE_DEMO_PASSWORD })).user.id
  clients[name] = client
}

async function prepare(label, final = false) {
  const f = { label, offers: [], date: futureDate(3) }; fixtures.push(f)
  for (const [name, quantity, minimum] of [['ana', 30, 400], ['joao', 25, 450]]) {
    const location = check(await clients[name].from('locations').select('id').eq('owner_id', users[name]).limit(1).single())
    const offer = check(await clients[name].from('offers').insert({ product_id: product, pickup_location_id: location.id, quantity_total: quantity, unit_price_cents: 500, minimum_net_unit_cents: minimum, available_from: today(), available_until: futureDate(7), expires_on: name === 'ana' ? futureDate(8) : null }).select('id').single())
    f.offers.push({ id: offer.id, name, quantity })
  }
  f.demand = await api('buyer', 'm2', 'save_demand', { product_id: product, quantity: 50, desired_date: f.date, destination_id: destination })
  const draft = await api('buyer', 'm2', 'draft', { ...f.demand, items: f.offers.map((o, i) => ({ offer_id: o.id, quantity: i ? 20 : 30 })), hours: 24 })
  f.id = draft.id; f.version = 1
  await api('buyer', 'm2', 'submit', base(f))
  for (const name of ['ana', 'joao']) await api(name, 'm2', 'respond', { ...base(f), decision: 'accepted' })
  f.expires_at = new Date(Date.now() + 3600000).toISOString()
  f.quote = await api('carrier', 'm3', 'quote', { ...base(f), vehicle_id: vehicle.id, total_cents: 8000, departure_address: `Base fictícia · ${label}`, departure_time: `${f.date}T10:00:00-03:00`, delivery_time: `${f.date}T12:00:00-03:00`, expires_at: f.expires_at, conservation_required: 'refrigerated', services_included: { fuel: true, tolls: true, pickups: true, unloading: true } })
  await sync(f)
  if (final) { await api('buyer', 'm3', 'select_quote', base(f)); await sync(f); await confirmAll(f) }
  return f
}

async function confirmAll(f) {
  for (const name of ['buyer', 'ana', 'joao', 'carrier']) await api(name, 'm3', 'confirm', base(f))
  assert.equal((await getLoad(f)).status, 'awaiting_payment')
}

async function cleanup(f) {
  if (f.id) {
    const l = await getLoad(f)
    if (l && !['cancelled', 'expired', 'delivered'].includes(l.status)) {
      assert.ok(!['in_transit', 'delivery_review'].includes(l.status), 'Do not hide an unfinished in-transit fixture')
      await api('buyer', 'm5', 'cancel', { id: f.id, version: l.version, reason: 'Teste remoto concluído; liberar somente os dados criados nesta execução.' })
    }
  }
  for (const o of f.offers) check(await clients[o.name].from('offers').update({ status: 'archived' }).eq('id', o.id))
  if (f.demand) await api('buyer', 'm2', 'archive_demand', { ...f.demand, version: 1 })
  report.cleanup.push({ id: f.id, archived: true })
}

try {
  for (const name of ['ana', 'joao', 'buyer', 'carrier']) await login(name)
  await login('buyer2', 'buyer'); await login('carrier2', 'carrier')
  product = check(await clients.buyer.from('products').select('id').eq('name', 'Alface').single()).id
  destination = check(await clients.buyer.from('locations').select('id').eq('owner_id', users.buyer).limit(1).single()).id
  for (const name of ['vehicle', 'vehicle2']) {
    const v = await api('carrier', 'm3', 'save_vehicle', { description: `Teste remoto revisões · ${name} · ${report.started_at}`, capacity_kg: 500, vehicle_category: 'van fictícia', conservation_conditions: 'refrigerated' })
    if (name === 'vehicle') vehicle = v; else vehicle2 = v
  }
  report.vehicles = [vehicle.id, vehicle2.id]
  assert.equal((await api('buyer', 'm3', 'list')).quoteRevisionAvailable, true)
  passed('Auth real: quatro participantes e duas sessões adicionais independentes; RPCs M5/revisões disponíveis.')

  const f = await prepare('revisões e negociação')
  const route = await api('buyer', 'm4', 'route', base(f))
  assert.equal(route.loadId, f.id); assert.equal(route.stops.length, 4)
  await fail('ana', 'transport_updates', 'revise', edit(f), /Somente/)
  await fail('carrier', 'transport_updates', 'revise', { ...edit(f), total_cents: 1 }, /bloqueado/)
  oneWinner(await Promise.all(['carrier', 'carrier2'].map(n => clients[n].rpc('transport_updates', { action: 'revise', payload: edit(f) }))))
  let l = await sync(f)
  assert.equal(f.quote.revision, 2); assert.equal(Number(f.quote.total_cents), 8000)
  assert.equal(l.quotes.filter(q => q.carrier_id === users.carrier).length, 1)
  assert.ok(l.items.find(i => i.producer_id === users.ana).product_expires_on)
  const notices = {}
  for (const name of ['buyer', 'ana', 'joao']) {
    notices[name] = (await api(name, 'transport_updates', 'list')).notifications.filter(n => n.load_id === f.id)
    assert.equal(notices[name].length, 1)
    assert.equal(notices[name][0].recipient_id, users[name])
    assert.equal(Number(notices[name][0].changes.before.total_cents), 8000)
    assert.equal(Number(notices[name][0].changes.after.total_cents), 8000)
    assert.equal(check(await clients[name].from('transport_notifications').select('id').neq('recipient_id', users[name])).length, 0)
  }
  await api('buyer', 'transport_updates', 'read', { notification_id: notices.buyer[0].id })
  await fail('ana', 'transport_updates', 'read', { notification_id: notices.buyer[0].id }, /indisponível/)
  const persisted = (await api('buyer2', 'transport_updates', 'list')).notifications.find(n => n.id === notices.buyer[0].id)
  assert.ok(persisted.read_at)
  passed('Duas revisões simultâneas: uma vencedora, frete R$80 preservado; avisos separados a comprador/Ana/João e leitura protegida.')

  await api('buyer', 'm3', 'select_quote', base(f)); await sync(f)
  await api('buyer', 'm3', 'confirm', base(f))
  const oldVersion = f.version
  await api('carrier', 'transport_updates', 'revise', edit(f, '08:00:00')); l = await sync(f)
  assert.equal(f.version, oldVersion + 1); assert.equal(l.status, 'awaiting_final_approval')
  assert.equal(l.confirmations.filter(c => c.proposal_version === f.version).length, 0)
  await fail('buyer2', 'm3', 'confirm', { ...base(f), version: oldVersion }, /alterada/)
  await confirmAll(f)
  passed('Revisão selecionada invalida aceites; confirmação de versão antiga rejeitada; quatro novos aceites exigidos.')

  const request = amount => api('carrier', 'transport_updates', 'request_price', { ...base(f), proposed_cents: amount, direct_contact: true, reason: 'Cenário fictício de teste: registro demonstrativo de negociação.' })
  let negotiation = await request(9000)
  assert.equal(Number((await getLoad(f)).freight_cents), 8000)
  await fail('buyer', 'm5', 'pay', { ...base(f), outcome: 'approved', idempotency_key: randomUUID() }, /negociação/)
  await fail('buyer', 'm3', 'confirm', base(f), /negociação|fora de ordem/)
  await fail('ana', 'transport_updates', 'approve_price', { ...base(f), negotiation_id: negotiation.id }, /Somente/)
  await api('buyer', 'transport_updates', 'reject_price', { ...base(f), negotiation_id: negotiation.id })
  await api('carrier', 'transport_updates', 'keep_price', { ...base(f), negotiation_id: negotiation.id })
  assert.equal(Number((await getLoad(f)).freight_cents), 8000)
  assert.equal((await getLoad(f)).cancellation_fees.length, 0)
  passed('Negociação bloqueia aceite/pagamento, produtor não aprova preço; recusa e manutenção preservam R$80 sem taxa.')

  negotiation = await request(10007)
  oneWinner(await Promise.all(['buyer', 'buyer2'].map(n => clients[n].rpc('transport_updates', { action: 'approve_price', payload: { ...base(f), negotiation_id: negotiation.id, proposed_cents: 1 } }))))
  l = await sync(f)
  assert.equal(Number(l.freight_cents), 10007); assert.equal(Number(l.total_cents), 35007)
  assert.equal(l.status, 'awaiting_final_approval')
  assert.equal(l.confirmations.filter(c => c.proposal_version === f.version).length, 0)
  passed('Aprovação simultânea: um efeito; frete persistido R$100,07/total R$350,07; valor adulterado ignorado e novos aceites.')

  for (const name of ['buyer', 'ana', 'joao', 'carrier']) {
    await clients[name].auth.signOut(); await login(name)
    const reloaded = await getLoad(f, name)
    assert.equal(reloaded.version, f.version)
    assert.ok((await api(name, 'transport_updates', 'list')).notifications.some(n => n.load_id === f.id))
  }
  assert.ok((await api('buyer', 'transport_updates', 'list')).notifications.find(n => n.id === persisted.id).read_at)
  passed('Nova autenticação nos quatro perfis conserva revisão/avisos/leitura; persistência via API, sem alegar F5 do navegador.')

  negotiation = await request(11000)
  await fail('buyer', 'm3', 'confirm', base(f), /negociação/)
  await api('buyer', 'transport_updates', 'reject_price', { ...base(f), negotiation_id: negotiation.id })
  const fee = await api('carrier', 'transport_updates', 'preview_fee', { ...base(f), negotiation_id: negotiation.id })
  const hours = (new Date(fee.deadline).getTime() - Date.now()) / 3600000
  assert.equal(fee.rate_percent, hours <= 24 ? 30 : hours <= 72 ? 15 : 5)
  const expectedFee = Math.round(10007 * fee.rate_percent / 100)
  assert.equal(Number(fee.amount_cents), expectedFee); assert.equal(fee.expiry_missing, true)
  await fail('carrier', 'transport_updates', 'withdraw', { ...base(f), negotiation_id: negotiation.id, accept_fee: true, expected_fee_cents: 0, expected_rate_percent: fee.rate_percent }, /taxa mudou/)
  oneWinner(await Promise.all(['carrier', 'carrier2'].map(n => clients[n].rpc('transport_updates', { action: 'withdraw', payload: { ...base(f), negotiation_id: negotiation.id, accept_fee: true, expected_fee_cents: fee.amount_cents, expected_rate_percent: fee.rate_percent } }))))
  l = await getLoad(f); f.version = l.version
  assert.equal(l.status, 'awaiting_quotes'); assert.equal(l.selected_quote_id, null); assert.equal(l.replacement_carrier_id, null)
  assert.equal(l.cancellation_fees.length, 1)
  assert.equal(l.cancellation_fees[0].shares.reduce((sum, s) => sum + Number(s.amount_cents), 0), expectedFee)
  assert.equal(l.cancellation_fees[0].shares.find(s => s.kind === 'buyer').amount_cents, expectedFee - Math.floor(expectedFee / 2))
  assert.equal(Number((await api('buyer', 'm2', 'balances')).find(o => o.id === f.offers[1].id).quantity_free), 5)
  await fail('carrier', 'm3', 'quote', { ...base(f) }, /desistiu/)
  passed(`Desistências simultâneas: taxa simulada única ${expectedFee} centavos (${fee.rate_percent}%), parcelas exatas e saldo 5 kg; sem substituta inventada.`)

  for (const name of ['ana', 'joao']) {
    const rows = check(await clients[name].from('carrier_fee_shares').select('*').eq('fee_id', l.cancellation_fees[0].id))
    assert.equal(rows.length, 1); assert.equal(rows[0].recipient_id, users[name])
    assert.ok((await clients[name].from('carrier_fee_shares').update({ amount_cents: 1 }).eq('fee_id', l.cancellation_fees[0].id)).error)
    assert.equal(check(await clients[name].from('freight_negotiations').select('*').eq('load_id', f.id)).length, 0)
  }
  for (const table of ['transport_notifications', 'freight_negotiations', 'carrier_cancellation_fees']) assert.ok((await clients.buyer.from(table).insert({})).error)
  const anonymous = freshClient()
  assert.ok((await anonymous.rpc('transport_updates', { action: 'list' })).error)
  passed('RLS real: produtor vê apenas sua parcela, negociação restrita; escrita direta e RPC anônima bloqueadas.')

  const p = await prepare('pagamento e cancelamento concorrentes', true)
  const key = randomUUID()
  const payments = await Promise.all(['buyer', 'buyer2'].map(n => clients[n].rpc('m5', { action: 'pay', payload: { ...base(p), outcome: 'approved', idempotency_key: key } })))
  const results = payments.map(check)
  assert.equal(results[0].id, results[1].id)
  let paid = await getLoad(p); assert.equal(paid.status, 'scheduled'); assert.equal(paid.payments.length, 1)
  await fail('carrier', 'transport_updates', 'revise', edit(p), /antes do pagamento/)
  const cancellations = await Promise.all(['buyer', 'buyer2'].map(n => clients[n].rpc('m5', { action: 'cancel', payload: { ...base(p), reason: 'Cancelamento fictício concorrente do teste.' } })))
  cancellations.forEach(check)
  paid = await getLoad(p); assert.equal(paid.status, 'cancelled'); assert.equal(paid.payments.length, 1); assert.equal(paid.payments[0].status, 'refunded')
  assert.equal(Number((await api('buyer', 'm2', 'balances')).find(o => o.id === p.offers[1].id).quantity_free), 25)
  passed('Pagamentos simultâneos com mesma chave: uma aprovação; cancelamentos simultâneos: um estorno e estoque liberado uma vez.')

  const race = await prepare('revisão versus pagamento', true)
  const competing = await Promise.all([
    clients.carrier.rpc('transport_updates', { action: 'revise', payload: edit(race) }),
    clients.buyer.rpc('m5', { action: 'pay', payload: { ...base(race), outcome: 'approved', idempotency_key: randomUUID() } }),
  ])
  oneWinner(competing)
  const winner = await getLoad(race); race.version = winner.version
  if (winner.status === 'scheduled') { assert.equal(winner.payments.length, 1); assert.equal(winner.version, 2) }
  else { assert.equal(winner.status, 'awaiting_final_approval'); assert.equal(winner.version, 3); assert.equal(winner.payments.length, 0) }
  passed(`Revisão versus pagamento simultâneos: um vencedor, estado consistente (${winner.status}).`)
  report.success = true
} catch (error) {
  report.success = false; report.error = error.message; process.exitCode = 1
  console.error(error.message)
} finally {
  for (const fixture of fixtures) {
    try { await cleanup(fixture) } catch (error) { report.cleanup.push({ id: fixture.id, error: error.message }); report.success = false; process.exitCode = 1 }
  }
  await mkdir('artifacts', { recursive: true })
  report.finished_at = new Date().toISOString()
  await writeFile(`artifacts/quote-revisions-${report.started_at.replace(/[:.]/g, '-')}.local.json`, JSON.stringify(report, null, 2))
  await writeFile('artifacts/quote-revisions-remote.local.json', JSON.stringify(report, null, 2))
  for (const client of Object.values(clients)) await client.auth.signOut()
  console.log(`Report: artifacts/quote-revisions-remote.local.json; ${report.checks.length} checks; success=${report.success}`)
}
