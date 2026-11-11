import WebSocket from 'ws'

// Only this server module knows the permanent key. No automatic retries.
export function createOpenAIVoice(apiKey, fetcher = fetch) {
  const headers = { Authorization: `Bearer ${apiKey}` }
  return {
    async create(sdp, session) {
      const form = new FormData()
      form.set('sdp', sdp); form.set('session', JSON.stringify(session))
      const response = await fetcher('https://api.openai.com/v1/realtime/calls', { method: 'POST', headers, body: form, signal: AbortSignal.timeout(15000) })
      if (!response.ok) throw new Error('Provedor recusou a sessão. Nenhuma repetição automática foi feita.')
      const id = response.headers.get('location')?.split('/').at(-1)
      if (!/^rtc_[\w-]+$/.test(id || '')) throw new Error('Resposta do provedor sem identificador válido; verifique o consumo antes de tentar novamente.')
      return { id, sdp: await response.text() }
    },
    async hangup(id) {
      const response = await fetcher(`https://api.openai.com/v1/realtime/calls/${encodeURIComponent(id)}/hangup`, { method: 'POST', headers, signal: AbortSignal.timeout(8000) })
      if (!response.ok && response.status !== 404) throw new Error('Encerramento remoto não confirmado.')
    },
    monitor(id, onEvent, onLost) {
      return new Promise((resolve, reject) => {
        const socket = new WebSocket(`wss://api.openai.com/v1/realtime?call_id=${encodeURIComponent(id)}`, { headers, handshakeTimeout: 8000, maxPayload: 512 * 1024 })
        let intentional = false
        socket.on('open', () => resolve({ close() { intentional = true; socket.close() } }))
        socket.on('message', data => {
          try { onEvent(JSON.parse(String(data))) } catch { onLost() }
        })
        socket.on('error', () => { reject(new Error('Falha no controle da sessão.')); if (!intentional) onLost() })
        socket.on('close', () => { if (!intentional) { reject(new Error('Controle de voz encerrado.')); onLost() } })
      })
    },
  }
}
