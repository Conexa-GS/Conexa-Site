import test from 'node:test'
import assert from 'node:assert/strict'
import { comparableQuotes } from '../src/domain/route-analysis.js'

const now = Date.parse('2026-11-08T12:00:00Z')
const quote = { id: 'a', status: 'confirmed', load_version: 1, total_cents: 8000, departure_address: 'Saída fictícia', departure_time: '2026-11-09T10:00:00Z', delivery_time: '2026-11-09T12:00:00Z', expires_at: '2026-11-08T18:00:00Z', conservation_required: 'ambient', services_included: { fuel: true, tolls: true, pickups: true, unloading: true } }
const load = { version: 1, status: 'awaiting_quotes', expires_at: quote.expires_at, items: [{ unit: 'kg', gross_cents: 15000, minimum_cents: 12000 }, { unit: 'kg', gross_cents: 10000, minimum_cents: 9000 }], quotes: [quote, { ...quote, id: 'b', total_cents: 10000 }] }

test('same itinerary and service compare actual full quotes without double-counting tolls', () => {
  const [group] = comparableQuotes(load, now)
  assert.deepEqual(group.map(q => q.buyerTotal), [33000, 35000])
  assert.equal(group[1].total_cents - group[0].total_cents, 2000)
})

test('departure, return, timing, conservation and service changes create separate groups', () => {
  for (const change of [{ departure_address: 'Outra saída' }, { return_address: 'Retorno' }, { departure_time: '2026-11-09T11:00:00Z' }, { delivery_time: '2026-11-09T13:00:00Z' }, { conservation_required: 'refrigerated' }, { services_included: { ...quote.services_included, packing: true } }]) {
    const groups = comparableQuotes({ ...load, quotes: [quote, { ...quote, ...change, id: 'b' }] }, now)
    assert.deepEqual(groups.map(g => g.length), [1, 1])
  }
})

test('unconfirmed, expired, old-version or incomplete quotes cannot support a cost claim', () => {
  const quotes = [{ ...quote, status: 'indicated' }, { ...quote, expires_at: '2026-11-07T10:00:00Z' }, { ...quote, load_version: 0 }, { ...quote, services_included: { fuel: true } }]
  assert.deepEqual(comparableQuotes({ ...load, quotes }, now), [])
  for (const change of [{ status: 'cancelled' }, { expires_at: '2026-11-07T10:00:00Z' }, { items: [{ unit: 'box', gross_cents: 100, minimum_cents: 50 }] }, { items: [{ unit: 'kg', gross_cents: 100, minimum_cents: 101 }] }]) {
    assert.deepEqual(comparableQuotes({ ...load, ...change }, now), [])
  }
})
