import { today } from './offers.js'

export function validateDemand(input) {
  const errors = {}
  const amount = String(input.quantity ?? '').trim().replace(',', '.')
  if (!input.product_id) errors.product_id = 'Escolha o alimento e a unidade.'
  if (!/^\d+(\.\d{1,3})?$/.test(amount) || Number(amount) <= 0 || Number(amount) > 1000000) errors.quantity = 'Informe de 0,001 a 1.000.000 kg, com até 3 casas decimais.'
  if (!input.destination_id) errors.destination_id = 'Escolha o destino fictício.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.desired_date || '') || input.desired_date < today()) errors.desired_date = 'Escolha hoje ou uma data futura.'
  return { errors, data: { product_id: input.product_id, quantity: Number(amount), destination_id: input.destination_id, desired_date: input.desired_date } }
}

// Inteiros em milésimos evitam erros ao somar seleções fracionadas.
export function selectionSummary(candidates, selected, demandQuantity) {
  let total = 0
  let valid = true
  const items = []
  for (const offer of candidates) {
    const value = String(selected[offer.id] ?? '0').replace(',', '.')
    if (!/^\d+(\.\d{1,3})?$/.test(value)) { valid = false; continue }
    const amount = Math.round(Number(value) * 1000)
    if (amount > Math.round(Number(offer.quantity_free) * 1000)) valid = false
    total += amount
    if (amount > 0) items.push({ offer_id: offer.id, quantity: amount / 1000 })
  }
  const missing = Math.round(Number(demandQuantity) * 1000) - total
  return { valid, items, selected: total / 1000, missing: missing / 1000, complete: valid && missing === 0 && items.length > 0 }
}
