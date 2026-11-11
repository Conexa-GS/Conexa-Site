import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createChatEnvironment } from './helpers/offer-chat-dom.mjs'
import { createConversationsFixture } from './helpers/conversations-fixture.mjs'
import { createBotFixture } from './helpers/site-bot-fixture.mjs'
import { futureDate, today } from '../src/domain/offers.js'

async function setup() {
  const ui = await createChatEnvironment()
  const { default: Page } = await ui.load('/src/features/conversations/ConversationsPage.jsx')
  const people = createConversationsFixture(), bot = createBotFixture()
  await ui.mountComponent(Page, { session: { id: 'ana', role: 'producer' }, service: people.service, botService: bot.service }, 'ana')
  const choose = async text => { await ui.act(async () => { [...ui.document.querySelectorAll('.conversation-list button')].find(b => b.textContent.includes(text)).click() }) }
  await choose('Bot Conexa')
  async function write(text) {
    await ui.act(async () => {
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
