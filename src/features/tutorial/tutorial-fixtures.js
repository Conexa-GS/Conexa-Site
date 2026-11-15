import { futureDate, today } from '../../domain/offers'

// Fixtures exclusivas da janela. Não são passadas aos serviços da aplicação.
export function tutorialFixtures() {
  const products = [{ id: 'tutorial-tomate', name: 'Tomate', unit: 'kg' }, { id: 'tutorial-alface', name: 'Alface', unit: 'kg' }, { id: 'tutorial-cenoura', name: 'Cenoura', unit: 'kg' }]
  const locations = [{ id: 'tutorial-coleta', display_address: 'Sítio da Ana · local fictício' }]
  const session = { id: 'tutorial-ana', role: 'producer', display_name: 'Ana' }
  const items = [
    { id: 'tutorial-item-ana', offer_id: 'tutorial-offer-ana', producer_id: session.id, producer_name: 'Ana', product_name: 'Tomate', quantity: 30, unit: 'kg', unit_price_cents: 500, gross_cents: 15000, minimum_cents: 12000, pickup_address: locations[0].display_address },
    { id: 'tutorial-item-joao', offer_id: 'tutorial-offer-joao', producer_id: 'tutorial-joao', producer_name: 'João', product_name: 'Tomate', quantity: 20, unit: 'kg', unit_price_cents: 500, gross_cents: 10000, minimum_cents: 9000, pickup_address: 'Sítio do João · local fictício' },
  ]
  const quote = { id: 'tutorial-quote', carrier_id: 'tutorial-carrier', status: 'confirmed', load_version: 1, total_cents: 8000 }
  const load = { id: 'tutorial-carga', version: 1, status: 'awaiting_producers', scheduled_date: futureDate(1), destination_address: 'Mercado · destino fictício', expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), items, confirmations: [], events: [], payments: [], occurrences: [], payouts: [], quotes: [quote], selected_quote_id: quote.id, subtotal_cents: 25000, freight_cents: 8000, total_cents: 33000 }
  const offer = { id: 'tutorial-offer-ana', product_id: products[0].id, quantity_total: 30, unit_price_cents: 500, minimum_net_unit_cents: 400, available_from: today(), available_until: futureDate(3), products: products[0], participants: session, locations: locations[0] }
  const vehicles = [{ id: 'tutorial-vehicle', description: 'Furgão', capacity_kg: 500, conservation_conditions: 'ambient' }]
  return { products, locations, session, load, offer, vehicles }
}
