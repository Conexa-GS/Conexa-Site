import { useState } from 'react'
import { Modal, ErrorNotice } from '../../components/ui'
import { futureDate, today } from '../../domain/offers'
import { validateDemand } from '../../domain/demands'
import { m2 } from '../../services/m2'

export default function DemandForm({ previous, catalog, close, request = m2 }) {
  const [input, setInput] = useState(previous || { product_id: '', quantity: '', desired_date: futureDate(3), destination_id: catalog.locations[0]?.id || '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const change = e => setInput(value => ({ ...value, [e.target.name]: e.target.value }))
  async function submit(e) {
    e.preventDefault()
    const result = validateDemand(input)
    setErrors(result.errors)
    if (Object.keys(result.errors).length) { document.getElementById(`d-${Object.keys(result.errors)[0]}`)?.focus(); return }
    setPending(true); setError('')
    try { const saved = await request('save_demand', { ...result.data, ...(previous ? { id: previous.id, version: previous.version } : {}) }); close(saved) }
    catch (failure) { setError(failure.message) }
    finally { setPending(false) }
  }
  const field = (name, label, children) => <label className="field" htmlFor={`d-${name}`}><span>{label}</span>{children}{errors[name] && <small className="field-error" id={`d-${name}-error`}>{errors[name]}</small>}</label>
  const props = name => ({ id: `d-${name}`, name, value: input[name], onChange: change, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `d-${name}-error` : undefined })
  return <Modal title={previous ? 'Editar pedido' : 'O que você precisa?'} closeDisabled={pending} onClose={() => { if (!pending) close() }}><p className="form-intro">{previous ? 'Revise os dados do seu pedido.' : 'Depois, você escolhe os produtores e envia a proposta. Os alimentos só são reservados no envio.'}</p><form onSubmit={submit} noValidate aria-busy={pending}><fieldset className="form-grid" disabled={pending}>
    {field('product_id', 'Alimento e unidade', <select {...props('product_id')}><option value="">Selecione</option>{catalog.products.map(p => <option key={p.id} value={p.id}>{p.name} · {p.unit}</option>)}</select>)}
    {field('quantity', 'Quantidade (kg)', <input {...props('quantity')} inputMode="decimal" placeholder="Ex.: 50" />)}
    {field('desired_date', 'Data desejada', <input {...props('desired_date')} type="date" min={today()} />)}
    {field('destination_id', 'Destino fictício', <select {...props('destination_id')}><option value="">Selecione</option>{catalog.locations.map(l => <option key={l.id} value={l.id}>{l.display_address}</option>)}</select>)}
  </fieldset>{error && <ErrorNotice autoFocus title="Não foi possível salvar a demanda">{error} Seus dados foram preservados.</ErrorNotice>}<div className="form-actions"><button type="button" className="button button-outline" disabled={pending} onClick={() => close()}>Cancelar</button><button className="button" disabled={pending}>{pending ? 'Salvando…' : previous ? 'Salvar alterações' : 'Continuar: escolher produtores'}</button></div></form></Modal>
}
