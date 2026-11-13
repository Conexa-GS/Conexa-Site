import test from 'node:test'
import assert from 'node:assert/strict'
import { createChatEnvironment } from './helpers/offer-chat-dom.mjs'

test('calculator requests only explicitly; tariffs recalculate locally and itinerary changes hide stale estimates', async () => {
  const ui = await createChatEnvironment()
  try {
    const { default: Calculator } = await ui.load('/src/features/transport/FreightCalculator.jsx')
    let calls = 0, applied
    const props = { load: { id: 'load', version: 1, items: [{ pickup_address: 'Coleta, Botucatu, SP' }], destination_address: 'Destino, Botucatu, SP' }, departureAddress: 'Base, Botucatu, SP', returnAddress: 'Base, Botucatu, SP', departureTime: '2026-11-16T10:00', request: async () => { calls++; return { distanceMeters: 10000, totalSeconds: 2400, deliverySeconds: 1200 } }, onApply: value => { applied = value } }
    await ui.mountComponent(Calculator, props)
    assert.equal(calls, 0)
    async function fill(label, value) {
      const field = [...ui.document.querySelectorAll('label')].find(item => item.textContent.includes(label)).querySelector('input')
      await ui.act(async () => {
        Object.getOwnPropertyDescriptor(ui.document.defaultView.HTMLInputElement.prototype, 'value').set.call(field, value)
        field.dispatchEvent(new ui.document.defaultView.Event('input', { bubbles: true }))
      })
    }
    for (const [name, value] of [['Valor base', '10'], ['Preço por km', '2'], ['Frete mínimo', '0'], ['Adicionais', '5'], ['Paradas antes', '10']]) await fill(name, value)
    await ui.click('Calcular com Google Maps')
    assert.equal(calls, 1)
    await ui.click('Usar estimativa na cotação')
    assert.equal(applied.totalCents, 3500)
    await fill('Preço por km', '3')
    await ui.click('Usar estimativa na cotação')
    assert.equal(applied.totalCents, 4500)
    assert.equal(calls, 1)
    await ui.mountComponent(Calculator, { ...props, returnAddress: '' })
    assert.equal([...ui.document.querySelectorAll('button')].some(button => button.textContent === 'Usar estimativa na cotação'), false)
    assert.match(ui.document.body.textContent, /Calcule novamente/)
    await ui.mountComponent(Calculator, { ...props, returnAddress: '', request: async () => { throw new Error('Sem rota. Cotação manual disponível.') } })
    await ui.click('Calcular com Google Maps')
    assert.match(ui.document.querySelector('[role=alert]').textContent, /Sem rota/)
  } finally { await ui.dispose() }
})

test('quote applies estimated price and delivery without submission; date input reaches calculator and edits require new confirmation', async () => {
  const ui = await createChatEnvironment()
  try {
    const { default: QuoteForm } = await ui.load('/src/features/transport/QuoteForm.jsx')
    let submissions = 0
    await ui.mountComponent(QuoteForm, { load: { id: 'load', version: 1, scheduled_date: '2099-11-16', expires_at: '2099-11-16T12:00Z', items: [{ pickup_address: 'Coleta' }], destination_address: 'Entrega', quotes: [] }, vehicles: [], submit: () => { submissions++ }, routeRequest: async () => ({ distanceMeters: 10000, totalSeconds: 2400, deliverySeconds: 1200 }) })
    async function fill(field, value) {
      await ui.act(async () => {
        Object.getOwnPropertyDescriptor(ui.document.defaultView.HTMLInputElement.prototype, 'value').set.call(field, value)
        field.dispatchEvent(new ui.document.defaultView.Event('input', { bubbles: true }))
      })
    }
    const form = ui.document.querySelector('form')
    const field = name => form.elements.namedItem(name)
    await fill(field('departure_address'), 'Base')
    await fill(field('departure_time'), '2099-11-16T08:00')
    for (const [label, value] of [['Valor base', '10'], ['Preço por km', '2'], ['Frete mínimo', '0'], ['Adicionais', '5'], ['Paradas antes', '10']]) {
      await fill([...ui.document.querySelectorAll('label')].find(item => item.textContent.includes(label)).querySelector('input'), value)
    }
    await ui.click('Calcular com Google Maps')
    const confirmation = ui.document.querySelector('[data-confirm-quote]')
    await ui.act(async () => confirmation.click())
    assert.equal(confirmation.checked, true)
    await ui.click('Usar estimativa na cotação')
    assert.equal(field('price').value, '35.00')
    assert.equal(field('delivery_time').value, '2099-11-16T08:30')
    assert.equal(confirmation.checked, false)
    assert.equal(submissions, 0)
    await ui.act(async () => confirmation.click())
    await fill(field('departure_time'), '2099-11-16T09:00')
    assert.equal(confirmation.checked, false)
    assert.match(ui.document.body.textContent, /pertencem ao cálculo anterior/)
    assert.equal(ui.document.querySelector('.freight-result'), null)
  } finally { await ui.dispose() }
})
