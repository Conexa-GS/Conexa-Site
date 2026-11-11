import { createServer } from 'node:http'
import { mkdir, open, unlink } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { readVoiceConfig } from './voice-policy.mjs'
import { createVoiceLedger } from './voice-ledger.mjs'
import { createVoiceBroker } from './voice-broker.mjs'
import { createOpenAIVoice } from './openai-voice.mjs'
import { createVoiceHandler } from './voice-http.mjs'

const config = readVoiceConfig(process.env)
let ledger, broker, lock
const directory = resolve('.voice-data')
if (config) {
  await mkdir(directory, { recursive: true })
  // Explicit single-process demo. A stale lock after a crash requires recovery.
  lock = await open(resolve(directory, 'server.lock'), 'wx')
  ledger = createVoiceLedger(resolve(directory, 'quotas.sqlite'))
  async function authenticate(token, conversationId) {
    const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false, autoRefreshToken: false } })
    const { data, error } = await client.auth.getUser(token)
    if (error || !data.user) throw new Error('Sessão demo inválida.')
    const { data: participant, error: denied } = await client.from('participants').select('id,role,is_demo').eq('id', data.user.id).eq('is_demo', true).single()
    if (denied || !participant || !['producer', 'buyer'].includes(participant.role)) throw new Error('Participante sem acesso.')
    if (conversationId) {
      const { error: forbidden } = await client.rpc('site_bot', { p_action: 'state', p_payload: { conversation_id: conversationId } })
      if (forbidden) throw new Error('Bot indisponível para este participante.')
    }
    return participant
  }
  broker = createVoiceBroker({ config, authenticate, ledger, provider: createOpenAIVoice(process.env.OPENAI_API_KEY) })
  await broker.recover()
}
const handle = createVoiceHandler({ config, broker })
const server = createServer(async (req, res) => {
  try {
    let size = 0
    const chunks = []
    for await (const chunk of req) {
      size += chunk.length
      if (size > 70000) { res.writeHead(413).end(); return }
      chunks.push(chunk)
    }
    const response = await handle(new Request(`http://localhost${req.url}`, { method: req.method, headers: req.headers, ...(['GET', 'HEAD'].includes(req.method) ? {} : { body: Buffer.concat(chunks) }) }))
    res.writeHead(response.status, Object.fromEntries(response.headers)); res.end(await response.text())
  } catch { res.writeHead(500, { 'Cache-Control': 'no-store' }).end() }
})
server.requestTimeout = 20000
server.headersTimeout = 10000
server.listen(Number(process.env.CONEXA_VOICE_PORT || 8787), '127.0.0.1', () => console.log(`Conexa voice broker: ${config ? 'habilitado para início manual' : 'desabilitado; nenhuma API chamada'}.`))
async function shutdown() {
  server.close()
  await broker?.shutdown()
  ledger?.close()
  if (lock) { await lock.close(); await unlink(resolve(directory, 'server.lock')) }
}
process.once('SIGINT', () => { void shutdown() })
process.once('SIGTERM', () => { void shutdown() })
