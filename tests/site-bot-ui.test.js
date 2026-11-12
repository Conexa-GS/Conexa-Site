import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createChatEnvironment } from './helpers/offer-chat-dom.mjs'
import { createConversationsFixture } from './helpers/conversations-fixture.mjs'
import { createBotFixture } from './helpers/site-bot-fixture.mjs'
import { futureDate, today } from '../src/domain/offers.js'

async function setup(role = 'producer') {
  const ui = await createChatEnvironment()
  const { default: Page } = await ui.load('/src/features/conversations/ConversationsPage.jsx')
  const people = createConversationsFixture(), bot = createBotFixture()
  await ui.mountComponent(Page, { session: { id: 'ana', role }, service: people.service, botService: bot.service }, 'ana')
  const choose = async text => { await ui.act(async () => { [...ui.document.querySelectorAll('.conversation-list button')].find(b => b.textContent.includes(text)).click() }) }
  await choose('Bot Conexa')
  async function write(text) {
    await ui.act(async () => {
      ui.document.querySelector('.bot-free-text').open = true
      const input = ui.document.getElementById('bot-message')
      Object.getOwnPropertyDescriptor(ui.document.defaultView.HTMLTextAreaElement.prototype, 'value').set.call(input, text)
      input.dispatchEvent(new ui.document.defaultView.Event('input', { bubbles: true }))
    })
    await ui.click('Enviar ao bot')
  }
  const confirm = async () => {
    const button = ui.document.querySelector('.bot-confirm')
    assert.ok(button, 'prévia disponível para confirmação')
    await ui.act(async () => { button.click(); button.click() })
  }
  return { ui, bot, choose, write, confirm }
}

async function answerValue(ui, value) {
  await ui.act(async () => {
    const input = ui.document.getElementById('bot-field-answer')
    Object.getOwnPropertyDescriptor(ui.document.defaultView.HTMLInputElement.prototype, 'value').set.call(input, value)
    input.dispatchEvent(new ui.document.defaultView.Event('input', { bubbles: true }))
  })
  await ui.click('Usar este valor')
}

test('Bot UI: ações visíveis e criação guiada sem digitar comandos, com confirmação separada', async () => {
  const { ui, bot, confirm } = await setup()
  try {
    for (const action of ['Consultar ofertas', 'Criar oferta', 'Editar oferta', 'Arquivar oferta']) assert.ok(ui.findButton(action))
    assert.equal(ui.document.querySelector('.bot-free-text').open, false)
    assert.equal(bot.requests.length, 0, 'Abrir o bot não inicia pedido')
    await ui.click('Criar oferta')
    await ui.click('Alface')
    await answerValue(ui, '20,125')
    await answerValue(ui, '5,07')
    await answerValue(ui, '4,00')
    await answerValue(ui, today())
    await answerValue(ui, futureDate(7))
    await ui.click('Não sei informar')
    await ui.click('Sítio Boa Semente · coleta fictícia')
    assert.match(ui.document.querySelector('.bot-preview').textContent, /20,125 kg/)
    assert.equal(bot.writes.length, 0)
    await confirm()
    assert.equal(bot.writes.length, 1)
    assert.equal(bot.writes[0].quantity_total, 20.125)
    assert.equal(bot.writes[0].unit_price_cents, 507)
    assert.equal(bot.writes[0].expires_on, null)
    assert.ok(ui.findButton('Criar oferta'))
  } finally { await ui.dispose() }
})

test('Bot UI: escolher oferta/campo, validação, cancelar e pedido incerto preservam controle da escrita', async () => {
  const { ui, bot, choose, confirm } = await setup()
  try {
    await ui.click('Editar oferta')
    assert.equal(ui.document.querySelector('.bot-field-options'), null, 'Escolher oferta antes de mostrar campos')
    assert.equal(ui.document.querySelector('.bot-preview'), null)
    await ui.click('Escolher esta oferta')
    await ui.click('Alterar quantidade (kg)')
    assert.equal(ui.document.activeElement.id, 'bot-field-answer')
    assert.equal(ui.document.querySelector('.bot-confirm'), null, 'Valor em edição não pode ser confirmado antes de usar')
    await answerValue(ui, '0')
    assert.ok(ui.document.querySelector('[role=alert]'))
    assert.equal(bot.writes.length, 0)
    await answerValue(ui, '22')
    assert.match(ui.document.querySelector('.bot-preview').textContent, /Depois: 22 kg/)
    await ui.click('Cancelar rascunho')
    assert.equal(bot.writes.length, 0)
    await ui.click('Arquivar oferta'); await ui.click('Escolher esta oferta')
    bot.loseResponse()
    await confirm()
    assert.equal(bot.writes.length, 1)
    assert.equal(ui.document.querySelector('.bot-action-menu button').disabled, true)
    await choose('Restaurante'); await choose('Bot Conexa')
    assert.equal(ui.findButton('Criar oferta').disabled, true)
    await ui.click('Verificar pedido pendente')
    assert.equal(bot.writes.length, 1)
    assert.equal(ui.findButton('Criar oferta').disabled, false)
  } finally { await ui.dispose() }
})

test('Bot UI: comprador encontra consulta sem opções de mutação', async () => {
  const { ui, bot } = await setup('buyer')
  try {
    const menu = ui.document.querySelector('.bot-action-menu')
    assert.equal(menu.querySelectorAll('button').length, 1)
    await ui.click('Consultar ofertas')
    assert.match(ui.document.querySelector('.bot-offer-options').textContent, /Alface/)
    assert.equal(ui.document.querySelector('.bot-confirm'), null)
    assert.equal(bot.writes.length, 0)
  } finally { await ui.dispose() }
})

test('Bot UI: prévia antes/depois, correção, cancelamento e confirmação única', async () => {
  const { ui, bot, write, confirm } = await setup()
  let notifications = 0
  const changed = () => { notifications++ }
  ui.document.defaultView.addEventListener('conexa:offers-changed', changed)
  try {
    assert.equal(ui.document.activeElement.id, 'bot-title')
    await write('editar alface total 20 kg e preço 7,00')
    assert.match(ui.document.querySelector('.bot-preview').textContent, /Antes: 30 kg.*Depois: 20 kg/)
    assert.match(ui.document.querySelector('.bot-preview').textContent, /Saldo livre na prévia: 25 kg/)
    assert.equal(bot.writes.length, 0)
    assert.equal(notifications, 0)
    await write('sim'); assert.match(ui.document.activeElement.textContent, /Confirmar revisão/)
    await write('total 21 kg'); assert.equal(bot.writes.length, 0)
    await confirm(); assert.equal(bot.writes.length, 1); assert.equal(bot.writes[0].quantity_total, 21)
    assert.equal(notifications, 1)
    assert.equal(bot.requests.filter(r => r.action === 'confirm').length, 1)
    assert.match(ui.document.querySelector('[role=status]').textContent, /Oferta persistida/)
    assert.match(ui.document.querySelector('.conversation-history').textContent, /Oferta persistida/)
    assert.equal(ui.document.querySelector('[role=alert]'), null)
    assert.equal(ui.document.activeElement.className, 'bot-feedback')
    await write('arquivar alface'); await write('cancelar')
    assert.equal(ui.document.querySelector('.bot-confirm'), null); assert.equal(bot.writes.length, 1)
    assert.equal(bot.offers[0].status, 'published')
    assert.equal(ui.document.querySelectorAll('.conversation-history script').length, 0)
  } finally { ui.document.defaultView.removeEventListener('conexa:offers-changed', changed); await ui.dispose() }
})

test('Bot UI: resposta perdida conserva pedido entre conversas e reconcilia sem duplicar', async () => {
  const { ui, bot, choose, write, confirm } = await setup()
  try {
    await write('editar alface total 20 kg')
    bot.loseResponse(); await confirm()
    assert.equal(bot.writes.length, 1)
    assert.equal(ui.document.getElementById('bot-message').disabled, true)
    assert.match(ui.document.activeElement.textContent, /Resposta perdida/)
    await choose('Restaurante'); await choose('Bot Conexa')
    await ui.click('Verificar pedido pendente')
    assert.equal(bot.writes.length, 1)
    const confirmations = bot.requests.filter(r => r.action === 'confirm')
    assert.equal(confirmations.length, 2); assert.equal(confirmations[0].request_id, confirmations[1].request_id)
    assert.equal(ui.document.getElementById('bot-message').disabled, false)
    assert.match(ui.document.querySelector('.bot-feedback').textContent, /Oferta persistida/)
  } finally { await ui.dispose() }
})

test('Bot UI: recarga após resposta perdida conserva confirmação e chave sem aplicar de novo', async () => {
  const { ui, bot, choose, write, confirm } = await setup()
  try {
    await write('editar alface total 20 kg')
    bot.loseResponse(); await confirm()
    const key = bot.requests.at(-1).request_id
    const { default: Page } = await ui.load('/src/features/conversations/ConversationsPage.jsx')
    await ui.unmount()
    const people = createConversationsFixture()
    await ui.mountComponent(Page, { session: { id: 'ana', role: 'producer' }, service: people.service, botService: bot.service }, 'reloaded')
    await choose('Bot Conexa')
    assert.equal(ui.findButton('Criar oferta').disabled, true)
    await ui.click('Verificar pedido pendente')
    assert.equal(bot.requests.at(-1).request_id, key)
    assert.equal(bot.writes.length, 1)
    assert.equal(ui.findButton('Criar oferta').disabled, false)
    assert.equal(ui.document.defaultView.sessionStorage.length, 0)
  } finally { await ui.dispose() }
})

test('Bot UI: conflito preserva campos e exige nova prévia e confirmação', async () => {
  const { ui, bot, write, confirm } = await setup()
  try {
    await write('editar alface total 20 kg')
    bot.offers[0].version++; bot.offers[0].quantity_free = 22
    await ui.click('Atualizar')
    await confirm(); assert.equal(bot.writes.length, 0)
    assert.equal(ui.document.querySelector('.bot-confirm'), null)
    await ui.click('Preparar nova prévia')
    assert.match(ui.document.querySelector('.bot-preview').textContent, /versão 2/)
    assert.match(ui.document.querySelector('.bot-preview').textContent, /Depois: 20 kg/)
    assert.equal(bot.writes.length, 0)
    await confirm(); assert.equal(bot.writes.length, 1)
  } finally { await ui.dispose() }
})

test('Bot UI: perguntas de criação, opções do catálogo e descarte sem escrita', async () => {
  const { ui, bot, write } = await setup()
  try {
    await write('criar oferta')
    assert.match(ui.document.querySelector('.conversation-thread').textContent, /Qual alimento/)
    assert.equal(ui.document.querySelector('.bot-preview'), null)
    await ui.click('Alface')
    assert.match(ui.document.querySelector('.conversation-thread').textContent, /quantidade total ofertada/)
    for (const answer of ['20,125', '5,07', '4,00', today(), futureDate(10), 'não sei']) await write(answer)
    assert.match(ui.document.querySelector('.conversation-thread').textContent, /qual local fictício/)
    await ui.click('Sítio Boa Semente · coleta fictícia')
    assert.ok(ui.document.querySelector('.bot-confirm'))
    assert.match(ui.document.querySelector('.bot-preview').textContent, /20,125 kg/)
    assert.equal(bot.writes.length, 0)
    await write('cancelar'); assert.equal(bot.writes.length, 0)
    // Simula longo intervalo sem eventos; atualização busca todas as páginas novas.
    const before = bot.messages.length
    for (let i = 0; i < 90; i++) bot.messages.push({ id: `bot-${before + i}`, seq: String(before + i + 1), speaker: 'bot', body: `Mensagem recuperada ${i}`, created_at: '2026-11-11T14:10:00Z' })
    await ui.click('Atualizar')
    assert.equal(ui.document.querySelectorAll('.conversation-history li').length, bot.messages.length)
    assert.match(ui.document.querySelector('.conversation-history').textContent, /Mensagem recuperada 89/)
  } finally { await ui.dispose() }
})

test('Bot UI: rejeição de revisão por outra sessão recarrega a prévia; falha na revalidação esconde confirmação antiga', async () => {
  const { ui, bot, write, confirm } = await setup()
  try {
    await write('editar alface total 20 kg')
    const state = await bot.service.state()
    await bot.service.turn({ conversation_id: 'bot-ana', request_id: 'other-session', revision: state.draft.revision, body: 'Cancelar em outra sessão', intent: 'cancel', fields: {} })
    await confirm()
    assert.equal(bot.writes.length, 0)
    assert.equal(ui.document.querySelector('.bot-confirm'), null)
    assert.ok(ui.findButton('Criar oferta'))
    await write('editar alface total 20 kg')
    const second = await bot.service.state()
    await bot.service.turn({ conversation_id: 'bot-ana', request_id: 'other-again', revision: second.draft.revision, body: 'Cancelar em outra sessão', intent: 'cancel', fields: {} })
    bot.service.state = async () => { throw new Error('Revalidação indisponível') }
    await confirm()
    assert.equal(ui.document.querySelector('.bot-confirm'), null)
    assert.match(ui.document.querySelector('[role=alert]').textContent, /Revalidação indisponível/)
  } finally { await ui.dispose() }
})
