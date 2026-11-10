import { useEffect, useState } from 'react'
import { Bell } from '@phosphor-icons/react'
import { ActionLink, ErrorNotice } from './ui'
import { transportUpdates } from '../services/transport-updates'
import { timestampLabel } from '../services/m2'
import { currency } from '../domain/offers'

export default function TransportNotifications({ session, request = transportUpdates }) {
  const [state, setState] = useState({ available: false, notifications: [], error: '' })
  const [revision, setRevision] = useState(0), [pending, setPending] = useState(false), [error, setError] = useState('')
  useEffect(() => {
    let active = true
    request('list').then(result => { if (active) setState({ ...result, error: '' }) }).catch(failure => { if (active) setState(previous => ({ ...previous, error: failure.message })) })
    const refresh = () => setRevision(n => n + 1)
    const timer = setInterval(refresh, 30000)
    window.addEventListener('focus', refresh)
    window.addEventListener('conexa:transport-updated', refresh)
    return () => { active = false; clearInterval(timer); window.removeEventListener('focus', refresh); window.removeEventListener('conexa:transport-updated', refresh) }
  }, [session.id, revision, request])
  async function read(id) {
    setPending(true); setError('')
    try { await request('read', { notification_id: id }); setRevision(n => n + 1) }
    catch (failure) { setError(failure.message) }
    finally { setPending(false) }
  }
  if (!state.available && !state.error) return null
  const unread = state.notifications.filter(n => !n.read_at).length
  return <aside className="transport-notifications" aria-label="Notificações de transporte">
    <details><summary><Bell size={21} aria-hidden="true" />Atualizações de transporte <span className="notification-count" aria-live="polite">{unread} não lida(s)</span></summary>
      <p className="inline-caption">Avisos dentro do site, atualizados a cada 30 segundos. Nenhum e-mail ou WhatsApp é enviado.</p>
      {state.error && <ErrorNotice retry={() => setRevision(n => n + 1)}>{state.error}</ErrorNotice>}
      {error && <ErrorNotice autoFocus>{error}</ErrorNotice>}
      {!state.notifications.length && !state.error && <p>Nenhuma atualização por aqui.</p>}
      <ul className="notification-list">{state.notifications.map(n => <li key={n.id} className={n.read_at ? '' : 'unread'}>
        <p className="eyebrow">PROPOSTA {n.load_id.slice(0, 8)} · VERSÃO {n.proposal_version}</p><strong>{n.message}</strong>
        <p>{timestampLabel(n.created_at)} (São Paulo)</p><p>Motivo: {n.changes.reason}</p>
        {n.changes.proposed_cents && <p>Novo frete proposto: {currency(n.changes.proposed_cents)} · aguardando aprovação.</p>}
        {n.changes.before && <details><summary>Conferir o que mudou</summary><dl className="notification-changes">
          <div><dt>Veículo</dt><dd>{n.changes.before.vehicle} → {n.changes.after.vehicle}</dd></div>
          {['departure_time', 'delivery_time', 'expires_at'].map((field, index) => <div key={field}><dt>{['Saída', 'Entrega', 'Validade'][index]}</dt><dd>{timestampLabel(n.changes.before[field])} → {timestampLabel(n.changes.after[field])} (São Paulo)</dd></div>)}
          <div><dt>Frete</dt><dd>{currency(n.changes.before.total_cents)} → {currency(n.changes.after.total_cents)}</dd></div>
        </dl></details>}
        <div className="m2-actions"><ActionLink href="/operacoes">Revisar proposta</ActionLink>{!n.read_at && <button className="text-link" disabled={pending} onClick={() => read(n.id)}>Marcar como lida</button>}</div>
      </li>)}</ul>
    </details>
  </aside>
}
