// Manual academic audit only. One disposable offer; real application services/Auth/RLS.
// Does not run in npm test, change schema, or touch existing business records.
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { demoConfig, demoProject } from './helpers/conversations-demo-config.mjs'
import { createChatEnvironment } from './helpers/offer-chat-dom.mjs'
import { futureDate, today } from '../src/domain/offers.js'

process.loadEnvFile('.env')
const config = demoConfig(process.env)
const mode = process.argv[2]
if (process.argv.length !== 3 || !['--check', '--run-demo'].includes(mode)) throw new Error('Use --check ou --run-demo (demo autorizado).')
if (mode === '--check') console.log(`PASS configuração offline ${demoProject}; sem rede/escrita.`)
else await run()

async function run() {
  const report = { run_id: randomUUID(), project: demoProject, date: new Date().toISOString(), status: 'running', checks: [], cleanup: [] }
  const env = { VITE_SUPABASE_URL: config.url, VITE_SUPABASE_PUBLISHABLE_KEY: config.key, VITE_DEMO_PASSWORD: config.password }
  for (const [name, email] of Object.entries(config.emails)) env[`VITE_DEMO_${name.toUpperCase()}_EMAIL`] = email
  const ui = await createChatEnvironment(env)
  const service = await ui.load('/src/services/offers.js')
  const { supabase } = await ui.load('/src/services/supabase.js')
  const clients = []
  const check = ({ data, error }) => { if (error) throw new Error(`Supabase: ${error.code || 'erro remoto'}`); return data }
  const account = name => service.accounts.find(item => item.id === name)
  const row = async id => check(await supabase.from('offers').select('*').eq('id', id).single())
  let producer, baseline, input
  const fixtureIds = new Set()
  const quantity = Number((31 + Number.parseInt(report.run_id.slice(0, 4), 16) / 1000).toFixed(3))
  // If a create response is lost, recover only this run's matching new own rows.
  async function findFixtures() {
    if (!producer || !baseline || !input) return []
    const rows = check(await supabase.from('offers').select('*').eq('producer_id', producer.id).eq('product_id', input.product_id).eq('pickup_location_id', input.pickup_location_id).eq('quantity_total', quantity).eq('available_until', input.available_until))
    return rows.filter(offer => !baseline.has(offer.id))
  }
  try {
    producer = await service.signInDemo(account('ana'))
    baseline = new Set(check(await supabase.from('offers').select('id').eq('producer_id', producer.id)).map(offer => offer.id))
    const catalog = await service.listCatalog(producer)
    assert.ok(catalog.products.find(product => product.unit === 'kg') && catalog.locations.length)
    input = { product_id: catalog.products.find(product => product.unit === 'kg').id, pickup_location_id: catalog.locations[0].id, quantity_total: quantity, unit_price_cents: 531, minimum_net_unit_cents: 400, available_from: today(), available_until: futureDate(7), expires_on: futureDate(8) }
    const created = await service.saveOffer(producer, input)
    if (created?.id) fixtureIds.add(created.id)
    const fixtures = await findFixtures()
    fixtures.forEach(offer => fixtureIds.add(offer.id))
    assert.equal(fixtures.length, 1)
    const offer = fixtures[0]
    report.offer_id = offer.id
    assert.equal(offer.producer_id, producer.id)
    assert.ok((await service.listOffers(producer)).some(item => item.id === offer.id))
    report.checks.push('C/R: saveOffer e listOffers reais criam e consultam uma oferta própria, com dono derivado de Auth.')

    const updated = { ...input, unit_price_cents: 532 }
    await service.saveOffer(producer, updated, offer)
    const current = await row(offer.id)
    assert.equal(current.unit_price_cents, 532)
    assert.ok(current.version > offer.version)
    await assert.rejects(service.saveOffer(producer, input, offer))
    assert.equal((await row(offer.id)).unit_price_cents, 532)
    report.checks.push('U: saveOffer persiste preço 531→532 centavos e incrementa versão; edição com versão antiga é rejeitada sem sobrescrever.')

    await service.signOutDemo()
    const buyer = await service.signInDemo(account('buyer'))
    const shared = (await service.listOffers(buyer)).find(item => item.id === offer.id)
    assert.ok(shared)
    assert.equal(shared.unit_price_cents, 532)
    assert.equal(Number(shared.quantity_total), quantity)
    assert.equal(shared.producer_id, producer.id)
    report.checks.push('Persistência: após nova autenticação, comprador consulta o mesmo ID, dono, quantidade e preço atualizado; sem navegador/F5 nesta rodada.')

    for (const who of ['buyer', 'joao', 'anonymous']) {
      const client = createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: `t31-${report.run_id}-${who}` }, global: { fetch: (url, options) => fetch(url, { ...options, signal: AbortSignal.timeout(20000) }) } })
      clients.push(client)
      if (who !== 'anonymous') check(await client.auth.signInWithPassword({ email: config.emails[who], password: config.password }))
      const edit = await client.from('offers').update({ unit_price_cents: 999 }).eq('id', offer.id).select('id')
      assert.ok(edit.error || edit.data.length === 0, `${who} não edita via REST`)
      const remove = await client.from('offers').delete().eq('id', offer.id).select('id')
      assert.ok(remove.error || remove.data.length === 0, `${who} não exclui via REST`)
      const rpc = await client.rpc('save_offer', { p_data: updated, p_id: offer.id, p_version: current.version })
      assert.ok(rpc.error, `${who} não edita via RPC`)
      const unchanged = await row(offer.id)
      assert.equal(unchanged.unit_price_cents, 532)
      assert.equal(unchanged.version, current.version)
      report.checks.push(`Auth/RLS: ${who} não altera/exclui a oferta via REST nem edita pelo gateway; estado remoto preservado.`)
    }

    await service.signOutDemo()
    producer = await service.signInDemo(account('ana'))
    assert.equal((await row(offer.id)).unit_price_cents, 532)
    await service.deleteOffer(producer, await row(offer.id))
    assert.deepEqual(check(await supabase.from('offers').select('id').eq('id', offer.id)), [])
    assert.ok(!(await service.listOffers(producer)).some(item => item.id === offer.id))
    report.cleanup.push({ id: offer.id, status: 'deleted_and_absence_verified' })
    const buyerAfter = await service.signInDemo(account('buyer'))
    assert.ok(!(await service.listOffers(buyerAfter)).some(item => item.id === offer.id))
    report.checks.push('D: deleteOffer exclui fisicamente a fixture sem vínculos; ausência confirmada por consulta direta, produtor e comprador após nova autenticação.')
    report.status = 'passed'
  } catch (error) {
    report.status = 'failed'
    report.error = error.message
    throw error
  } finally {
    try {
      if (producer && baseline && input) {
        producer = await service.signInDemo(account('ana'))
        for (const offer of await findFixtures()) fixtureIds.add(offer.id)
        for (const id of fixtureIds) {
          const remaining = check(await supabase.from('offers').select('*').eq('id', id))
          if (!remaining.length) continue
          assert.equal(remaining[0].producer_id, producer.id)
          await service.deleteOffer(producer, remaining[0])
          assert.deepEqual(check(await supabase.from('offers').select('id').eq('id', id)), [])
          report.cleanup.push({ id, status: 'deleted_in_finally_and_absence_verified' })
        }
      }
    } catch (error) {
      report.status = 'failed'
      report.cleanup_error = error.message
      process.exitCode = 1
    } finally {
      try {
        await service.signOutDemo()
        for (const client of clients) await client.auth.signOut({ scope: 'local' })
      } catch {
        report.status = 'failed'
        report.session_cleanup_error = 'Falha ao encerrar sessão de teste.'
        process.exitCode = 1
      } finally {
        await supabase.auth.dispose()
        for (const client of clients) await client.auth.dispose()
        await mkdir('artifacts', { recursive: true })
        await writeFile('artifacts/t31-remote.local.json', JSON.stringify(report, null, 2))
        await ui.dispose()
      }
    }
  }
  if (report.status !== 'passed') throw new Error('T31 falhou; confira a limpeza no relatório local.')
  console.log(`PASS T31: ${report.checks.length} grupos, CRUD remoto real, fixture própria excluída. Sem navegador/F5 ou migration.`)
}
