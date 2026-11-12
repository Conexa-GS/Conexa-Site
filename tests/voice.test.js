import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { setImmediate } from 'node:timers'
import { createVoiceLedger } from '../server/voice-ledger.mjs'
import { createVoiceBroker } from '../server/voice-broker.mjs'
import { createVoiceHandler } from '../server/voice-http.mjs'
import { readVoiceConfig, voiceSessionConfig } from '../server/voice-policy.mjs'
import { createVoiceTransport } from '../src/services/voice-transport.js'
import { voiceProposal } from '../src/domain/voice.js'
import { createOpenAIVoice } from '../server/openai-voice.mjs'

const config = { duration: 60, daily: 2, responses: 2, outputTokens: 256, model: 'fixture-model', transcriptionModel: 'fixture-transcription', origin: 'http://localhost:5173' }
const input = { conversation_id: 'bot-ana', sdp: 'v=0\r\nfixture' }
const defer = () => { let resolve; const promise = new Promise(r => { resolve = r }); return { promise, resolve } }

async function backend(overrides = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'conexa-voice-'))
  const file = join(dir, 'quota.sqlite')
  const ledger = createVoiceLedger(file)
  const hangups = [], timers = []
  let calls = 0, event, lost
  const provider = {
    async create() { return { id: `rtc_fixture${++calls}`, sdp: 'v=0\r\nanswer' } },
    async hangup(id) { hangups.push(id) },
    async monitor(id, handler, onLost) { event = handler; lost = onLost; return { close() {} } },
    ...overrides,
  }
  const authenticate = async (token, cid) => {
    if (token === 'invalid' || (cid && cid !== 'bot-ana')) throw new Error('Acesso negado')
    return { id: token, role: token === 'carrier' ? 'carrier' : 'producer' }
  }
  const broker = createVoiceBroker({ config, authenticate, ledger, provider, schedule: fn => { timers.push(fn); return timers.length }, unschedule() {} })
  return { broker, ledger, file, hangups, timers, get calls() { return calls }, event: e => event(e), lost: () => lost(),
    async dispose() {
      await broker.shutdown(); ledger.close()
      if (!resolve(dir).startsWith(resolve(join(tmpdir(), 'conexa-voice-')))) throw new Error('Unexpected voice test directory')
      await rm(dir, { recursive: true, force: true })
    } }
}

test('Voz: desligada por padrão, configuração exige limites e só ferramenta propositiva', () => {
  assert.equal(readVoiceConfig({}), null)
  assert.throws(() => readVoiceConfig({ CONEXA_VOICE_ENABLED: 'true' }), /OPENAI_API_KEY/)
  const session = voiceSessionConfig(config, { role: 'buyer', messages: ['private DM'], key: 'secret' })
  assert.equal(session.max_output_tokens, 256)
  assert.deepEqual(session.tools.map(t => t.name), ['propose_offer_command'])
  assert.doesNotMatch(JSON.stringify(session), /private DM|secret/)
  assert.throws(() => voiceProposal({ type: 'response.function_call_arguments.done', name: 'confirm', arguments: '{}' }), /Ferramenta/)
  assert.throws(() => voiceProposal({ type: 'response.function_call_arguments.done', name: 'propose_offer_command', arguments: '{"command":"consultar","confirm":true}' }), /inválida/)
})

test('Voz backend: autenticação, vínculo do bot e isolamento de encerramento', async () => {
  const b = await backend()
  try {
    await assert.rejects(b.broker.start('invalid', input))
    await assert.rejects(b.broker.start('carrier', input))
    await assert.rejects(b.broker.start('ana', { ...input, conversation_id: 'bot-outro' }))
    assert.equal(b.calls, 0)
    const session = await b.broker.start('ana', input)
    await assert.rejects(b.broker.close('joao', session.id))
    assert.equal((await b.broker.status('ana', session.id)).active, true)
    await b.broker.close('ana', session.id)
    assert.equal(b.hangups.length, 1)
    await b.broker.close('ana', session.id)
    assert.equal(b.hangups.length, 1)
  } finally { await b.dispose() }
})

test('Voz backend: sessões concorrentes, teto diário durável e duração no servidor', async () => {
  const b = await backend()
  try {
    const attempts = await Promise.allSettled([b.broker.start('ana', input), b.broker.start('ana', input)])
    assert.equal(attempts.filter(a => a.status === 'fulfilled').length, 1)
    assert.equal(b.calls, 1)
    const first = attempts.find(a => a.status === 'fulfilled').value
    b.timers[0](); await new Promise(resolve => setImmediate(resolve))
    assert.equal((await b.broker.status('ana', first.id)).active, false)
    assert.deepEqual(b.hangups, ['rtc_fixture1'])
    const second = await b.broker.start('ana', input)
    await b.broker.close('ana', second.id)
    await assert.rejects(b.broker.start('ana', input), /diário/)
    const reopened = createVoiceLedger(b.file)
    try { assert.throws(() => reopened.reserve('ana', config), /diário/) } finally { reopened.close() }
  } finally { await b.dispose() }
})

test('Voz backend: limite de respostas, perda de controle e configuração alterada encerram a chamada', async () => {
  const b = await backend()
  try {
    const session = await b.broker.start('ana', input)
    for (const id of ['one', 'one', 'two']) b.event({ type: 'response.created', response: { id } })
    assert.equal((await b.broker.status('ana', session.id)).active, true)
    b.event({ type: 'response.done' }); await new Promise(resolve => setImmediate(resolve))
    assert.equal((await b.broker.status('ana', session.id)).active, false)
    await b.broker.start('joao', input); b.lost()
    await new Promise(resolve => setImmediate(resolve))
    await b.broker.start('buyer', input); b.event({ type: 'session.updated' })
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(b.hangups.length, 3)
  } finally { await b.dispose() }
})

test('Voz backend: criação incerta bloqueia repetição e reserva sem ID não é liberada no reinício', async () => {
  const b = await backend({ async create() { throw new Error('lost response') } })
  try {
    await assert.rejects(b.broker.start('ana', input))
    await assert.rejects(b.broker.start('ana', input), /indisponível/)
    assert.equal(b.ledger.active().length, 1)
    await assert.rejects(b.broker.recover(), /sem ID remoto/)
  } finally { await b.dispose() }
})

test('Voz HTTP: origem, autenticação e desligamento impedem chamar o provedor', async () => {
  const b = await backend()
  const handler = createVoiceHandler({ config, broker: b.broker })
  const req = (origin, auth) => new Request('http://local/api/voice/sessions', { method: 'POST', headers: { Origin: origin, ...(auth ? { Authorization: `Bearer ${auth}` } : {}), 'Content-Type': 'application/json' }, body: JSON.stringify(input) })
  try {
    assert.equal((await handler(req('http://evil', 'ana'))).status, 403)
    assert.equal((await handler(req(config.origin))).status, 401)
    assert.equal((await createVoiceHandler({})(req(config.origin, 'ana'))).status, 503)
    assert.equal(b.calls, 0)
    const response = await handler(req(config.origin, 'ana'))
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.doesNotMatch(await response.text(), /api_key|Bearer|rtc_fixture/)
  } finally { await b.dispose() }
})

test('Voz backend: criação tardia é encerrada e falha no hangup bloqueia novas sessões', async () => {
  const response = defer()
  const b = await backend({ create: () => response.promise })
  try {
    const starting = b.broker.start('ana', input)
    await new Promise(resolve => setImmediate(resolve))
    b.timers[0](); await new Promise(resolve => setImmediate(resolve))
    response.resolve({ id: 'rtc_late', sdp: 'answer' })
    await assert.rejects(starting, /esgotado/)
    assert.deepEqual(b.hangups, ['rtc_late'])
    assert.equal(b.ledger.active().length, 0)
  } finally { await b.dispose() }
  const c = await backend({ async hangup() { throw new Error('timeout') } })
  try {
    const session = await c.broker.start('ana', input)
    await assert.rejects(c.broker.close('ana', session.id), /verificar/)
    await assert.rejects(c.broker.start('joao', input), /indisponível/)
    assert.equal(c.ledger.active().length, 1)
  } finally { await c.dispose() }
})

test('OpenAI adapter: unified SDP e hangup com fetch simulado, sem credencial no retorno', async () => {
  const requests = []
  const provider = createOpenAIVoice('fixture-secret', async (url, options) => {
    requests.push({ url, options })
    return options.body ? new Response('v=0\r\nanswer', { headers: { Location: 'https://api.openai.com/v1/realtime/calls/rtc_fixture' } }) : new Response(null)
  })
  const result = await provider.create(input.sdp, voiceSessionConfig(config, { role: 'producer' }))
  assert.deepEqual(result, { id: 'rtc_fixture', sdp: 'v=0\r\nanswer' })
  assert.equal(requests[0].options.headers.Authorization, 'Bearer fixture-secret')
  assert.equal(requests[0].options.body.get('sdp'), input.sdp)
  assert.equal(JSON.parse(requests[0].options.body.get('session')).model, 'fixture-model')
  await provider.hangup(result.id)
  assert.match(requests[1].url, /rtc_fixture\/hangup$/)
  assert.doesNotMatch(JSON.stringify(result), /fixture-secret/)
})

function browser(overrides = {}) {
  const states = [], transcripts = [], suggestions = [], replies = [], sent = [], closed = [], timers = []
  let mic = 0, stopped = 0, peers = 0, polls
  const channel = { readyState: 'open', send: text => sent.push(JSON.parse(text)), close() {} }
  const pc = { connectionState: 'connected', createDataChannel: () => channel, addTrack() {}, addTransceiver() {}, async createOffer() { return { sdp: input.sdp } }, async setLocalDescription() {}, async setRemoteDescription() {}, close() {} }
  const api = { async start() { return { id: 'lease', sdp: 'answer', expires_at: Date.now() + 60000, max_responses: 4 } }, async close(id) { closed.push(id) }, async status() { return { active: true } }, ...overrides.api }
  const service = createVoiceTransport({ api, media: overrides.media || (async () => { mic++; return { getTracks: () => [{ stop() { stopped++ } }] } }), peer: () => { peers++; return pc }, schedule: fn => { timers.push(fn); return timers.length }, unschedule() {}, repeat: fn => { polls = fn; return 1 }, unrepeat() {} })
  return { states, transcripts, suggestions, replies, sent, closed, timers, pc, channel, get mic() { return mic }, get stopped() { return stopped }, get peers() { return peers }, poll: () => polls(),
    start: mode => service.start({ conversationId: 'bot-ana', mode, onState: state => states.push(state), onTranscript: t => transcripts.push(t), onSuggestion: t => suggestions.push(t), onReply: t => replies.push(t) }),
    event: event => channel.onmessage({ data: JSON.stringify(event) }),
  }
}

test('Voz navegador: importa sem microfone, início explícito, sugestão não executa e cleanup único', async () => {
  const b = browser()
  assert.equal(b.mic, 0); assert.equal(b.peers, 0)
  const control = await b.start('voice')
  assert.equal(b.mic, 1)
  const suggestion = { event_id: 'one', type: 'response.function_call_arguments.done', name: 'propose_offer_command', call_id: 'proposal', arguments: '{"command":"editar alface total 20 kg"}' }
  b.event(suggestion); b.event(suggestion)
  b.event({ type: 'conversation.item.input_audio_transcription.completed', transcript: 'total vinte quilos' })
  assert.deepEqual(b.suggestions, ['editar alface total 20 kg'])
  assert.equal(b.transcripts[0], 'total vinte quilos')
  assert.deepEqual(b.sent.map(e => e.type), ['conversation.item.create'])
  await control.stop(); await control.stop()
  assert.equal(b.stopped, 1); assert.deepEqual(b.closed, ['lease'])
  assert.throws(() => control.sendText('sim'), /Aguarde/)
})

test('Voz navegador: texto não pede microfone; falha não reconecta; limite libera mídia', async () => {
  const text = browser()
  const control = await text.start('text')
  assert.equal(text.mic, 0)
  control.sendText('consultar'); assert.deepEqual(text.sent.map(e => e.type), ['conversation.item.create', 'response.create'])
  text.pc.connectionState = 'disconnected'; text.pc.onconnectionstatechange()
  await new Promise(resolve => setImmediate(resolve))
  assert.deepEqual(text.closed, ['lease']); assert.equal(text.peers, 1)
  const voice = browser()
  await voice.start('voice'); voice.timers.at(-1)()
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(voice.stopped, 1); assert.deepEqual(voice.closed, ['lease'])
})

test('Voz navegador: cancelar durante permissão ou SDP libera resultados tardios', async () => {
  const permission = defer()
  let stopped = 0
  const b = browser({ media: () => permission.promise })
  const started = b.start('voice')
  await b.states[0].controls.stop()
  permission.resolve({ getTracks: () => [{ stop() { stopped++ } }] })
  await started
  assert.equal(stopped, 1); assert.equal(b.peers, 0)
  const response = defer()
  const c = browser({ api: { start: () => response.promise } })
  const late = c.start('voice')
  await new Promise(resolve => setImmediate(resolve))
  await c.states[0].controls.stop()
  response.resolve({ id: 'late', sdp: 'answer', expires_at: Date.now() + 60000 })
  await late
  assert.deepEqual(c.closed, ['late'])
  assert.equal(c.states.at(-1).phase, 'closed')
})

test('Voz navegador: permissão negada e ferramenta indevida preservam alternativa por texto', async () => {
  const b = browser({ media: async () => { throw Object.assign(new Error(), { name: 'NotAllowedError' }) } })
  await b.start('voice')
  assert.equal(b.peers, 0); assert.match(b.states.at(-1).reason, /Microfone não permitido/)
  const c = browser()
  await c.start('voice')
  c.event({ type: 'response.function_call_arguments.done', name: 'confirm', arguments: '{}' })
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(c.stopped, 1); assert.deepEqual(c.suggestions, [])
})
