import { offerChatSteps, answerOfferChat, validateChatDraft } from './offer-chat.js'

const plain = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
export const offerFields = offer => ({ product_id: offer.product_id, quantity_total: String(offer.quantity_total), price: (offer.unit_price_cents / 100).toFixed(2), minimum: (offer.minimum_net_unit_cents / 100).toFixed(2), available_from: offer.available_from, available_until: offer.available_until, expires_on: offer.expires_on || '', pickup_location_id: offer.pickup_location_id })

export function botQuestion(draft, catalog) {
  if (draft?.status === 'applied') return 'Alteração já aplicada. Escreva consultar ou inicie um novo pedido com criar, editar ou arquivar.'
  if (draft?.status === 'conflict') return 'O rascunho foi preservado. Corrija os campos necessários ou prepare nova prévia antes de confirmar.'
  if (!draft || !['create', 'edit', 'archive'].includes(draft.intent)) return 'Escreva consultar, criar oferta, editar alimento ou arquivar alimento. Exemplo: editar alface.'
  if (draft.intent !== 'create' && !draft.target_id) return 'Escolha uma oferta abaixo. Se houver mais de uma do mesmo alimento, confira o identificador.'
  if (draft.intent === 'archive') return 'Confira a oferta e confirme o arquivamento na prévia. O histórico será preservado.'
  const missing = offerChatSteps.find(step => !Object.hasOwn(draft.fields, step.name))
  if (missing?.name === 'quantity_total') return 'Qual é a quantidade total ofertada em kg? O total inclui reservas e compromissos. Informe o número, por exemplo 20.'
  if (missing) return `${missing.question}${missing.help ? ` ${missing.help}` : ''}`
  const { errors } = validateChatDraft(draft.fields, catalog)
  return Object.values(errors)[0] || 'Confira os campos antes/depois e confirme esta revisão na prévia. Quantidade significa o total ofertado, incluindo reservas e compromissos.'
}

// Interpretador determinístico: intenções delimitadas, sem modelo externo.
// Nunca interpreta "sim" como autorização. A confirmação pertence ao botão versionado.
export function interpretSiteBot(text, context) {
  const value = text.trim(), normalized = plain(value)
  const { role, offers, catalog } = context
  const previous = context.draft
  if (/^(cancelar|descartar)$/.test(normalized)) return { intent: 'cancel', fields: {}, target_id: null, reply: 'Rascunho descartado. Nenhuma oferta foi alterada.' }
  if (/^(consultar|listar|minhas ofertas|ofertas)( ofertas)?$/.test(normalized)) return { intent: 'consult', fields: {}, target_id: null, reply: 'Consulte as ofertas abaixo. Publicação não significa venda confirmada.' }
  if (role !== 'producer') return { error: 'Você pode consultar ofertas. Para comprar, use demandas e composição; somente o produtor altera suas ofertas.' }
  if (/^(sim|confirmar|ok|pode salvar)$/.test(normalized)) return { error: 'Revise a prévia e use Confirmar revisão. Uma resposta solta não autoriza publicação.' }
  let draft = previous && ['draft', 'conflict'].includes(previous.status) && ['create', 'edit', 'archive'].includes(previous.intent) ? { ...previous, fields: { ...previous.fields } } : null
  const start = normalized.replace(/^minha oferta(?: de)?\s+/, 'editar ').match(/^(criar|nova|editar|atualizar|arquivar)\b(.*)$/)
  if (start) {
    const intent = /^(criar|nova)$/.test(start[1]) ? 'create' : start[1] === 'arquivar' ? 'archive' : 'edit'
    draft = { intent, fields: {}, target_id: null }
    const matches = offers.filter(offer => normalized.includes(plain(offer.products?.name || '___')) || value.includes(offer.id))
    if (intent !== 'create' && matches.length === 1) {
      draft.target_id = matches[0].id; draft.fields = offerFields(matches[0])
    }
    if (intent === 'create') {
      const product = catalog.products.filter(product => normalized.includes(plain(product.name)))
      if (product.length === 1) draft.fields.product_id = product[0].id
    }
  }
  if (!draft) return { error: botQuestion(null, catalog) }
  if (draft.intent !== 'create' && !draft.target_id) return { ...draft, reply: botQuestion(draft, catalog) }
  if (draft.intent === 'archive') return { ...draft, reply: botQuestion(draft, catalog) }
  // Valores explícitos: total, preço, mínimo e datas. Sem inferência de saldo ou datas relativas.
  if (/\b(hoje|amanha|semana|mes que vem)\b/.test(normalized)) return { error: 'Informe a data exata em dia/mês/ano para evitar ambiguidade (horário de São Paulo).' }
  const amount = normalized.match(/(?:total(?: de)?|quantidade(?: total)?(?: de)?|tenho|tem)\s*(\d+(?:[.,]\d+)?)\s*kg\b/)
  if ((amount || /\bsaldo\b.*\d/.test(normalized)) && !/\btotal\b/.test(normalized)) return { error: 'Essa quantidade é o total ofertado ou o saldo livre? Escreva total 20 kg. O total inclui quantidades reservadas e comprometidas.' }
  const price = normalized.match(/(?:preco(?: de)?|quilo(?: fica)?(?: a)?|kg(?: fica)?(?: a)?)\s*(?:r\$\s*)?(\d+(?:[.,]\d+)?)/)
  const minimum = normalized.match(/minimo(?: de)?\s*(?:r\$\s*)?(\d+(?:[.,]\d+)?)/)
  const updates = { ...(amount ? { quantity_total: amount[1] } : {}), ...(price ? { price: price[1] } : {}), ...(minimum ? { minimum: minimum[1] } : {}) }
  const named = normalized.match(/^(alimento|quantidade|preco|minimo|inicio|fim|vencimento|coleta)\s*:\s*(.+)$/)
  const names = { alimento: 'product_id', quantidade: 'quantity_total', preco: 'price', minimo: 'minimum', inicio: 'available_from', fim: 'available_until', vencimento: 'expires_on', coleta: 'pickup_location_id' }
  let field = named ? names[named[1]] : null
  let answer = named ? value.slice(value.indexOf(':') + 1).trim() : value
  if (!start && !field && !Object.keys(updates).length) field = offerChatSteps.find(step => !Object.hasOwn(draft.fields, step.name))?.name
  if (field) {
    if (field === 'product_id' || field === 'pickup_location_id') {
      const options = field === 'product_id' ? catalog.products : catalog.locations
      const matches = options.filter(option => option.id === answer || plain(option.name || option.display_address) === plain(answer))
      if (matches.length !== 1) return { error: 'Escolha uma opção do catálogo abaixo.' }
      answer = matches[0].id
    }
    if (field === 'expires_on' && /^(nao sei|desconhecido|nao sei informar)$/.test(plain(answer))) answer = ''
    updates[field] = answer
  }
  for (const [name, answer] of Object.entries(updates)) {
    const result = answerOfferChat(draft.fields, name, answer, catalog)
    if (result.error) return { error: result.error }
    draft.fields = result.draft
  }
  if (!start && !Object.keys(updates).length) return { error: 'Não entendi essa alteração. Use total 20 kg, preço 7,00, mínimo 4,00 ou campo: valor (início, fim, vencimento, coleta, alimento).' }
  return { ...draft, reply: botQuestion(draft, catalog) }
}

export function canConfirmBot(draft, catalog) {
  if (!draft || draft.status !== 'draft') return false
  if (draft.intent === 'archive') return Boolean(draft.target_id)
  return ['create', 'edit'].includes(draft.intent) && !offerChatSteps.some(step => !Object.hasOwn(draft.fields, step.name)) && !Object.keys(validateChatDraft(draft.fields, catalog).errors).length
}
