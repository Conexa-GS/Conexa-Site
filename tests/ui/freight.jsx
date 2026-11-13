import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Logo, PageHeading } from '../../src/components/ui'
import FreightCalculator from '../../src/features/transport/FreightCalculator'
import QuoteForm from '../../src/features/transport/QuoteForm'
import '../../src/index.css'
import '../../src/App.css'

const load = { id: 'fixture-freight', version: 1, scheduled_date: '2099-11-16', expires_at: '2099-11-16T12:00:00Z', quotes: [], items: [{ pickup_address: '-22.8615,-48.4690' }, { pickup_address: '-22.8519,-48.4501' }], destination_address: '-22.8858,-48.4435' }
export default function Review() {
  const [failure, setFailure] = useState(false), [withReturn, setWithReturn] = useState(true), [applied, setApplied] = useState(null)
  const request = async () => {
    if (failure) throw new Error('Falha controlada. A cotação manual continua disponível.')
    return { distanceMeters: withReturn ? 25000 : 15000, totalSeconds: withReturn ? 3600 : 2400, deliverySeconds: 2400 }
  }
  return <div className="app-shell"><header className="app-header"><Logo /></header><main id="conteudo" className="app-content"><PageHeading eyebrow="BANCADA LOCAL · SEM CONSULTA GOOGLE" title="Frete estimado," accent="entrega prevista.">Distâncias e tempos de teste em memória; não representam uma consulta real.</PageHeading>
    <section className="wide-card"><label className="m3-check"><input type="checkbox" checked={failure} onChange={event => setFailure(event.target.checked)} />Simular falha</label><label className="m3-check"><input type="checkbox" checked={withReturn} onChange={event => setWithReturn(event.target.checked)} />Incluir retorno acordado</label>
      <FreightCalculator load={load} departureAddress="-22.8791,-48.4552" returnAddress={withReturn ? '-22.8791,-48.4552' : ''} departureTime="2099-11-16T08:00" request={request} onApply={setApplied} illustrative />
      {applied && <p role="status">Aplicação somente nesta bancada: {applied.totalCents} centavos. Nenhuma gravação.</p>}
    </section><section className="wide-card"><QuoteForm load={load} vehicles={[{ id: 'vehicle', description: 'Utilitário fictício', capacity_kg: 500, conservation_conditions: 'ambient' }]} routeRequest={request} submit={() => setApplied(null)} /></section>
  </main></div>
}
createRoot(document.getElementById('root')).render(<Review />)
