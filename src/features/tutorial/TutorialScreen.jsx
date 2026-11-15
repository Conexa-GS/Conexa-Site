import { Plus } from '@phosphor-icons/react'
import { PageHeading, StatusBadge } from '../../components/ui'
import { profileRoutes } from '../../domain/profiles'
import { currency, today, futureDate } from '../../domain/offers'
import { OfferCard } from '../offers/OffersPage'
import OfferForm from '../offers/OfferForm'
import DemandForm from '../demands/DemandForm'
import Loads from '../demands/Loads'
import VehicleForm from '../transport/VehicleForm'
import QuoteForm from '../transport/QuoteForm'
import OperationClosure from '../transport/OperationClosure'

const noop = () => {}
const blockedRequest = async () => { throw new Error('Esta tela pertence apenas ao tutorial.') }
const roleNames = { producer: 'Produtor', buyer: 'Comprador', carrier: 'Transportador' }

function Composition({ send, items }) {
  return <><PageHeading title="Escolher produtores" /><section className="wide-card"><h3>Tomate · 50 kg</h3>{items.map((item, index) => <div className="composition-row" key={item.id}><div><strong>{item.producer_name}</strong><p>{item.quantity} kg livres · R$ 5,00/kg</p></div><label className="field"><span>Oferta {index + 1}: selecionar de {item.producer_name} (kg)</span><input data-action={index === 0 ? 'quantity' : undefined} value={item.quantity} readOnly /></label></div>)}</section>{send && <aside className="summary-panel"><h3>50 / 50 kg</h3><p>Alimentos: R$ 250,00 · Frete: a cotar · Taxa: R$ 0,00</p><label className="field"><span>Prazo da reserva (horas)</span><input value="24" readOnly /></label><button type="button" className="button" data-action="send">Enviar proposta aos produtores</button></aside>}</>
}

function ScreenContent({ step, data }) {
  const { products, locations, session, load, offer, vehicles } = data
  switch (step.id) {
    case 'offer-open': return <><div className="task-heading"><PageHeading title="Minhas ofertas" /><button type="button" className="button" data-action="new-offer"><Plus size={22} />Nova oferta</button></div><OfferCard offer={offer} producer edit={noop} remove={noop} /></>
    case 'offer-fill': case 'offer-save': return <OfferForm embedded initialValues={{ product_id: products[0].id, quantity_total: '30', price: '5,00', minimum: '4,00', available_from: today(), available_until: futureDate(3) }} products={products} locations={locations} save={blockedRequest} close={noop} />
    case 'demand-open': return <><PageHeading title="Meus pedidos" /><div className="section-toolbar"><h3>Pedidos de alimentos</h3><button type="button" className="button" data-action="new-demand">Novo pedido</button></div></>
    case 'demand-save': return <DemandForm embedded initialValues={{ product_id: products[0].id, quantity: '50' }} catalog={{ products, locations: [{ id: 'tutorial-destino', display_address: load.destination_address }] }} close={noop} request={blockedRequest} />
    case 'composition': case 'send': return <Composition items={load.items} send={step.id === 'send'} />
    case 'supply': return <Loads loads={[load]} session={session} reload={noop} />
    case 'vehicle': return <VehicleForm initialValues={{ description: 'Furgão do exemplo', vehicle_category: 'Furgão', capacity_kg: '500' }} pending={false} onSubmit={blockedRequest} />
    case 'quote-vehicle': case 'quote-send': return <QuoteForm initialValues={{ vehicle_id: vehicles[0].id, departure_address: 'Base fictícia da transportadora', price: '80,00', departure_time: futureDate(1) + 'T07:00', delivery_time: futureDate(1) + 'T10:00', expires_at: today() + 'T23:00', confirmed: true }} load={load} vehicles={vehicles} pending={false} submit={blockedRequest} routeRequest={blockedRequest} />
    case 'quote-select': return <><PageHeading title="Entregas e valores" /><article className="m3-quote"><h3>Cotação confirmada pelo transportador · R$ 80,00</h3><p>Combustível, pedágios, coletas e descarga incluídos.</p><button type="button" className="button button-outline" data-action="select-quote">Selecionar e pedir novos aceites</button></article></>
    case 'final-others': case 'final-buyer': return <><PageHeading title="Entregas e valores" /><section className="wide-card"><h3>Valores individuais</h3><p>Ana · bruto e líquido R$ 150,00 · mínimo R$ 120,00 · mínimo preservado</p><p>João · bruto e líquido R$ 100,00 · mínimo R$ 90,00 · mínimo preservado</p><p>Alimentos: R$ 250,00 · Frete: R$ 80,00 · Total: R$ 330,00</p><StatusBadge tone="pending">Aguardando aceites finais</StatusBadge><p>Versão 1 · condições e valores revisados</p><button type="button" className="button" data-action="final">{step.id === 'final-buyer' ? 'Aprovar total final desta versão' : 'Confirmar condições finais desta versão'}</button></section></>
    case 'pay': return <OperationClosure preview initialOutcome="approved" load={{ ...load, status: 'awaiting_payment' }} session={{ id: 'tutorial-buyer', role: 'buyer' }} reload={noop} request={blockedRequest} />
    case 'start': return <OperationClosure preview load={{ ...load, status: 'scheduled' }} session={{ id: 'tutorial-carrier', role: 'carrier' }} reload={noop} request={blockedRequest} />
    case 'receive': return <OperationClosure preview load={{ ...load, status: 'in_transit' }} session={{ id: 'tutorial-buyer', role: 'buyer' }} reload={noop} request={blockedRequest} />
    case 'done': return <OperationClosure preview load={{ ...load, status: 'delivered', payouts: [...load.items.map(item => ({ id: item.id, recipient_id: item.producer_id, kind: 'producer', amount_cents: item.gross_cents })), { id: 'tutorial-payout', kind: 'carrier', amount_cents: load.freight_cents }] }} session={{ id: 'tutorial-buyer', role: step.role }} reload={noop} request={blockedRequest} />
    default: return null
  }
}

export default function TutorialScreen({ step, data }) {
  const entries = step.role === 'carrier' ? [...profileRoutes.carrier, ['/operacoes', 'Entregas']] : profileRoutes[step.role]
  const section = step.page.split(' → ')[0]
  return <div className="tutorial-reference" inert aria-hidden="true">
    <aside className="tutorial-screen-menu"><img src="/assets/marca/conexa-logo.svg" width="140" height="32" alt="" />{entries.map(([href, label]) => <span key={href} className={label === section ? 'is-current' : undefined}>{label}</span>)}</aside>
    <div className="tutorial-screen-body"><div className="tutorial-screen-bar"><span>{roleNames[step.role]} / {section}</span><strong>Conta de exemplo</strong></div><p className="tutorial-simulation">Tutorial · pedido fictício · nada será salvo</p><div className="tutorial-screen-content" onClickCapture={event => event.stopPropagation()} onSubmitCapture={event => { event.preventDefault(); event.stopPropagation() }}><ScreenContent step={step} data={data} /></div></div>
    <span className="sr-only">Total do exemplo: {currency(data.load.total_cents)}</span>
  </div>
}
