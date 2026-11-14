import test from 'node:test'
import assert from 'node:assert/strict'
import { createChatEnvironment } from './helpers/offer-chat-dom.mjs'
import { today, futureDate } from '../src/domain/offers.js'

test('foto é opcional; editar preserva vínculo e remover exige salvar, sem mudar os 50 kg', async () => {
  const ui = await createChatEnvironment()
  try {
    const { default: OfferForm } = await ui.load('/src/features/offers/OfferForm.jsx')
    const previous = { id: 'offer', photo_path: 'ana/lote.jpg', photo_url: 'https://example.invalid/photo', product_id: 'cenoura', quantity_total: 50, unit_price_cents: 450, minimum_net_unit_cents: 350, available_from: today(), available_until: futureDate(7), pickup_location_id: 'coleta' }
    const saves = []
    const props = { previous, products: [{ id: 'cenoura', name: 'Cenoura', unit: 'kg' }], locations: [{ id: 'coleta', display_address: 'Fictício' }], save: async (...args) => saves.push(args), close() {} }
    await ui.mountComponent(OfferForm, props, 'preserve')
    assert.equal(ui.document.querySelector('input[capture]').getAttribute('capture'), 'environment')
    await ui.act(async () => ui.document.querySelector('form').dispatchEvent(new ui.document.defaultView.Event('submit', { bubbles: true, cancelable: true })))
    assert.equal(saves.length, 1)
    assert.equal(saves[0][0].quantity_total, 50)
    assert.equal(saves[0][2], undefined)
    await ui.mountComponent(OfferForm, props, 'remove')
    await ui.click('Usar imagem padrão')
    assert.equal(saves.length, 1, 'remover da prévia ainda não salva')
    assert.equal(ui.document.querySelector('.offer-photo img').getAttribute('src'), '/assets/products/cenoura.jpg')
    assert.equal(ui.document.querySelector('.offer-photo img').getAttribute('alt'), 'Imagem padrão de Cenoura')
    await ui.act(async () => ui.document.querySelector('form').dispatchEvent(new ui.document.defaultView.Event('submit', { bubbles: true, cancelable: true })))
    assert.equal(saves[1][2], null)
    assert.equal(saves[1][0].quantity_total, 50)
    await ui.mountComponent(OfferForm, props, 'invalid')
    const input = ui.document.querySelector('input[type=file]')
    Object.defineProperty(input, 'files', { value: [new File(['<svg/>'], 'imagem.svg', { type: 'image/svg+xml' })] })
    await ui.act(async () => input.dispatchEvent(new ui.document.defaultView.Event('change', { bubbles: true })))
    assert.match(ui.document.querySelector('[role=alert]').textContent, /JPG, PNG ou WebP/)
    assert.ok(ui.document.querySelector('.offer-photo img'), 'arquivo inválido conserva foto anterior')
    assert.equal(saves.length, 2)
  } finally { await ui.dispose() }
})

test('nova oferta acompanha imagem padrão do produto escolhido e salva sem enviar arquivo', async () => {
  const ui = await createChatEnvironment()
  try {
    const { default: OfferForm } = await ui.load('/src/features/offers/OfferForm.jsx')
    const products = ['Alface', 'Cenoura', 'Tomate'].map(name => ({ id: name.toLowerCase(), name, unit: 'kg' }))
    const saves = []
    await ui.mountComponent(OfferForm, { products, locations: [{ id: 'coleta', display_address: 'Fictício' }], save: async (...args) => saves.push(args), close() {} })
    async function change(id, value) {
      const input = ui.document.getElementById(id)
      const prototype = input.tagName === 'SELECT' ? ui.document.defaultView.HTMLSelectElement.prototype : ui.document.defaultView.HTMLInputElement.prototype
      await ui.act(async () => {
        Object.getOwnPropertyDescriptor(prototype, 'value').set.call(input, value)
        input.dispatchEvent(new ui.document.defaultView.Event(input.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }))
      })
    }
    for (const product of products) {
      await change('product_id', product.id)
      assert.equal(ui.document.querySelector('.offer-photo img').getAttribute('src'), `/assets/products/${product.id}.jpg`)
      assert.match(ui.document.querySelector('.offer-photo img').getAttribute('alt'), /Imagem padrão/)
    }
    for (const [id, value] of [['quantity_total', '50'], ['price', '4,50'], ['minimum', '3,50']]) await change(id, value)
    await ui.act(async () => ui.document.querySelector('form').dispatchEvent(new ui.document.defaultView.Event('submit', { bubbles: true, cancelable: true })))
    assert.equal(saves.length, 1)
    assert.equal(saves[0][0].product_id, 'tomate')
    assert.equal(saves[0][0].quantity_total, 50)
    assert.equal(saves[0][2], undefined, 'imagem padrão local não faz upload')
  } finally { await ui.dispose() }
})
