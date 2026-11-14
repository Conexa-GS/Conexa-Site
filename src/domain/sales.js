// Resumos somente dos itens próprios; frete e propostas não são receita realizada.
export function producerSales(loads, producerId, start = '', end = '') {
  const own = loads.filter(load => load.items.some(item => item.producer_id === producerId))
  const scoped = own.filter(load => (!start || load.scheduled_date >= start) && (!end || load.scheduled_date <= end))
  const amount = load => load.items.filter(item => item.producer_id === producerId).reduce((sum, item) => sum + Number(item.gross_cents), 0)
  const completed = scoped.filter(load => load.status === 'delivered')
  const active = scoped.filter(load => !['draft', 'delivered', 'cancelled', 'expired'].includes(load.status))
  return { loads: scoped, completed, active, gross: completed.reduce((sum, load) => sum + amount(load), 0), amount }
}
export function salesMonths(loads, amount, end) {
  const [year, month] = end.split('-').map(Number)
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 6 + index, 1))
    const key = date.toISOString().slice(0, 7)
    return { key, label: new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' }).format(date).replace('.', ''), value: loads.filter(load => load.scheduled_date?.startsWith(key)).reduce((sum, load) => sum + amount(load), 0) }
  })
}
