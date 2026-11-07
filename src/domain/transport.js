export const conservationLabel = value => ({ ambient: 'Ambiente protegido', refrigerated: 'Refrigerado' })[value] || 'A confirmar'

export function financialSummary(load) {
  const producers = Object.values(load.items.reduce((groups, item) => {
    const p = groups[item.producer_id] ||= { id: item.producer_id, name: item.producer_name, gross: 0, minimum: 0 }
    p.gross += Number(item.gross_cents)
    p.minimum += Number(item.minimum_cents)
    return groups
  }, {}))
  const quote = load.quotes.find(q => q.id === load.selected_quote_id)
  const subtotal = producers.reduce((sum, p) => sum + p.gross, 0)
  return { producers, subtotal: Number(load.subtotal_cents ?? subtotal), freight: quote ? Number(load.freight_cents ?? quote.total_cents) : null, total: quote ? Number(load.total_cents ?? (subtotal + Number(quote.total_cents))) : null, minimumsPreserved: producers.every(p => p.gross >= p.minimum) }
}
