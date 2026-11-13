import { useState } from 'react'
import { ErrorNotice } from '../../components/ui'
import { currency, quantity } from '../../domain/offers'
import { compositionAlternatives } from '../../domain/inclusion'
import { m4 } from '../../services/m4'

export default function InclusionComparison({ demand, disabled, onChoose, request = m4 }) {
  const [state, setState] = useState({ loading: false, error: '', candidates: null })
  const alternatives = state.candidates && compositionAlternatives(state.candidates, demand)
  async function compare() {
    setState({ loading: true, error: '', candidates: null })
    try { setState({ loading: false, error: '', candidates: await request('candidates', { id: demand.id }) }) }
    catch (error) { setState({ loading: false, error: error.message, candidates: null }) }
  }
  return <section className="m4-analysis" aria-label="Comparação de composições">
    <p className="eyebrow">PRÉVIA EM AVALIAÇÃO</p><h3>Mais caminhos para compor.</h3>
    <p>Compare duas candidatas: preço dos alimentos e prioridade a produtores com menos vendas concluídas na plataforma, com desempate pela oferta mais antiga. Frete e viabilidade final dependem de cotação e aceites.</p>
    <button className="button button-outline" disabled={disabled || state.loading} onClick={compare}>{state.loading ? 'Consultando histórico…' : 'Comparar composições'}</button>
    {state.loading && <p role="status">Consultando saldo e histórico da plataforma…</p>}
    {state.error && <ErrorNotice retry={compare}>{state.error}</ErrorNotice>}
    {alternatives && <>
      <p role="status">{alternatives.inclusive.complete ? `Diferença da inclusiva para o menor valor de alimentos entre estas duas candidatas: ${currency(alternatives.difference)}.` : `Saldo insuficiente: faltam ${quantity(alternatives.inclusive.missing)} ${demand.unit}. Sua demanda permanece inalterada.`}</p>
      <div className="m4-alternatives">{[['price', 'Candidata por preço dos alimentos'], ['inclusive', 'Candidata inclusiva']].map(([key, title]) => {
        const alternative = alternatives[key]
        return <article key={key} className="m4-candidate"><h4>{title}</h4><p><strong>Alimentos {currency(alternative.subtotal)}</strong> · frete a cotar · total pendente</p>
          <ul>{alternative.items.map(item => <li key={item.id}><strong>{item.producer_name}</strong> · {quantity(item.quantity)} {item.unit} · {currency(item.gross_cents)}<br /><small>{item.completed_sales} venda(s) concluída(s) na plataforma · oferta aguardando há {quantity(item.waiting_days)} dia(s). Mínimo desta seleção: {currency(item.minimum_cents)}.</small></li>)}</ul>
          <button className="text-link" disabled={disabled || !alternative.complete} onClick={() => onChoose(state.candidates, Object.fromEntries(alternative.items.map(i => [i.id, i.quantity])))}>Usar esta candidata</button>
        </article>
      })}</div>
      <p className="inline-caption">Sem histórico de entregas, zero vendas significa ausência de vendas concluídas registradas; o desempate usa a idade da oferta. A sugestão não garante venda nem ótimo global. Mínimos individuais preservados, sem descontos. Não há comparação de frete entre composições diferentes.</p>
    </>}
  </section>
}
