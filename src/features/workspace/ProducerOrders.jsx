import { ActionLink, EmptyState, ErrorNotice, PageHeading, StatusBadge } from '../../components/ui'
import { useM3 } from '../../hooks/useM3'
import { dateLabel, currency } from '../../domain/offers'
import { producerSales } from '../../domain/sales'
import { statusLabel } from '../../services/m2'

export default function ProducerOrders({ session }) {
  const state = useM3(session)
  const sales = producerSales(state.loads, session.id)
  return <><div className="dashboard-heading"><PageHeading title="Meus pedidos">Acompanhe os pedidos que incluem sua produção, das primeiras confirmações até a entrega simulada.</PageHeading><button className="text-link" onClick={state.reload}>Atualizar</button></div>
    {state.error ? <ErrorNotice retry={state.reload}>{state.error}</ErrorNotice> : state.loading ? <p role="status">Carregando pedidos…</p> : !sales.loads.length ? <EmptyState title="Nenhum pedido por enquanto">Mantenha suas ofertas atualizadas para participar de novas composições.</EmptyState> : sales.loads.map(load => <article className="wide-card m2-load" key={load.id}><div className="card-heading"><h2>Pedido #{load.id.slice(0, 8)}</h2><StatusBadge tone="pending">{statusLabel(load.status)}</StatusBadge></div><p>Entrega prevista: {dateLabel(load.scheduled_date)} · {load.destination_address}</p><p>{load.items.filter(item => item.producer_id === session.id).map(item => item.product_name).join(', ')}</p><p>Seus alimentos: <strong>{currency(sales.amount(load))}</strong> · valor acordado, sujeito ao andamento do pedido.</p><div className="m2-actions"><ActionLink href="/produtor/propostas" secondary>Consultar proposta e fornecimento</ActionLink><ActionLink href="/operacoes" secondary>Informações de entrega</ActionLink></div></article>)}
  </>
}
