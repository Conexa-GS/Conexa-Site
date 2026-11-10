import { isRemote, supabase } from './supabase'

export async function transportUpdates(action, payload = {}) {
  if (!isRemote) {
    if (action === 'list') return { available: false, notifications: [] }
    throw new Error('A modificação precisa do Supabase configurado.')
  }
  const { data, error } = await supabase.rpc('transport_updates', { action, payload })
  if (error && ['PGRST202', '42883'].includes(error.code)) {
    if (action === 'list') return { available: false, notifications: [] }
    throw new Error('A modificação de cotações aguarda atualização do Supabase demo.')
  }
  if (error) throw new Error(error.code === 'P0001' ? error.message : error.code === '23505' ? 'Já existe uma negociação em aberto. Atualize a proposta para consultar a decisão.' : 'Não foi possível acessar as atualizações de transporte. Atualize e tente novamente.')
  return data
}
