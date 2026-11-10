export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
export function futureDate(days) {
  const date = new Date(`${today()}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}
export const currency = cents => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)
export const quantity = value => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 }).format(value)
export const dateLabel = value => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date(`${value}T12:00:00Z`))
export function centsFromInput(value) {
  const normalized = String(value).trim().replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return NaN
  const [whole, decimals = ''] = normalized.split('.')
  const cents = Number(whole) * 100 + Number(decimals.padEnd(2, '0'))
  return Number.isSafeInteger(cents) ? cents : NaN
}
export function validateOffer(input) {
  const errors = {}
  const amount = String(input.quantity_total ?? '').replace(',', '.')
  if (!input.product_id) errors.product_id = 'Escolha o alimento.'
  if (!/^\d+(\.\d{1,3})?$/.test(amount) || Number(amount) <= 0 || Number(amount) > 1000000) errors.quantity_total = 'Informe uma quantidade entre 0,001 e 1.000.000 kg, com até 3 casas decimais.'
  const price = centsFromInput(input.price)
  const minimum = centsFromInput(input.minimum)
  if (!Number.isFinite(price) || price <= 0 || price > 100000000) errors.price = 'Informe um preço positivo com até 2 casas decimais (máximo R$ 1.000.000).'
  if (!Number.isFinite(minimum) || minimum < 0 || minimum > 100000000) errors.minimum = 'Informe um mínimo válido com até 2 casas decimais.'
  if (Number.isFinite(price) && price < minimum) errors.price = 'O preço de venda deve preservar seu mínimo líquido.'
  if (!input.available_from || input.available_from < today()) errors.available_from = 'Escolha hoje ou uma data futura.'
  if (!input.available_until || input.available_until < input.available_from) errors.available_until = 'A data final deve ser igual ou posterior ao início.'
  if (input.expires_on && (!/^\d{4}-\d{2}-\d{2}$/.test(input.expires_on) || input.expires_on < input.available_until)) errors.expires_on = 'O vencimento deve ser igual ou posterior ao fim da disponibilidade.'
  if (!input.pickup_location_id) errors.pickup_location_id = 'Selecione um local de coleta.'
  return { errors, data: { product_id: input.product_id, quantity_total: Number(amount), unit_price_cents: price, minimum_net_unit_cents: minimum, available_from: input.available_from, available_until: input.available_until, expires_on: input.expires_on || null, pickup_location_id: input.pickup_location_id, status: 'published' } }
}
// Quantidade em milésimos; arredondamento por linha, metade para cima.
export function lineTotalCents(unitCents, amount) {
  const thousandths = Math.round(Number(amount) * 1000)
  const scaled = BigInt(unitCents) * BigInt(thousandths)
  return Number((scaled + 500n) / 1000n)
}
