import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { advanceConversation, newConversation, settlePublication } from '../server/whatsapp/conversation.js'
import { createWebhookHandler } from '../server/whatsapp/webhook.js'
import { today, futureDate } from '../src/domain/offers.js'

// Isolated walkthrough: no .env, HTTP server, Meta requests or database client.
const catalog = { products: [{ id: 'alface-demo', name: 'Alface', unit: 'kg' }], locations: [{ id: 'coleta-demo', display_address: 'Coleta fictícia da demonstração local' }] }
const config = { verifyToken: 'token-ficticio-local', appSecret: 'segredo-ficticio-local', businessAccountId: 'waba-demo', phoneNumberId: 'phone-demo' }
const sender = '00000000001'
let state = newConversation('previa-local')
let sequence = 0
const seen = new Set()
const offers = new Map()
const handler = createWebhookHandler({ ...config, acceptBatch: async messages => {
  for (const message of messages) {
    if (seen.has(message.id)) continue
    // Explicit fixture binding; this is NOT a phone verification mechanism.
    if (message.from !== sender) throw new Error('Sem vínculo fictício.')
    if (message.type !== 'text') continue
    const next = advanceConversation(state, message.text, catalog)
    state = next.state
    console.log(`\nVocê: ${message.text}\nConexa local: ${next.reply}`)
    if (next.effect) {
      // Map and Set demonstrate sequential re-delivery only, not durable atomicity.
      if (!offers.has(next.effect.idempotencyKey)) offers.set(next.effect.idempotencyKey, { id: 'oferta-ficticia-local', ...next.effect.data })
      const settled = settlePublication(state, { offerId: offers.get(next.effect.idempotencyKey).id })
      state = settled.state
      console.log(`Conexa local: ${settled.reply}`)
    }
    seen.add(message.id)
  }
} })

async function deliver(text, id = `mensagem-local-${++sequence}`) {
  const body = JSON.stringify({ object: 'whatsapp_business_account', entry: [{ id: config.businessAccountId, changes: [{ field: 'messages', value: { messaging_product: 'whatsapp', metadata: { phone_number_id: config.phoneNumberId }, messages: [{ id, from: sender, timestamp: '1', type: 'text', text: { body: text } }] } }] }] })
  const signature = `sha256=${createHmac('sha256', config.appSecret).update(body).digest('hex')}`
  const response = await handler(new Request('http://localhost/whatsapp-demo', { method: 'POST', body, headers: { 'x-hub-signature-256': signature } }))
  assert.equal(response.status, 200)
}

console.log('SIMULAÇÃO LOCAL — dados em memória, descartados ao encerrar. Nenhum WhatsApp ou Supabase conectado.')
for (const answer of ['OFERTA', '1', '30,125', '5,00', '4,00', today(), futureDate(7), 'NÃO SEI', '1']) await deliver(answer)
assert.equal(offers.size, 0, 'Prévia não pode publicar.')
const oldConfirmation = `CONFIRMAR ${state.id}:${state.revision}`
await deliver('CORRIGIR 2')
await deliver('20')
await deliver(oldConfirmation)
assert.equal(offers.size, 0, 'Confirmação antiga não pode publicar.')
const confirmation = `CONFIRMAR ${state.id}:${state.revision}`
await deliver(confirmation, 'confirmacao-local')
await deliver(confirmation, 'confirmacao-local')
await deliver(confirmation)
assert.equal(offers.size, 1)
console.log('\nResultado local: uma oferta fictícia; prévia e confirmação antiga sem escrita; reentrega sequencial sem duplicação. Nada foi salvo no site.')
