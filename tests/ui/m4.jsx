import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Logo, PageHeading } from '../../src/components/ui'
import InclusionComparison from '../../src/features/demands/InclusionComparison'
import RouteAnalysis, { QuoteComparison } from '../../src/features/transport/RouteAnalysis'
import '../../src/index.css'
import '../../src/App.css'

// Isolated visual fixtures. Never enter the application, Supabase or the production build.
const candidates = [
  { id: 'ana', product_id: 'lettuce', unit: 'kg', producer_name: 'Ana fictícia', quantity_free: 50, unit_price_cents: 500, minimum_net_unit_cents: 400, completed_sales: 4, waiting_days: 2, created_at: '2026-11-06T00:00:00Z' },
  { id: 'joao', product_id: 'lettuce', unit: 'kg', producer_name: 'João fictício', quantity_free: 20, unit_price_cents: 600, minimum_net_unit_cents: 550, completed_sales: 0, waiting_days: 5, created_at: '2026-11-03T00:00:00Z' },
]
const quote = { id: 'quote-01', load_version: 1, status: 'confirmed', departure_address: 'Garagem fictícia', departure_time: '2099-11-09T10:00:00Z', delivery_time: '2099-11-09T12:00:00Z', expires_at: '2099-11-08T18:00:00Z', conservation_required: 'ambient', services_included: { fuel: true, tolls: true, pickups: true, unloading: true }, total_cents: 8000 }
const load = { id: 'load', version: 1, status: 'awaiting_quotes', expires_at: quote.expires_at, items: [{ unit: 'kg', gross_cents: 15000, minimum_cents: 12000 }, { unit: 'kg', gross_cents: 10000, minimum_cents: 9000 }], quotes: [quote, { ...quote, id: 'quote-02', total_cents: 10000 }] }

export default function Review() {
  const [failure, setFailure] = useState(false), [selected, setSelected] = useState(null)
  async function fixture(action) {
    if (failure) throw new Error('Falha controlada da bancada local. A cotação manual e sua seleção foram preservadas.')
    if (action === 'candidates') return candidates
    return { freightCents: 8000, stops: [{ kind: 'departure', address: 'Garagem fictícia' }, { kind: 'pickup', address: 'Sítio fictício A', producerName: 'Ana fictícia' }, { kind: 'pickup', address: 'Sítio fictício B', producerName: 'João fictício' }, { kind: 'destination', address: 'Restaurante fictício' }, { kind: 'return', address: 'Retorno fictício acordado' }] }
  }
  return <div className="app-shell"><header className="app-header"><Logo /></header><main id="conteudo" className="app-content"><PageHeading eyebrow="BANCADA LOCAL · FIXTURES EM MEMÓRIA" title="Rotas e inclusão," accent="em avaliação.">Revisão isolada dos componentes M4. Estes dados são fixtures visuais, sem consulta ao Supabase e sem operações ativas. Não comprovam persistência remota.</PageHeading>
    <label className="m3-check"><input type="checkbox" checked={failure} onChange={e => setFailure(e.target.checked)} />Simular falha de consulta nesta bancada</label>
    <section className="wide-card"><InclusionComparison demand={{ id: 'demand', unit: 'kg', product_id: 'lettuce', quantity: 50 }} onChoose={(_offers, values) => setSelected(values)} request={fixture} />{selected && <p role="status">Seleção na bancada: {Object.entries(selected).map(([id, value]) => `${id}: ${value} kg`).join(' · ')}. Nenhuma proposta enviada.</p>}</section>
    <section className="wide-card"><QuoteComparison load={load} /><h3>Roteiro da cotação fictícia</h3><RouteAnalysis load={load} quote={quote} request={fixture} /></section>
  </main></div>
}

createRoot(document.getElementById('root')).render(<Review />)
