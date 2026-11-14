import test from 'node:test'
import assert from 'node:assert/strict'
import { producerSales, salesMonths } from '../src/domain/sales.js'
const item = (id, cents) => ({ producer_id: id, gross_cents: cents })
const loads = [
  { id: 'done', scheduled_date: '2026-11-01', status: 'delivered', items: [item('ana', 1200), item('joao', 800)] },
  { id: 'pending', scheduled_date: '2026-11-03', status: 'awaiting_payment', items: [item('ana', 900)] },
  { id: 'cancel', scheduled_date: '2026-11-04', status: 'cancelled', items: [item('ana', 700)] },
  { id: 'other', scheduled_date: '2026-11-05', status: 'delivered', items: [item('joao', 600)] },
  { id: 'old', scheduled_date: '2026-01-01', status: 'delivered', items: [item('ana', 300)] },
]
test('dashboard soma somente itens próprios concluídos, sem propostas pendentes ou canceladas', () => {
  const sales = producerSales(loads, 'ana', '2026-11-01', '2026-11-13')
  assert.equal(sales.gross, 1200)
  assert.equal(sales.completed.length, 1)
  assert.equal(sales.active.length, 1)
  assert.equal(sales.loads.length, 3)
  assert.equal(producerSales([], 'ana').gross, 0)
})
test('gráfico atravessa a virada do ano, preserva meses vazios e valores em centavos', () => {
  const sales = producerSales(loads, 'ana')
  const months = salesMonths(sales.completed, sales.amount, '2026-01-20')
  assert.equal(months[0].key, '2025-08')
  assert.equal(months[0].value, 0)
  assert.equal(months[5].key, '2026-01')
  assert.equal(months[5].value, 300)
})
