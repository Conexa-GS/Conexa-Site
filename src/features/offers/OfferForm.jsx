import { useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { Modal, ErrorNotice } from '../../components/ui'
import { futureDate, today, validateOffer } from '../../domain/offers'
export default function OfferForm({ previous, products, locations, save, close }) {
  const [input, setInput] = useState(previous ? { ...previous, expires_on: previous.expires_on || '', price: (previous.unit_price_cents / 100).toFixed(2), minimum: (previous.minimum_net_unit_cents / 100).toFixed(2) } : { product_id: '', quantity_total: '', price: '', minimum: '', pickup_location_id: locations[0]?.id || '', available_from: today(), available_until: futureDate(7), expires_on: '' })
  const [errors, setErrors] = useState({})
  const [remoteError, setRemoteError] = useState('')
  const [pending, setPending] = useState(false)
  const update = event => setInput(value => ({ ...value, [event.target.name]: event.target.value }))
  async function submit(event) {
    event.preventDefault()
    const result = validateOffer(input)
    setErrors(result.errors)
    if (Object.keys(result.errors).length) { document.getElementById(Object.keys(result.errors)[0])?.focus(); return }
    setPending(true); setRemoteError('')
    try { await save(result.data, previous); close(true) } catch (error) { setRemoteError(error.message) } finally { setPending(false) }
  }
  const field = (name, label, props = {}) => <label className="field" htmlFor={name}><span>{label}</span><input id={name} name={name} value={input[name]} onChange={update} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} {...props} />{errors[name] && <small id={`${name}-error`} className="field-error">{errors[name]}</small>}</label>
  return <Modal title={previous ? 'Editar sua oferta' : 'Nova oferta'} closeDisabled={pending} onClose={() => { if (!pending) close() }}><p className="form-intro">Informe a produção disponível. Publicar uma oferta ainda não confirma uma venda.</p><form onSubmit={submit} noValidate aria-busy={pending}><fieldset className="form-grid" disabled={pending}>
    <label className="field wide" htmlFor="product_id"><span>Qual alimento você oferece?</span><select id="product_id" name="product_id" value={input.product_id} onChange={update} aria-invalid={Boolean(errors.product_id)} aria-describedby={errors.product_id ? 'product_id-error' : undefined}><option value="">Selecione um alimento</option>{products.map(p => <option key={p.id} value={p.id}>{p.name} · {p.unit}</option>)}</select>{errors.product_id && <small id="product_id-error" className="field-error">{errors.product_id}</small>}</label>
    {field('quantity_total', 'Quantidade disponível (kg)', { inputMode: 'decimal', placeholder: 'Ex.: 30' })}
    {field('price', 'Preço de venda por kg (R$)', { inputMode: 'decimal', placeholder: 'Ex.: 5,00' })}
    <div className="wide">{field('minimum', 'Mínimo que aceita receber por kg (R$)', { inputMode: 'decimal', placeholder: 'Ex.: 4,00' })}<small className="field-help">Valor mínimo que você aceita receber por kg. O frete é pago pelo comprador.</small></div>
    {field('available_from', 'Disponível a partir de', { type: 'date', min: today() })}
    {field('available_until', 'Disponível até', { type: 'date', min: input.available_from || today() })}
    <div className="wide">{field('expires_on', 'Vencimento do produto (opcional)', { type: 'date', min: input.available_until || today() })}<small className="field-help">Informe o vencimento conhecido. Disponibilidade não é vencimento. Sem esse dado, a taxa de desistência considera a entrega e mostra essa limitação.</small></div>
    <label className="field wide" htmlFor="pickup_location_id"><span>Local de coleta fictício</span><select id="pickup_location_id" name="pickup_location_id" value={input.pickup_location_id} onChange={update} aria-invalid={Boolean(errors.pickup_location_id)} aria-describedby={errors.pickup_location_id ? 'pickup_location_id-error' : undefined}><option value="">Selecione o local</option>{locations.map(l => <option key={l.id} value={l.id}>{l.display_address}</option>)}</select>{errors.pickup_location_id && <small id="pickup_location_id-error" className="field-error">{errors.pickup_location_id}</small>}</label>
  </fieldset>{remoteError && <ErrorNotice autoFocus title="Não foi possível salvar a oferta">{remoteError} Seus dados foram preservados; tente salvar novamente.</ErrorNotice>}<div className="form-actions"><button type="button" className="button button-outline" disabled={pending} onClick={() => close()}>Cancelar</button><button className="button" disabled={pending}>{pending ? 'Salvando…' : previous ? 'Salvar alterações' : 'Publicar oferta'}<ArrowUpRight size={18} /></button></div></form></Modal>
}
