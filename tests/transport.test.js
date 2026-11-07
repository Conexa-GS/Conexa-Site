import test from 'node:test'
import assert from 'node:assert/strict'
import { financialSummary } from '../src/domain/transport.js'

test('financial summary preserves individual minimums, zero fee and separate freight', () => {
  const load = { items:[{producer_id:'ana',producer_name:'Ana',gross_cents:15000,minimum_cents:12000},{producer_id:'joao',producer_name:'João',gross_cents:10000,minimum_cents:9000}],quotes:[{id:'quote',total_cents:8000}],selected_quote_id:'quote' }
  assert.equal(financialSummary(load).total,33000)
  assert.equal(financialSummary(load).minimumsPreserved,true)
  assert.equal(financialSummary({...load,selected_quote_id:null}).total,null)
  assert.equal(financialSummary({...load,items:[load.items[0],{...load.items[1],gross_cents:8999}]}).minimumsPreserved,false)
})
