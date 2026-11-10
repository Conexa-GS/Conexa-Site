import { CheckCircle, LockSimple } from '@phosphor-icons/react'
import { currency } from '../../domain/offers'
import { timestampLabel } from '../../services/m2'

export default function QuoteStatus({ load, quote, session }) {
  const selected = load.selected_quote_id === quote.id
  const anotherSelected = session.role === 'carrier' && load.selected_quote_id && !selected
  return <section className="quote-confirmed-summary" aria-label="Cotação confirmada pela transportadora">
    <CheckCircle size={32} weight="duotone" aria-hidden="true" />
    <div><p className="eyebrow">{session.role === 'carrier' ? 'SUA COTAÇÃO CONFIRMADA' : 'TRANSPORTE COTADO'} · REVISÃO {quote.revision || 1}</p>
      <h3>{selected ? 'Cotação selecionada pelo comprador' : anotherSelected ? 'Outra transportadora foi selecionada' : 'Cotação enviada ao comprador'}</h3>
      <p>{selected ? 'Acompanhe os aceites e as condições desta versão abaixo.' : anotherSelected || quote.load_version !== load.version ? 'Sua cotação está preservada no histórico; confira o estado atual da proposta.' : 'Aguardando a escolha do comprador e os aceites finais.'}</p>
      <p>Saída {timestampLabel(quote.departure_time)} · entrega {timestampLabel(quote.delivery_time)} (São Paulo)</p>
    </div><div className="quote-confirmed-price"><small>Frete completo</small><strong>{currency(quote.total_cents)}</strong><span><LockSimple size={15} aria-hidden="true" />Valor protegido</span></div>
  </section>
}
