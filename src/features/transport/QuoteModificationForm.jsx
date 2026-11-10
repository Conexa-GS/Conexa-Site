import { useId, useState } from 'react'
import { ErrorNotice } from '../../components/ui'
import { currency, dateLabel } from '../../domain/offers'
import { localDateTime, validateQuoteDates } from '../../domain/transport'
import { timestampLabel } from '../../services/m2'

export default function QuoteModificationForm({ load, quote, vehicles, pending, submit, cancel, error }) {
  const id = useId()
  const [errors, setErrors] = useState({})
  return <form className="m3-form quote-edit-form" aria-busy={pending} onSubmit={e => {
    e.preventDefault()
    const form = e.currentTarget, fields = Object.fromEntries(new FormData(form))
    const invalid = validateQuoteDates(fields, load)
    setErrors(invalid)
    if (Object.keys(invalid).length) { form.elements.namedItem(Object.keys(invalid)[0]).focus(); return }
    submit('revise_quote', { id: load.id, version: load.version, quote_id: quote.id, ...fields,
      departure_time: new Date(fields.departure_time).toISOString(), delivery_time: new Date(fields.delivery_time).toISOString(), expires_at: new Date(fields.expires_at).toISOString() })
  }}>
    <h3>Modificar proposta de transporte</h3><p>Comprador e produtores receberão um aviso no site com o que mudou. Se esta cotação já foi selecionada, todos precisarão confirmar a nova versão.</p>
    <label className="field"><span>Veículo para esta proposta</span><select name="vehicle_id" required defaultValue={quote.vehicle_id}>{vehicles.map(v => <option key={v.id} value={v.id}>{v.description} · {v.capacity_kg} kg</option>)}</select></label>
    {['departure_time', 'delivery_time', 'expires_at'].map((name, index) => <label className="field" htmlFor={`${id}-${name}`} key={name}><span>{['Nova saída (horário do dispositivo)', `Nova entrega em ${dateLabel(load.scheduled_date)} (horário do dispositivo)`, 'Nova validade (horário do dispositivo)'][index]}</span>
      <input id={`${id}-${name}`} name={name} type="datetime-local" required defaultValue={localDateTime(quote[name])} aria-invalid={Boolean(errors[name])} aria-describedby={`${id}-help${errors[name] ? ` ${id}-${name}-error` : ''}`} onChange={() => setErrors(previous => ({ ...previous, [name]: undefined }))} />
      {errors[name] && <small className="field-error" id={`${id}-${name}-error`}>{errors[name]}</small>}
    </label>)}
    <p id={`${id}-help`} className="inline-caption">Saída e validade futuras; entrega após a saída na data desejada em São Paulo. A validade não pode ultrapassar {timestampLabel(load.expires_at)} (São Paulo), prazo da reserva.</p>
    <div className="quote-locked-price"><strong>Frete preservado: {currency(quote.total_cents)}</strong><p>O preço fica bloqueado nesta edição. Para negociar outro valor, converse diretamente com o comprador, responsável por pagar o envio.</p></div>
    <label className="field"><span>O que mudou e por quê?</span><textarea name="reason" rows={3} required maxLength={500} /></label>
    <label className="m3-check"><input type="checkbox" required />Confirmo os novos dados e o envio de avisos ao comprador e aos produtores.</label>
    {Object.values(errors).some(Boolean) && <p className="field-error" role="alert">Alteração não enviada. Corrija os campos indicados.</p>}
    {error && <ErrorNotice autoFocus title="Não foi possível modificar a proposta">{error} Os campos foram preservados.</ErrorNotice>}
    <div className="m2-actions"><button type="button" className="button button-outline" disabled={pending} onClick={cancel}>Manter proposta atual</button><button className="button" disabled={pending}>{pending ? 'Salvando alteração…' : 'Salvar alteração e notificar'}</button></div>
  </form>
}
