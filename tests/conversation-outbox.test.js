import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createConversationOutbox } from '../src/services/conversation-outbox.js'

test('Outbox: somente pedidos incertos, isolados por participante e aba, sobrevivem à nova instância', () => {
  const data = new Map()
  const storage = () => ({ getItem: k => data.get(k), setItem: (k, v) => data.set(k, v), removeItem: k => data.delete(k) })
  const first = createConversationOutbox('ana', storage)
  first.save('direct', { body: 'Texto ainda não enviado', locked: false })
  assert.equal(data.size, 0)
  const attempt = { body: 'Mensagem fictícia', key: 'same-key', locked: true }
  first.save('direct', attempt)
  const restored = createConversationOutbox('ana', storage)
  assert.deepEqual(restored.load().direct, attempt)
  assert.deepEqual(createConversationOutbox('buyer', storage).load(), {})
  assert.deepEqual(createConversationOutbox('ana', () => ({ getItem: () => null })).load(), {})
  restored.save('direct', { body: '', locked: false })
  assert.equal(data.size, 0)
  restored.save('direct', { ...attempt, key: 'new-key' })
  assert.equal(restored.save('direct', { body: '', locked: false }, 'same-key'), false, 'Resposta tardia não apaga pedido mais recente')
  assert.equal(restored.load().direct.key, 'new-key')
  assert.equal(restored.save('direct', { body: '', locked: false }, 'new-key'), true)
  first.save('direct', attempt)
  const newerPage = createConversationOutbox('ana', storage)
  newerPage.save('direct', { ...attempt, key: 'page-key' })
  assert.equal(first.save('direct', { body: '', locked: false }, 'same-key'), false, 'Página antiga compara chave persistida pela página nova')
  assert.equal(createConversationOutbox('ana', storage).load().direct.key, 'page-key')
})

test('Outbox: storage bloqueado impede iniciar envio sem chave durável; journal inválido não vira comando', () => {
  const outbox = createConversationOutbox('ana', () => { throw new Error('Storage blocked') })
  assert.match(outbox.warning(), /retomar/)
  assert.throws(() => outbox.save('direct', { body: 'Não enviar', key: 'key', locked: true }), /armazenamento/)
  assert.deepEqual(outbox.load(), {})
  const invalid = createConversationOutbox('ana', () => ({ getItem: () => JSON.stringify({ bot: { body: '', locked: true, pending: { action: 'confirm', payload: { conversation_id: 'other' } } } }) }))
  assert.deepEqual(invalid.load(), {})
  assert.match(invalid.warning(), /retomar/)
})
