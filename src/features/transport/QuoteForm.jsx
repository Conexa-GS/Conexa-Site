import { useId, useState } from 'react'
import { ErrorNotice } from '../../components/ui'
import { centsFromInput, currency, dateLabel, quantity } from '../../domain/offers'
import { conservationLabel, validateQuoteDates } from '../../domain/transport'
import { timestampLabel } from '../../services/m2'

export default function QuoteForm({ load, vehicles, pending, submit, error }) {
  const id = useId()
  const [errors, setErrors] = useState({})
  function dateField(name, label) {
    return <label className="field" htmlFor={`${id}-${name}`}><span>{label}</span>
      <input id={`${id}-${name}`} name={name} type="datetime-local" required aria-invalid={Boolean(errors[name])} aria-describedby={`${id}-date-help${errors[name] ? ` ${id}-${name}-error` : ''}`} onChange={() => setErrors(previous => ({ ...previous, [name]: undefined }))} />
      {errors[name] && <small id={`${id}-${name}-error`} className="field-error">{errors[name]}</small>}
    </label>
  }
  return <form className="m3-form" aria-busy={pending} onSubmit={e => {
    e.preventDefault()
    const form = e.currentTarget
    const fields = Object.fromEntries(new FormData(form))
    const invalid = validateQuoteDates(fields, load)
    setErrors(invalid)
    if (Object.keys(invalid).length) {
      form.elements.namedItem(Object.keys(invalid)[0]).focus()
      return
    }
    submit('quote', { id: load.id, version: load.version, ...fields, total_cents: centsFromInput(fields.price), departure_time: new Date(fields.departure_time).toISOString(), delivery_time: new Date(fields.delivery_time).toISOString(), expires_at: new Date(fields.expires_at).toISOString(), services_included: { fuel: true, tolls: true, pickups: true, unloading: true } }, form)
  }}><h3>Cotação manual do roteiro completo</h3>
    {load.quotes.some(q => q.status === 'indicated') && <label className="field"><span>Indicação recebida (opcional)</span><select name="indication_id" defaultValue=""><option value="">Cotação própria</option>{load.quotes.filter(q => q.status === 'indicated').map(q => <option key={q.id} value={q.id}>Indicação · {currency(q.total_cents)}</option>)}</select></label>}
    <label className="field"><span>Seu veículo</span><select name="vehicle_id" required defaultValue=""><option value="">Selecione</option>{vehicles.map(v => <option value={v.id} key={v.id}>{v.description} · {quantity(v.capacity_kg)} kg · {conservationLabel(v.conservation_conditions)}</option>)}</select></label>
    <label className="field"><span>Saída do transportador (local fictício)</span><input name="departure_address" required maxLength={200} /></label>
    <label className="field"><span>Conservação exigida para esta carga (confirmada pelo transportador)</span><select name="conservation_required"><option value="ambient">Ambiente protegido</option><option value="refrigerated">Refrigerado</option></select></label>
    {dateField('departure_time', 'Saída (horário do dispositivo)')}
    {dateField('delivery_time', `Entrega em ${dateLabel(load.scheduled_date)} (horário do dispositivo)`)}
    {dateField('expires_at', 'Validade da cotação (horário do dispositivo; limitada à reserva)')}
    <p className="inline-caption" id={`${id}-date-help`}>Saída e validade precisam estar no futuro. Entrega em {dateLabel(load.scheduled_date)}, após a saída, considerando São Paulo. Validade até {timestampLabel(load.expires_at)} (São Paulo), prazo da reserva.</p>
    <label className="field"><span>Frete final completo (R$)</span><input name="price" inputMode="decimal" required pattern="[0-9]+([,.][0-9]{1,2})?" /></label>
    <label className="field"><span>Retorno acordado (local fictício, opcional; incluído no frete)</span><input name="return_address" maxLength={200} /></label>
    <label className="m3-check"><input type="checkbox" required />Confirmo o roteiro exibido, as condições e o valor final, incluindo combustível, pedágios, todas as coletas, descarga e eventual retorno. Sem custos obrigatórios adicionais.</label>
    <p className="inline-caption">Dados do cenário fictício, sem certificado sanitário. Distância e duração não foram calculadas; pedágio individual a confirmar, coberto pelo frete fechado.</p>
    {Object.values(errors).some(Boolean) && <p className="field-error" role="alert">Cotação não enviada. Corrija os horários indicados acima e confirme novamente.</p>}
    {error && <ErrorNotice autoFocus title="Não foi possível confirmar a cotação">{error} Os campos foram preservados; revise os dados e tente novamente.</ErrorNotice>}
    <button className="button" disabled={pending || !vehicles.length}>{pending ? 'Confirmando cotação…' : 'Confirmar cotação fictícia'}</button>
  </form>
}
