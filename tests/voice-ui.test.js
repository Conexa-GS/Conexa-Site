import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createChatEnvironment } from './helpers/offer-chat-dom.mjs'
import { createConversationsFixture } from './helpers/conversations-fixture.mjs'
import { createBotFixture } from './helpers/site-bot-fixture.mjs'
import { createVoiceFixture } from './helpers/voice-fixture.mjs'

async function setup(enabled = true) {
  const ui = await createChatEnvironment()
  const { default: Page } = await ui.load('/src/features/conversations/ConversationsPage.jsx')
  const people = createConversationsFixture(), bot = createBotFixture(), voice = createVoiceFixture()
  const props = { session: { id: 'ana', role: 'producer' }, service: people.service, botService: bot.service, voice: { service: voice.service, enabled } }
  await ui.mountComponent(Page, props, 'ana')
  const choose = async text => { await ui.act(async () => { [...ui.document.querySelectorAll('.conversation-list button')].find(b => b.textContent.includes(text)).click() }) }
  await choose('Bot Conexa')
  async function write(id, text) {
    await ui.act(async () => {
      const input = ui.document.getElementById(id)
      Object.getOwnPropertyDescriptor(ui.document.defaultView.HTMLTextAreaElement.prototype, 'value').set.call(input, text)
      input.dispatchEvent(new ui.document.defaultView.Event('input', { bubbles: true }))
    })
  }
  return { ui, bot, voice, props, choose, write, Page }
}

test('IA/voz UI: desabilitada não oferece início nem chama provedor', async () => {
  const { ui, voice } = await setup(false)
  try {
    assert.match(ui.document.querySelector('.voice-panel').textContent, /Voz desabilitada/)
    assert.equal(ui.document.querySelector('.voice-actions'), null)
    assert.equal(voice.starts.length, 0)
    assert.equal(ui.document.getElementById('bot-message').disabled, false)
  } finally { await ui.dispose() }
})

test('IA/voz UI: proposta corrigida exige envio, prévia e confirmação da revisão', async () => {
  const { ui, bot, voice, write } = await setup()
  try {
    assert.equal(voice.starts.length, 0)
    await ui.click('Iniciar voz paga')
    assert.deepEqual(voice.starts, ['voice'])
    assert.match(ui.document.querySelector('.voice-active').textContent, /microfone ativo/)
    await ui.act(async () => { voice.transcript('tenho vinte quilos'); voice.suggest('editar alface total 20 kg') })
    assert.equal(bot.requests.length, 0); assert.equal(bot.writes.length, 0)
    await write('voice-suggestion', 'editar alface total 21 kg')
    await ui.click('Revisar sugestão no bot')
    assert.equal(voice.stops.length, 1)
    assert.equal(ui.document.activeElement.id, 'bot-message')
    assert.equal(ui.document.getElementById('bot-message').value, 'editar alface total 21 kg')
    assert.equal(bot.requests.length, 0)
    await ui.click('Enviar ao bot')
    assert.ok(ui.document.querySelector('.bot-preview'))
    assert.equal(bot.writes.length, 0)
    await ui.act(async () => { ui.document.querySelector('.bot-confirm').click() })
    assert.equal(bot.writes.length, 1); assert.equal(bot.writes[0].quantity_total, 21)
  } finally { await ui.dispose() }
})

test('IA/voz UI: corrigir transcrição, cancelar e sair encerram, sem reinício automático', async () => {
  const { ui, bot, voice, choose, write, Page, props } = await setup()
  try {
    await ui.click('Iniciar IA paga por texto')
    assert.match(ui.document.querySelector('.voice-active').textContent, /microfone desligado/)
    await ui.act(async () => { voice.transcript('sim') })
    await write('voice-transcript', 'cancelar')
    await ui.click('Usar transcrição no texto simulado'); await ui.click('Enviar ao bot')
    assert.equal(bot.writes.length, 0)
    await ui.click('Iniciar voz paga'); await choose('Restaurante')
    assert.equal(voice.stops.length, 2)
    await choose('Bot Conexa')
    assert.equal(voice.starts.length, 2)
    await ui.click('Iniciar voz paga')
    await ui.act(async () => { ui.document.defaultView.dispatchEvent(new ui.document.defaultView.Event('pagehide')) })
    assert.equal(voice.stops.length, 3)
    await ui.click('Iniciar voz paga')
    await ui.mountComponent(Page, { ...props, session: { id: 'buyer', role: 'buyer' } }, 'buyer')
    assert.equal(voice.stops.length, 4)
    assert.equal(ui.document.getElementById('voice-transcript'), null)
  } finally { await ui.dispose() }
})
