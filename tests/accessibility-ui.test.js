import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createChatEnvironment } from './helpers/offer-chat-dom.mjs'

test('listas: ocultar e reexibir devolvem foco ao filtro atual, inclusive ao esvaziar a lista', async () => {
  const ui = await createChatEnvironment()
  try {
    const { default: RecordList } = await ui.load('/src/components/RecordList.jsx')
    await ui.mountComponent(RecordList, { records: [{ id: 'registro-1', status: 'open' }], scope: 'review', participantId: 'fixture', label: 'Propostas', renderRecord: () => 'Proposta fictícia' })
    await ui.click('Ocultar propostas registro')
    assert.equal(ui.document.activeElement.getAttribute('aria-pressed'), 'true')
    assert.match(ui.document.activeElement.textContent, /Ativas/)
    assert.match(ui.document.querySelector('.empty-state').textContent, /Nenhum registro ativo/)
    await ui.click('Ocultas 1')
    await ui.click('Reexibir propostas registro')
    assert.match(ui.document.activeElement.textContent, /Ocultas/)
    assert.match(ui.document.querySelector('.empty-state').textContent, /Nenhum registro oculto/)
  } finally { await ui.dispose() }
})

test('oferta: validação foca campo e associa erro; envio bloqueia edição/saída e falha preserva valores', async () => {
  const ui = await createChatEnvironment()
  try {
    const { default: OfferForm } = await ui.load('/src/features/offers/OfferForm.jsx')
    const { today, futureDate } = await ui.load('/src/domain/offers.js')
    let reject, closed = 0, calls = 0
    const options = { products: [{ id: 'alface', name: 'Alface', unit: 'kg' }], locations: [{ id: 'coleta', display_address: 'Coleta fictícia' }], close: () => { closed++ }, save: () => { calls++; return new Promise((_, fail) => { reject = fail }) } }
    await ui.mountComponent(OfferForm, options)
    const submit = async () => ui.act(async () => { ui.document.querySelector('form').dispatchEvent(new ui.document.defaultView.Event('submit', { bubbles: true, cancelable: true })) })
    await submit()
    assert.equal(ui.document.activeElement.id, 'product_id')
    assert.equal(ui.document.activeElement.getAttribute('aria-describedby'), 'product_id-error')
    assert.equal(calls, 0)
    await ui.unmount()
    await ui.mountComponent(OfferForm, { ...options, previous: { id: 'fixture', product_id: 'alface', quantity_total: 30, unit_price_cents: 500, minimum_net_unit_cents: 400, pickup_location_id: 'coleta', available_from: today(), available_until: futureDate(7) } })
    await submit()
    assert.equal(calls, 1)
    assert.equal(ui.findButton('Fechar').disabled, true)
    assert.equal(ui.document.querySelector('fieldset').disabled, true)
    await ui.cancel()
    assert.equal(closed, 0)
    await ui.act(async () => { reject(new Error('Falha controlada da revisão')) })
    assert.match(ui.document.activeElement.textContent, /Falha controlada/)
    assert.equal(ui.document.getElementById('quantity_total').value, '30')
    assert.equal(ui.document.querySelector('fieldset').disabled, false)
    await ui.click('Cancelar')
    assert.equal(closed, 1)
  } finally { await ui.dispose() }
})

test('modal: fechamento mantém um destino de foco quando o acionador foi removido', async () => {
  const ui = await createChatEnvironment()
  try {
    const { Modal } = await ui.load('/src/components/ui.jsx')
    const main = ui.document.createElement('main')
    main.id = 'conteudo'; main.tabIndex = -1
    ui.document.body.append(main)
    const opener = ui.document.getElementById('opener')
    opener.focus()
    await ui.mountComponent(Modal, { title: 'Revisão', onClose: () => {} })
    opener.remove()
    await ui.unmount()
    assert.equal(ui.document.activeElement, main)
  } finally { await ui.dispose() }
})

test('demanda: falha de envio recebe foco, mantém campos e permite recuperar sem saída durante envio', async () => {
  const ui = await createChatEnvironment()
  try {
    const { default: DemandForm } = await ui.load('/src/features/demands/DemandForm.jsx')
    const { futureDate } = await ui.load('/src/domain/offers.js')
    let reject, closed = 0
    const previous = { id: 'fixture', version: 1, product_id: 'alface', quantity: 25, desired_date: futureDate(3), destination_id: 'destino' }
    await ui.mountComponent(DemandForm, { previous, catalog: { products: [{ id: 'alface', name: 'Alface', unit: 'kg' }], locations: [{ id: 'destino', display_address: 'Destino fictício' }] }, close: () => { closed++ }, request: () => new Promise((_, fail) => { reject = fail }) })
    await ui.act(async () => { ui.document.querySelector('form').dispatchEvent(new ui.document.defaultView.Event('submit', { bubbles: true, cancelable: true })) })
    assert.equal(ui.findButton('Fechar').disabled, true)
    assert.equal(ui.document.querySelector('fieldset').disabled, true)
    await ui.cancel()
    assert.equal(closed, 0)
    await ui.act(async () => { reject(new Error('Falha controlada da demanda')) })
    assert.match(ui.document.activeElement.textContent, /Falha controlada da demanda/)
    assert.equal(ui.document.getElementById('d-quantity').value, '25')
    assert.equal(ui.document.getElementById('d-destination_id').value, 'destino')
    assert.equal(ui.findButton('Fechar').disabled, false)
  } finally { await ui.dispose() }
})
