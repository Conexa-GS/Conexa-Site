export const conservationLabel = value => ({ ambient: 'Ambiente protegido', refrigerated: 'Refrigerado' })[value] || 'A confirmar'

export const currentQuotes = load => load.quotes.filter(q => q.status === 'confirmed' && !q.superseded_at && q.load_version === load.version).sort((a, b) => (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0) || b.id.localeCompare(a.id))
export function confirmedQuoteFor(load, session) {
  const quotes = currentQuotes(load)
  return session.role === 'carrier' ? quotes.find(q => q.carrier_id === session.id && q.id === load.selected_quote_id) || quotes.find(q => q.carrier_id === session.id) || load.quotes.filter(q => q.status === 'confirmed' && !q.superseded_at && q.carrier_id === session.id).sort((a,b) => b.load_version-a.load_version || (Date.parse(b.created_at) || 0)-(Date.parse(a.created_at) || 0))[0] : quotes.find(q => q.id === load.selected_quote_id) || quotes[0]
}
export const canReviseQuote = (load, quote) => Boolean(quote && !quote.superseded_at && quote.load_version === load.version && ['awaiting_quotes', 'awaiting_final_approval', 'awaiting_payment'].includes(load.status) && (!load.selected_quote_id || load.selected_quote_id === quote.id) && !(load.payments || []).some(p => p.outcome === 'approved'))
export function localDateTime(value) {
  const date = new Date(value)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

// Matches M3's timestamps and delivery date in São Paulo, regardless of device timezone.
export function validateQuoteDates(input, load, now = Date.now()) {
  const errors = {}
  const departure = new Date(input.departure_time).getTime()
  const delivery = new Date(input.delivery_time).getTime()
  const expiry = new Date(input.expires_at).getTime()
  if (!Number.isFinite(departure)) errors.departure_time = 'Informe a data e o horário de saída.'
  else if (departure <= now) errors.departure_time = 'Escolha uma saída futura; este horário já passou.'
  if (!Number.isFinite(delivery)) errors.delivery_time = 'Informe a data e o horário de entrega.'
  else {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(delivery)
    const part = type => parts.find(p => p.type === type).value
    const date = `${part('year')}-${part('month')}-${part('day')}`
    if (date !== load.scheduled_date) errors.delivery_time = 'A entrega deve ocorrer na data desejada da proposta, considerando o horário de São Paulo.'
    else if (delivery <= departure) errors.delivery_time = 'A entrega precisa ocorrer depois da saída.'
  }
  if (!Number.isFinite(expiry)) errors.expires_at = 'Informe a data e o horário de validade.'
  else if (expiry <= now) errors.expires_at = 'A validade precisa estar no futuro; este prazo já encerrou.'
  else if (expiry > new Date(load.expires_at).getTime()) errors.expires_at = 'A validade da cotação não pode ultrapassar o prazo da reserva exibido abaixo.'
  return errors
}

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
