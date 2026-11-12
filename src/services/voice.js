import { supabase } from './supabase'
import { createVoiceTransport } from './voice-transport'

// Explicit public switch only. Permanent credentials belong to .env.voice.
export const voiceEnabled = import.meta.env.VITE_CONEXA_VOICE_ENABLED === 'true'

async function request(method, id, body) {
  const { data } = supabase ? await supabase.auth.getSession() : { data: {} }
  if (!data.session?.access_token) throw new Error('Entre em uma conta demo conectada.')
  const response = await fetch(`/api/voice/sessions${id ? `/${encodeURIComponent(id)}` : ''}`, {
    method, headers: { Authorization: `Bearer ${data.session.access_token}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(20000),
  })
  const result = await response.json()
  if (!response.ok) throw Object.assign(new Error(result.error || 'Serviço de voz indisponível.'), { publicMessage: result.error || 'Serviço de voz indisponível.' })
  return result
}
export const voiceService = createVoiceTransport({
  api: { start: body => request('POST', null, body), close: id => request('DELETE', id), status: id => request('GET', id) },
  media: () => navigator.mediaDevices.getUserMedia({ audio: true }),
  peer: () => new RTCPeerConnection(),
})
