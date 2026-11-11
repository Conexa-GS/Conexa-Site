import { voiceProposal } from '../domain/voice.js'

// One manual start, one negotiation, no retry. Dependencies are replaceable in
// tests; importing this module never requests a microphone or contacts a model.
export function createVoiceTransport({ api, media, peer, schedule = setTimeout, unschedule = clearTimeout, repeat = setInterval, unrepeat = clearInterval, now = Date.now }) {
  return {
    async start({ conversationId, mode, onState, onTranscript, onSuggestion, onReply }) {
      let stopped = false, stream, pc, channel, remote, timer, poll, closing
      const seen = new Set()
      function release() {
        stream?.getTracks().forEach(track => track.stop())
        channel?.close(); pc?.close(); unschedule(timer); unrepeat(poll)
      }
      async function stop(reason = 'Sessão encerrada. Texto simulado disponível.') {
        if (closing) return closing
        stopped = true; release()
        onState({ phase: 'closed', reason })
        closing = remote ? api.close(remote.id).catch(() => { onState({ phase: 'closed', reason: 'Microfone desligado. Encerramento no servidor a verificar; aguarde o limite da sessão.' }) }) : Promise.resolve()
        return closing
      }
      // Expose cleanup synchronously, even while permission/SDP is pending.
      const controls = {
        stop,
        sendText(text) {
          if (stopped || channel?.readyState !== 'open' || !text.trim() || text.length > 2000) throw new Error('Aguarde a conexão ou continue pelo texto simulado.')
          channel.send(JSON.stringify({ type: 'conversation.item.create', item: { type: 'message', role: 'user', content: [{ type: 'input_text', text: text.trim() }] } }))
          channel.send(JSON.stringify({ type: 'response.create' }))
        },
      }
      onState({ phase: 'connecting', controls })
      timer = schedule(() => { void stop('Tempo de conexão esgotado. Inicie novamente apenas quando desejar.') }, 20000)
      try {
        if (mode === 'voice') {
          stream = await media()
          if (stopped) { release(); return controls }
        }
        pc = peer()
        if (stream) stream.getTracks().forEach(track => {
          track.onended = () => { if (!stopped) void stop('Microfone encerrado. Texto simulado disponível.') }
          pc.addTrack(track, stream)
        })
        else pc.addTransceiver('audio', { direction: 'recvonly' })
        channel = pc.createDataChannel('oai-events')
        channel.onmessage = ({ data }) => {
          if (stopped) return
          try {
            if (typeof data !== 'string' || data.length > 32000) throw new Error('Evento inválido do provedor.')
            const event = JSON.parse(data)
            if (event.event_id && seen.has(event.event_id)) return
            if (event.event_id) seen.add(event.event_id)
            const command = voiceProposal(event)
            if (command) {
              onSuggestion(command)
              // Acknowledge only; no follow-up response or mutation is started.
              if (event.call_id) channel.send(JSON.stringify({ type: 'conversation.item.create', item: { type: 'function_call_output', call_id: event.call_id, output: 'Sugestão apresentada para revisão. Nada foi salvo.' } }))
            }
            if (event.type === 'conversation.item.input_audio_transcription.completed' && typeof event.transcript === 'string') onTranscript(event.transcript.slice(0, 2000))
            if (event.type === 'response.output_text.done' && typeof event.text === 'string') onReply(event.text.slice(0, 2000))
            if (event.type === 'error' || event.type === 'conversation.item.input_audio_transcription.failed') void stop('Falha no provedor. Continue por texto; não reconectamos automaticamente.')
          } catch { void stop('Resposta inválida do provedor. Continue pelo texto simulado.') }
        }
        channel.onclose = () => { if (!stopped) void stop('Conexão encerrada. Texto simulado disponível.') }
        pc.onconnectionstatechange = () => {
          if (['failed', 'disconnected', 'closed'].includes(pc.connectionState) && !stopped) void stop('Conexão interrompida. Inicie outra sessão somente por ação explícita.')
        }
        const offer = await pc.createOffer()
        if (stopped) return controls
        await pc.setLocalDescription(offer)
        if (stopped) return controls
        remote = await api.start({ conversation_id: conversationId, sdp: offer.sdp })
        if (stopped) { await api.close(remote.id); return controls }
        if (!remote.id || typeof remote.sdp !== 'string' || !Number.isFinite(remote.expires_at) || remote.expires_at <= now()) throw new Error('Sessão expirada ou inválida.')
        await pc.setRemoteDescription({ type: 'answer', sdp: remote.sdp })
        if (stopped) return controls
        unschedule(timer)
        timer = schedule(() => { void stop('Limite de duração atingido. Texto simulado disponível.') }, remote.expires_at - now())
        let polling = false
        poll = repeat(async () => {
          if (stopped || polling) return
          polling = true
          try {
            const status = await api.status(remote.id)
            if (!status.active) await stop(status.reason || 'Sessão encerrada pelo servidor.')
          } catch { await stop('Não foi possível verificar a sessão. Texto simulado disponível.') }
          finally { polling = false }
        }, 2000)
        onState({ phase: 'active', expires: remote.expires_at, maxResponses: remote.max_responses, controls })
      } catch (error) {
        await stop(error.name === 'NotAllowedError' ? 'Microfone não permitido. Continue por texto.' : error.publicMessage || 'Não foi possível conectar a IA. Continue pelo texto simulado; não houve repetição automática.')
      }
      return controls
    },
  }
}
