import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Logo, PageHeading, StatusBadge } from '../../src/components/ui'
import OperationClosure from '../../src/features/transport/OperationClosure'
import { statusLabel } from '../../src/services/m2'
import '../../src/index.css'
import '../../src/App.css'

// Visual fixtures only. No Supabase calls; this reducer does not validate database rules.
const profiles = { buyer: { id: 'buyer', role: 'buyer' }, producer: { id: 'ana', role: 'producer' }, carrier: { id: 'carrier', role: 'carrier' } }
const initial = { id: 'fixture-m5', version: 2, status: 'awaiting_payment', total_cents: 33000, selected_quote_id: 'quote', quotes: [{ id: 'quote', carrier_id: 'carrier' }], items: [{ producer_id: 'ana', producer_name: 'Ana fictícia' }, { producer_id: 'joao', producer_name: 'João fictício' }], payments: [], occurrences: [], payouts: [] }
export default function Review() {
  const [load, setLoad] = useState(initial), [profile, setProfile] = useState('buyer'), [failure, setFailure] = useState(false), [lastKey, setLastKey] = useState('')
  async function fixture(action, payload) {
    setLastKey(payload.idempotency_key)
    if (failure) throw new Error('Falha controlada da bancada local. Nenhuma escrita remota.')
    const now = new Date().toISOString()
    setLoad(previous => {
      const next = structuredClone(previous)
      if (action === 'pay') {
        next.payments.push({ id: crypto.randomUUID(), status: payload.outcome, amount_cents: 33000, created_at: now })
        if (payload.outcome === 'approved') next.status = 'scheduled'
      }
      if (action === 'start') next.status = 'in_transit'
      if (['report', 'discrepancy'].includes(action) || (action === 'cancel' && ['in_transit', 'delivery_review'].includes(next.status))) {
        next.status = 'delivery_review'
        next.occurrences.push({ id: crypto.randomUUID(), description: payload.reason, status: 'open', created_at: now })
      } else if (action === 'cancel') {
        next.status = 'cancelled'
        next.payments = next.payments.map(p => p.status === 'approved' ? { ...p, status: 'refunded', refunded_at: now } : p)
      }
      if (action === 'resolve') next.occurrences = next.occurrences.map(o => o.id === payload.occurrence_id ? { ...o, status: 'resolved', resolution: payload.resolution, resolved_at: now } : o)
      if (action === 'receive') {
        next.status = 'delivered'
        next.payouts = [{ id: 'p1', kind: 'producer', recipient_id: 'ana', amount_cents: 15000 }, { id: 'p2', kind: 'producer', recipient_id: 'joao', amount_cents: 10000 }, { id: 'p3', kind: 'carrier', recipient_id: 'carrier', amount_cents: 8000 }]
      }
      return next
    })
    return {}
  }
  const session = profiles[profile]
  const visible = { ...load, payments: profile === 'buyer' ? load.payments : [], payouts: load.payouts.filter(p => profile === 'buyer' || p.recipient_id === session.id) }
  return <div className="app-shell"><header className="app-header"><Logo /></header><main id="conteudo" className="app-content"><PageHeading eyebrow="BANCADA LOCAL · FIXTURES EM MEMÓRIA" title="Fechamento da operação," accent="em avaliação.">Revisão isolada da interface M5. Não consulta Supabase, não comprova persistência, permissões ou regras de banco.</PageHeading>
    <section className="wide-card m3-form"><label className="field"><span>Perfil da bancada</span><select value={profile} onChange={e => setProfile(e.target.value)}><option value="buyer">Comprador</option><option value="producer">Produtor</option><option value="carrier">Transportador</option></select></label><label className="m3-check"><input type="checkbox" checked={failure} onChange={e => setFailure(e.target.checked)} />Simular falha nesta bancada</label><button className="button button-outline" onClick={() => setLoad(initial)}>Reiniciar cenário visual</button><StatusBadge tone="pending">{statusLabel(load.status)}</StatusBadge>{lastKey && <p>Chave da última ação visual: {lastKey}</p>}</section>
    <section className="wide-card"><OperationClosure key={profile} load={visible} session={session} reload={() => {}} request={fixture} /></section>
  </main></div>
}
createRoot(document.getElementById('root')).render(<Review />)
