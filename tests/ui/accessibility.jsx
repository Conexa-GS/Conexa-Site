import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Logo, PageHeading } from '../../src/components/ui'
import RecordList from '../../src/components/RecordList'
import OfferForm from '../../src/features/offers/OfferForm'
import DemandForm from '../../src/features/demands/DemandForm'
import { futureDate, today } from '../../src/domain/offers'
import '../../src/index.css'
import '../../src/App.css'

// Real components with injected responses. No writes or queries to Supabase.
const catalog = { products: [{ id: 'product', name: 'Alface', unit: 'kg' }], locations: [{ id: 'place', display_address: 'Local fictício da bancada' }] }
const offer = { id: 'fixture', product_id: 'product', quantity_total: 30, unit_price_cents: 500, minimum_net_unit_cents: 400, pickup_location_id: 'place', available_from: today(), available_until: futureDate(7) }
const demand = { id: 'fixture', product_id: 'product', quantity: 30, destination_id: 'place', desired_date: futureDate(3), version: 1 }
export default function Review() {
  const [form, setForm] = useState(null), [fail, setFail] = useState(true), [notice, setNotice] = useState('')
  async function save() {
    await new Promise(resolve => setTimeout(resolve, 1200))
    if (fail) throw new Error('Falha controlada da bancada local.')
    return { id: 'fixture' }
  }
  function close(saved) { setForm(null); if (saved) setNotice('Salvo apenas na bancada local. Nenhuma escrita remota.') }
  return <div className="app-shell"><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><header className="app-header"><Logo /></header><main id="conteudo" tabIndex={-1} className="app-content">
    <PageHeading eyebrow="BANCADA LOCAL · SEM OPERAÇÕES REMOTAS" title="Teclado e formulários," accent="em revisão.">Componentes reais, respostas em memória. Esta bancada não comprova persistência ou RLS.</PageHeading>
    <label className="m3-check"><input type="checkbox" checked={fail} onChange={e => setFail(e.target.checked)} />Simular falha ao salvar</label>
    <div className="m2-actions"><button className="button" onClick={() => setForm('offer')}>Revisar oferta</button><button className="button button-outline" onClick={() => setForm('demand')}>Revisar demanda</button></div>
    {notice && <p className="success-notice" role="status">{notice}</p>}
    <RecordList records={[{ id: 'fixture-a11y', status: 'open' }]} scope="accessibility-fixture" participantId="fixture" label="Propostas" renderRecord={() => <article className="wide-card"><h2>Proposta fictícia</h2><p>Ocultar e reexibir alteram somente esta lista local.</p></article>} />
    {form === 'offer' && <OfferForm previous={offer} {...catalog} close={close} save={save} />}
    {form === 'demand' && <DemandForm previous={demand} catalog={catalog} close={close} request={save} />}
  </main></div>
}
createRoot(document.getElementById('root')).render(<Review />)
