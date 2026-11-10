import test from 'node:test'
import assert from 'node:assert/strict'
import { compositionAlternatives } from '../src/domain/inclusion.js'

const demand = { product_id: 'lettuce', unit: 'kg', quantity: 50 }
const ana = { id: 'ana', producer_id: 'ana', product_id: 'lettuce', unit: 'kg', quantity_free: 50, unit_price_cents: 500, minimum_net_unit_cents: 400, completed_sales: 4, created_at: '2026-11-01T00:00:00Z' }
const joao = { ...ana, id: 'joao', producer_id: 'joao', quantity_free: 20, unit_price_cents: 600, minimum_net_unit_cents: 550, completed_sales: 0, created_at: '2026-11-02T00:00:00Z' }

test('inclusion prioritizes fewer completed sales and exposes actual food difference without freight', () => {
  const result = compositionAlternatives([ana, joao], demand)
  assert.equal(result.price.subtotal, 25000)
  assert.equal(result.inclusive.subtotal, 27000)
  assert.equal(result.difference, 2000)
  assert.deepEqual(result.inclusive.items.map(i => [i.id, i.quantity]), [['joao', 20], ['ana', 30]])
  assert.ok(result.inclusive.items.every(i => i.gross_cents >= i.minimum_cents))
  assert.equal(result.inclusive.freight, undefined)
})

test('without completed sales, oldest offer breaks ties deterministically; input is preserved', () => {
  const offers = [{ ...ana, completed_sales: 0 }, joao]
  const original = structuredClone(offers)
  assert.equal(compositionAlternatives(offers, demand).inclusive.items[0].id, 'ana')
  assert.deepEqual(offers, original)
  assert.equal(compositionAlternatives([joao, { ...ana, completed_sales: 0 }], demand).inclusive.items[0].id, 'ana')
})

test('incompatible units, product and violated minimum do not fill a demand; shortage stays explicit', () => {
  const result = compositionAlternatives([joao, { ...ana, unit: 'box' }, { ...ana, product_id: 'tomato' }, { ...ana, minimum_net_unit_cents: 501 }], demand)
  assert.equal(result.inclusive.complete, false)
  assert.equal(result.inclusive.missing, 30)
  assert.equal(result.difference, null)
  assert.equal(demand.quantity, 50)
})

test('unknown history is not treated as zero; fractional quantities use line rounding', () => {
  assert.equal(compositionAlternatives([{ ...ana, completed_sales: undefined }], demand), null)
  const result = compositionAlternatives([{ ...ana, quantity_free: 0.003, unit_price_cents: 501 }], { ...demand, quantity: 0.003 })
  assert.equal(result.inclusive.subtotal, 2)
  assert.equal(result.inclusive.items[0].minimum_cents, 1)
  assert.equal(result.inclusive.missing, 0)
})
