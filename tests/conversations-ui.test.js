import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createChatEnvironment } from './helpers/offer-chat-dom.mjs'
import { createConversationsFixture } from './helpers/conversations-fixture.mjs'

const session = { id: 'ana', role: 'producer' }
async function setup(count) {
  const ui = await createChatEnvironment()
  const { default: Page } = await ui.load('/src/features/conversations/ConversationsPage.jsx')
  const fixture = createConversationsFixture('ana', count)
  await ui.mountComponent(Page, { session, service: fixture.service }, session.id)
  const choose = async text => { await ui.act(async () => { [...ui.document.querySelectorAll('.conversation-list button')].find(button => button.textContent.includes(text)).click() }) }
  const write = async text => {
    await ui.act(async () => {
      const input = ui.document.getElementById('conversation-message')
      Object.getOwnPropertyDescriptor(ui.document.defaultView.HTMLTextAreaElement.prototype, 'value').set.call(input, text)
      input.dispatchEvent(new ui.document.defaultView.Event('input', { bubbles: true }))
    })
  }
  return { ui, fixture, Page, choose, write }
}

test('Conversas: bot indisponível sem configuração; contatos abrem mensagem; texto humano não executa HTML ou altera ofertas', async () => {
  const { ui, fixture, choose, write } = await setup()
  try {
    assert.match(ui.document.querySelector('.conversation-list button').textContent, /Bot Conexa/)
    await choose('Bot Conexa')
    assert.match(ui.document.querySelector('.conversation-thread').textContent, /Bot por texto precisa do Supabase demo configurado/)
    assert.equal(ui.document.querySelector('textarea'), null)
    assert.equal(fixture.sends.length, 0)
    await choose('Restaurante')
    assert.equal(ui.document.activeElement.id, 'thread-title')
    assert.match(ui.document.querySelector('.conversation-agreement').textContent, /formalizados/)
    await write('<script>agora tenho 20 kg</script>')
    await ui.click('Enviar')
    assert.equal(fixture.sends.length, 1)
    assert.equal(ui.document.querySelector('.conversation-history script'), null)
    assert.match(ui.document.querySelector('.conversation-history').textContent, /<script>agora tenho 20 kg<\/script>/)
    assert.equal(ui.document.getElementById('conversation-message').value, '')
    await ui.act(async () => { fixture.emit(); fixture.emit() })
    assert.equal(ui.document.querySelectorAll('.conversation-history li').length, 3)
    await ui.click('João · Horta da FamíliaProdutor fictício')
    assert.match(ui.document.getElementById('thread-title').textContent, /João/)
    assert.equal(ui.document.querySelectorAll('.conversation-history li').length, 0)
  } finally { await ui.dispose() }
})

test('Conversas: falha conserva texto/chave entre conversas e bloqueia alteração antes de verificar envio', async () => {
  const { ui, fixture, choose, write } = await setup()
  try {
    await choose('Restaurante')
    fixture.setFailure(true)
    await write('Uma parceria fictícia')
    await ui.click('Enviar')
    assert.equal(ui.document.getElementById('conversation-message').value, 'Uma parceria fictícia')
    assert.equal(ui.document.getElementById('conversation-message').disabled, true)
    assert.match(ui.document.activeElement.textContent, /Não foi possível confirmar/)
    await choose('Bot Conexa')
    await choose('Restaurante')
    assert.equal(ui.document.getElementById('conversation-message').value, 'Uma parceria fictícia')
    fixture.setFailure(false)
    await ui.click('Verificar envio')
    assert.equal(fixture.sends[0].key, fixture.sends[1].key)
    assert.equal(ui.document.querySelectorAll('.conversation-history li').length, 3)
    assert.equal(ui.document.getElementById('conversation-message').value, '')
  } finally { await ui.dispose() }
})

test('Conversas: confirmação dupla pendente envia uma vez; timeout após persistir reconcilia com a mesma chave', async () => {
  const { ui, fixture, choose, write } = await setup()
  let finish
  const original = fixture.service.send
  fixture.service.send = async (...args) => { const message = await original(...args); await new Promise(resolve => { finish = resolve }); return message }
  try {
    await choose('Restaurante')
    await write('Somente uma mensagem')
    const button = ui.findButton('Enviar')
    await ui.act(async () => { button.click(); button.click() })
    assert.equal(fixture.sends.length, 1)
    assert.equal(ui.document.getElementById('conversation-message').disabled, true)
    await ui.act(async () => { finish() })
    assert.equal(ui.document.querySelectorAll('.conversation-history li').length, 3)
    fixture.service.send = async (...args) => { await original(...args); throw new Error('Resposta perdida após persistência') }
    await write('Resultado incerto')
    await ui.click('Enviar')
    fixture.service.send = original
    await ui.click('Verificar envio')
    assert.equal(fixture.messages.filter(m => m.body === 'Resultado incerto').length, 1)
    assert.equal(fixture.sends.at(-1).key, fixture.sends.at(-2).key)
  } finally { await ui.dispose() }
})

test('Conversas: paginação mantém ordem e histórico; troca de conta descarta dados e cancela assinatura', async () => {
  const { ui, fixture, Page, choose, write } = await setup(45)
  try {
    await choose('Restaurante')
    assert.equal(ui.document.querySelectorAll('.conversation-history li').length, 40)
    await ui.click('Carregar mensagens anteriores')
    assert.equal(ui.document.querySelectorAll('.conversation-history li').length, 45)
    await ui.act(async () => { fixture.emit() })
    assert.equal(ui.document.querySelectorAll('.conversation-history li').length, 45)
    await write('Rascunho privado da conta Ana')
    assert.equal(fixture.listeners.size, 1)
    const other = createConversationsFixture('buyer', 0)
    await ui.mountComponent(Page, { session: { id: 'buyer', role: 'buyer' }, service: other.service }, 'buyer')
    assert.equal(fixture.listeners.size, 0)
    assert.equal(other.listeners.size, 1)
    assert.equal(ui.document.querySelector('textarea'), null)
    assert.doesNotMatch(ui.document.body.textContent, /Rascunho privado|Mensagem fictícia 45/)
  } finally { await ui.dispose() }
})

test('Conversas: serviço indisponível mostra impedimento sem fabricar histórico', async () => {
  const { ui, fixture, Page } = await setup()
  try {
    fixture.service.inbox = async () => { throw new Error('Migration ainda não aplicada') }
    await ui.mountComponent(Page, { session, service: fixture.service }, 'offline')
    assert.match(ui.document.querySelector('[role="alert"]').textContent, /Migration ainda não aplicada/)
    assert.equal(ui.document.querySelectorAll('.conversation-list li').length, 0)
    assert.equal(ui.document.querySelector('textarea'), null)
  } finally { await ui.dispose() }
})

test('Conversas: reconexão recupera mais de uma página nova sem lacunas ou duplicação', async () => {
  const { ui, fixture, choose } = await setup()
  try {
    await choose('Restaurante')
    for (let i = 3; i <= 93; i++) fixture.messages.push({ id: `offline-${i}`, seq: String(i), conversation_id: 'direct', sender_id: 'buyer', body: `Chegou offline ${i}`, created_at: '2026-11-11T14:10:00Z' })
    await ui.act(async () => { fixture.emit() })
    assert.equal(ui.document.querySelectorAll('.conversation-history li').length, 93)
    await ui.act(async () => { fixture.emit() })
    assert.equal(ui.document.querySelectorAll('.conversation-history li').length, 93)
    assert.match(ui.document.querySelector('.conversation-history li:last-child').textContent, /offline 93/)
  } finally { await ui.dispose() }
})
