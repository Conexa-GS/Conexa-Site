// Manual, explicitly authorized demo run. Own fixtures, public key and real Auth/RLS.
// No admin writes, migrations, external payments or physical transport.
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { demoConfig, demoProject } from './helpers/conversations-demo-config.mjs'
import { today, futureDate } from '../src/domain/offers.js'

const [mode, reportPath] = process.argv.slice(2)
assert.ok(['--check', '--run-demo', '--prepare-ui', '--finish-ui', '--recover'].includes(mode), 'Use --check | --run-demo | --prepare-ui | --finish-ui/--recover artifacts/m5-….local.json')
process.loadEnvFile('.env')
const config = demoConfig(process.env)
if (mode === '--check') console.log(`PASS configuração offline ${demoProject}; sem rede/escrita.`)
else await run()

async function run() {
  const report = ['--finish-ui', '--recover'].includes(mode) ? JSON.parse(await readFile(reportPath, 'utf8')) : {
    run_id: randomUUID(), project: demoProject, started_at: new Date().toISOString(), checks: [], offers: [], loads: [], cleanup: [],
    limitations: ['API/Auth/RLS e concorrência reais; navegador registrado separadamente.', 'Sem nova conta ou segunda transportadora; terceiro testado com produtor alheio à carga.', 'Histórico fictício preservado; ofertas/demandas próprias arquivadas ao terminar.'],
  }
  assert.equal(report.project, demoProject)
  const clients = {}, ids = {}
  const fresh = () => createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: (url, options) => fetch(url, { ...options, signal: AbortSignal.timeout(20000) }) } })
  const check = ({ data, error }) => { if (error) throw Object.assign(new Error(error.message), { code: error.code }); return data }
  const api = async (who, module, action, payload = {}) => check(await clients[who].rpc(module, { action, payload }))
  const rows = async (who, table, filters = {}) => {
    let query = clients[who].from(table).select('*')
    for (const [key, value] of Object.entries(filters)) query = query.eq(key, value)
    return check(await query)
  }
  const base = load => ({ id: load.id, version: load.version })
  const current = async (load, who = 'buyer') => (await api(who, 'm5', 'list')).loads.find(l => l.id === load.id)
  const stock = async offer => Number((await api('buyer', 'm2', 'balances')).find(o => o.id === offer.id).quantity_free)
  const reject = async (promise, pattern = /./) => assert.rejects(promise, pattern)
  const parallel = async tasks => {
    const results = await Promise.allSettled(tasks)
    for (const result of results) assert.equal(result.status, 'fulfilled', result.reason?.message)
    return results.map(result => result.value)
  }
  async function login(who) {
    const account = who === 'buyer2' ? 'buyer' : who
    clients[who] = fresh()
    const { user } = check(await clients[who].auth.signInWithPassword({ email: config.emails[account], password: config.password }))
    assert.equal(check(await clients[who].auth.getUser()).user.id, user.id)
    const participant = (await rows(who, 'participants', { id: user.id }))[0]
    assert.equal(participant.is_demo, true)
    assert.equal(participant.role, { ana: 'producer', joao: 'producer', buyer: 'buyer', carrier: 'carrier' }[account])
    ids[who] = user.id
  }
  async function again(who) { check(await clients[who].auth.signOut({ scope: 'local' })); await login(who) }
  async function prepare(two = true, tiny = false) {
    const product = (await rows('buyer', 'products')).find(p => p.unit === 'kg')
    const items = []
    for (const who of two ? ['ana', 'joao'] : ['ana']) {
      const location = (await rows(who, 'locations', { owner_id: ids[who] }))[0]
      const offer = check(await clients[who].rpc('save_offer', { p_data: {
        product_id: product.id, pickup_location_id: location.id, quantity_total: tiny ? 1 : who === 'ana' ? 30 : 25,
        unit_price_cents: tiny ? 1 : 500, minimum_net_unit_cents: tiny ? 0 : 400,
        available_from: today(), available_until: futureDate(7), expires_on: futureDate(8), status: 'published',
      } }))
      report.offers.push({ id: offer.id, who })
      items.push({ offer_id: offer.id, quantity: tiny ? 0.001 : who === 'ana' ? 30 : 20 })
    }
    const quantity = items.reduce((sum, item) => sum + item.quantity, 0)
    const destination = (await rows('buyer', 'locations', { owner_id: ids.buyer }))[0]
    const date = futureDate(3)
    const demand = await api('buyer', 'm2', 'save_demand', { product_id: product.id, quantity, desired_date: date, destination_id: destination.id })
    const entry = { demand_id: demand.id, items, producers: two ? ['ana', 'joao'] : ['ana'] }
    report.loads.push(entry)
    const load = { ...await api('buyer', 'm2', 'draft', { ...demand, items, hours: 24 }), version: 1 }
    Object.assign(entry, base(load))
    await reject(api('buyer', 'm5', 'pay', { ...base(load), outcome: 'approved', idempotency_key: randomUUID() }), /fora de ordem/)
    await api('buyer', 'm2', 'submit', base(load))
    for (const who of entry.producers) await api(who, 'm2', 'respond', { ...base(load), decision: 'accepted' })
    const vehicle = (await rows('carrier', 'vehicles', { carrier_id: ids.carrier })).find(v => Number(v.capacity_kg) >= quantity)
    assert.ok(vehicle, 'Veículo demo existente compatível necessário; não alterar frota.')
    const quote = await api('carrier', 'm3', 'quote', { ...base(load), vehicle_id: vehicle.id, total_cents: 8000,
      departure_address: `Base fictícia T28 ${report.run_id}`, departure_time: `${date}T10:00:00-03:00`, delivery_time: `${date}T12:00:00-03:00`,
      expires_at: new Date(Date.now() + 3600000).toISOString(), conservation_required: vehicle.conservation_conditions,
      services_included: { fuel: true, tolls: true, pickups: true, unloading: true },
    })
    await api('buyer', 'm3', 'select_quote', { ...base(load), quote_id: quote.id })
    Object.assign(entry, base(await current(load)))
    for (const who of [...entry.producers, 'carrier', 'buyer']) await api(who, 'm3', 'confirm', base(entry))
    assert.equal((await current(entry)).status, 'awaiting_payment')
    return entry
  }
  async function pay(load, outcome, key = randomUUID(), who = 'buyer') {
    return api(who, 'm5', 'pay', { ...base(load), outcome, idempotency_key: key, amount_cents: 1 })
  }
  try {
    for (const who of ['ana', 'joao', 'buyer', 'buyer2', 'carrier']) await login(who)
    clients.anon = fresh()
    report.checks.push('Auth real de quatro participantes e segunda sessão independente do comprador; identidade/demo conferidos.')
    if (mode === '--recover') {
      assert.equal(report.status, 'failed')
      report.original_failure = report.failure; delete report.failure
      const tiny = report.loads.at(-1)
      assert.equal(tiny.items.length, 1); assert.equal(tiny.items[0].quantity, 0.001)
      const before = await current(tiny)
      assert.equal(before.status, 'in_transit'); assert.equal(before.payouts.length, 0)
      await parallel([api('buyer', 'm5', 'receive', base(tiny)), api('buyer2', 'm5', 'receive', base(tiny))])
      const after = await current(tiny)
      assert.equal(after.status, 'delivered')
      assert.deepEqual(after.payouts.map(p => p.amount_cents).sort((a,b) => a-b), [0,8000])
      report.checks.push('Carga que reproduziu o erro recuperada após correção, sem duplicação: repasses 0/8000 centavos e entrega concluída.')
    } else if (mode === '--finish-ui') {
      const delivered = await current(report.loads[0])
      assert.equal(delivered.status, 'delivered')
      assert.equal(delivered.payouts.length, 3)
      assert.equal(delivered.occurrences.length, 1)
      assert.equal(delivered.occurrences[0].status, 'resolved')
      assert.deepEqual(delivered.payouts.map(p => p.amount_cents).sort((a,b) => a-b), [8000,10000,15000])
      report.checks.push('Estado final do percurso de navegador conferido por nova Auth/API: entrega, ocorrência resolvida e três repasses.')
    } else if (mode === '--prepare-ui') {
      await prepare()
      report.status = 'ready_for_ui'
    } else {
      const load = await prepare()
      await reject(api('buyer', 'm5', 'receive', base(load)), /viagem/)
      await reject(api('carrier', 'm5', 'start', base(load)), /agendamento/)
      for (const outcome of ['pending', 'declined']) {
        const key = randomUUID(), before = await current(load)
        const attempts = await parallel([pay(load, outcome, key), pay(load, outcome, key, 'buyer2')])
        assert.deepEqual(attempts[0], attempts[1]); assert.equal(attempts[0].amount_cents, 33000)
        const after = await current(load)
        assert.equal(after.status, 'awaiting_payment'); assert.equal(after.payments.length, before.payments.length + 1)
        await reject(api('carrier', 'm5', 'start', base(load)), /agendamento/)
      }
      report.checks.push('Pendente/recusado concorrentes com mesma chave: tentativa única pelo total do servidor R$330, sem agendamento.')
      for (const who of ['ana', 'joao', 'carrier']) {
        await reject(pay(load, 'approved', randomUUID(), who), /comprador/)
        await reject(api(who, 'm5', 'cancel', { ...base(load), reason: 'Indevido fictício' }), /comprador/)
      }
      await reject(pay({ ...load, version: 1 }, 'approved'), /alterada/)
      const key = randomUUID()
      const approved = await parallel([pay(load, 'approved', key), pay(load, 'approved', key, 'buyer2')])
      assert.deepEqual(approved[0], approved[1]); assert.equal(approved[0].amount_cents, 33000)
      await reject(pay(load, 'declined', key), /Chave/)
      const newKeys = await Promise.allSettled([pay(load, 'approved'), pay(load, 'approved', randomUUID(), 'buyer2')])
      assert.ok(newKeys.every(result => result.status === 'rejected'))
      let state = await current(load)
      assert.equal(state.status, 'scheduled'); assert.equal(state.payments.filter(p => p.outcome === 'approved').length, 1)
      for (const [i, item] of load.items.entries()) {
        assert.equal(await stock({ id: item.offer_id }), i === 0 ? 0 : 5)
        const reservations = await rows('buyer', 'reservations', { offer_id: item.offer_id })
        assert.equal(reservations.length, 1); assert.equal(reservations[0].status, 'committed')
      }
      await again('buyer'); assert.deepEqual(await current(load), state)
      report.checks.push('Aprovação concorrente única, novas chaves bloqueadas, versão/perfis indevidos rejeitados, reserva→compromisso sem dupla baixa; persistência após nova Auth.')
      for (const who of ['ana', 'joao', 'buyer']) await reject(api(who, 'm5', 'start', base(load)), /transportador/)
      await parallel([api('carrier', 'm5', 'start', base(load)), api('carrier', 'm5', 'start', base(load))])
      const reportInput = { ...base(load), reason: `Pedido de cancelamento após saída fictícia T28 ${report.run_id}`, idempotency_key: randomUUID() }
      await parallel([api('buyer', 'm5', 'cancel', reportInput), api('buyer2', 'm5', 'cancel', reportInput)])
      state = await current(load)
      assert.equal(state.status, 'delivery_review'); assert.equal(state.occurrences.length, 1)
      assert.equal(state.payments.find(p => p.outcome === 'approved').status, 'approved'); assert.equal(state.payouts.length, 0)
      const divergence = { ...base(load), reason: `Caixa danificada fictícia T28 ${report.run_id}`, idempotency_key: randomUUID() }
      await parallel([api('buyer', 'm5', 'discrepancy', divergence), api('buyer2', 'm5', 'discrepancy', divergence)])
      await reject(api('buyer', 'm5', 'discrepancy', { ...divergence, reason: 'Outro conteúdo' }), /Chave/)
      state = await current(load); assert.equal(state.occurrences.length, 2); assert.equal(state.payouts.length, 0)
      await reject(api('buyer', 'm5', 'receive', base(load)), /ocorrências/)
      for (const who of ['ana', 'joao', 'carrier']) {
        await reject(api(who, 'm5', 'discrepancy', { ...divergence, idempotency_key: randomUUID() }), /comprador/)
        await reject(api(who, 'm5', 'resolve', { ...base(load), occurrence_id: state.occurrences[0].id, resolution: 'Indevida' }), /comprador/)
        await reject(api(who, 'm5', 'receive', base(load)), /comprador/)
      }
      assert.equal(await stock({ id: load.items[1].offer_id }), 5)
      await again('carrier'); assert.equal((await current(load, 'carrier')).occurrences.length, 2)
      report.checks.push('Viagem e ocorrências concorrentes únicas; cancelamento em trânsito preserva compromisso/pagamento, divergências bloqueiam recebimento/repasses, comprador exclusivo.')
      for (const occurrence of state.occurrences) {
        const input = { ...base(load), occurrence_id: occurrence.id, resolution: 'Conferência fictícia concluída; entrega aceita sem alterar valores.' }
        await parallel([api('buyer', 'm5', 'resolve', input), api('buyer2', 'm5', 'resolve', input)])
        await reject(api('buyer', 'm5', 'resolve', { ...input, resolution: 'Outra resolução' }), /registrada/)
      }
      state = await current(load)
      assert.equal(state.status, 'delivery_review'); assert.equal(state.payouts.length, 0)
      await again('buyer'); assert.deepEqual(await current(load), state)
      await parallel([api('buyer', 'm5', 'receive', base(load)), api('buyer2', 'm5', 'receive', base(load))])
      const delivered = await current(load)
      assert.equal(delivered.status, 'delivered'); assert.equal(delivered.payouts.length, 3)
      assert.deepEqual(delivered.payouts.map(p => p.amount_cents).sort((a,b) => a-b), [8000,10000,15000])
      assert.equal(delivered.payouts.reduce((sum,p) => sum + p.amount_cents, 0), 33000)
      assert.ok(delivered.payouts.every(p => p.is_simulated && p.status === 'completed'))
      await api('buyer', 'm5', 'receive', base(load)); assert.deepEqual(await current(load), delivered)
      for (const who of ['ana', 'joao', 'carrier', 'buyer']) {
        await again(who)
        const visible = await current(load, who)
        assert.equal(visible.status, 'delivered'); assert.equal(visible.occurrences.length, 2)
        assert.equal(visible.payments.length, who === 'buyer' ? 3 : 0)
        assert.equal(visible.payouts.length, who === 'buyer' ? 3 : 1)
        if (who !== 'buyer') assert.equal(visible.payouts[0].recipient_id, ids[who])
        assert.deepEqual(await rows(who, 'payment_attempts', { load_id: load.id }), visible.payments)
        assert.equal((await rows(who, 'simulated_payouts', { load_id: load.id })).length, visible.payouts.length)
        assert.equal((await rows(who, 'delivery_occurrences', { load_id: load.id })).length, 2)
        for (const table of ['payment_attempts','simulated_payouts','delivery_occurrences']) {
          const target = (await rows('buyer', table, { load_id: load.id }))[0]
          assert.equal((await clients[who].from(table).delete().eq('id', target.id)).error?.code, '42501')
          assert.equal((await clients[who].from(table).update({ load_id: load.id }).eq('id', target.id)).error?.code, '42501')
          assert.equal((await clients[who].from(table).insert(target)).error?.code, '42501')
        }
      }
      report.checks.push('Resolução persiste sem concluir entrega; recebimento concorrente e replay geram só R$150/R$100/R$80; RLS limita pagamentos ao comprador e repasse ao beneficiário; escrita direta negada.')
      const cancel = await prepare(false)
      assert.equal(await current(cancel, 'joao'), undefined)
      for (const table of ['payment_attempts','simulated_payouts','delivery_occurrences']) assert.equal((await rows('joao', table, { load_id: cancel.id })).length, 0)
      await reject(pay(cancel, 'approved', randomUUID(), 'joao'), /indisponível/)
      await reject(api('anon', 'm5', 'list'))
      for (const table of ['payment_attempts','simulated_payouts','delivery_occurrences']) assert.ok((await clients.anon.from(table).select('*').eq('load_id', load.id)).error)
      const cancelKey = randomUUID(), payment = await pay(cancel, 'approved', cancelKey)
      const input = { ...base(cancel), reason: `Cancelamento antes da saída fictícia T28 ${report.run_id}` }
      await parallel([api('buyer', 'm5', 'cancel', input), api('buyer2', 'm5', 'cancel', input)])
      state = await current(cancel)
      assert.equal(state.status, 'cancelled'); assert.equal(state.payouts.length, 0)
      assert.equal(state.payments.length, 1); assert.equal(state.payments[0].status, 'refunded')
      assert.equal((await pay(cancel, 'approved', cancelKey)).id, payment.id)
      assert.equal(await stock({ id: cancel.items[0].offer_id }), 30)
      await api('buyer', 'm5', 'cancel', input); assert.deepEqual(await current(cancel), state)
      report.checks.push('Terceiro e anônimo isolados; cancelamento concorrente anterior à saída estorna uma única vez e libera estoque, replay preserva datas/histórico.')
      // Valid sub-cent product total (positive quantity/price) must not strand a paid load.
      const tiny = await prepare(false, true)
      await pay(tiny, 'approved'); await api('carrier', 'm5', 'start', base(tiny))
      await api('buyer', 'm5', 'receive', base(tiny))
      state = await current(tiny)
      assert.equal(state.status, 'delivered')
      assert.equal(state.payouts.length, 2)
      assert.deepEqual(state.payouts.map(p => p.amount_cents).sort((a,b) => a-b), [0,8000])
      assert.equal(state.payouts.reduce((sum,p) => sum + p.amount_cents, 0), 8000)
      report.checks.push('Quantidade/preço positivos cujo alimento arredonda a zero centavos também concluem recebimento sem travar repasses.')
    }
    if (mode !== '--prepare-ui') report.status = 'passed'
  } catch (error) {
    report.status = 'failed'; report.failure = `${error.code || 'TEST'}: ${error.message}`.split('\n')[0]; process.exitCode = 1
  } finally {
    if (report.status !== 'ready_for_ui') {
      try {
        for (const load of report.loads.filter(l => l.id)) {
          const state = await current(load)
          if (!['cancelled','delivered','expired'].includes(state.status)) {
            if (['in_transit','delivery_review'].includes(state.status)) { report.cleanup.push(`Carga ${load.id} preservada em trânsito para diagnóstico; sem liberação indevida.`); continue }
            await api('buyer', 'm5', 'cancel', { ...base(state), reason: `Encerramento técnico fictício T28 ${report.run_id}` })
          }
          const demand = (await rows('buyer', 'demands', { id: load.demand_id }))[0]
          if (demand.status !== 'archived') await api('buyer', 'm2', 'archive_demand', { id: demand.id, version: demand.version })
        }
        for (const { id, who } of report.offers) {
          const offer = (await rows(who, 'offers', { id }))[0]
          if (offer.status !== 'archived') check(await clients[who].rpc('save_offer', { p_data: {}, p_id: id, p_version: offer.version, p_archive: true }))
        }
        report.cleanup.push('Ofertas e demandas encerradas próprias arquivadas; histórico preservado.')
      } catch (error) { report.cleanup_failure = error.message; report.status = 'failed'; process.exitCode = 1 }
    }
    for (const client of Object.values(clients)) { try { check(await client.auth.signOut({ scope: 'local' })) } catch { report.session_cleanup_failed = true; process.exitCode = 1 } }
    report.finished_at = new Date().toISOString()
    await mkdir('artifacts', { recursive: true })
    const path = reportPath || `artifacts/m5-${report.run_id}.local.json`
    await writeFile(path, JSON.stringify(report, null, 2))
    console.log(`${report.status}: T28 demo, ${report.checks.length} grupos. ${path}`)
    if (report.failure) console.log(report.failure)
  }
}
