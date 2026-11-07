import { isRemote, supabase } from './supabase'

export async function m3(action, payload = {}) {
  if (!isRemote) throw new Error('O M3 precisa do Supabase configurado. Nenhum transporte é salvo no modo local.')
  const { data, error } = await supabase.rpc('m3', { action, payload })
  if (error) throw new Error(error.code === 'P0001' ? error.message : error.code === '23505' ? 'Aceite já registrado. Atualize a lista.' : 'Não foi possível salvar. Revise os campos, a conexão e a migration M3.')
  return data
}
