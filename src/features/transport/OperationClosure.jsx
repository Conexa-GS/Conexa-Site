import { useRef, useState } from 'react'
import { ErrorNotice } from '../../components/ui'
import { currency } from '../../domain/offers'
import { timestampLabel } from '../../services/m2'
import { m5 } from '../../services/m5'

const paymentLabel = { pending: 'Pendente', approved: 'Aprovado', declined: 'Recusado', refunded: 'Estornado' }
const executionStates = ['scheduled', 'in_transit', 'delivery_review', 'delivered']

function ReasonForm({ action, title, button, explanation, pending, onAction }) {
  return <form className="m3-form" onSubmit={e => { e.preventDefault(); onAction(action, { reason: new FormData(e.currentTarget).get('reason') }, e.currentTarget) }}>
    <h4>{title}</h4><p>{explanation}</p><label className="field"><span>{action === 'cancel' ? 'Motivo do cancelamento' : 'Descrição da ocorrência ou divergência'}</span><textarea name="reason" required maxLength={500} rows={3} /></label>
    <button className="button button-outline" disabled={pending}>{button}</button>
  </form>
}

export default function OperationClosure({ load, session, reload, request = m5 }) {
  const [pending, setPending] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('')
  const [outcome, setOutcome] = useState('pending')
  const retry = useRef(null)
  const busy = useRef(false)
  const buyer = session.role === 'buyer'
  const selected = load.quotes.find(q => q.id === load.selected_quote_id)
  const carrier = session.role === 'carrier' && selected?.carrier_id === session.id
  const open = (load.occurrences || []).some(o => o.status === 'open')
  const transit = ['in_transit', 'delivery_review'].includes(load.status)
  async function act(action, fields = {}, form) {
    if (busy.current) return
    busy.current = true
    setPending(true); setError(''); setNotice('')
    const payload = { id: load.id, version: load.version, ...fields }
    const signature = JSON.stringify({ action, ...payload })
    if (retry.current?.signature !== signature) retry.current = { signature, key: crypto.randomUUID() }
    payload.idempotency_key = retry.current.key
    try {
      await request(action, payload)
      retry.current = null
      form?.reset()
      setNotice('Simulação registrada. Atualize a lista para consultar o estado e o histórico persistidos.')
      reload()
    } catch (failure) { setError(failure.message); reload() }
    finally { busy.current = false; setPending(false) }
  }
  return <section className="m5-closure" aria-label="Fechamento simulado da operação">
    <h3>Pagamento e entrega · M5 em avaliação</h3>
    <p className="inline-note"><strong>Demonstração fictícia persistida.</strong> Não há cobrança, transferência de dinheiro ou transporte físico. Não informe cartão, CPF ou conta bancária.</p>
    {error && <ErrorNotice>{error} Os campos foram preservados. Repetir a mesma ação reutiliza sua chave de tentativa.</ErrorNotice>}
    {notice && <p role="status" className="success-notice">{notice}</p>}
    {load.status === 'awaiting_payment' && (buyer ? <form className="m3-form" onSubmit={e => { e.preventDefault(); act('pay', { outcome }) }}>
      <h4>Simular pagamento de {currency(load.total_cents)}</h4>
      <p>Pendente ou recusado mantém a reserva até o prazo exibido. Só a aprovação libera o agendamento fictício. Uma nova tentativa não cobra dinheiro.</p>
      <label className="field"><span>Resultado controlado da demonstração</span><select value={outcome} disabled={pending} onChange={e => setOutcome(e.target.value)}><option value="pending">Pendente</option><option value="declined">Recusado</option><option value="approved">Aprovado</option></select></label>
      <button className="button" disabled={pending}>{pending ? 'Registrando…' : 'Registrar pagamento simulado'}</button>
    </form> : <p>Aguardando o comprador simular o pagamento. Transporte ainda não liberado.</p>)}
    {executionStates.includes(load.status) && <p className="success-notice">Pagamento simulado aprovado · {load.status === 'scheduled' ? 'agendamento fictício liberado; aguardando o transportador iniciar.' : load.status === 'delivered' ? 'recebimento confirmado.' : 'estoque comprometido; viagem fictícia iniciada.'}</p>}
    {buyer && !!load.payments?.length && <details open><summary>Tentativas de pagamento simuladas</summary><ul className="m5-records">{load.payments.map(p => <li key={p.id}><strong>{paymentLabel[p.status]}</strong> · {currency(p.amount_cents)} · {timestampLabel(p.created_at)} (São Paulo){p.refunded_at && <> · estorno simulado em {timestampLabel(p.refunded_at)}</>}</li>)}</ul></details>}
    {carrier && load.status === 'scheduled' && <button className="button" disabled={pending} onClick={() => act('start')}>Iniciar viagem fictícia</button>}
    {transit && <>
      {buyer && <><p>Confirme somente após resolver todas as ocorrências. O recebimento gera os repasses simulados uma única vez.</p><button className="button" disabled={pending || open} onClick={() => act('receive')}>Confirmar recebimento e simular repasses</button>{open && <p>Recebimento bloqueado: há ocorrência aguardando resolução.</p>}<ReasonForm pending={pending} onAction={act} action="discrepancy" title="Recebimento com divergência" button="Registrar divergência e segurar repasses" explanation="Registre o problema antes de confirmar o recebimento." /></>}
      {!buyer && (session.role === 'producer' || carrier) && <ReasonForm pending={pending} onAction={act} action="report" title="Ocorrência durante o transporte" button="Registrar ocorrência" explanation="O comprador deverá registrar a resolução antes de confirmar o recebimento. O estoque não será liberado automaticamente." />}
    </>}
    {!!load.occurrences?.length && <div><h4>Ocorrências e resoluções</h4>{load.occurrences.map(o => <article className="m3-quote" key={o.id}><p><strong>{o.status === 'open' ? 'Em análise · repasses bloqueados' : 'Resolução registrada'}</strong> · {timestampLabel(o.created_at)}</p><p>{o.description}</p>{o.resolution && <p>Resolução: {o.resolution} · {timestampLabel(o.resolved_at)}</p>}{buyer && o.status === 'open' && <form className="m3-form" onSubmit={e => { e.preventDefault(); act('resolve', { occurrence_id: o.id, resolution: new FormData(e.currentTarget).get('resolution') }, e.currentTarget) }}><label className="field"><span>Resolução acordada para esta ocorrência</span><textarea name="resolution" required maxLength={500} rows={3} /></label><button className="button button-outline" disabled={pending}>Registrar resolução</button><p>Esta ação não confirma o recebimento nem libera repasses.</p></form>}</article>)}</div>}
    {buyer && ['awaiting_payment', 'scheduled', 'in_transit', 'delivery_review'].includes(load.status) && <ReasonForm pending={pending} onAction={act} action="cancel" title={transit ? 'Solicitar cancelamento após a saída' : 'Cancelar antes do transporte'} button={transit ? 'Registrar pedido como ocorrência' : 'Cancelar e liberar estoque'} explanation={transit ? 'Após iniciar o transporte, o pedido abre ocorrência, segura repasses e preserva o estoque em trânsito. Não há estorno automático.' : 'Informe o motivo. O estoque será liberado e um pagamento aprovado será estornado uma única vez, em simulação.'} />}
    {executionStates.includes(load.status) && <div><h4>Repasses simulados</h4>{load.status !== 'delivered' ? <p>{load.status === 'delivery_review' ? 'Em análise até resolver ocorrências e confirmar recebimento.' : 'Aguardando recebimento confirmado pelo comprador.'}</p> : <ul className="m5-records">{(load.payouts || []).map(p => <li key={p.id}>{p.kind === 'carrier' ? 'Transportador' : load.items.find(i => i.producer_id === p.recipient_id)?.producer_name || 'Produtor'} · {currency(p.amount_cents)} · simulado concluído</li>)}</ul>}</div>}
  </section>
}
