import { randomUUID } from 'node:crypto'
import { voiceSessionConfig } from './voice-policy.mjs'

// Provider and authentication are injected so tests can NEVER call a paid API.
export function createVoiceBroker({ config, authenticate, ledger, provider, now = Date.now, schedule = setTimeout, unschedule = clearTimeout }) {
  const sessions = new Map()
  let healthy = true
  async function end(session, reason = 'Sessão encerrada.') {
    if (session.ending) return session.ending
    session.active = false; session.reason = reason
    unschedule(session.timer)
    session.monitor?.close()
    session.ending = (async () => {
      try {
        if (!session.callId) { healthy = false; throw new Error('Resultado da criação desconhecido.') }
        await provider.hangup(session.callId)
        ledger.end(session.id)
      } catch {
        // Never issue another paid session if server-side hangup is uncertain.
        healthy = false
        throw new Error('Encerramento remoto a verificar. Voz bloqueada no servidor.')
      }
    })()
    return session.ending
  }
  const stop = (s, reason) => { void end(s, reason).catch(() => {}) }
  function owned(id, owner) {
    const session = sessions.get(id)
    if (!session || session.owner !== owner) throw new Error('Sessão de voz indisponível.')
    return session
  }
  return {
    async recover() {
      for (const lease of ledger.active()) {
        if (lease.call_id) await provider.hangup(lease.call_id)
        // Unknown outcome during create must be inspected manually; no replay.
        else throw new Error('Tentativa de voz sem ID remoto. Verifique no provedor antes de liberar o registro.')
        ledger.end(lease.id)
      }
    },
    async start(token, input) {
      if (!config || !healthy) throw new Error('Voz indisponível. Continue pelo texto simulado.')
      if (!input || typeof input.sdp !== 'string' || !input.sdp.startsWith('v=0') || input.sdp.length > 64000 || !/^[\w-]{1,80}$/.test(input.conversation_id || '')) throw new Error('Pedido de sessão inválido.')
      const context = await authenticate(token, input.conversation_id)
      if (!['producer', 'buyer'].includes(context.role)) throw new Error('Perfil sem acesso ao bot.')
      const session = { ...ledger.reserve(context.id, config, now()), active: true, responses: new Set() }
      sessions.set(session.id, session)
      session.timer = schedule(() => stop(session, 'Limite de duração atingido.'), Math.max(0, session.expires - now()))
      try {
        const call = await provider.create(input.sdp, voiceSessionConfig(config, context))
        session.callId = call.id; ledger.attach(session.id, call.id)
        if (!session.active || now() >= session.expires) {
          // Create completed after timeout: still hang up the newly returned ID.
          session.ending = null
          await end(session); throw new Error('Tempo de conexão esgotado.')
        }
        session.monitor = await provider.monitor(call.id, event => {
          if (!session.active) return
          if (event.type === 'response.created') {
            session.responses.add(event.response?.id || randomUUID())
            if (session.responses.size > config.responses) stop(session, 'Limite de respostas atingido.')
          }
          if (event.type === 'response.done' && session.responses.size >= config.responses) stop(session, 'Limite de respostas atingido.')
          if (event.type === 'session.updated') stop(session, 'Configuração alterada; inicie outra sessão manualmente.')
          if (event.type === 'error') stop(session, 'Falha no provedor; continue por texto.')
        }, () => stop(session, 'Conexão de controle encerrada.'))
        if (!session.active) { session.monitor.close(); throw new Error('Sessão encerrada durante a conexão.') }
        return { id: session.id, sdp: call.sdp, expires_at: session.expires, max_responses: config.responses }
      } catch (error) {
        // Failed creates may have reached the provider. Block rather than retry.
        if (!session.callId) { healthy = false; session.active = false; unschedule(session.timer) }
        else await end(session)
        throw error
      }
    },
    async status(token, id) {
      const context = await authenticate(token)
      const session = owned(id, context.id)
      return { active: session.active, reason: session.reason || '', expires_at: session.expires }
    },
    async close(token, id) {
      const context = await authenticate(token)
      await end(owned(id, context.id))
      return { active: false }
    },
    async shutdown() { await Promise.allSettled([...sessions.values()].filter(s => s.active).map(s => end(s))) },
  }
}
