import test from 'node:test'
import assert from 'node:assert/strict'
import { createChatEnvironment } from './helpers/offer-chat-dom.mjs'

test('map opens only on demand; segments, retry and circuit change preserve the manual fallback', async () => {
  const ui = await createChatEnvironment()
  try {
    const { default: Map } = await ui.load('/src/features/transport/DemoRouteMap.jsx')
    await ui.mountComponent(Map, { apiKey: '' })
    assert.equal(ui.document.querySelector('iframe'), null)
    assert.match(ui.document.body.textContent, /aguarda configuração/)
    assert.equal(ui.document.querySelectorAll('.demo-map-stops li').length, 4)
    await ui.mountComponent(Map, { apiKey: 'test-only', withReturn: true })
    assert.equal(ui.document.querySelector('iframe'), null)
    await ui.click('Abrir mapa simulado')
    assert.equal(ui.document.querySelector('iframe').getAttribute('referrerpolicy'), 'strict-origin-when-cross-origin')
    await ui.click('Coleta 2')
    const frame = ui.document.querySelector('iframe')
    const params = new URL(frame.src).searchParams
    assert.equal(params.has('waypoints'), false)
    assert.equal(ui.findButton('Coleta 2').getAttribute('aria-pressed'), 'true')
    await ui.act(async () => { frame.dispatchEvent(new ui.document.defaultView.Event('load')) })
    assert.match(ui.document.body.textContent, /Se o Google exibir erro/)
    assert.doesNotMatch(ui.document.body.textContent, /Abrindo Google Maps/)
    await ui.click('Coleta 2')
    assert.doesNotMatch(ui.document.body.textContent, /Abrindo Google Maps/, 'selecionar o trecho atual não mantém carregamento sem nova navegação')
    await ui.click('Tentar carregar novamente')
    assert.ok(ui.document.querySelector('iframe'))
    assert.notEqual(ui.document.querySelector('iframe'), frame, 'tentar novamente cria uma nova navegação')
    await ui.click('Fechar mapa')
    assert.equal(ui.document.querySelector('iframe'), null)
    await ui.mountComponent(Map, { apiKey: 'test-only', pickupCount: 1 })
    assert.equal(ui.findButton('Percurso completo').getAttribute('aria-pressed'), 'true')
    assert.equal(ui.document.querySelectorAll('.demo-map-stops li').length, 3)
    await ui.mountComponent(Map, { apiKey: 'test-only', pickupCount: 7 })
    assert.equal(ui.document.querySelector('iframe'), null)
    assert.match(ui.document.body.textContent, /até seis coletas/)
  } finally { await ui.dispose() }
})
