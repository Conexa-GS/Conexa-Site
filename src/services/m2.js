import { isRemote, supabase } from './supabase'

export async function m2(action, payload = {}) {
  if (!isRemote) throw new Error('A M2 precisa do Supabase configurado. As operações não são salvas no modo local.')
  const { data, error } = await supabase.rpc('m2', { action, payload })
  if (error) {
    const messages = {
      '23505': 'Já existe uma proposta ativa ou resposta registrada. Atualize a lista; cancele a proposta antes de remontar.',
      '23503': 'Cadastro vinculado ao histórico. Arquive para preservar os dados acordados.',
      '23514': 'Revise quantidade, precisão e prazo: até 3 casas decimais e reserva entre 1 e 168 horas.',
      '23502': 'Preencha todos os campos obrigatórios.',
    }
    throw new Error(messages[error.code] || (error.code === 'P0001' ? error.message : 'Não foi possível acessar a M2. Confira a conexão e a migration do Supabase.'))
  }
  return data
}

export const statusLabel = status => ({ draft: 'Composição candidata', awaiting_producers: 'Aguardando produtores', awaiting_quotes: 'Fornecimentos aceitos · transporte pendente', awaiting_final_approval: 'Aguardando aceites finais', awaiting_payment: 'Aguardando pagamento simulado', scheduled: 'Agendada · simulação', in_transit: 'Em transporte · simulação', delivery_review: 'Entrega em análise · repasses bloqueados', delivered: 'Recebida · repasses simulados', cancelled: 'Cancelada', expired: 'Expirada' })[status] || status
export const timestampLabel = date => new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }).format(new Date(date))
