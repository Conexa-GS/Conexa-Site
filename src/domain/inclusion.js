import { lineTotalCents } from './offers.js'

const byId = (a, b) => a.id.localeCompare(b.id)
const byInclusion = (a, b) => a.completed_sales - b.completed_sales
  || new Date(a.created_at) - new Date(b.created_at) || byId(a, b)

function compose(candidates, required, compare) {
  let missing = Math.round(Number(required) * 1000)
  const items = []
  for (const offer of [...candidates].sort(compare)) {
    const amount = Math.min(missing, Math.round(Number(offer.quantity_free) * 1000))
    if (amount <= 0) continue
    const selected = amount / 1000
    items.push({ ...offer, quantity: selected, gross_cents: lineTotalCents(offer.unit_price_cents, selected), minimum_cents: lineTotalCents(offer.minimum_net_unit_cents, selected) })
    missing -= amount
  }
  return { items, missing: missing / 1000, subtotal: items.reduce((sum, i) => sum + i.gross_cents, 0), complete: missing === 0 && items.length > 0 }
}

// Two explainable candidates, never an assertion of a globally optimal solution.
export function compositionAlternatives(candidates, demand) {
  if (!demand) return null
  const compatible = candidates.filter(o => o.unit === demand.unit && o.product_id === demand.product_id
    && Number(o.quantity_free) > 0 && Number(o.unit_price_cents) >= Number(o.minimum_net_unit_cents))
  const historyKnown = compatible.every(o => Number.isInteger(o.completed_sales) && o.completed_sales >= 0 && Number.isFinite(Date.parse(o.created_at)))
  if (!historyKnown) return null
  const price = compose(compatible, demand.quantity, (a, b) => a.unit_price_cents - b.unit_price_cents || byInclusion(a, b))
  const inclusive = compose(compatible, demand.quantity, byInclusion)
  const lowest = price.subtotal <= inclusive.subtotal ? price : inclusive
  return { price, inclusive, lowest, difference: inclusive.complete && price.complete ? inclusive.subtotal - lowest.subtotal : null }
}
