import test from 'node:test'
import assert from 'node:assert/strict'
import { financialSummary, validateQuoteDates } from '../src/domain/transport.js'

test('financial summary preserves individual minimums, zero fee and separate freight', () => {
  const load = { items:[{producer_id:'ana',producer_name:'Ana',gross_cents:15000,minimum_cents:12000},{producer_id:'joao',producer_name:'João',gross_cents:10000,minimum_cents:9000}],quotes:[{id:'quote',total_cents:8000}],selected_quote_id:'quote' }
  assert.equal(financialSummary(load).total,33000)
  assert.equal(financialSummary(load).minimumsPreserved,true)
  assert.equal(financialSummary({...load,selected_quote_id:null}).total,null)
  assert.equal(financialSummary({...load,items:[load.items[0],{...load.items[1],gross_cents:8999}]}).minimumsPreserved,false)
})

const now = Date.parse('2026-11-09T15:00:00Z')
const load = { scheduled_date: '2026-11-10', expires_at: '2026-11-10T15:00:00Z' }
const dates = { departure_time: '2026-11-10T13:00:00Z', delivery_time: '2026-11-10T16:00:00Z', expires_at: load.expires_at }

test('quote dates accept the reservation boundary and identify each invalid timestamp', () => {
  assert.deepEqual(validateQuoteDates(dates, load, now), {})
  const errors = validateQuoteDates({ departure_time: '2026-11-09T15:00:00Z', delivery_time: '2026-11-11T16:00:00Z', expires_at: '2026-11-10T15:00:01Z' }, load, now)
  assert.deepEqual(Object.keys(errors).sort(), ['delivery_time', 'departure_time', 'expires_at'])
  assert.match(errors.expires_at, /reserva/)
  assert.match(validateQuoteDates({ ...dates, expires_at: '2026-11-09T15:00:00Z' }, load, now).expires_at, /futuro/)
  assert.match(validateQuoteDates({ ...dates, delivery_time: dates.departure_time }, load, now).delivery_time, /depois da saída/)
})

test('quote delivery follows São Paulo date even across UTC midnight', () => {
  assert.deepEqual(validateQuoteDates({ ...dates, delivery_time: '2026-11-11T02:59:00Z' }, load, now), {})
  assert.match(validateQuoteDates({ ...dates, delivery_time: '2026-11-10T02:59:00Z' }, load, now).delivery_time, /São Paulo/)
})

test('quote dates handle missing and malformed inputs without throwing during conversion', () => {
  for (const value of ['', 'invalid']) {
    assert.deepEqual(Object.keys(validateQuoteDates({ departure_time: value, delivery_time: value, expires_at: value }, load, now)).sort(), ['delivery_time', 'departure_time', 'expires_at'])
  }
})
