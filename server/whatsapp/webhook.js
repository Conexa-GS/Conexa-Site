const encoder = new TextEncoder()
export const MAX_WEBHOOK_BYTES = 256 * 1024
const reply = (body, status) => new Response(body, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } })

export async function verifySignature(bytes, signature, appSecret) {
  if (!appSecret || !/^sha256=[a-fA-F0-9]{64}$/.test(signature || '')) return false
  const key = await crypto.subtle.importKey('raw', encoder.encode(appSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
  const digest = Uint8Array.from(signature.slice(7).match(/../g), hex => Number.parseInt(hex, 16))
  return crypto.subtle.verify('HMAC', key, digest, bytes)
}

// The receiver is configuration, never a value trusted from the request itself.
export function parseMessages(payload, { businessAccountId, phoneNumberId }) {
  if (payload?.object !== 'whatsapp_business_account' || !Array.isArray(payload.entry) || !payload.entry.length) throw new Error('invalid_payload')
  const messages = []
  for (const entry of payload.entry) {
    if (entry.id !== businessAccountId) throw new Error('wrong_receiver')
    if (!Array.isArray(entry.changes) || !entry.changes.length) throw new Error('invalid_payload')
    for (const change of entry.changes) {
      if (change.field !== 'messages') continue
      const value = change.value
      if (value?.metadata?.phone_number_id !== phoneNumberId) throw new Error('wrong_receiver')
      if (value.messaging_product !== 'whatsapp') throw new Error('invalid_payload')
      // Delivery/read status events do not constitute a user's answer.
      if (value.messages === undefined && Array.isArray(value.statuses)) continue
      if (!Array.isArray(value.messages) || !value.messages.length) throw new Error('invalid_payload')
      for (const message of value.messages) {
        if (typeof message?.id !== 'string' || !message.id || message.id.length > 512 || !/^\d{5,20}$/.test(message.from || '') || !/^\d{1,12}$/.test(message.timestamp || '') || typeof message.type !== 'string') throw new Error('invalid_payload')
        if (message.type === 'text' && (typeof message.text?.body !== 'string' || !message.text.body.trim() || message.text.body.length > 4096)) throw new Error('invalid_payload')
        messages.push({ id: message.id, from: message.from, timestamp: Number(message.timestamp), type: message.type, text: message.type === 'text' ? message.text.body : null, phoneNumberId, businessAccountId })
        if (messages.length > 100) throw new Error('invalid_payload')
      }
    }
  }
  return messages
}

async function readBoundedBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_WEBHOOK_BYTES) throw new Error('too_large')
  if (!request.body) return new Uint8Array()
  const reader = request.body.getReader()
  const chunks = []
  let length = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > MAX_WEBHOOK_BYTES) { await reader.cancel(); throw new Error('too_large') }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  const bytes = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
  return bytes
}

// acceptBatch must resolve only after durable receipt of the ENTIRE batch.
// No default queue, browser session, service_role client, logging or outgoing HTTP.
export function createWebhookHandler({ verifyToken, appSecret, businessAccountId, phoneNumberId, acceptBatch } = {}) {
  return async request => {
    if (!['GET', 'POST'].includes(request.method)) return reply('Método não permitido.', 405)
    if (![verifyToken, appSecret, businessAccountId, phoneNumberId].every(value => typeof value === 'string' && value.trim()) || typeof acceptBatch !== 'function') return reply('Integração indisponível.', 503)
    if (request.method === 'GET') {
      const query = new URL(request.url).searchParams
      if (query.get('hub.mode') !== 'subscribe' || query.get('hub.verify_token') !== verifyToken || !query.get('hub.challenge')) return reply('Verificação recusada.', 403)
      return reply(query.get('hub.challenge'), 200)
    }
    let bytes
    try { bytes = await readBoundedBody(request) } catch (error) { return reply('Corpo inválido.', error.message === 'too_large' ? 413 : 400) }
    if (!await verifySignature(bytes, request.headers.get('x-hub-signature-256'), appSecret)) return reply('Assinatura inválida.', 401)
    let messages
    try { messages = parseMessages(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)), { businessAccountId, phoneNumberId }) }
    catch (error) { return reply('Evento recusado.', error.message === 'wrong_receiver' ? 403 : 400) }
    if (!messages.length) return reply('EVENT_RECEIVED', 200)
    try { await acceptBatch(messages) } catch { return reply('Recebimento indisponível. Tente novamente.', 503) }
    return reply('EVENT_RECEIVED', 200)
  }
}
