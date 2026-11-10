import { answerOfferChat, nextOfferChatStep, offerChatSteps, validateChatDraft } from '../../src/domain/offer-chat.js'
import { currency, quantity } from '../../src/domain/offers.js'

// Transport-independent protocol. This module never writes an offer or sends a message.
export function newConversation(id) {
  if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(id)) throw new Error('Identificador de conversa inválido.')
  return { id, revision: 0, status: 'idle', draft: {}, field: null, choices: [] }
}
const result = (state, reply, effect = null) => ({ state, reply, effect })
const token = state => `${state.id}:${state.revision}`
const optionsFor = (field, catalog) => field === 'product_id'
  ? catalog.products.filter(product => product.unit === 'kg').map(product => ({ id: product.id, label: product.name }))
  : field === 'pickup_location_id'
    ? catalog.locations.map(location => ({ id: location.id, label: location.display_address })) : []

function ask(state, field, catalog, prefix = '') {
  const step = offerChatSteps.find(item => item.name === field)
  const choices = optionsFor(field, catalog)
  const lines = [prefix, step.question, step.help]
  if (choices.length) lines.push(...choices.map((choice, index) => `${index + 1}. ${choice.label}`), 'Responda com o número da opção.')
  if (step.optional) lines.push('Digite NÃO SEI para deixar o vencimento desconhecido.')
  lines.push('CANCELAR descarta o rascunho.')
  return result({ ...state, status: 'collecting', field, choices }, lines.filter(Boolean).join('\n'))
}

function preview(state, catalog) {
  const { errors, data } = validateChatDraft(state.draft, catalog)
  const invalid = offerChatSteps.find(step => errors[step.name])
  if (invalid) return ask(state, invalid.name, catalog, errors[invalid.name])
  const next = { ...state, status: 'preview', field: null, choices: [] }
  const product = catalog.products.find(item => item.id === data.product_id)
  const location = catalog.locations.find(item => item.id === data.pickup_location_id)
  return result(next, [
    'PRÉVIA — oferta de demonstração. Ainda não foi publicada.',
    `1. Alimento: ${product.name}`,
    `2. Quantidade: ${quantity(data.quantity_total)} kg`,
    `3. Preço por kg: ${currency(data.unit_price_cents)}`,
    `4. Mínimo líquido por kg: ${currency(data.minimum_net_unit_cents)}`,
    `5. Disponível a partir de: ${data.available_from}`,
    `6. Disponível até: ${data.available_until}`,
    `7. Vencimento: ${data.expires_on || 'não informado'}`,
    `8. Coleta fictícia: ${location.display_address}`,
    'O comprador paga o frete separado. Publicar não confirma uma venda.',
    `Para publicar, responda CONFIRMAR ${token(next)}`,
    'Para alterar, responda CORRIGIR seguido do número do campo. CANCELAR descarta.',
  ].join('\n'))
}

export function advanceConversation(state, text, catalog) {
  const answer = String(text).trim()
  const command = answer.toLocaleUpperCase('pt-BR')
  if (['submitting', 'reconciling'].includes(state.status)) return result(state, 'A publicação está sendo conferida. Aguarde o resultado antes de iniciar outra oferta.')
  if (state.status === 'confirmed') return result(state, 'Esta oferta já teve a publicação confirmada. Inicie uma nova conversa para outra oferta.')
  if (state.status === 'cancelled') return result(state, 'Rascunho descartado. Inicie uma nova conversa para outra oferta.')
  if (command === 'CANCELAR') return result({ ...state, draft: {}, choices: [], field: null, status: 'cancelled', revision: state.revision + 1 }, 'Rascunho descartado. Nenhuma oferta publicada.')
  if (!catalog.products.some(item => item.unit === 'kg') || !catalog.locations.length) return result(state, 'Catálogo ou coleta indisponível para seu perfil. Confira o cadastro no site. Nenhuma oferta publicada.')
  if (state.status === 'idle') {
    if (command !== 'OFERTA') return result(state, 'Conexa — demonstração. Para cadastrar uma oferta por texto, responda OFERTA.')
    return ask(state, offerChatSteps[0].name, catalog)
  }
  if (state.status === 'preview') {
    const correction = command.match(/^CORRIGIR ([1-8])$/)
    if (correction) return ask({ ...state, revision: state.revision + 1 }, offerChatSteps[Number(correction[1]) - 1].name, catalog)
    if (answer !== `CONFIRMAR ${token(state)}`) return result(state, `Use CONFIRMAR ${token(state)}, CORRIGIR 1 a 8 ou CANCELAR. Nenhuma oferta publicada.`)
    // Revalidate against the current catalog and date even if the preview was valid.
    const checked = preview(state, catalog)
    if (checked.state.status !== 'preview') return checked
    const { data } = validateChatDraft(state.draft, catalog)
    return result({ ...state, status: 'submitting' }, 'Confirmação recebida. A publicação ainda aguarda o resultado.', { type: 'publish_offer', idempotencyKey: token(state), data })
  }
  if (command.startsWith('CONFIRMAR')) return result(state, 'Conclua ou corrija as respostas para receber uma nova prévia antes de confirmar.')
  let value = answer
  if (state.choices.length) {
    if (!/^[1-9]\d*$/.test(answer) || !state.choices[Number(answer) - 1]) return result(state, 'Responda com o número de uma das opções apresentadas.')
    value = state.choices[Number(answer) - 1].id
  }
  if (state.field === 'expires_on' && ['NÃO SEI', 'NAO SEI'].includes(command)) value = ''
  const accepted = answerOfferChat(state.draft, state.field, value, catalog)
  if (accepted.error) return result(state, accepted.error)
  const next = { ...state, draft: accepted.draft, revision: state.revision + 1 }
  const index = nextOfferChatStep(next.draft)
  return index === -1 ? preview(next, catalog) : ask(next, offerChatSteps[index].name, catalog)
}

export function settlePublication(state, { offerId, outcome = 'unknown' } = {}) {
  if (!['submitting', 'reconciling'].includes(state.status)) throw new Error('Não há publicação em andamento.')
  if (typeof offerId !== 'string' || !offerId.trim()) {
    if (outcome === 'rejected') return result({ ...state, status: 'preview' }, `A publicação foi recusada sem gravar a oferta. Confira os dados ou repita CONFIRMAR ${token(state)}.`)
    return result({ ...state, status: 'reconciling' }, 'O resultado da publicação ainda não foi confirmado. Aguarde a consulta ao servidor antes de corrigir, cancelar ou tentar outra oferta.')
  }
  return result({ ...state, status: 'confirmed', offerId, draft: {}, choices: [] }, `Publicação confirmada: ${offerId}. Oferta de demonstração; não é venda confirmada.`)
}
