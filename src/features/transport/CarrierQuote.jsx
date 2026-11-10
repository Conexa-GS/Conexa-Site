import { useState } from 'react'
import { canReviseQuote } from '../../domain/transport'
import { ActionLink } from '../../components/ui'
import QuoteForm from './QuoteForm'
import QuoteModificationForm from './QuoteModificationForm'

export default function CarrierQuote({ load, quote, vehicles, available, pending, submit, error, withdrawn }) {
  const [editing, setEditing] = useState(false)
  if (withdrawn) return <p className="inline-note">Sua transportadora desistiu desta proposta. Ela foi reaberta para outro transporte; confira a taxa simulada abaixo.</p>
  if (!quote) return load.status === 'awaiting_quotes' ? <><ActionLink href="/transportador/veiculos">Cadastrar veículo</ActionLink><QuoteForm load={load} vehicles={vehicles} pending={pending} submit={submit} error={error} /></> : null
  if (!canReviseQuote(load, quote)) return <p className="inline-caption">A edição desta cotação está encerrada para o estado atual da operação.</p>
  return <section className="carrier-quote-controls" aria-label="Gerenciar cotação confirmada">
    {editing ? <QuoteModificationForm key={quote.id} load={load} quote={quote} vehicles={vehicles} pending={pending} error={error} cancel={() => setEditing(false)} submit={async (...args) => { if (await submit(...args)) setEditing(false) }} /> : <>
      <button className="button button-outline" disabled={pending || !available || (load.negotiations || []).some(n => n.quote_id === quote.id && ['pending','rejected'].includes(n.status))} onClick={() => setEditing(true)}>Modificar proposta</button>
      <p className="inline-caption">Altere veículo e horários com aviso aos envolvidos. O frete fica bloqueado nesta edição.</p>
      {!available && <p className="inline-note">A modificação aguarda atualização do Supabase demo.</p>}
    </>}
  </section>
}
