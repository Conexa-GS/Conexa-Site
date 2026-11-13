import { useId, useRef, useState } from 'react'
import { calculateFreight, freightJourney } from '../../domain/freight-estimate'
import { currency, quantity } from '../../domain/offers'
import { estimateRoute } from '../../services/routes'
import './freight-calculator.css'

export default function FreightCalculator({ load, departureAddress, returnAddress, departureTime, onApply, request = estimateRoute, disabled = false, illustrative = false }) {
  const id = useId()
  const [values, setValues] = useState({ base: '', perKm: '', minimum: '', extras: '', stopMinutes: '' })
  const [state, setState] = useState({ loading: false, error: '', route: null, signature: '' })
  const requestId = useRef(0)
  const journey = freightJourney(load, departureAddress, returnAddress)
  const signature = JSON.stringify([load.id, load.version, journey, departureTime])
  const route = state.signature === signature ? state.route : null
  let estimate, validation = ''
  if (route) {
    try { estimate = calculateFreight(route, values, departureTime) } catch (error) { validation = error.message }
  }
  async function calculate() {
    const current = ++requestId.current
    if (journey.addresses.some(address => !address) || !Number.isFinite(Date.parse(departureTime))) {
      setState({ loading: false, error: 'Informe saída, coletas, destino e horário de saída antes de calcular.', route: null, signature })
      return
    }
    setState({ loading: true, error: '', route: null, signature })
    try {
      const result = await request(journey)
      if (current === requestId.current) setState({ loading: false, error: '', route: result, signature })
    } catch (error) {
      if (current === requestId.current) setState({ loading: false, error: error.message, route: null, signature })
    }
  }
  const timeLabel = value => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date(value))
  return <fieldset className="freight-calculator" disabled={disabled} aria-busy={state.loading}>
    <legend>Frete e entrega por distância</legend>
    <p>Google Maps calcula o trajeto na ordem abaixo. As tarifas são suas; o frete e a previsão são recalculados ao ajustar os valores, sem nova consulta ao Google.</p>
    <ol className="freight-stops">{journey.addresses.map((address, index) => <li key={index}><strong>{index === 0 ? 'Saída' : index === journey.deliveryIndex ? 'Entrega' : index > journey.deliveryIndex ? 'Retorno' : `Coleta ${index}`}:</strong> {address || 'A informar'}</li>)}</ol>
    <div className="freight-fields">{[['base', 'Valor base (R$)'], ['perKm', 'Preço por km (R$)'], ['minimum', 'Frete mínimo (R$)'], ['extras', 'Adicionais totais (R$)'], ['stopMinutes', 'Paradas antes da entrega (minutos totais)']].map(([name, label]) => <label className="field" key={name} htmlFor={`${id}-${name}`}><span>{label}</span><input id={`${id}-${name}`} inputMode={name === 'stopMinutes' ? 'numeric' : 'decimal'} value={values[name]} maxLength={12} onChange={event => setValues(previous => ({ ...previous, [name]: event.target.value }))} /></label>)}</div>
    <p className="inline-caption">Frete = maior entre mínimo e (base + km × preço por km), mais adicionais. Use 0 explicitamente quando não houver custo. Inclua nos adicionais os custos obrigatórios ainda não cobertos pela tarifa, sem duplicá-los. Pedágio não é calculado pelo Google nesta consulta.</p>
    <button type="button" className="button button-outline" onClick={calculate} disabled={disabled || state.loading}>{state.loading ? 'Calculando trajeto…' : 'Calcular com Google Maps'}</button>
    <p className="inline-caption">Ao calcular, os locais deste roteiro serão enviados ao Google. Use rua, cidade e UF ou coordenadas; nomes fictícios isolados podem não ser encontrados. {illustrative ? 'Neste exemplo são usadas as coordenadas inventadas do mapa de Botucatu. O resultado é ilustrativo e não altera nenhuma cotação.' : 'O mapa ilustrativo de Botucatu é independente deste cálculo.'}</p>
    {state.loading && <p role="status">Consultando distância e tempo de direção…</p>}
    {state.signature === signature && state.error && <p className="field-error" role="alert">{state.error}</p>}
    {!route && state.route && <p role="status">Roteiro ou saída alterados. Calcule novamente antes de usar a estimativa.</p>}
    {route && <div className="freight-result" aria-live="polite"><p className="eyebrow">TRAJETO ESTIMADO</p><p className="google-routes-attribution">Google Maps</p><dl className="money-list">
      <div><dt>Distância total{ returnAddress.trim() ? ' com retorno' : ''}</dt><dd>{quantity(route.distanceMeters / 1000)} km</dd></div>
      <div><dt>Direção até a entrega</dt><dd>{Math.ceil(route.deliverySeconds / 60)} min</dd></div>
      <div><dt>Direção do percurso completo</dt><dd>{Math.ceil(route.totalSeconds / 60)} min</dd></div>
      <div><dt>Paradas antes da entrega</dt><dd>{estimate ? `${estimate.stopMinutes} min` : 'A informar'}</dd></div>
      <div><dt>Pedágio individual</dt><dd>A confirmar</dd></div>
      <div className="money-total"><dt>Frete estimado</dt><dd>{estimate ? currency(estimate.totalCents) : 'Tarifas pendentes'}</dd></div>
      <div><dt>Entrega prevista (São Paulo)</dt><dd>{estimate ? timeLabel(estimate.arrival) : 'A calcular'}</dd></div>
    </dl>{validation && <p className="field-error">{validation}</p>}
      {estimate && onApply && <><button type="button" className="button" onClick={() => onApply(estimate)}>Usar estimativa na cotação</button><p className="inline-caption">Após mudar as tarifas, use a estimativa novamente para atualizar os campos da cotação.</p></>}
      <p className="inline-caption">Fonte: Google Maps. Estimativa para automóveis, sem trânsito em tempo real nem restrições de caminhão. Entrega = saída + direção até o destino + paradas informadas; o retorno entra no frete, mas não atrasa a entrega. Revise acessos, capacidade, pedágios e prazo antes de confirmar. Nenhuma operação é confirmada pelo cálculo.</p>
    </div>}
  </fieldset>
}
