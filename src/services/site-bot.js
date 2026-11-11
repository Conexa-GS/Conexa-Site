import { supabase } from './supabase'

async function request(action, payload) {
  if (!supabase) throw new Error('Bot por texto precisa do Supabase demo configurado. Não há persistência local.')
  const { data, error } = await supabase.rpc('site_bot', { p_action: action, p_payload: payload })
  if (['PGRST202', '42883'].includes(error?.code)) throw new Error('Bot por texto aguarda aplicação e validação autorizadas da migration no demo. Use o formulário de ofertas.')
  if (error) throw Object.assign(new Error(error.message), { definitive: error.code === 'P0001' })
  return data
}
export const siteBotService = {
  state: id => request('state', { conversation_id: id }),
  messages: (id, before, after) => request('messages', { conversation_id: id, ...(before ? { before_seq: before } : {}), ...(after ? { after_seq: after } : {}) }),
  turn: payload => request('turn', payload),
  confirm: payload => request('confirm', payload),
}
