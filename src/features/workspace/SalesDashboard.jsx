import { useState } from 'react'
import { ChartBar, Package, Plant, Wallet } from '@phosphor-icons/react'
import { ActionLink, EmptyState, ErrorNotice, Link, StatusBadge } from '../../components/ui'
import { useM3 } from '../../hooks/useM3'
import { currency, dateLabel, today } from '../../domain/offers'
import { producerSales, salesMonths } from '../../domain/sales'
import { statusLabel } from '../../services/m2'

export default function SalesDashboard({ session }) {
  const state = useM3(session)
  return <SalesDashboardContent session={session} state={state} />
}

export function SalesDashboardContent({ session, state }) {
  const [period, setPeriod] = useState('6')
  const end = today()
  const [year, month] = end.split('-').map(Number)
  const start = period === 'all' ? '' : new Date(Date.UTC(year, month - Number(period), 1)).toISOString().slice(0, 10)
  const periodEnd = period === 'all' ? '' : new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10)
  const sales = producerSales(state.loads, session.id, start, periodEnd)
  const months = salesMonths(sales.completed, sales.amount, end)
  const max = Math.max(...months.map(point => point.value), 1)
  const groups = [
    ['Aguardando fornecimento', sales.active.filter(load => load.status === 'awaiting_producers').length],
    ['Em negociação e aprovação', sales.active.filter(load => ['awaiting_quotes', 'awaiting_final_approval', 'awaiting_payment'].includes(load.status)).length],
    ['Em entrega ou análise', sales.active.filter(load => ['scheduled', 'in_transit', 'delivery_review'].includes(load.status)).length],
    ['Concluídos', sales.completed.length],
  ]
  return <>
    <div className="dashboard-heading"><div><p className="dashboard-kicker">Sua produção, novas conexões</p><h1>Visão geral das vendas</h1><p>Olá, {(session.display_name || session.name).split(' ')[0]}. Acompanhe o caminho da sua produção.</p></div><ActionLink href="/produtor/ofertas">Gerenciar produtos</ActionLink></div>
    <div className="dashboard-toolbar"><label>Período de entrega prevista<select value={period} onChange={event => setPeriod(event.target.value)}><option value="1">Mês atual</option><option value="6">Últimos 6 meses</option><option value="all">Todo o histórico</option></select></label><button className="text-link" onClick={state.reload}>Atualizar dados</button></div>
    {state.error ? <ErrorNotice retry={state.reload}>{state.error} Os indicadores não estão disponíveis.</ErrorNotice> : state.loading ? <div className="skeleton-list" role="status" aria-label="Carregando indicadores"><div /><div /></div> : <>
      <div className="dashboard-metrics">{[
        ['Vendas concluídas', currency(sales.gross), 'Bruto dos seus alimentos · simulado', Wallet],
        ['Pedidos em andamento', sales.active.length, 'Ainda não são vendas concluídas', Package],
        ['Pedidos concluídos', sales.completed.length, 'Recebimento confirmado no demo', ChartBar],
        ['Produtos negociados', new Set(sales.loads.flatMap(load => load.items.filter(item => item.producer_id === session.id).map(item => item.product_name))).size, 'Produtos distintos no período', Plant],
      ].map(([label, value, note, Icon]) => <article className="dashboard-metric" key={label}><span>{label}<Icon size={20} aria-hidden="true" /></span><strong>{value}</strong><small>{note}</small></article>)}</div>
      <div className="dashboard-panels"><section className="dashboard-panel"><h2>Fluxo de vendas</h2><p>Valor bruto concluído, por mês da entrega prevista. Valores simulados.</p><div className="sales-chart" role="img" aria-label={months.map(point => `${point.label}: ${currency(point.value)}`).join('; ')}>{months.map(point => <div className="sales-chart-column" key={point.key} title={`${point.label}: ${currency(point.value)}`}><i style={{ height: `${point.value / max * 165}px` }} /><span>{point.label}</span></div>)}</div><p>Gráfico dos últimos seis meses dentro do período selecionado. {sales.completed.length === 0 && 'Nenhuma venda concluída no período.'}</p><details><summary>Consultar valores do gráfico</summary><ul>{months.map(point => <li key={point.key}>{point.key}: {currency(point.value)}</li>)}</ul></details></section>
      <section className="dashboard-panel"><h2>Do pedido à entrega</h2><p>Situação dos pedidos no período.</p><ul className="dashboard-flow">{groups.map(([label, count]) => <li key={label}><span><i className="flow-dot" aria-hidden="true" />{label}</span><strong>{count}</strong></li>)}</ul><Link className="text-link dashboard-orders-link" href="/produtor/pedidos">Ver todos os pedidos</Link></section></div>
      <section className="dashboard-panel"><h2>Pedidos do período</h2><p>Valores somente dos seus itens. Frete separado, por conta do comprador.</p>{!sales.loads.length ? <EmptyState title="Seu próximo pedido começa com uma oferta" action={<ActionLink href="/produtor/ofertas">Ver meus produtos</ActionLink>}>Seus pedidos aparecerão aqui quando uma composição incluir sua produção.</EmptyState> : <div className="dashboard-table-wrap"><table className="dashboard-table"><thead><tr><th>Pedido</th><th>Entrega prevista</th><th>Seus alimentos</th><th>Situação</th></tr></thead><tbody>{[...sales.loads].sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date)).map(load => <tr key={load.id}><td><Link href="/produtor/pedidos">#{load.id.slice(0, 8)}</Link></td><td>{dateLabel(load.scheduled_date)}</td><td>{currency(sales.amount(load))}</td><td><StatusBadge tone="pending">{statusLabel(load.status)}</StatusBadge></td></tr>)}</tbody></table></div>}</section>
    </>}
    <aside className="workspace-welcome" style={{ marginTop: 24 }}><img src="/assets/illustrations/farmer-talk.webp" alt="" /><div><h2>Mais tempo para o que você cultiva.</h2><p>Use as mensagens para conversar com compradores ou o Bot Conexa para preparar suas ofertas.</p><Link className="text-link" href="/produtor/conversas">Abrir mensagens</Link></div></aside>
  </>
}
