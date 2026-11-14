import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import AppLayout from '../../src/components/AppLayout'
import { OfferCard } from '../../src/features/offers/OffersPage'
import OfferForm from '../../src/features/offers/OfferForm'
import { PageHeading } from '../../src/components/ui'
import { today, futureDate } from '../../src/domain/offers'
import { photoDataUrl } from '../../src/services/offer-photos'
import '../../src/index.css'
import '../../src/App.css'
import '../../src/participant.css'

// Bancada volátil, sem Auth, Storage ou escrita remota. A foto é ilustrativa.
const products = [{ id: 'cenoura', name: 'Cenoura', unit: 'kg' }, { id: 'alface', name: 'Alface', unit: 'kg' }, { id: 'tomate', name: 'Tomate', unit: 'kg' }]
const locations = [{ id: 'local', display_address: 'Ponto de coleta fictício' }]
const session = { id: 'visual', role: 'producer', name: 'Produtor da bancada', access: 'developer' }
const initial = { id: 'fixture-photo', producer_id: session.id, product_id: 'cenoura', quantity_total: 50, unit_price_cents: 450, minimum_net_unit_cents: 350, pickup_location_id: 'local', available_from: today(), available_until: futureDate(7), photo_url: null, photo_path: null, products: products[0], locations: locations[0], participants: { display_name: 'Produtor fictício' } }
export function Bench() {
  const [offer, setOffer] = useState(initial)
  const [editing, setEditing] = useState(null)
  const [buyer, setBuyer] = useState(false)
  const [notice, setNotice] = useState('')
  return <AppLayout session={{ ...session, role: buyer ? 'buyer' : 'producer' }} path={buyer ? '/comprador/ofertas' : '/produtor/ofertas'} leave={() => {}}>
    <div className="task-heading"><PageHeading title={buyer ? 'Buscar alimentos' : 'Minhas ofertas'} />{!buyer && <button className="button" onClick={() => setEditing({})}>Nova oferta</button>}</div>
    <p className="inline-caption">Bancada local · foto ilustrativa · alterações descartadas ao recarregar.</p>
    <button className="button button-outline" onClick={() => setBuyer(value => !value)}>{buyer ? 'Ver como produtor' : 'Ver como comprador'}</button>
    {notice && <p role="status">{notice}</p>}
    <div className="offer-grid" style={{ marginTop: 20 }}>
      <OfferCard offer={offer} producer={!buyer} edit={setEditing} remove={() => setNotice('Exclusão não executada nesta bancada.')} />
      {products.slice(1).map(product => <OfferCard key={product.id} offer={{ ...initial, id: `fixture-${product.id}`, product_id: product.id, products: product }} producer={false} />)}
    </div>
    {editing && <OfferForm previous={editing.id ? editing : null} products={products} locations={locations} close={() => setEditing(null)} save={async (data, previous, photo) => {
      const photo_url = photo === undefined ? previous?.photo_url : photo ? await photoDataUrl(photo) : null
      setOffer({ ...initial, ...data, products: products.find(product => product.id === data.product_id), photo_url, photo_path: photo_url ? 'fixture-only' : null })
      setNotice('Oferta atualizada somente na bancada local.')
    }} />}
  </AppLayout>
}
createRoot(document.getElementById('root')).render(<Bench />)
