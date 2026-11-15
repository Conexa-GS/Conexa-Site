import test from 'node:test'
import assert from 'node:assert/strict'
import { createChatEnvironment } from './helpers/offer-chat-dom.mjs'
import { createConversationsFixture } from './helpers/conversations-fixture.mjs'
import { createBotFixture } from './helpers/site-bot-fixture.mjs'

test('Cadastrar com ajuda abre o assistente flutuante, preserva texto e não inicia pedido', async () => {
  const ui = await createChatEnvironment()
  const win = ui.document.defaultView
  const original = new Map()
  // Browser APIs used by the router and illustration; no layout/network mocks.
  const globals = { history: win.history, PopStateEvent: win.PopStateEvent, AbortController: win.AbortController, matchMedia: () => ({ matches: true, addEventListener() {} }), IntersectionObserver: class { observe() {} disconnect() {} } }
  for (const [name, value] of Object.entries(globals)) {
    original.set(name, Object.getOwnPropertyDescriptor(globalThis, name))
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value })
  }
  win.scrollTo = () => {}
  win.history.replaceState(null, '', '/demo')
  const { conversationService } = await ui.load('/src/services/conversations.js')
  const { siteBotService } = await ui.load('/src/services/site-bot.js')
  const originalPeople = { ...conversationService }, originalBot = { ...siteBotService }
  const people = createConversationsFixture(), bot = createBotFixture()
  Object.assign(conversationService, people.service)
  Object.assign(siteBotService, bot.service)
  try {
    const { default: App } = await ui.load('/src/App.jsx')
    await ui.mountComponent(App, {})
    await ui.click('Entrar como produtor')
    assert.equal(win.location.pathname, '/produtor/dashboard')
    const products = [...ui.document.querySelectorAll('nav a')].find(a => a.textContent === 'Produtos')
    await ui.act(async () => { products.click() })
    assert.equal(win.location.pathname, '/produtor/ofertas')
    await ui.click('Cadastrar com ajuda')
    assert.equal(win.location.pathname, '/produtor/ofertas')
    const panel = ui.document.getElementById('conexa-bot-panel')
    assert.equal(panel.dataset.testPopover, 'open')
    assert.equal(ui.document.querySelector('dialog[open]'), null)
    assert.equal(ui.document.getElementById('bot-title').textContent, 'Bot Conexa')
    assert.ok(ui.findButton('Criar oferta'))
    assert.equal(bot.requests.length, 0, 'O atalho não descarta rascunho nem inicia mutação')
    await ui.act(async () => {
      const input = ui.document.getElementById('bot-message')
      Object.getOwnPropertyDescriptor(win.HTMLTextAreaElement.prototype, 'value').set.call(input, 'Meu rascunho')
      input.dispatchEvent(new win.Event('input', { bubbles: true }))
    })
    await ui.click('Minimizar conversa')
    assert.equal(panel.dataset.testPopover, 'closed')
    await ui.click('Conversar com o Bot Conexa')
    assert.equal(ui.document.getElementById('bot-message').value, 'Meu rascunho')
    await ui.act(async () => { [...ui.document.querySelectorAll('nav a')].find(a => a.textContent === 'Mensagens').click() })
    assert.equal(ui.document.getElementById('bot-message').value, 'Meu rascunho', 'Trocar de página mantém a conversa')
    assert.equal(ui.document.querySelectorAll('#bot-title').length, 1, 'Bot único no painel')
    await ui.click('Minimizar conversa')
    await ui.act(async () => { [...ui.document.querySelectorAll('.conversation-list button')].find(b => b.textContent.includes('Bot Conexa')).click() })
    assert.equal(panel.dataset.testPopover, 'open')
    await ui.act(async () => { people.emit() })
    assert.equal(bot.requests.length, 0)
    assert.equal(ui.document.querySelectorAll('#bot-title').length, 1)
  } finally {
    await ui.dispose()
    Object.assign(conversationService, originalPeople)
    Object.assign(siteBotService, originalBot)
    for (const [name, descriptor] of original) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor)
      else delete globalThis[name]
    }
  }
})
