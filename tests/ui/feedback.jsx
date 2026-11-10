import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorNotice, Logo, PageHeading } from '../../src/components/ui'
import QuoteForm from '../../src/features/transport/QuoteForm'
import OfferForm from '../../src/features/offers/OfferForm'
import '../../src/index.css'
import '../../src/App.css'

// Local visual fixture using real components. No Supabase requests or persistence.
const day = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10)
const load = { id: 'fixture-feedback', version: 1, scheduled_date: day, expires_at: `${day}T15:00:00Z`, quotes: [] }
const vehicles = [{ id: 'vehicle', description: 'Veículo fictício', capacity_kg: 500, conservation_conditions: 'ambient' }]
export default function Review() {
  const [error, setError] = useState(''), [pending, setPending] = useState(false), [notice, setNotice] = useState('')
  const [fail, setFail] = useState(true), [editing, setEditing] = useState(false), [passive, setPassive] = useState(false)
  async function submit(action, payload, form) {
    setError(''); setNotice(''); setPending(true)
    await new Promise(resolve => setTimeout(resolve, 150))
    if (fail) setError('Revise validade, saída e entrega na data desejada; validade limitada à reserva.')
    else { form.reset(); setNotice('Cotação confirmada somente na bancada local.') }
    setPending(false)
  }
  return <div className="app-shell"><header className="app-header"><Logo /></header><main id="conteudo" className="app-content">
    <PageHeading eyebrow="BANCADA LOCAL · SEM ESCRITA REMOTA" title="Confirmação com" accent="feedback visível.">Componentes reais com respostas controladas. Não comprova persistência ou permissões no Supabase.</PageHeading>
    <section className="wide-card m3-form"><label className="m3-check"><input type="checkbox" checked={fail} onChange={e => setFail(e.target.checked)} />Simular erro remoto</label><button className="button button-outline" onClick={() => setEditing(true)}>Testar erro no modal</button><button className="button button-outline" onClick={() => setPassive(value => !value)}>Alternar erro de consulta</button>{passive && <ErrorNotice>Falha de consulta controlada. Este aviso não muda o foco.</ErrorNotice>}</section>
    <section className="wide-card"><h2>Proposta fictícia · cotação</h2><div style={{ minHeight: '55vh', paddingBlock: '2rem' }}><p>Espaço para reproduzir a distância entre o cabeçalho da proposta e a confirmação.</p></div><QuoteForm load={load} vehicles={vehicles} pending={pending} submit={submit} error={error} />{notice && <p className="success-notice" role="status">{notice}</p>}</section>
    {editing && <OfferForm products={[{ id: 'product', name: 'Tomate', unit: 'kg' }]} locations={[{ id: 'place', display_address: 'Coleta fictícia' }]} close={() => setEditing(false)} save={async () => { throw new Error('Falha controlada de salvamento na bancada local.') }} />}
  </main></div>
}
createRoot(document.getElementById('root')).render(<Review />)
