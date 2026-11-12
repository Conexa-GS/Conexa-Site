// Manual demo test. Auth/RLS only; creates its own offer/demand/load, never
// modifies existing business fixtures. No admin writes, migrations or paid API.
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { demoConfig, demoProject } from './helpers/conversations-demo-config.mjs'
import { today, futureDate } from '../src/domain/offers.js'
import { offerFields } from '../src/domain/site-bot.js'

process.loadEnvFile('.env')
const config = demoConfig(process.env)
if (process.argv.length !== 3 || !['--check', '--run-demo'].includes(process.argv[2])) throw new Error('Use --check ou --run-demo (demo autorizado).')
if (process.argv[2] === '--check') {
  console.log(`PASS configuração offline ${demoProject}; sem rede/escrita.`)
} else await run()

async function run() {
  const report = { run_id: randomUUID(), project: demoProject, checks: [], status: 'running', cleanup: [] }
  const clients = {}, ids = {}
  const check = ({ data, error }) => { if (error) throw Object.assign(new Error(error.message), { code: error.code }); return data }
  const query = async (who, table, filters = {}) => {
    let q = clients[who].from(table).select('*')
    for (const [key, value] of Object.entries(filters)) q = q.eq(key, value)
    return check(await q)
  }
  const api = async (who, module, action, payload = {}) => check(await clients[who].rpc(module, { action, payload }))
  let cid, offer, demand, load, createKey
  const bot = async (action, payload = {}) => check(await clients.ana.rpc('site_bot', { p_action: action, p_payload: { conversation_id: cid, ...payload } }))
  const state = () => bot('state')
  const turn = async (intent, fields, target = null) => {
    const s = await state()
    return bot('turn', { request_id: randomUUID(), revision: s.draft?.revision || 0, body: `Teste fictício estoque ${report.run_id}: ${intent}`, intent, fields, target_id: target?.id || null, offer_version: target?.version || null })
  }
  const confirm = async () => bot('confirm', { revision: (await state()).draft.revision, request_id: randomUUID() })
  const edit = async changes => {
    const current = (await query('ana', 'offers', { id: offer.id }))[0]
    await turn('edit', { ...offerFields(current), ...changes }, current)
    return confirm()
  }
  const stock = async () => Number((await api('buyer', 'm2', 'balances')).find(o => o.id === offer.id).quantity_free)
  const getLoad = async () => (await api('buyer', 'm5', 'list')).loads.find(l => l.id === load.id)
  const base = () => ({ id: load.id, version: load.version })
  try {
    for (const who of ['ana', 'buyer', 'carrier']) {
      clients[who] = createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: (url, options) => fetch(url, { ...options, signal: AbortSignal.timeout(20000) }) } })
      ids[who] = check(await clients[who].auth.signInWithPassword({ email: config.emails[who], password: config.password })).user.id
      const participant = (await query(who, 'participants', { id: ids[who] }))[0]
      assert.equal(participant.is_demo, true)
      assert.equal(participant.role, { ana: 'producer', buyer: 'buyer', carrier: 'carrier' }[who])
    }
    cid = check(await clients.ana.rpc('site_chat', { p_action: 'inbox', p_payload: {} })).conversations.find(c => c.kind === 'bot').id
    const initial = await state()
    assert.ok(!initial.draft || ['applied', 'cancelled'].includes(initial.draft.status), 'Não substituir rascunho de outra sessão.')
    const product = initial.catalog.products.find(p => p.unit === 'kg')
    const date = futureDate(3)
    const fields = { product_id: product.id, pickup_location_id: initial.catalog.locations[0].id, quantity_total: '20', price: '5,07', minimum: '4,00', available_from: today(), available_until: futureDate(7), expires_on: futureDate(8) }
    const created = await turn('create', fields)
    createKey = randomUUID()
    offer = (await bot('confirm', { revision: created.draft.revision, request_id: createKey })).offer
    assert.ok(offer?.id); report.offer_id = offer.id
    const destination = (await query('buyer', 'locations', { owner_id: ids.buyer }))[0].id
    demand = await api('buyer', 'm2', 'save_demand', { product_id: product.id, quantity: 10, desired_date: date, destination_id: destination })
    report.demand_id = demand.id
    load = await api('buyer', 'm2', 'draft', { ...demand, items: [{ offer_id: offer.id, quantity: 10 }], hours: 24 })
    load.version = 1; report.load_id = load.id
    await turn('edit', { ...offerFields(offer), quantity_total: '5' }, offer)
    await api('buyer', 'm2', 'submit', base())
    const stale = await confirm()
    assert.equal(stale.offer, null); assert.equal(stale.draft.status, 'conflict')
    assert.equal(await stock(), 10)
    const reserved = await edit({ quantity_total: '5' })
    assert.equal(reserved.offer, null); assert.match(reserved.reply, /reservad|comprometid/)
    assert.equal(Number((await query('ana', 'offers', { id: offer.id }))[0].quantity_total), 20)
    report.checks.push('Reserva real invalida prévia antiga e bloqueia redução abaixo dos 10 kg reservados; saldo livre 10 kg.')

    const snapshots = await query('buyer', 'load_items', { load_id: load.id })
    assert.equal((await edit({ price: '8,00', expires_on: futureDate(9) })).offer.unit_price_cents, 800)
    assert.deepEqual(await query('buyer', 'load_items', { load_id: load.id }), snapshots)
    const otherProduct = initial.catalog.products.find(p => p.id !== product.id && p.unit === 'kg')
    assert.ok(otherProduct)
    assert.equal((await edit({ product_id: otherProduct.id })).offer, null)
    report.checks.push('Preço/vencimento do cadastro editados pelo bot preservam snapshots; troca de produto vinculado é bloqueada.')

    await api('ana', 'm2', 'respond', { ...base(), decision: 'accepted' })
    const vehicle = (await query('carrier', 'vehicles', { carrier_id: ids.carrier })).find(v => Number(v.capacity_kg) >= 10 && v.conservation_conditions === 'refrigerated')
    assert.ok(vehicle, 'Necessário veículo demo existente compatível, sem alterar frota.')
    const quote = await api('carrier', 'm3', 'quote', { ...base(), vehicle_id: vehicle.id, total_cents: 8000, departure_address: `Base fictícia T41 ${report.run_id}`, departure_time: `${date}T10:00:00-03:00`, delivery_time: `${date}T12:00:00-03:00`, expires_at: new Date(Date.now() + 3600000).toISOString(), conservation_required: 'refrigerated', services_included: { fuel: true, tolls: true, pickups: true, unloading: true } })
    await api('buyer', 'm3', 'select_quote', { ...base(), quote_id: quote.id })
    load = await getLoad()
    for (const who of ['buyer', 'ana', 'carrier']) await api(who, 'm3', 'confirm', base())
    assert.equal((await getLoad()).status, 'awaiting_payment')
    const paymentKey = randomUUID()
    await api('buyer', 'm5', 'pay', { ...base(), outcome: 'approved', idempotency_key: paymentKey })
    assert.equal((await getLoad()).status, 'scheduled')
    assert.equal(await stock(), 10, 'Reserva vira compromisso sem descontar duas vezes')
    const committed = await query('buyer', 'reservations', { offer_id: offer.id })
    assert.equal(committed.length, 1); assert.equal(committed[0].status, 'committed')
    assert.equal((await edit({ quantity_total: '9' })).offer, null)
    const paidBefore = await getLoad()
    assert.equal((await edit({ price: '9,00', quantity_total: '25' })).offer.unit_price_cents, 900)
    assert.equal(await stock(), 15)
    const paidAfter = await getLoad()
    for (const field of ['items', 'payments', 'confirmations', 'events', 'total_cents', 'freight_cents', 'version', 'status']) assert.deepEqual(paidAfter[field], paidBefore[field], `Histórico pago preservado: ${field}`)
    assert.deepEqual(await query('buyer', 'load_items', { load_id: load.id }), snapshots)
    assert.deepEqual(await query('buyer', 'reservations', { offer_id: offer.id }), committed)
    report.checks.push('Pagamento simulado converte reserva real em compromisso único; redução bloqueada; edição válida preserva operação paga, aceites, pagamento, reservas e snapshots.')
    const archive = (await query('ana', 'offers', { id: offer.id }))[0]
    await turn('archive', offerFields(archive), archive)
    assert.equal((await confirm()).offer.status, 'archived')
    assert.equal((await query('ana', 'offers', { id: offer.id }))[0].status, 'archived')
    assert.deepEqual(await query('buyer', 'load_items', { load_id: load.id }), snapshots)
    assert.deepEqual(await query('buyer', 'reservations', { offer_id: offer.id }), committed)
    assert.ok((await bot('messages')).messages.some(m => m.body.includes(offer.id)))
    report.checks.push('Arquivar pelo bot conserva oferta física, compromisso, histórico do bot e snapshots da carga paga.')
    report.status = 'passed'
  } catch (error) {
    report.status = 'failed'; report.failure = `${error.code || 'TEST'}: ${error.message}`.split('\n')[0]; process.exitCode = 1
  } finally {
    try {
      if (!offer && createKey) offer = (await query('ana', 'site_bot_requests', { request_id: createKey }))[0]?.result?.offer
      if (load) {
        const latest = await getLoad()
        assert.ok(['draft', 'awaiting_producers', 'awaiting_quotes', 'awaiting_final_approval', 'awaiting_payment', 'scheduled', 'cancelled'].includes(latest.status))
        if (latest.status !== 'cancelled') await api('buyer', 'm5', 'cancel', { id: load.id, version: latest.version, reason: `Encerramento do teste fictício T41 ${report.run_id}` })
        assert.ok((await query('buyer', 'reservations', { offer_id: offer.id })).every(r => r.status === 'released'))
        report.cleanup.push('Carga própria cancelada; compromisso liberado; estorno simulado quando aplicável.')
      }
      if (offer) {
        const current = (await query('ana', 'offers', { id: offer.id }))[0]
        if (current.status !== 'archived') check(await clients.ana.rpc('save_offer', { p_data: {}, p_id: current.id, p_version: current.version, p_archive: true }))
        assert.equal((await query('ana', 'offers', { id: offer.id }))[0].status, 'archived')
        report.cleanup.push('Oferta própria arquivada; linhas/histórico preservados.')
      }
      if (demand) {
        const current = (await query('buyer', 'demands', { id: demand.id }))[0]
        await api('buyer', 'm2', 'archive_demand', { id: current.id, version: current.version })
        report.cleanup.push('Demanda própria arquivada.')
      }
      if (cid) {
        const draft = (await state()).draft
        if (draft && draft.status !== 'applied' && draft.status !== 'cancelled' && draft.target_id === offer?.id) await turn('cancel', {})
      }
    } catch (error) { report.cleanup_failure = error.message; report.status = 'failed'; process.exitCode = 1 }
    for (const client of Object.values(clients)) { try { check(await client.auth.signOut({ scope: 'local' })) } catch { report.status = 'failed'; process.exitCode = 1 } }
    report.finished_at = new Date().toISOString()
    await mkdir('artifacts', { recursive: true })
    const path = `artifacts/bot-stock-${report.run_id}.local.json`
    await writeFile(path, JSON.stringify(report, null, 2))
    console.log(`${report.status === 'passed' ? 'PASS' : 'FAIL'} bot/estoque demo: ${report.checks.length} grupos. ${path}`)
  }
}
