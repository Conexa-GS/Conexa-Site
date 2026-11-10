const requiredServices = ['fuel', 'tolls', 'pickups', 'unloading']

// Strict comparability: no cheaper-freight claim across different itineraries or services.
export function comparableQuotes(load, now = Date.now()) {
  const groups = new Map()
  const weightKnown = load.items.length > 0 && load.items.every(i => i.unit === 'kg')
  const minimumsPreserved = load.items.every(i => Number(i.gross_cents) >= Number(i.minimum_cents))
  if (!weightKnown || !minimumsPreserved || !['awaiting_quotes', 'awaiting_final_approval', 'awaiting_payment'].includes(load.status) || !(Date.parse(load.expires_at) > now)) return []
  const subtotal = load.items.reduce((sum, i) => sum + Number(i.gross_cents), 0)
  for (const quote of load.quotes) {
    if (quote.status !== 'confirmed' || quote.load_version !== load.version || !(Date.parse(quote.expires_at) > now)
      || !quote.departure_address || !quote.departure_time || !quote.delivery_time || !quote.conservation_required
      || !requiredServices.every(service => quote.services_included?.[service] === true)) continue
    const key = JSON.stringify([quote.departure_address, quote.return_address || null,
      Date.parse(quote.departure_time), Date.parse(quote.delivery_time), quote.conservation_required,
      Object.entries(quote.services_included).sort(([a], [b]) => a.localeCompare(b))])
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push({ ...quote, buyerTotal: subtotal + Number(quote.total_cents) })
  }
  return [...groups.values()].map(quotes => quotes.sort((a, b) => a.total_cents - b.total_cents || a.id.localeCompare(b.id)))
}
