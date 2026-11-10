import { isRemote, supabase } from './supabase'

export async function m4(action, payload = {}) {
  if (!isRemote) throw new Error('A análise M4 precisa do Supabase configurado. Nenhum histórico é simulado.')
  const { data, error } = await supabase.rpc('m4', { action, payload })
  if (error) throw new Error(error.code === 'P0001' ? error.message : 'Análise M4 indisponível neste ambiente. Tente novamente mais tarde; a composição e a cotação manual continuam disponíveis.')
  return data
}
