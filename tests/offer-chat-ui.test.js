import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createChatEnvironment } from './helpers/offer-chat-dom.mjs'
import { today, futureDate, validateOffer } from '../src/domain/offers.js'

const products = [{ id: 'alface', name: 'Alface', unit: 'kg' }]
const locations = [{ id: 'sitio', display_address: 'Coleta fictícia' }]
const answers = () => ['alface', '30,125', '5,00', '4,00', today(), futureDate(7), '', 'sitio']
const props = overrides => ({ products, locations, save: async () => {}, close: () => {}, onSaved: () => {}, ...overrides })
async function review(ui) { for (const answer of answers()) await ui.respond(answer) }

test('T29: abertura foca a pergunta; prévia e correção não gravam; descarte devolve foco e reabertura limpa dados', async () => {
  const ui = await createChatEnvironment()
  let writes = 0, closed = 0
  try {
    const options = props({ save: async () => { writes++ }, close: () => { closed++ } })
    await ui.mount(options)
    assert.equal(ui.document.activeElement.id, 'chat-answer')
    await ui.respond('alface')
    await ui.respond('0')
    assert.match(ui.document.getElementById('chat-error').textContent, /quantidade/)
    assert.equal(ui.document.getElementById('chat-answer').getAttribute('aria-invalid'), 'true')
    await ui.respond('30,125')
    for (const answer of answers().slice(2)) await ui.respond(answer)
    assert.match(ui.document.activeElement.textContent, /Prévia da oferta/)
    assert.equal(writes, 0)
    await ui.click('Corrigir quantidade (kg)')
    assert.equal(ui.document.activeElement.id, 'chat-answer')
    await ui.respond('12,5')
    assert.match(ui.document.querySelector('dl').textContent, /12,5/)
    assert.equal(writes, 0)
    await ui.click('Descartar rascunho e fechar')
    assert.equal(closed, 1)
    await ui.unmount()
    assert.equal(ui.document.activeElement.id, 'opener')
    await ui.mount(options)
    assert.equal(ui.document.getElementById('chat-answer').value, '')
    assert.equal(ui.document.querySelector('dl'), null)
    await ui.cancel()
    assert.equal(closed, 2)
    assert.equal(writes, 0)
  } finally { await ui.dispose() }
})

test('T29: confirmação explícita usa payload do formulário e bloqueia repetição, correção e saída durante envio', async () => {
  const ui = await createChatEnvironment()
  const calls = []
  let resolve, closed = 0, saved = 0
  try {
    await ui.mount(props({ save: (...args) => { calls.push(args); return new Promise(done => { resolve = done }) }, close: () => { closed++ }, onSaved: () => { saved++ } }))
    await review(ui)
    const confirm = ui.findButton('Confirmar e publicar oferta')
    await ui.act(async () => { confirm.click(); confirm.click() })
    assert.equal(calls.length, 1)
    const values = answers()
    const input = Object.fromEntries(['product_id', 'quantity_total', 'price', 'minimum', 'available_from', 'available_until', 'expires_on', 'pickup_location_id'].map((name, index) => [name, values[index]]))
    assert.deepEqual(calls[0], [validateOffer(input).data, null])
    assert.equal(ui.findButton('Fechar').disabled, true)
    assert.equal(ui.findButton('Descartar rascunho e fechar').disabled, true)
    assert.equal(ui.findButton('Corrigir alimento').disabled, true)
    await ui.cancel()
    assert.equal(closed, 0)
    await ui.act(async () => { resolve() })
    assert.equal(saved, 1)
    assert.match(ui.document.activeElement.textContent, /Oferta publicada/)
    assert.equal(ui.document.querySelector('form'), null)
    assert.equal(ui.document.querySelectorAll('button.text-link').length, 0)
    await ui.click('Concluir')
    assert.equal(closed, 1)
    assert.equal(calls.length, 1)
  } finally { await ui.dispose() }
})

test('T29: erro recebe foco e preserva rascunho; reenvio explícito conclui uma publicação', async () => {
  const ui = await createChatEnvironment()
  let attempts = 0, writes = 0
  try {
    await ui.mount(props({ save: async () => { attempts++; if (attempts === 1) throw new Error('Falha controlada'); writes++ } }))
    await review(ui)
    await ui.click('Confirmar e publicar oferta')
    assert.match(ui.document.activeElement.textContent, /Falha controlada/)
    assert.match(ui.document.querySelector('dl').textContent, /30,125/)
    assert.equal(writes, 0)
    await ui.click('Confirmar e publicar oferta')
    assert.equal(attempts, 2)
    assert.equal(writes, 1)
    assert.match(ui.document.activeElement.textContent, /Oferta publicada/)
  } finally { await ui.dispose() }
})

test('T29: catálogo indisponível impede perguntas e escrita, com mensagem e foco', async () => {
  const ui = await createChatEnvironment()
  let writes = 0
  try {
    for (const missing of [{ products: [] }, { locations: [] }, { products: [{ id: 'caixa', name: 'Caixa', unit: 'cx' }] }]) {
      await ui.mount(props({ ...missing, save: async () => { writes++ } }))
      assert.equal(ui.document.querySelector('form'), null)
      assert.match(ui.document.activeElement.textContent, /O chat precisa/)
      assert.equal(ui.document.querySelector('[aria-label="Fechar"]').disabled, false)
      await ui.unmount()
    }
    assert.equal(writes, 0)
  } finally { await ui.dispose() }
})

test('T29: correção de disponibilidade revalida vencimento antes de permitir publicar', async () => {
  const ui = await createChatEnvironment()
  let writes = 0
  try {
    await ui.mount(props({ save: async () => { writes++ } }))
    await review(ui)
    await ui.click('Corrigir vencimento do produto')
    await ui.respond(futureDate(8))
    await ui.click('Corrigir disponível até')
    await ui.respond(futureDate(10))
    assert.equal(ui.findButton('Confirmar e publicar oferta').disabled, true)
    assert.match(ui.document.querySelector('[role="alert"]').textContent, /vencimento/)
    assert.equal(writes, 0)
    await ui.click('Corrigir vencimento do produto')
    await ui.click('Não sei informar')
    assert.equal(ui.findButton('Confirmar e publicar oferta').disabled, false)
    await ui.click('Confirmar e publicar oferta')
    assert.equal(writes, 1)
  } finally { await ui.dispose() }
})
