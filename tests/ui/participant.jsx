import { createRoot } from 'react-dom/client'
import AppLayout from '../../src/components/AppLayout'
import OffersPage from '../../src/features/offers/OffersPage'
import DemandsPage from '../../src/features/demands/DemandsPage'
import ProducerProposals from '../../src/features/demands/ProducerProposals'
import TransportPage from '../../src/features/transport/TransportPage'
import OfferForm from '../../src/features/offers/OfferForm'
import DemandForm from '../../src/features/demands/DemandForm'
import { accounts } from '../../src/services/offers'
import '../../src/index.css'
import '../../src/App.css'
import '../../src/participant.css'

// Run with the local-only Vite configuration (no remote credentials or requests).
const params = new URLSearchParams(location.search)
const role = params.get('role') || 'producer'
const view = params.get('view') || 'offers'
const session = accounts.find(account => account.role === role)
const path = role === 'carrier' ? '/transportador/veiculos' : role === 'buyer' ? '/comprador/ofertas' : '/produtor/ofertas'
const catalog = { products: [{ id: 'alface', name: 'Alface', unit: 'kg' }], locations: [{ id: 'local', display_address: 'Ponto de coleta fictício' }] }
const noop = () => {}
createRoot(document.getElementById('root')).render(<AppLayout session={session} path={path} leave={noop}>
  {view === 'offers' && <OffersPage session={session} />}
  {view === 'demands' && <DemandsPage session={session} />}
  {view === 'proposals' && <ProducerProposals session={session} />}
  {view === 'vehicles' && <TransportPage session={session} vehiclesOnly />}
  {view === 'offer-form' && <OfferForm {...catalog} save={async () => { throw new Error('Bancada visual: sem gravação.') }} close={noop} />}
  {view === 'demand-form' && <DemandForm catalog={catalog} request={async () => { throw new Error('Bancada visual: sem gravação.') }} close={noop} />}
</AppLayout>)
