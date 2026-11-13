import { useState } from 'react'
import { ErrorNotice } from '../../components/ui'
import { currency } from '../../domain/offers'
import { comparableQuotes } from '../../domain/route-analysis'
import { m4 } from '../../services/m4'

const stopLabel = { departure: 'Saída', pickup: 'Coleta', destination: 'Destino', return: 'Retorno acordado' }

export function QuoteComparison({ load }) {
  const groups = comparableQuotes(load).filter(group => group.length > 1)
  return <section className="m4-analysis" aria-label="Comparação de cotações"><p className="eyebrow">PRÉVIA EM AVALIAÇÃO</p><h3>Compare o mesmo serviço.</h3>
    <p>Cotações da versão atual, dentro da validade, com a mesma saída, coletas, destino, retorno, horários, conservação e serviços incluídos.</p>
    {!groups.length ? <p>Ainda não há duas cotações comparáveis. Saídas, horários ou serviços diferentes não comprovam menor frete para o mesmo roteiro.</p> : groups.map(group => <div key={group[0].id} className="m4-alternatives">{group.map((quote, index) => <article className="m4-candidate" key={quote.id}><h4>Cotação {quote.id.slice(0, 8)}</h4><dl className="money-list"><div><dt>Frete fechado</dt><dd>{currency(quote.total_cents)}</dd></div><div><dt>Total comprador</dt><dd>{currency(quote.buyerTotal)}</dd></div><div><dt>Diferença para o menor deste grupo</dt><dd>{currency(quote.total_cents - group[0].total_cents)}</dd></div></dl><p>{index === 0 ? 'Menor valor entre as cotações deste grupo.' : 'Alternativa comparável.'} Pedágios incluídos; taxa zero. A seleção e os aceites continuam necessários.</p></article>)}</div>)}
  </section>
}

export default function RouteAnalysis({ load, quote, request = m4 }) {
  const [state, setState] = useState({ loading: false, error: '', route: null })
  async function inspect() {
    setState({ loading: true, error: '', route: null })
    try { setState({ loading: false, error: '', route: await request('route', { id: load.id, version: load.version, quote_id: quote.id }) }) }
    catch (error) { setState({ loading: false, error: error.message, route: null }) }
  }
  return <div className="m4-route"><button className="text-link" disabled={state.loading} onClick={inspect}>{state.loading ? 'Consultando roteiro…' : 'Conferir roteiro e dados de rota (M4)'}</button>
    {state.loading && <p role="status">Consultando a cotação no servidor…</p>}
    {state.error && <ErrorNotice retry={inspect}>{state.error}</ErrorNotice>}
    {state.route && <section aria-label="Roteiro manual da cotação"><p role="status"><strong>Roteiro manual · API de rotas não habilitada.</strong></p><ol className="m3-route">{state.route.stops.map((stop, index) => <li key={index}>{stopLabel[stop.kind]}: {stop.address}{stop.producerName && ` · ${stop.producerName}`}</li>)}</ol>
      <dl className="money-list"><div><dt>Distância</dt><dd>Indisponível</dd></div><div><dt>Tempo de direção</dt><dd>Indisponível</dd></div><div><dt>Tempo de paradas</dt><dd>A confirmar</dd></div><div><dt>Pedágio individual</dt><dd>A confirmar</dd></div><div><dt>Frete completo da cotação</dt><dd>{currency(state.route.freightCents)}</dd></div></dl>
      <p className="inline-caption">Dados da cotação fictícia consultada. Combustível, pedágios, coletas, descarga e retorno acordado já estão cobertos pelo frete fechado. Nenhum custo é somado novamente. Distância e tempo não são deduzidos dos horários; a cotação manual continua disponível sem cálculo externo.</p>
    </section>}
  </div>
}
