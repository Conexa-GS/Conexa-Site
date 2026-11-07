import test from 'node:test'
import assert from 'node:assert/strict'
import { validateDemand, selectionSummary } from '../src/domain/demands.js'
import { futureDate } from '../src/domain/offers.js'

test('demanda exige produto, quantidade precisa, data futura e destino', () => {
  const input = { product_id: 'alface', quantity: '50,125', desired_date: futureDate(3), destination_id: 'raiz' }
  assert.equal(validateDemand(input).data.quantity, 50.125)
  assert.deepEqual(validateDemand(input).errors, {})
  for (const amount of ['0', '-1', '1.0001', '1000001', 'NaN', '']) assert.ok(validateDemand({ ...input, quantity: amount }).errors.quantity)
  assert.equal(Object.keys(validateDemand({}).errors).length, 4)
})
test('composição 30+20 atende 50 e não altera demanda insuficiente', () => {
  const candidates = [{ id: 'ana', quantity_free: 30 }, { id: 'joao', quantity_free: 25 }]
  assert.equal(selectionSummary(candidates, { ana: '30', joao: '20' }, 50).complete, true)
  assert.equal(selectionSummary(candidates, { ana: '30', joao: '10' }, 50).missing, 10)
  assert.equal(selectionSummary(candidates, { ana: '31', joao: '19' }, 50).valid, false)
  assert.equal(selectionSummary(candidates, { ana: '30.0001', joao: '20' }, 50).valid, false)
  assert.equal(selectionSummary([{ id: 'a', quantity_free: 1 }, { id: 'b', quantity_free: 1 }], { a: '0.1', b: '0.2' }, 0.3).complete, true)
})
