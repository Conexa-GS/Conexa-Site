import { useState } from 'react'
import { ActionLink, EmptyState, ErrorNotice, Modal, StatusBadge } from '../../components/ui'
import { currency, dateLabel, quantity } from '../../domain/offers'
import { m2, statusLabel, timestampLabel } from '../../services/m2'

export default function Loads({ loads, session, reload }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [cancel, setCancel] = useState(null)
  const [reason, setReason] = useState('')
  const [notice, setNotice] = useState('')
  async function act(action, load, extra = {}) {
    setPending(true); setError(''); setNotice('')
    try { await m2(action, { id: load.id, version: load.version, ...extra }); setCancel(null); setNotice('Ação registrada no Supabase.'); reload() }
    catch (failure) { setError(failure.message); reload() }
    finally { setPending(false) }
  }
  return <section className="m2-loads"><div className="section-toolbar"><h2>{session.role === 'producer' ? 'Propostas recebidas' : 'Minhas propostas'}</h2><button className="text-link" onClick={reload}>Atualizar</button></div>{error && !cancel && <ErrorNotice>{error}</ErrorNotice>}{notice && <p className="success-notice" role="status">{notice}</p>}
    {!loads.length && <EmptyState title="As próximas conexões aparecem aqui.">{session.role === 'buyer' ? 'Escolha uma demanda e reúna ofertas para criar uma proposta.' : 'Quando um comprador enviar uma composição com sua oferta, você poderá aceitar ou recusar.'}</EmptyState>}
    {loads.map(load => {
      const decision = load.confirmations.find(c => c.participant_id === session.id && c.proposal_version === load.version)
      const active = ['draft', 'awaiting_producers', 'awaiting_quotes', 'awaiting_final_approval', 'awaiting_payment'].includes(load.status)
      const expired = load.expires_at && new Date(load.expires_at) <= new Date()
      return <article className="wide-card m2-load" key={load.id}><div className="card-heading"><div><p className="eyebrow">PROPOSTA {load.id.slice(0, 8)} · VERSÃO {load.version}</p><h3>{dateLabel(load.scheduled_date)} · destino fictício</h3></div><StatusBadge tone="pending">{expired && active ? 'Prazo encerrado · atualize' : statusLabel(load.status)}</StatusBadge></div><p>{load.destination_address}</p>
        <ul className="m2-items">{load.items.map(item => <li key={item.id}><strong>{item.producer_name} · {item.product_name}</strong><span>{quantity(item.quantity)} {item.unit} × {currency(item.unit_price_cents)} = {currency(item.gross_cents)}</span><small>Mínimo acordado: {currency(item.minimum_cents)} · coleta: {item.pickup_address}</small></li>)}</ul>
        <p>{session.role === 'buyer' ? `Alimentos: ${currency(load.subtotal_cents)}. ` : ''}Taxa zero · sem pagamento ou transporte agendado.</p>
        {['awaiting_quotes','awaiting_final_approval','awaiting_payment'].includes(load.status) && <ActionLink href="/operacoes">Ver transporte, valores e aceites finais</ActionLink>}
        {load.expires_at && <p><strong>Reserva até {timestampLabel(load.expires_at)} (São Paulo).</strong></p>}
        {load.reason && <p>Motivo: {load.reason}</p>}
        {load.status === 'draft' && <p>Composição candidata salva. Nenhum estoque reservado. Prazo configurado: {load.reservation_hours} horas, limitado pela disponibilidade e data desejada.</p>}
        <div className="m2-actions">{session.role === 'buyer' && load.status === 'draft' && <button className="button" disabled={pending} onClick={() => act('submit', load)}>Enviar aos produtores e reservar</button>}
          {session.role === 'buyer' && active && <button className="button button-outline" disabled={pending} onClick={() => { setCancel(load); setReason(''); setError('') }}>Cancelar proposta</button>}
          {session.role === 'producer' && load.status === 'awaiting_producers' && !decision && !expired && <><button className="button" disabled={pending} onClick={() => act('respond', load, { decision: 'accepted' })}>Aceitar fornecimento</button><button className="button button-outline" disabled={pending} onClick={() => act('respond', load, { decision: 'rejected' })}>Recusar e liberar proposta</button></>}
        </div>{decision && <p role="status">Sua resposta: {decision.decision === 'accepted' ? 'aceite registrado' : 'recusa registrada'} para a versão {load.version}.</p>}
        {load.confirmations.length > 0 && <p>{load.confirmations.filter(c => c.decision === 'accepted').length} aceite(s) de produtor registrado(s) nesta versão.</p>}
        <details><summary>Histórico da proposta</summary><ol>{load.events.map(e => <li key={e.id}>{timestampLabel(e.created_at)} · {e.event}</li>)}</ol></details>
      </article>
    })}
    {cancel && <Modal title="Cancelar proposta?" onClose={() => { if (!pending) setCancel(null) }}><p>As reservas serão liberadas. Para mudar quantidades, preços ou datas, remonte uma nova proposta.</p><form onSubmit={e => { e.preventDefault(); act('cancel', cancel, { reason }) }}><label className="field"><span>Motivo do cancelamento</span><input required maxLength={500} value={reason} onChange={e => setReason(e.target.value)} /></label>{error && <ErrorNotice>{error}</ErrorNotice>}<div className="form-actions"><button type="button" className="button button-outline" disabled={pending} onClick={() => setCancel(null)}>Manter proposta</button><button className="button button-danger" disabled={pending || !reason.trim()}>Cancelar e liberar saldo</button></div></form></Modal>}
  </section>
}
