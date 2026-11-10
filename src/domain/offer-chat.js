import { validateOffer } from './offers.js'

export const offerChatSteps = [
  { name: 'product_id', label: 'Alimento', question: 'Qual alimento você quer oferecer?', kind: 'product' },
  { name: 'quantity_total', label: 'Quantidade (kg)', question: 'Quantos kg estão disponíveis?', help: 'Use até 3 casas decimais. Exemplo: 30 ou 2,500.', kind: 'decimal' },
  { name: 'price', label: 'Preço de venda por kg (R$)', question: 'Qual é o preço de venda por kg?', help: 'Informe em reais, sem R$. Exemplo: 5,00.', kind: 'decimal' },
  { name: 'minimum', label: 'Mínimo líquido por kg (R$)', question: 'Qual é o mínimo que você aceita receber por kg?', help: 'O frete é pago pelo comprador. Este mínimo não pode superar seu preço de venda.', kind: 'decimal' },
  { name: 'available_from', label: 'Disponível a partir de', question: 'A partir de qual dia podemos coletar?', help: 'Digite dia/mês/ano, por exemplo 20/11/2026. Também aceitamos AAAA-MM-DD.', kind: 'date' },
  { name: 'available_until', label: 'Disponível até', question: 'Até qual dia a oferta estará disponível?', help: 'Use dia/mês/ano. Pode ser o mesmo dia do início.', kind: 'date' },
  { name: 'expires_on', label: 'Vencimento do produto', question: 'Você sabe o vencimento do produto?', help: 'Opcional: use dia/mês/ano ou escolha Não sei informar. Disponibilidade não é vencimento.', kind: 'date', optional: true },
  { name: 'pickup_location_id', label: 'Coleta fictícia', question: 'Em qual local fictício será a coleta?', kind: 'location' },
]

// No inference, external AI or default dates: every answer is supplied explicitly.
function normalizeDate(answer) {
  const brazilian = answer.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  const iso = brazilian ? `${brazilian[3]}-${brazilian[2]}-${brazilian[1]}` : answer
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
  const date = new Date(`${iso}T12:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === iso ? iso : null
}

export function validateChatDraft(draft, catalog) {
  const result = validateOffer(draft)
  if (!catalog.products.some(p => p.id === draft.product_id && p.unit === 'kg')) result.errors.product_id = 'Escolha um alimento em kg do catálogo.'
  if (!catalog.locations.some(l => l.id === draft.pickup_location_id)) result.errors.pickup_location_id = 'Escolha um local de coleta do seu perfil.'
  for (const name of ['available_from', 'available_until', 'expires_on']) {
    if ((draft[name] || name !== 'expires_on') && !normalizeDate(String(draft[name] || ''))) result.errors[name] = 'Informe uma data existente em dia/mês/ano.'
  }
  return result
}

export function answerOfferChat(draft, name, answer, catalog) {
  const step = offerChatSteps.find(item => item.name === name)
  if (!step) throw new Error('Pergunta de oferta desconhecida.')
  const text = String(answer).trim()
  const value = step.kind === 'date' && text ? normalizeDate(text) : text
  if (value === null) return { error: 'Informe uma data existente em dia/mês/ano.', draft }
  const next = { ...draft, [name]: value }
  const { errors } = validateChatDraft(next, catalog)
  const error = errors[name] || (name === 'minimum' ? errors.price : '')
  if (error) return { error, draft }
  return { error: '', draft: next }
}

export function nextOfferChatStep(draft) {
  return offerChatSteps.findIndex(step => !Object.hasOwn(draft, step.name))
}
