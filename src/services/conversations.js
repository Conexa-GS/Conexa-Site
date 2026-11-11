import { supabase } from './supabase'

async function request(action, payload = {}) {
  if (!supabase) throw new Error('Conversas precisam do Supabase demo configurado. Não há histórico local persistente.')
  const { data, error } = await supabase.rpc('site_chat', { p_action: action, p_payload: payload })
  if (error) {
    if (['PGRST202', '42883'].includes(error.code)) throw new Error('Conversas ainda não estão habilitadas neste demo. A nova migration aguarda aplicação e validação autorizadas.')
    throw new Error(error.message)
  }
  return data
}

export const conversationService = {
  inbox: () => request('inbox'),
  openDirect: peerId => request('open_direct', { peer_id: peerId }),
  messages: (id, before, after) => request('messages', { conversation_id: id, ...(before ? { before_seq: before } : {}), ...(after ? { after_seq: after } : {}) }),
  send: (id, key, body) => request('send', { conversation_id: id, client_send_id: key, body }),
  read: (id, seq) => request('read', { conversation_id: id, seq }),
  subscribe(participantId, refresh) {
    if (!supabase) return () => {}
    const channel = supabase.channel(`site-chat-${participantId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'site_messages' }, refresh)
      .subscribe(status => { if (status === 'SUBSCRIBED') refresh() })
    // Reconcilia também ao voltar à aba/rede e quando o websocket perder eventos.
    const visible = () => { if (document.visibilityState === 'visible') refresh() }
    window.addEventListener('online', refresh)
    window.addEventListener('focus', visible)
    document.addEventListener('visibilitychange', visible)
    const interval = window.setInterval(visible, 30000)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('online', refresh)
      window.removeEventListener('focus', visible)
      document.removeEventListener('visibilitychange', visible)
      void supabase.removeChannel(channel)
    }
  },
}
