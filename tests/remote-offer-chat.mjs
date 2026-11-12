// Manual only. Real demo Auth/RLS/service; component events run in jsdom, not a browser.
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { createChatEnvironment } from './helpers/offer-chat-dom.mjs'
import { futureDate, today } from '../src/domain/offers.js'

process.loadEnvFile('.env')
const env = Object.fromEntries(Object.entries(process.env).filter(([name]) => /^VITE_(SUPABASE_(URL|PUBLISHABLE_KEY)|DEMO_(PASSWORD|(ANA|JOAO|BUYER|CARRIER)_EMAIL))$/.test(name)))
if (new URL(env.VITE_SUPABASE_URL).hostname !== 'ppbneiusqlitvewwoact.supabase.co') throw new Error('Teste limitado ao Supabase demo autorizado.')
const report = { date: new Date().toISOString(), offers: [], checks: [], archived: [], environment: 'jsdom + serviço real + Auth/RLS demo; sem navegador/F5' }
const ui = await createChatEnvironment(env)
const service = await ui.load('/src/services/offers.js')
const { isRemote, supabase } = await ui.load('/src/services/supabase.js')
assert.equal(isRemote, true)
const check = ({ data, error }) => { if (error) throw new Error(`Supabase: ${error.code || 'erro na consulta'}`); return data }
const account = name => service.accounts.find(item => item.id === name)
let producer, catalog, baseline, input
let attempts = 0, saved = 0, saving
const amount = (17 + Number.parseInt(crypto.randomUUID().slice(0, 4), 16) / 1000).toFixed(3)
async function identifyFixture() {
  if (!baseline || !input) return []
  const rows = check(await supabase.from('offers').select('*').eq('producer_id', producer.id).eq('quantity_total', Number(amount)).eq('product_id', input.product_id).eq('available_until', input.available_until).eq('unit_price_cents', 507))
  return rows.filter(row => !baseline.has(row.id))
}
async function fill() {
  for (const answer of [input.product_id, amount.replace('.', ','), '5,07', '4,00', today(), futureDate(7), futureDate(8), input.pickup_location_id]) await ui.respond(answer)
}
try {
  producer = await service.signInDemo(account('ana'))
  baseline = new Set(check(await supabase.from('offers').select('id').eq('producer_id', producer.id)).map(row => row.id))
  catalog = await service.listCatalog(producer)
  const product = catalog.products.find(item => item.unit === 'kg')
  assert.ok(product && catalog.locations.length, 'Catálogo real do produtor disponível')
  input = { product_id: product.id, pickup_location_id: catalog.locations[0].id, available_until: futureDate(7) }
  const options = {
    ...catalog,
    close: () => {},
    onSaved: () => { saved++ },
    save: (data, previous) => {
      attempts++
      saving = (async () => {
        await service.saveOffer(producer, data, previous)
        const rows = await identifyFixture()
        report.offers = rows.map(row => row.id)
        assert.equal(rows.length, 1, 'Uma oferta nova pelo mesmo serviço do formulário')
      })()
      return saving
    },
  }
  await ui.mount(options)
  await fill()
  assert.equal(attempts, 0)
  assert.equal((await identifyFixture()).length, 0)
  await ui.click('Descartar rascunho e fechar')
  await ui.unmount()
  assert.equal((await identifyFixture()).length, 0)
  report.checks.push('Prévia e descarte do componente com catálogo real: zero chamadas de saveOffer e zero novas ofertas próprias.')

  await ui.mount(options)
  await fill()
  await ui.click('Corrigir quantidade (kg)')
  await ui.respond(amount.replace('.', ','))
  assert.equal(attempts, 0)
  await ui.act(async () => { ui.findButton('Confirmar e publicar oferta').click(); await saving })
  assert.equal(saved, 1)
  assert.equal(attempts, 1)
  assert.match(ui.document.activeElement.textContent, /Oferta publicada/)
  const id = report.offers[0]
  const offer = (await service.listOffers(producer)).find(row => row.id === id)
  assert.ok(offer)
  assert.equal(Number(offer.quantity_total), Number(amount))
  assert.equal(offer.unit_price_cents, 507)
  assert.equal(offer.minimum_net_unit_cents, 400)
  assert.equal(offer.expires_on, futureDate(8))
  report.checks.push('Confirmação explícita do componente chama saveOffer uma vez; oferta do produtor mantém quantidade, centavos, coleta e vencimento.')
  await ui.unmount()
  await service.signOutDemo()

  const buyer = await service.signInDemo(account('buyer'))
  const published = (await service.listOffers(buyer)).find(row => row.id === id)
  assert.ok(published, 'Comprador lê a mesma oferta após nova autenticação')
  assert.equal(published.producer_id, producer.id)
  assert.equal(Number(published.quantity_total), Number(amount))
  assert.equal(published.unit_price_cents, 507)
  const { data, error } = await supabase.from('offers').insert({ product_id: input.product_id, pickup_location_id: input.pickup_location_id, quantity_total: 1, unit_price_cents: 507, minimum_net_unit_cents: 400, available_from: today(), available_until: futureDate(7), status: 'published' }).select('id')
  // Record unexpected writes before failing so cleanup remains limited to this test's IDs.
  if (data?.length) report.unexpected = data.map(row => row.id)
  assert.ok(error, 'RLS bloqueia criação por comprador')
  report.checks.push('Nova autenticação do comprador lê o mesmo ID/valores; escrita pelo comprador rejeitada por RLS.')

  await service.signOutDemo()
  await service.signInDemo(account('joao'))
  const altered = check(await supabase.from('offers').update({ quantity_total: 1 }).eq('id', id).select('id'))
  assert.equal(altered.length, 0, 'Outro produtor não altera a oferta')
  const anonymous = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false, autoRefreshToken: false, storageKey: 'conexa-t29-anonymous' } })
  const anonymousWrite = await anonymous.from('offers').insert({ ...input, quantity_total: 1, unit_price_cents: 507, minimum_net_unit_cents: 400, available_from: today(), status: 'published' })
  assert.ok(anonymousWrite.error, 'Anônimo não publica oferta')
  report.checks.push('Auth/RLS reais impedem alteração por outro produtor e inserção anônima.')
} finally {
  try {
    await ui.unmount()
    if (producer && baseline && input) {
      await service.signOutDemo()
      const session = await service.signInDemo(account('ana'))
      const rows = await identifyFixture()
      report.offers = [...new Set([...report.offers, ...rows.map(row => row.id)])]
      for (const row of rows) {
        assert.equal(row.producer_id, session.id)
        await service.archiveOffer(session, row)
        report.archived.push(row.id)
      }
      for (const id of report.offers) {
        const row = check(await supabase.from('offers').select('id,status').eq('id', id).single())
        assert.equal(row.status, 'archived')
      }
      report.checks.push('Ofertas próprias arquivadas pelo mesmo serviço; IDs preservados no relatório local.')
    }
  } finally {
    await service.signOutDemo()
    await mkdir('artifacts', { recursive: true })
    await writeFile('artifacts/offer-chat-remote.local.json', JSON.stringify(report, null, 2))
    await ui.dispose()
  }
}
console.log(`PASS: ${report.checks.length} grupos T29; ${report.offers.length} oferta(s) própria(s) arquivada(s). Sem teste de navegador/F5.`)
