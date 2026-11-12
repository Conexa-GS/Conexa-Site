// Manual demo verification. Public key + real Auth/RLS; no map provider or admin writes.
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { demoConfig, demoProject } from './helpers/conversations-demo-config.mjs'
import { futureDate, today } from '../src/domain/offers.js'
import { compositionAlternatives } from '../src/domain/inclusion.js'

const [mode, reportPath] = process.argv.slice(2)
assert.ok(['--check', '--prepare-ui', '--prepare-route', '--finish'].includes(mode), 'Use --check | --prepare-ui | --prepare-route/--finish artifacts/m4-….local.json')
process.loadEnvFile('.env')
const config = demoConfig(process.env)
if (mode === '--check') console.log(`PASS configuração offline ${demoProject}; sem rede/escrita.`)
else await run()

async function run() {
  const report = mode === '--prepare-ui' ? { run_id: randomUUID(), project: demoProject, started_at: new Date().toISOString(), checks: [], offers: [], demands: [] } : JSON.parse(await readFile(reportPath, 'utf8'))
  assert.equal(report.project, demoProject)
  if (report.failure) {
    report.previous_failures = [...(report.previous_failures || []), report.failure]
    delete report.failure
  }
  const clients = {}, ids = {}
  const check = ({ data, error }) => { if (error) throw Object.assign(new Error(error.message), { code: error.code }); return data }
  const api = async (who, module, action, payload = {}) => check(await clients[who].rpc(module, { action, payload }))
  const rows = async (who, table, filters = {}) => {
    let query = clients[who].from(table).select('*')
    for (const [key, value] of Object.entries(filters)) query = query.eq(key, value)
    return check(await query)
  }
  const base = load => ({ id: load.id, version: load.version })
  const current = async () => (await api('buyer', 'm3', 'list')).loads.find(l => l.demand_id === report.demands[0]?.id)
  const fresh = () => createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: {
    fetch: (url, options) => {
      assert.equal(new URL(url).origin, config.url, 'Rede limitada ao Supabase demo; mapas externos bloqueados no roteiro.')
      return fetch(url, { ...options, signal: AbortSignal.timeout(20000) })
    },
  } })
  async function login(who) {
    clients[who] = fresh()
    const { user } = check(await clients[who].auth.signInWithPassword({ email: config.emails[who], password: config.password }))
    assert.equal(check(await clients[who].auth.getUser()).user.id, user.id)
    const participant = (await rows(who, 'participants', { id: user.id }))[0]
    assert.equal(participant.is_demo, true)
    assert.equal(participant.role, { ana: 'producer', joao: 'producer', buyer: 'buyer', carrier: 'carrier' }[who])
    ids[who] = user.id
  }
  async function snapshot(load) {
    return { load: await current(), reservations: (await Promise.all(load.items.map(i => rows('buyer', 'reservations', { load_item_id: i.id })))).flat() }
  }
  try {
    for (const who of ['ana', 'joao', 'buyer', 'carrier']) await login(who)
    clients.anon = fresh()
    if (mode === '--prepare-ui') {
      const product = (await rows('buyer', 'products')).find(p => p.name === 'Tomate' && p.unit === 'kg')
      assert.ok(product)
      const date = futureDate(3)
      const destination = (await rows('buyer', 'locations', { owner_id: ids.buyer }))[0]
      // Refuse to mingle this controlled comparison with existing compatible offers.
      const baseline = await api('buyer', 'm2', 'balances')
      assert.equal(baseline.filter(o => o.product_id === product.id && Number(o.quantity_free) > 0 && o.available_from <= date && o.available_until >= date).length, 0)
      for (const who of ['ana', 'joao']) {
        const location = (await rows(who, 'locations', { owner_id: ids[who] }))[0]
        const offer = check(await clients[who].rpc('save_offer', { p_data: {
          product_id: product.id, pickup_location_id: location.id, quantity_total: 30,
          unit_price_cents: who === 'ana' ? 500 : 700, minimum_net_unit_cents: who === 'ana' ? 400 : 600,
          available_from: today(), available_until: futureDate(7), expires_on: null, status: 'published',
        } }))
        report.offers.push({ id: offer.id, who })
      }
      for (const quantity of [50, 80]) report.demands.push(await api('buyer', 'm2', 'save_demand', { product_id: product.id, quantity, desired_date: date, destination_id: destination.id }))
      const demand = (await api('buyer', 'm2', 'list')).demands.find(d => d.id === report.demands[0].id)
      const before = await api('buyer', 'm2', 'list')
      const plain = await api('buyer', 'm2', 'candidates', { id: demand.id })
      const candidates = await api('buyer', 'm4', 'candidates', { id: demand.id })
      assert.equal(candidates.length, 2)
      for (const offer of candidates) {
        assert.deepEqual(Object.keys(offer).sort(), [...Object.keys(plain.find(o => o.id === offer.id)), 'completed_sales', 'waiting_days'].sort())
        const who = report.offers.find(o => o.id === offer.id).who
        const history = (await api(who, 'm5', 'list')).loads.filter(l => l.status === 'delivered')
        assert.equal(offer.completed_sales, new Set(history.map(l => l.id)).size)
        assert.equal(offer.waiting_days, Math.max(0, Math.floor((Date.now() - Date.parse(offer.created_at)) / 86400000)))
      }
      report.history = candidates.map(o => ({ producer_id: o.producer_id, completed_sales: o.completed_sales, waiting_days: o.waiting_days, created_at: o.created_at }))
      assert.equal(candidates.find(o => o.producer_id === ids.joao).completed_sales < candidates.find(o => o.producer_id === ids.ana).completed_sales, true)
      const alternatives = compositionAlternatives(candidates, demand)
      assert.equal(alternatives.price.subtotal, 29000)
      assert.equal(alternatives.inclusive.subtotal, 31000)
      assert.equal(alternatives.difference, 2000)
      assert.equal(alternatives.inclusive.items[0].producer_id, ids.joao)
      assert.ok(alternatives.inclusive.items.every(i => i.gross_cents >= i.minimum_cents))
      assert.deepEqual(await api('buyer', 'm2', 'list'), before)
      assert.equal(compositionAlternatives(candidates.map(o => ({ ...o, completed_sales: null })), demand), null)
      assert.equal(compositionAlternatives(candidates.map(o => ({ ...o, created_at: null })), demand), null)
      const shortDemand = (await api('buyer', 'm2', 'list')).demands.find(d => d.id === report.demands[1].id)
      const short = compositionAlternatives(await api('buyer', 'm4', 'candidates', { id: shortDemand.id }), shortDemand)
      assert.equal(short.inclusive.complete, false); assert.equal(short.inclusive.missing, 20); assert.equal(short.difference, null)
      for (const who of ['ana', 'joao', 'carrier', 'anon']) await assert.rejects(api(who, 'm4', 'candidates', { id: demand.id }))
      report.checks.push('Histórico agregado confere com entregas reais visíveis aos produtores; idade da oferta confere; resposta só acrescenta contagem/espera, sem expor vendas alheias.')
      report.checks.push('Candidatas R$290/R$310, diferença R$20 só alimentos, João prioritário por 4 vs 7 entregas; mínimos preservados, consulta não cria carga/reserva. Histórico desconhecido não vira zero no domínio.')
      report.checks.push('Saldo 60/80 mantém demanda e faltam 20 kg, sem candidata utilizável/diferença fictícia; perfis indevidos e anônimo rejeitados.')
      report.status = 'ready_for_composition_ui'
    } else if (mode === '--prepare-route') {
      let load = await current()
      assert.ok(load, 'Envie primeiro a candidata inclusiva pela interface.')
      assert.ok(['awaiting_producers', 'awaiting_quotes'].includes(load.status))
      assert.equal(Number(load.subtotal_cents), 31000)
      report.load_id = load.id
      if (load.status === 'awaiting_producers') for (const who of ['ana', 'joao']) await api(who, 'm2', 'respond', { ...base(load), decision: 'accepted' })
      load = await current()
      const vehicle = (await rows('carrier', 'vehicles', { carrier_id: ids.carrier })).find(v => Number(v.capacity_kg) >= 50)
      assert.ok(vehicle)
      const quote = load.quotes.find(q => q.departure_address === `Base fictícia M4 ${report.run_id}`) || await api('carrier', 'm3', 'quote', { ...base(load), vehicle_id: vehicle.id, total_cents: 8000,
        departure_address: `Base fictícia M4 ${report.run_id}`, return_address: `Retorno fictício M4 ${report.run_id}`,
        departure_time: `${load.scheduled_date}T10:00:00-03:00`, delivery_time: `${load.scheduled_date}T12:00:00-03:00`,
        expires_at: new Date(Date.now() + 3600000).toISOString(), conservation_required: vehicle.conservation_conditions,
        services_included: { fuel: true, tolls: true, pickups: true, unloading: true },
      })
      const request = { ...base(load), quote_id: quote.id }
      const before = await snapshot(load)
      assert.equal(before.reservations.length, 2)
      const route = await api('buyer', 'm4', 'route', request)
      assert.deepEqual(await api('carrier', 'm4', 'route', request), route)
      assert.deepEqual(route.stops.map(s => s.kind), ['departure', 'pickup', 'pickup', 'destination', 'return'])
      assert.deepEqual(route.stops.filter(s => s.kind === 'pickup').map(s => s.itemId), load.items.map(i => i.id).sort())
      assert.equal(route.stops[0].address, quote.departure_address)
      assert.equal(route.stops[3].address, load.destination_address)
      assert.equal(route.stops[4].address, quote.return_address)
      for (const field of ['distanceMeters', 'drivingSeconds', 'stopSeconds', 'tollAmountCents', 'provider']) assert.equal(route[field], null)
      assert.ok(route.stops.every(s => s.stopSeconds === null))
      assert.equal(route.status, 'manual'); assert.equal(route.isSimulated, false); assert.equal(route.freightCents, 8000)
      assert.deepEqual(await snapshot(load), before)
      for (const who of ['ana', 'joao', 'anon']) await assert.rejects(api(who, 'm4', 'route', request))
      await assert.rejects(api('buyer', 'm4', 'route', { ...request, quote_id: randomUUID() }), /indisponível/)
      await assert.rejects(api('buyer', 'm4', 'route', { ...request, version: load.version + 1 }), /alterada/)
      await api('buyer', 'm3', 'select_quote', request)
      await assert.rejects(api('buyer', 'm4', 'route', request), /alterada/)
      load = await current()
      await api('ana', 'm3', 'confirm', base(load))
      const selectedBefore = await snapshot(load)
      report.route = await api('buyer', 'm4', 'route', { ...base(load), quote_id: load.selected_quote_id })
      assert.deepEqual(await snapshot(load), selectedBefore)
      assert.equal(Number(load.total_cents), 39000)
      // Existing delivered demo operation: read-only route without an agreed return.
      const old = (await api('buyer', 'm5', 'list')).loads.find(l => l.status === 'delivered' && l.quotes.some(q => q.id === l.selected_quote_id && !q.return_address))
      assert.ok(old)
      const noReturn = await api('buyer', 'm4', 'route', { ...base(old), quote_id: old.selected_quote_id })
      assert.equal(noReturn.stops.filter(s => s.kind === 'return').length, 0)
      await clients.buyer.auth.signOut({ scope: 'local' }); await login('buyer')
      assert.deepEqual(await api('buyer', 'm4', 'route', { ...base(load), quote_id: load.selected_quote_id }), report.route)
      assert.deepEqual(await snapshot(load), selectedBefore)
      report.checks.push('Roteiro comprador/transportador idêntico: saída, duas coletas por UUID, destino, retorno acordado; sem retorno em operação antiga consultada. Distância/direção/paradas/pedágio/provider nulos, frete R$80 sem dupla soma, total R$390.')
      report.checks.push('Roteiro não altera carga/cotações/eventos/aceites/reservas; produtor e anônimo isolados, cotação inexistente e versão antiga rejeitadas; nova Auth preserva roteiro e aceite.')
      report.status = 'ready_for_route_ui'
    } else {
      const load = await current()
      if (load && !['cancelled', 'expired'].includes(load.status)) await api('buyer', 'm2', 'cancel', { ...base(load), reason: `Encerramento da verificação fictícia M4 ${report.run_id}` })
      for (const demand of report.demands) {
        const row = (await rows('buyer', 'demands', { id: demand.id }))[0]
        if (row.status !== 'archived') await api('buyer', 'm2', 'archive_demand', { id: row.id, version: row.version })
        assert.equal((await rows('buyer', 'demands', { id: row.id }))[0].status, 'archived')
      }
      for (const { id, who } of report.offers) {
        const offer = (await rows(who, 'offers', { id }))[0]
        if (offer.status !== 'archived') check(await clients[who].rpc('save_offer', { p_data: {}, p_id: id, p_version: offer.version, p_archive: true }))
        assert.equal((await rows(who, 'offers', { id }))[0].status, 'archived')
      }
      if (load) {
        assert.ok((await snapshot(load)).reservations.every(r => r.status === 'released'))
        assert.equal((await rows('buyer', 'payment_attempts', { load_id: load.id })).length, 0)
      }
      report.checks.push('Nova Auth: carga própria cancelada, reservas liberadas, duas ofertas/duas demandas arquivadas, zero pagamentos; histórico anterior preservado.')
      report.status = 'passed'
    }
  } catch (error) {
    report.status = 'failed'; report.failure = `${error.code || 'TEST'}: ${error.message}`.split('\n')[0]; process.exitCode = 1
  } finally {
    for (const client of Object.values(clients)) { try { check(await client.auth.signOut({ scope: 'local' })) } catch { report.session_cleanup_failed = true; process.exitCode = 1 } }
    report.updated_at = new Date().toISOString()
    await mkdir('artifacts', { recursive: true })
    const path = reportPath || `artifacts/m4-${report.run_id}.local.json`
    await writeFile(path, JSON.stringify(report, null, 2))
    console.log(`${report.status}: M4 demo, ${report.checks.length} grupos. ${path}`)
    if (report.failure) console.log(report.failure)
    if (mode === '--prepare-ui' && report.status !== 'failed') console.log(JSON.stringify({ demands: report.demands, history: report.history }))
    if (mode === '--prepare-route' && report.status !== 'failed') console.log(JSON.stringify({ load_id: report.load_id, version: report.route.version }))
  }
}
