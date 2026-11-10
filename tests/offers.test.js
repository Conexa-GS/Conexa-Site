import { test } from 'node:test'
import assert from 'node:assert/strict'
import { centsFromInput, lineTotalCents, validateOffer, today, futureDate } from '../src/domain/offers.js'
const valid = () => ({ product_id: 'alface', quantity_total: '30', price: '5,00', minimum: '4,00', pickup_location_id: 'sitio', available_from: today(), available_until: futureDate(7) })
test('converte BRL em centavos sem arredondar entrada com precisão excessiva', () => {
  assert.equal(centsFromInput('5,05'), 505)
  assert.equal(centsFromInput('0.01'), 1)
  for (const input of ['1,001', '-2', 'Infinity', '', '1e2']) assert.ok(Number.isNaN(centsFromInput(input)))
})
test('arredonda cada linha ao centavo, metade para cima', () => {
  assert.equal(lineTotalCents(500, '30'), 15000)
  assert.equal(lineTotalCents(500, '20'), 10000)
  assert.equal(lineTotalCents(500, '0.001'), 1)
  assert.equal(lineTotalCents(499, '0.001'), 0)
})
test('aceita oferta completa preservando mínimo individual', () => {
  const result = validateOffer(valid())
  assert.deepEqual(result.errors, {})
  assert.equal(result.data.unit_price_cents, 500)
  assert.equal(result.data.quantity_total, 30)
})
test('rejeita quantidade inválida e precisão maior que três casas', () => {
  for (const input of ['0', '-1', '1.0001', 'Infinity', '1000001', '']) assert.ok(validateOffer({ ...valid(), quantity_total: input }).errors.quantity_total)
})
test('mínimo individual não pode ser coberto por preço menor', () => { assert.ok(validateOffer({ ...valid(), price: '3,99', minimum: '4,00' }).errors.price) })
test('campos ausentes e datas invertidas indicam correção', () => {
  const result = validateOffer({ ...valid(), product_id: '', pickup_location_id: '', available_from: futureDate(7), available_until: today() })
  assert.ok(result.errors.product_id); assert.ok(result.errors.pickup_location_id); assert.ok(result.errors.available_until)
})
test('rejeita início no passado, admite o mesmo dia como fim', () => {
  assert.ok(validateOffer({ ...valid(), available_from: '2020-01-01' }).errors.available_from)
  assert.deepEqual(validateOffer({ ...valid(), available_until: today() }).errors, {})
})

test('vencimento é opcional e não pode preceder o fim da disponibilidade', () => {
  assert.equal(validateOffer(valid()).data.expires_on, null)
  assert.equal(validateOffer({ ...valid(), expires_on: futureDate(8) }).data.expires_on, futureDate(8))
  assert.ok(validateOffer({ ...valid(), expires_on: futureDate(6) }).errors.expires_on)
})
