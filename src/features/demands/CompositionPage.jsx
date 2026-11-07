import { useEffect, useState } from 'react'
import { BackLink, EmptyState, ErrorNotice, PageHeading } from '../../components/ui'
import { currency, lineTotalCents, quantity } from '../../domain/offers'
import { selectionSummary } from '../../domain/demands'
import { m2 } from '../../services/m2'
import { navigate } from '../../hooks/useRouter'

export default function CompositionPage({ demandId }) {
  const [state, setState] = useState({ loading: true, error: '', demand: null, candidates: [] })
  const [selected, setSelected] = useState({})
  const [hours, setHours] = useState('24')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let active = true
    Promise.all([m2('list'), m2('candidates', { id: demandId })]).then(([data, candidates]) => {
      const demand = data.demands.find(d => d.id === demandId)
      if (!demand) throw new Error('Demanda não encontrada para este comprador.')
      if (active) setState({ loading: false, error: '', demand, candidates })
    }).catch(failure => { if (active) setState(previous => ({ ...previous, loading: false, error: failure.message })) })
    return () => { active = false }
  }, [demandId, revision])
  const summary = selectionSummary(state.candidates, selected, state.demand?.quantity || 0)
  const subtotal = summary.valid ? summary.items.reduce((sum, item) => sum + lineTotalCents(state.candidates.find(o => o.id === item.offer_id).unit_price_cents, item.quantity), 0) : 0
  const validHours = /^\d+$/.test(hours) && Number(hours) >= 1 && Number(hours) <= 168
  async function save() {
    setPending(true); setError('')
    try { await m2('draft', { id: demandId, items: summary.items, hours: Number(hours) }); navigate('/comprador/demandas') }
    catch (failure) { setError(failure.message) }
    finally { setPending(false) }
  }
  return <><BackLink href="/comprador/demandas">Minhas demandas</BackLink><PageHeading eyebrow="PEQUENAS OFERTAS, UM PEDIDO" title="Junte a colheita." accent="Compartilhe o caminho.">Escolha ofertas do mesmo alimento, unidade e prazo. A seleção é candidata, com frete e viabilidade pendentes.</PageHeading>
    {state.loading ? <p role="status">Buscando candidatas…</p> : state.error ? <ErrorNotice retry={() => setRevision(n => n + 1)}>{state.error}</ErrorNotice> : <div className="split-content"><section className="wide-card"><h2>{state.demand.product_name} · {quantity(state.demand.quantity)} {state.demand.unit}</h2><p>Destino: {state.demand.destination_address}</p><button className="text-link" onClick={() => setRevision(n => n + 1)}>Atualizar saldo</button>
      {!state.candidates.length && <EmptyState title="Nenhuma oferta compatível.">Verifique alimento, unidade e disponibilidade. Sua demanda não foi reduzida.</EmptyState>}
      {state.candidates.map(offer => <div className="composition-row" key={offer.id}><div><strong>{offer.producer_name}</strong><p>{quantity(offer.quantity_free)} {offer.unit} livres · {currency(offer.unit_price_cents)}/{offer.unit}</p><small>Mínimo: {currency(offer.minimum_net_unit_cents)}/{offer.unit} · {offer.pickup_address}</small></div><label className="field"><span>Selecionar de {offer.producer_name} ({offer.unit})</span><input inputMode="decimal" value={selected[offer.id] ?? '0'} onChange={e => setSelected(values => ({ ...values, [offer.id]: e.target.value }))} /></label></div>)}
      <p className="inline-caption">Encontrados {quantity(state.candidates.reduce((sum, o) => sum + Number(o.quantity_free), 0))} {state.demand.unit} compatíveis. Caixas ou outras unidades sem conversão não são somadas a kg. Região não exclui produtores distantes. Ranking de inclusão será tratado na M4.</p>
    </section><aside className="summary-panel"><p className="eyebrow">COMPOSIÇÃO CANDIDATA</p><h2>{quantity(summary.selected)}<small> / {quantity(state.demand.quantity)} {state.demand.unit}</small></h2><p role="status">{!summary.valid ? 'Revise quantidades e saldo: até 3 casas decimais.' : summary.missing > 0 ? `Faltam ${quantity(summary.missing)} ${state.demand.unit}. A demanda permanece inalterada.` : summary.missing < 0 ? `Seleção excede a demanda em ${quantity(-summary.missing)} ${state.demand.unit}.` : 'Quantidade atendida. Salve para revisar antes de enviar.'}</p><dl className="money-list"><div><dt>Alimentos</dt><dd>{summary.valid ? currency(subtotal) : '—'}</dd></div><div><dt>Frete</dt><dd>A cotar</dd></div><div><dt>Taxa</dt><dd>R$ 0,00</dd></div></dl><label className="field"><span>Prazo da reserva (horas)</span><input type="number" min="1" max="168" step="1" value={hours} onChange={e => setHours(e.target.value)} aria-describedby="reservation-help" /></label><p className="inline-caption" id="reservation-help">Padrão 24 horas. De 1 a 168 horas, limitado pela disponibilidade e data desejada. Começa no envio aos produtores; salvar não reserva.</p>{error && <ErrorNotice>{error}</ErrorNotice>}<button className="button" disabled={pending || !summary.complete || !validHours} onClick={save}>{pending ? 'Salvando…' : 'Salvar composição candidata'}</button></aside></div>}
  </>
}
