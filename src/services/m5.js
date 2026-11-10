import { isRemote, supabase } from './supabase'
import { m3 } from './m3'

export async function m5(action, payload = {}) {
  if (!isRemote) throw new Error('A M5 precisa do Supabase configurado. Nenhum pagamento é salvo no modo local.')
  const { data, error } = await supabase.rpc('m5', { action, payload })
  if (error) throw new Error(error.code === 'P0001' ? error.message : 'Não foi possível acessar a M5. Confira a conexão e a migration do Supabase; atualize a lista antes de tentar novamente.')
  return data
}

export async function listOperations() {
  if (!isRemote) return { ...await m3('list'), m5Available: false }
  const { data, error } = await supabase.rpc('m5', { action: 'list', payload: {} })
  // A prepared migration must not interrupt the already published M3 flow.
  if (error && ['PGRST202', '42883'].includes(error.code)) return { ...await m3('list'), m5Available: false }
  if (error) throw new Error('Não foi possível carregar as operações. Confira a conexão e tente novamente.')
  return { ...data, m5Available: true }
}
