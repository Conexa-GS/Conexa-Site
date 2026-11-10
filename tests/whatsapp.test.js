import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { advanceConversation, newConversation, settlePublication } from '../server/whatsapp/conversation.js'
import { createWebhookHandler, MAX_WEBHOOK_BYTES } from '../server/whatsapp/webhook.js'
import { today, futureDate, validateOffer } from '../src/domain/offers.js'

const catalog = { products: [{ id: 'alface', name: 'Alface', unit: 'kg' }, { id: 'caixa', name: 'Caixa', unit: 'cx' }], locations: [{ id: 'coleta', display_address: 'Coleta fictícia do produtor' }] }
const draft = () => ({ product_id: 'alface', quantity_total: '30,125', price: '5,00', minimum: '4,00', available_from: today(), available_until: futureDate(7), expires_on: '', pickup_location_id: 'coleta' })
const config = { verifyToken: 'token-ficticio', appSecret: 'segredo-ficticio', businessAccountId: 'conta-ficticia', phoneNumberId: 'numero-ficticio' }
const envelope = (messages = [{ id: 'wamid.ficticio', from: '00000000001', timestamp: '1', type: 'text', text: { body: 'OFERTA' } }]) => ({ object: 'whatsapp_business_account', entry: [{ id: config.businessAccountId, changes: [{ field: 'messages', value: { messaging_product: 'whatsapp', metadata: { phone_number_id: config.phoneNumberId }, messages } }] }] })
const signed = body => `sha256=${createHmac('sha256', config.appSecret).update(body).digest('hex')}`
const post = (payload = envelope(), headers = {}) => {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload)
  return new Request('https://conexa.invalid/webhook', { method: 'POST', body, headers: { 'x-hub-signature-256': signed(body), ...headers } })
}
function completeConversation(id = 'conversa-ficticia') {
  let state = newConversation(id)
  for (const answer of ['OFERTA', '1', '30,125', '5,00', '4,00', today(), futureDate(7), 'NÃO SEI', '1']) {
    const next = advanceConversation(state, answer, catalog)
    assert.equal(next.effect, null)
    state = next.state
  }
  assert.equal(state.status, 'preview')
  return state
}
const confirmation = state => `CONFIRMAR ${state.id}:${state.revision}`

test('WhatsApp exige OFERTA, oito respostas, prévia e confirmação exata; payload equivale ao formulário', () => {
  const idle = newConversation('inicio')
  assert.equal(advanceConversation(idle, 'oi', catalog).state, idle)
  let state = advanceConversation(idle, 'OFERTA', catalog).state
  assert.equal(state.choices.length, 1, 'Não oferecer caixas sem conversão.')
  const invalid = advanceConversation(state, 'alface', catalog)
  assert.equal(invalid.state, state)
  assert.equal(invalid.effect, null)
  state = completeConversation()
  assert.match(advanceConversation(state, 'sim', catalog).reply, /CONFIRMAR/)
  assert.equal(advanceConversation(state, 'CONFIRMAR', catalog).effect, null)
  const next = advanceConversation(state, confirmation(state), catalog)
  assert.equal(next.state.status, 'submitting')
  assert.deepEqual(next.effect.data, validateOffer(draft()).data)
  assert.equal(next.effect.idempotencyKey, `${state.id}:${state.revision}`)
  assert.doesNotMatch(next.reply, /Publicação confirmada/)
})

test('WhatsApp correção invalida confirmação antiga e isola tokens de outras conversas', () => {
  const initial = completeConversation()
  const editing = advanceConversation(initial, 'CORRIGIR 2', catalog)
  assert.equal(editing.state.field, 'quantity_total')
  assert.equal(advanceConversation(editing.state, confirmation(initial), catalog).effect, null)
  const corrected = advanceConversation(editing.state, '20', catalog)
  assert.match(corrected.reply, /20 kg/)
  assert.equal(corrected.state.status, 'preview')
  assert.equal(advanceConversation(corrected.state, confirmation(initial), catalog).effect, null)
  assert.equal(advanceConversation(completeConversation('outra'), confirmation(corrected.state), catalog).effect, null)
  assert.equal(advanceConversation(corrected.state, confirmation(corrected.state), catalog).effect.data.quantity_total, 20)
})

test('WhatsApp valida precisão, mínimo, datas e dependências após correção sem apagar respostas válidas', () => {
  let state = advanceConversation(newConversation('validacao'), 'OFERTA', catalog).state
  state = advanceConversation(state, '1', catalog).state
  assert.equal(advanceConversation(state, '1,0001', catalog).state, state)
  const before = completeConversation()
  let edited = advanceConversation(before, 'CORRIGIR 3', catalog).state
  assert.equal(advanceConversation(edited, '3,00', catalog).state, edited)
  edited = advanceConversation(before, 'CORRIGIR 7', catalog).state
  assert.equal(advanceConversation(edited, '31/02/2030', catalog).state, edited)
  edited = advanceConversation(edited, futureDate(8), catalog).state
  edited = advanceConversation(edited, 'CORRIGIR 6', catalog).state
  const invalidated = advanceConversation(edited, futureDate(10), catalog)
  assert.equal(invalidated.state.field, 'expires_on')
  assert.equal(invalidated.state.status, 'collecting')
  assert.equal(invalidated.effect, null)
  assert.equal(invalidated.state.draft.quantity_total, '30,125')
})

test('WhatsApp usa opções exibidas e revalida catálogo e calendário na confirmação', () => {
  let state = advanceConversation(newConversation('catalogo'), 'OFERTA', catalog).state
  const changed = { ...catalog, products: [{ id: 'tomate', name: 'Tomate', unit: 'kg' }, ...catalog.products] }
  state = advanceConversation(state, '1', changed).state
  assert.equal(state.draft.product_id, 'alface', 'Número deve se referir à opção que foi exibida.')
  const ready = completeConversation()
  const removed = advanceConversation(ready, confirmation(ready), { ...catalog, products: [{ id: 'tomate', name: 'Tomate', unit: 'kg' }] })
  assert.equal(removed.effect, null)
  assert.equal(removed.state.field, 'product_id')
  const outdated = { ...ready, draft: { ...ready.draft, available_from: '2020-01-01' } }
  assert.equal(advanceConversation(outdated, confirmation(outdated), catalog).effect, null)
  const missing = advanceConversation(ready, confirmation(ready), { ...catalog, locations: [] })
  assert.equal(missing.state, ready)
  assert.equal(missing.effect, null)
})

test('WhatsApp descarta sem publicar e não cancela uma escrita em andamento', () => {
  const state = completeConversation()
  const cancelled = advanceConversation(state, 'CANCELAR', catalog)
  assert.equal(cancelled.state.status, 'cancelled')
  assert.deepEqual(cancelled.state.draft, {})
  assert.equal(cancelled.effect, null)
  assert.equal(advanceConversation(cancelled.state, confirmation(state), catalog).effect, null)
  const submitting = advanceConversation(state, confirmation(state), catalog).state
  for (const answer of ['CANCELAR', confirmation(state), 'OFERTA']) {
    const next = advanceConversation(submitting, answer, catalog)
    assert.equal(next.state, submitting)
    assert.equal(next.effect, null)
  }
})

test('WhatsApp só anuncia sucesso após resultado, preserva chave em falha e bloqueia confirmação após sucesso', () => {
  const ready = completeConversation()
  const first = advanceConversation(ready, confirmation(ready), catalog)
  const failed = settlePublication(first.state, { outcome: 'rejected' })
  assert.equal(failed.state.status, 'preview')
  assert.deepEqual(failed.state.draft, ready.draft)
  assert.doesNotMatch(failed.reply, /Publicação confirmada/)
  const retry = advanceConversation(failed.state, confirmation(failed.state), catalog)
  assert.equal(retry.effect.idempotencyKey, first.effect.idempotencyKey)
  const saved = settlePublication(retry.state, { offerId: 'oferta-ficticia' })
  assert.equal(saved.state.status, 'confirmed')
  assert.deepEqual(saved.state.draft, {})
  assert.match(saved.reply, /Publicação confirmada: oferta-ficticia/)
  assert.equal(advanceConversation(saved.state, confirmation(ready), catalog).effect, null)
  assert.throws(() => settlePublication(ready, { offerId: 'invalida' }))
})

test('WhatsApp resultado incerto impede correção e cancelamento até reconciliação pela mesma chave', () => {
  const ready = completeConversation()
  const pending = advanceConversation(ready, confirmation(ready), catalog)
  const unknown = settlePublication(pending.state)
  assert.equal(unknown.state.status, 'reconciling')
  assert.deepEqual(unknown.state.draft, ready.draft)
  assert.doesNotMatch(unknown.reply, /Publicação confirmada/)
  for (const text of ['CORRIGIR 2', 'CANCELAR', 'OFERTA', confirmation(ready)]) {
    const next = advanceConversation(unknown.state, text, catalog)
    assert.equal(next.state, unknown.state)
    assert.equal(next.effect, null)
  }
  const recovered = settlePublication(unknown.state, { offerId: 'gravada-antes-do-timeout' })
  assert.equal(recovered.state.status, 'confirmed')
  const rejected = settlePublication(unknown.state, { outcome: 'rejected' })
  const retry = advanceConversation(rejected.state, confirmation(rejected.state), catalog)
  assert.equal(retry.effect.idempotencyKey, pending.effect.idempotencyKey)
})

test('webhook recusa configuração incompleta e verifica challenge/token/método', async () => {
  const goodUrl = `https://conexa.invalid/webhook?hub.mode=subscribe&hub.verify_token=${config.verifyToken}&hub.challenge=12345`
  assert.equal((await createWebhookHandler()(new Request(goodUrl))).status, 503)
  const handler = createWebhookHandler({ ...config, acceptBatch: async () => {} })
  const verified = await handler(new Request(goodUrl))
  assert.equal(verified.status, 200)
  assert.equal(await verified.text(), '12345')
  for (const url of [goodUrl.replace(config.verifyToken, 'errado'), goodUrl.replace('subscribe', 'outro'), goodUrl.replace('12345', '')]) assert.equal((await handler(new Request(url))).status, 403)
  assert.equal((await handler(new Request(goodUrl, { method: 'DELETE' }))).status, 405)
})

test('webhook autentica bytes originais antes de aceitar JSON; corpo alterado e assinatura ausente são rejeitados', async () => {
  const accepted = []
  const handler = createWebhookHandler({ ...config, acceptBatch: async messages => accepted.push(messages) })
  for (const signature of ['', 'sha256=abc', `sha256=${'0'.repeat(64)}`]) assert.equal((await handler(post(envelope(), { 'x-hub-signature-256': signature }))).status, 401)
  const body = JSON.stringify(envelope())
  assert.equal((await handler(post(`${body} `, { 'x-hub-signature-256': signed(body) }))).status, 401)
  assert.equal((await handler(post('{invalido'))).status, 400)
  assert.equal(accepted.length, 0)
  assert.equal((await handler(post(envelope()))).status, 200)
  assert.equal(accepted[0][0].text, 'OFERTA')
})

test('webhook confere conta e número receptores e valida o lote inteiro antes de aceitar', async () => {
  const accepted = []
  const handler = createWebhookHandler({ ...config, acceptBatch: async messages => accepted.push(messages) })
  const wrongAccount = envelope(); wrongAccount.entry[0].id = 'outra'
  const wrongPhone = envelope(); wrongPhone.entry[0].changes[0].value.metadata.phone_number_id = 'outro'
  for (const payload of [wrongAccount, wrongPhone]) assert.equal((await handler(post(payload))).status, 403)
  const invalidLast = envelope(); invalidLast.entry[0].changes[0].value.messages.push({ id: 'invalida' })
  for (const payload of [null, {}, { object: 'whatsapp_business_account', entry: [] }, invalidLast]) assert.equal((await handler(post(payload))).status, 400)
  assert.equal(accepted.length, 0, 'Não aceitar só a primeira parte de um lote inválido.')
})

test('webhook separa status de entrega e áudio; não usa nome de contato como identidade', async () => {
  const batches = []
  const handler = createWebhookHandler({ ...config, acceptBatch: async messages => batches.push(messages) })
  const status = envelope()
  const value = status.entry[0].changes[0].value
  delete value.messages
  value.statuses = [{ id: 'outbound-ficticio', status: 'delivered' }]
  assert.equal((await handler(post(status))).status, 200)
  assert.equal(batches.length, 0)
  const audio = envelope([{ id: 'audio-ficticio', from: '00000000001', timestamp: '2', type: 'audio', audio: { id: 'nao-baixar' } }])
  audio.entry[0].changes[0].value.contacts = [{ wa_id: 'outro', profile: { name: 'Outro produtor' } }]
  assert.equal((await handler(post(audio))).status, 200)
  assert.deepEqual(batches[0][0], { id: 'audio-ficticio', from: '00000000001', timestamp: 2, type: 'audio', text: null, businessAccountId: config.businessAccountId, phoneNumberId: config.phoneNumberId })
})

test('webhook retorna 503 se recebimento falhar e só responde 200 após o aceite assíncrono', async () => {
  const failing = createWebhookHandler({ ...config, acceptBatch: async () => { throw new Error('Detalhe privado do banco') } })
  const failed = await failing(post())
  assert.equal(failed.status, 503)
  assert.doesNotMatch(await failed.text(), /Detalhe privado/)
  let release
  const pending = new Promise(resolve => { release = resolve })
  let completed = false
  const handler = createWebhookHandler({ ...config, acceptBatch: async () => pending })
  const response = handler(post()).then(value => { completed = true; return value })
  await new Promise(resolve => setTimeout(resolve, 5))
  assert.equal(completed, false)
  release()
  assert.equal((await response).status, 200)
})

test('webhook limita bytes mesmo sem Content-Length e limita quantidade de eventos', async () => {
  let calls = 0
  const handler = createWebhookHandler({ ...config, acceptBatch: async () => { calls++ } })
  assert.equal((await handler(post('x'.repeat(MAX_WEBHOOK_BYTES + 1)))).status, 413)
  const declaredOversize = await handler(post(envelope(), { 'content-length': String(MAX_WEBHOOK_BYTES + 1) }))
  assert.equal(declaredOversize.status, 413)
  const template = envelope().entry[0].changes[0].value.messages[0]
  const many = envelope(Array.from({ length: 101 }, (_, index) => ({ ...template, id: `wamid.${index}` })))
  assert.equal((await handler(post(many))).status, 400)
  assert.equal(calls, 0)
})
