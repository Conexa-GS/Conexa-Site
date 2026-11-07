import { useState } from 'react'
import { PageHeading, EmptyState, ErrorNotice, ActionLink, StatusBadge } from '../../components/ui'
import { currency, centsFromInput, dateLabel, quantity } from '../../domain/offers'
import { conservationLabel, financialSummary } from '../../domain/transport'
import { useM3 } from '../../hooks/useM3'
import { m3 } from '../../services/m3'
import { m2, statusLabel, timestampLabel } from '../../services/m2'

const conditions = <><option value="ambient">Ambiente protegido</option><option value="refrigerated">Refrigerado</option></>
function Field({ label, children }) { return <label className="field"><span>{label}</span>{children}</label> }
function QuoteForm({ load, vehicles, pending, submit }) {
  return <form className="m3-form" onSubmit={e => {
    e.preventDefault()
    const fields = Object.fromEntries(new FormData(e.currentTarget))
    submit('quote', { id: load.id, version: load.version, ...fields, total_cents: centsFromInput(fields.price), departure_time: new Date(fields.departure_time).toISOString(), delivery_time: new Date(fields.delivery_time).toISOString(), expires_at: new Date(fields.expires_at).toISOString(), services_included: { fuel: true, tolls: true, pickups: true, unloading: true } }, e.currentTarget)
  }}><h3>Cotação manual do roteiro completo</h3>
    {load.quotes.some(q => q.status === 'indicated') && <Field label="Indicação recebida (opcional)"><select name="indication_id" defaultValue=""><option value="">Cotação própria</option>{load.quotes.filter(q => q.status === 'indicated').map(q => <option key={q.id} value={q.id}>Indicação · {currency(q.total_cents)}</option>)}</select></Field>}
    <Field label="Seu veículo"><select name="vehicle_id" required defaultValue=""><option value="">Selecione</option>{vehicles.map(v => <option value={v.id} key={v.id}>{v.description} · {quantity(v.capacity_kg)} kg · {conservationLabel(v.conservation_conditions)}</option>)}</select></Field>
    <Field label="Saída do transportador (local fictício)"><input name="departure_address" required maxLength={200} /></Field>
    <Field label="Conservação exigida para esta carga (confirmada pelo transportador)"><select name="conservation_required">{conditions}</select></Field>
    <Field label="Saída (horário do dispositivo)"><input name="departure_time" type="datetime-local" required /></Field>
    <Field label={`Entrega em ${dateLabel(load.scheduled_date)} (horário do dispositivo)`}><input name="delivery_time" type="datetime-local" required /></Field>
    <Field label="Validade da cotação (horário do dispositivo; limitada à reserva)"><input name="expires_at" type="datetime-local" required /></Field>
    <Field label="Frete final completo (R$)"><input name="price" inputMode="decimal" required pattern="[0-9]+([,.][0-9]{1,2})?" /></Field>
    <Field label="Retorno acordado (local fictício, opcional; incluído no frete)"><input name="return_address" maxLength={200} /></Field>
    <label className="m3-check"><input type="checkbox" required />Confirmo o roteiro exibido, as condições e o valor final, incluindo combustível, pedágios, todas as coletas, descarga e eventual retorno. Sem custos obrigatórios adicionais.</label>
    <p className="inline-caption">Dados do cenário fictício, sem certificado sanitário. Distância e duração não foram calculadas; pedágio individual a confirmar, coberto pelo frete fechado.</p>
    <button className="button" disabled={pending || !vehicles.length}>Confirmar cotação fictícia</button>
  </form>
}
function Money({ load, role }) {
  const summary = financialSummary(load)
  return <section className="m3-money"><h3>Valores individuais</h3>{summary.producers.map(p => <p key={p.id}><strong>{p.name}</strong> · bruto e líquido {currency(p.gross)} · mínimo {currency(p.minimum)} · {p.gross >= p.minimum ? 'mínimo preservado' : 'mínimo violado'}</p>)}<p>Sem descontos. Frete pago pelo comprador; taxa da plataforma {currency(0)}.</p>{role !== 'producer' && <p><strong>Alimentos: {currency(summary.subtotal)} · Frete: {summary.freight === null ? 'pendente' : currency(summary.freight)} · Total: {summary.total === null ? 'pendente' : currency(summary.total)}</strong></p>}</section>
}
export default function TransportPage({ session, vehiclesOnly = false }) {
  const state = useM3(session)
  const [pending, setPending] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('')
  async function submit(action, payload, form) {
    setPending(true); setError(''); setNotice('')
    try {
      if (payload.indication_id === '') delete payload.indication_id
      if (action === 'cancel') await m2(action, payload)
      else await m3(action, payload)
      form?.reset(); setNotice('Registro salvo no Supabase.'); state.reload()
    } catch (failure) { setError(failure.message); state.reload() }
    finally { setPending(false) }
  }
  return <><PageHeading eyebrow="TRANSPORTE E VALORES CLAROS" title={vehiclesOnly ? 'Seu veículo,' : 'Da coleta à mesa,'} accent={vehiclesOnly ? 'o cuidado certo.' : 'cada parte importa.'}>M3 · demonstração persistida no Supabase com participantes fictícios. Nenhum pagamento, agendamento ou transporte físico é realizado.</PageHeading>
    <div className="section-toolbar"><h2>{vehiclesOnly ? 'Meus veículos' : 'Transporte e confirmações'}</h2><button className="text-link" onClick={state.reload}>Atualizar</button></div>
    {error && <ErrorNotice>{error}</ErrorNotice>}{notice && <p className="success-notice" role="status">{notice}</p>}
    {state.error ? <ErrorNotice retry={state.reload}>{state.error}</ErrorNotice> : state.loading ? <p role="status">Carregando transporte…</p> : vehiclesOnly ? <>
      <form className="wide-card m3-form" onSubmit={e => { e.preventDefault(); submit('save_vehicle', Object.fromEntries(new FormData(e.currentTarget)), e.currentTarget) }}><h3>Cadastrar veículo fictício</h3>
        <Field label="Descrição"><input name="description" required maxLength={120} /></Field><Field label="Categoria do veículo"><input name="vehicle_category" required maxLength={80} /></Field><Field label="Capacidade em kg"><input name="capacity_kg" type="number" min="0.001" max="1000000" step="0.001" required /></Field><Field label="Conservação disponível"><select name="conservation_conditions">{conditions}</select></Field><button className="button" disabled={pending}>Salvar veículo</button>
      </form>{!state.vehicles.length && <EmptyState title="Cadastre seu primeiro veículo.">Capacidade e conservação serão verificadas antes da aprovação.</EmptyState>}{state.vehicles.map(v => <article className="wide-card" key={v.id}><h3>{v.description}</h3><p>{v.vehicle_category} · {quantity(v.capacity_kg)} kg · {conservationLabel(v.conservation_conditions)}</p><p>Cadastro preservado no histórico; para outras condições, cadastre outro veículo.</p></article>)}
    </> : <>{!state.loads.length && <EmptyState title="As próximas conexões aparecem aqui.">As propostas chegam após o envio e o aceite dos fornecimentos.</EmptyState>}{state.loads.map(load => {
      const selected = load.quotes.find(q => q.id === load.selected_quote_id)
      const confirmed = load.confirmations.some(c => c.participant_id === session.id && c.proposal_version === load.version && c.decision === 'accepted')
      const participant = session.role !== 'carrier' || selected?.carrier_id === session.id
      return <article className="wide-card m2-load" key={load.id}><div className="card-heading"><h2>Proposta {load.id.slice(0, 8)} · v{load.version}</h2><StatusBadge tone="pending">{statusLabel(load.status)}</StatusBadge></div><p>Entrega: {dateLabel(load.scheduled_date)} · {load.destination_address}</p><p><strong>Reserva até {timestampLabel(load.expires_at)} (São Paulo).</strong></p>
        <h3>Roteiro completo</h3><ol className="m3-route"><li>Saída: {selected?.departure_address || 'a informar na cotação'}</li>{load.items.map(i => <li key={i.id}>Coleta: {i.pickup_address} · {i.producer_name} · {quantity(i.quantity)} {i.unit}</li>)}<li>Destino: {load.destination_address}</li>{selected?.return_address && <li>Retorno acordado: {selected.return_address}</li>}</ol><p>Distância e tempo de direção indisponíveis · paradas sem estimativa · pedágio individual a confirmar, incluído no frete fechado.</p>
        <Money load={load} role={session.role} />
        {load.quotes.map(q => <div className="m3-quote" key={q.id}><h3>{q.status === 'indicated' ? 'Indicação pendente do transportador' : q.id === load.selected_quote_id ? 'Cotação selecionada' : 'Cotação confirmada pelo transportador'} · {currency(q.total_cents)}</h3><p>Versão {q.load_version} · {state.carriers.find(c => c.id === q.carrier_id)?.display_name || 'Transportador fictício'}</p>{q.status === 'confirmed' && <><p>Saída: {q.departure_address} · {timestampLabel(q.departure_time)} → entrega {timestampLabel(q.delivery_time)} (São Paulo).</p><p>Conservação: {conservationLabel(q.conservation_required)} · validade {timestampLabel(q.expires_at)}. Combustível, pedágios, coletas, descarga e retorno acordado incluídos.</p>{q.return_address && <p>Retorno: {q.return_address}</p>}</>}{session.role === 'buyer' && load.status === 'awaiting_quotes' && q.status === 'confirmed' && q.load_version === load.version && <button className="button button-outline" disabled={pending} onClick={() => submit('select_quote', { id: load.id, version: load.version, quote_id: q.id })}>Selecionar e pedir novos aceites</button>}</div>)}
        {session.role === 'producer' && load.status === 'awaiting_quotes' && <form className="m3-form" onSubmit={e => { e.preventDefault(); const fields = Object.fromEntries(new FormData(e.currentTarget)); submit('indicate', { id: load.id, version: load.version, carrier_id: fields.carrier_id, total_cents: centsFromInput(fields.price) }, e.currentTarget) }}><h3>Indicar transportador fictício</h3><Field label="Transportador"><select name="carrier_id" required>{state.carriers.map(c => <option key={c.id} value={c.id}>{c.display_name}</option>)}</select></Field><Field label="Preço sugerido (R$)"><input name="price" required inputMode="decimal" pattern="[0-9]+([,.][0-9]{1,2})?" /></Field><button className="button button-outline" disabled={pending}>Enviar indicação pendente</button></form>}
        {session.role === 'carrier' && load.status === 'awaiting_quotes' && <><ActionLink href="/transportador/veiculos">Cadastrar veículo</ActionLink><QuoteForm load={load} vehicles={state.vehicles} pending={pending} submit={submit} /></>}
        {load.status === 'awaiting_final_approval' && participant && (confirmed ? <p role="status">Seu aceite final está registrado nesta versão.</p> : <button className="button" disabled={pending} onClick={() => submit('confirm', { id: load.id, version: load.version })}>{session.role === 'buyer' ? 'Aprovar total final desta versão' : 'Confirmar condições finais desta versão'}</button>)}
        {load.status === 'awaiting_payment' && <p className="success-notice">Aceites finais completos. Pagamento simulado é uma etapa futura (M5); nenhum transporte foi agendado.</p>}
        {session.role === 'buyer' && ['awaiting_quotes','awaiting_final_approval','awaiting_payment'].includes(load.status) && <form className="m3-form" onSubmit={e => { e.preventDefault(); submit('cancel', { id: load.id, version: load.version, reason: new FormData(e.currentTarget).get('reason') }, e.currentTarget) }}><p>Mudanças no roteiro, preço, datas ou itens exigem cancelar e remontar; os aceites anteriores ficam no histórico.</p><Field label="Motivo do cancelamento"><input name="reason" required maxLength={500} /></Field><button className="button button-outline" disabled={pending}>Cancelar proposta e liberar reservas</button></form>}
        <details><summary>Histórico e aceites</summary><p>{load.confirmations.filter(c => c.proposal_version === load.version && c.decision === 'accepted').length} aceite(s) nesta versão.</p><ol>{load.events.map(event => <li key={event.id}>{timestampLabel(event.created_at)} · {event.event}</li>)}</ol></details>
      </article>
    })}</>}
  </>
}
