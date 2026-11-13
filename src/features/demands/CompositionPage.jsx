import { useEffect, useId, useState } from 'react'
import { BackLink, EmptyState, ErrorNotice, PageHeading } from '../../components/ui'
import { currency, lineTotalCents, quantity } from '../../domain/offers'
import { selectionSummary } from '../../domain/demands'
import { m2 } from '../../services/m2'
import { navigate } from '../../hooks/useRouter'
import { sendComposition } from '../../services/composition'
import InclusionComparison from './InclusionComparison'

export default function CompositionPage({ demandId }) {
  const fieldId = useId()
  const [state, setState] = useState({ loading: true, error: '', demand: null, candidates: [] })
  const [selected, setSelected] = useState({})
  const [hours, setHours] = useState('24')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const [draft, setDraft] = useState(null)
  useEffect(() => {
    let active = true
    Promise.all([m2('list'), m2('candidates', { id: demandId })]).then(([data, candidates]) => {
      const demand = data.demands.find(d => d.id === demandId)
      if (!demand) throw new Error('Demanda não encontrada para este comprador.')
      const proposal = data.loads.find(load => load.demand_id === demandId && !['cancelled','expired'].includes(load.status))
      if (active) {
        setState({ loading: false, error: '', demand, candidates, proposal })
        if (proposal?.status === 'draft') {
          setDraft(proposal)
          setSelected(Object.fromEntries(proposal.items.map(item => [item.offer_id, item.quantity])))
          setHours(String(proposal.reservation_hours))
        }
      }
    }).catch(failure => { if (active) setState(previous => ({ ...previous, loading: false, error: failure.message })) })
    return () => { active = false }
  }, [demandId, revision])
  const summary = selectionSummary(state.candidates, selected, state.demand?.quantity || 0)
  const subtotal = draft?.subtotal_cents ?? (summary.valid ? summary.items.reduce((sum, item) => sum + lineTotalCents(state.candidates.find(o => o.id === item.offer_id).unit_price_cents, item.quantity), 0) : 0)
  const validHours = /^\d+$/.test(hours) && Number(hours) >= 1 && Number(hours) <= 168
  async function save() {
    setPending(true); setError('')
    try {
      await sendComposition(m2, { demandId, items: summary.items, hours: Number(hours), draft, onDraft: setDraft })
      navigate('/comprador/demandas')
    }
    catch (failure) { setError(failure.message) }
    finally { setPending(false) }
  }
  if (state.proposal && state.proposal.status !== 'draft') return <><BackLink href="/comprador/demandas">Meus pedidos</BackLink><EmptyState title="Esta demanda já tem uma proposta enviada.">Acompanhe as respostas em Meus pedidos. Para alterar a composição, cancele a proposta atual antes de remontar.</EmptyState></>
  return <><BackLink href="/comprador/demandas">Meus pedidos</BackLink><PageHeading title="Escolher produtores">O envio reserva os alimentos. Frete e compra dependem das próximas confirmações.</PageHeading>
    <ol className="demand-steps" aria-label="Etapas do pedido"><li>Pedido cadastrado</li><li aria-current="step">Escolher produtores</li><li>Enviar e acompanhar respostas</li></ol>
    {state.loading ? <p role="status">Buscando ofertas…</p> : state.error ? <ErrorNotice retry={() => setRevision(n => n + 1)}>{state.error}</ErrorNotice> : <div className="split-content"><section className="wide-card"><h2>{state.demand.product_name} · {quantity(state.demand.quantity)} {state.demand.unit}</h2><p>Destino: {state.demand.destination_address}</p><button className="text-link" onClick={() => setRevision(n => n + 1)}>Atualizar saldo</button>
      {!state.candidates.length && <EmptyState title="Nenhuma oferta compatível.">Verifique alimento, unidade e disponibilidade. Sua demanda não foi reduzida.</EmptyState>}
      {!draft && <InclusionComparison key={revision} demand={state.demand} disabled={pending} onChoose={(candidates, values) => { setState(previous => ({ ...previous, candidates })); setSelected(values) }} />}
      {draft ? <><h3>Composição salva para envio</h3><p>Esta composição já está salva. Tente enviar novamente ou volte à lista para cancelar e remontar.</p>{draft.items?.map(item => <p key={item.id}>{item.producer_name} · {quantity(item.quantity)} {item.unit} · {currency(item.gross_cents)}</p>)}</> : state.candidates.map((offer, index) => <div className="composition-row" key={offer.id}><div><strong>{offer.producer_name}</strong><p>{quantity(offer.quantity_free)} {offer.unit} livres · {currency(offer.unit_price_cents)}/{offer.unit}</p><small>Mínimo: {currency(offer.minimum_net_unit_cents)}/{offer.unit} · {offer.pickup_address}</small></div><label className="field"><span>Oferta {index + 1}: selecionar de {offer.producer_name} ({offer.unit})</span><input aria-invalid={!selectionSummary([offer], selected, 0).valid} aria-describedby={!selectionSummary([offer], selected, 0).valid ? `${fieldId}-${offer.id}-error` : undefined} disabled={pending} inputMode="decimal" value={selected[offer.id] ?? '0'} onChange={e => setSelected(values => ({ ...values, [offer.id]: e.target.value }))} />{!selectionSummary([offer], selected, 0).valid && <small className="field-error" id={`${fieldId}-${offer.id}-error`}>Informe de 0 a {quantity(offer.quantity_free)} {offer.unit}, com até 3 casas decimais.</small>}</label></div>)}
      <p className="inline-caption">Encontrados {quantity(state.candidates.reduce((sum, o) => sum + Number(o.quantity_free), 0))} {state.demand.unit} compatíveis. Caixas ou outras unidades sem conversão não são somadas a kg. Região não exclui produtores distantes. A sugestão inclusiva só altera sua seleção quando você escolhe usá-la.</p>
    </section><aside className="summary-panel"><p className="eyebrow">REVISE E ENVIE</p><h2>{quantity(draft?.items ? draft.items.reduce((sum, item) => sum + Number(item.quantity), 0) : summary.selected)}<small> / {quantity(state.demand.quantity)} {state.demand.unit}</small></h2><p role="status">{draft ? 'Composição salva. O envio ainda precisa ser concluído; tente novamente abaixo.' : !summary.valid ? 'Revise quantidades e saldo: até 3 casas decimais.' : summary.missing > 0 ? `Faltam ${quantity(summary.missing)} ${state.demand.unit}. A demanda permanece inalterada.` : summary.missing < 0 ? `Seleção excede a demanda em ${quantity(-summary.missing)} ${state.demand.unit}.` : 'Quantidade atendida. Ao enviar, os produtores recebem a proposta para responder.'}</p><dl className="money-list"><div><dt>Alimentos</dt><dd>{draft || summary.valid ? currency(subtotal) : '—'}</dd></div><div><dt>Frete</dt><dd>A cotar</dd></div><div><dt>Taxa</dt><dd>R$ 0,00</dd></div></dl><label className="field"><span>Prazo da reserva (horas)</span><input disabled={pending || Boolean(draft)} type="number" min="1" max="168" step="1" value={hours} onChange={e => setHours(e.target.value)} aria-invalid={!validHours} aria-describedby={`reservation-help${!validHours ? ' reservation-error' : ''}`} />{!validHours && <small className="field-error" id="reservation-error">Informe um prazo inteiro de 1 a 168 horas.</small>}</label><p className="inline-caption" id="reservation-help">Padrão 24 horas. De 1 a 168 horas, limitado pela disponibilidade e data desejada. O banco verifica o saldo e inicia a reserva no envio. Nenhuma compra final é aprovada aqui.</p>{error && <ErrorNotice autoFocus title="Não foi possível enviar a proposta">{error} {draft && 'Sua composição está preservada; tente enviar novamente.'}</ErrorNotice>}<button className="button" disabled={pending || (!draft && (!summary.complete || !validHours))} onClick={save}>{pending ? 'Enviando aos produtores…' : draft ? 'Tentar enviar aos produtores' : 'Enviar proposta aos produtores'}</button></aside></div>}
  </>
}
