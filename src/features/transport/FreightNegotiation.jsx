import { useState } from 'react'
import { ErrorNotice } from '../../components/ui'
import { centsFromInput, currency } from '../../domain/offers'
import { canReviseQuote } from '../../domain/transport'
import { timestampLabel } from '../../services/m2'
import { transportUpdates } from '../../services/transport-updates'

export default function FreightNegotiation({ load, quote, session, available, reload, request = transportUpdates }) {
  const [pending, setPending] = useState(false), [error, setError] = useState(''), [fee, setFee] = useState(null), [notice, setNotice] = useState('')
  const active = (load.negotiations || []).filter(n => ['pending', 'rejected'].includes(n.status))
  const own = active.find(n => n.carrier_id === session.id)
  async function act(action, negotiation, fields = {}) {
    setPending(true); setError(''); setNotice('')
    try {
      const result = await request(action, { id: load.id, version: load.version, quote_id: negotiation?.quote_id || quote?.id, ...(negotiation ? { negotiation_id: negotiation.id } : {}), ...fields })
      if (action === 'preview_fee') setFee(result)
      else { setFee(null); setNotice('Decisão registrada. Consulte o estado atualizado da proposta.'); reload(); window.dispatchEvent(new Event('conexa:transport-updated')) }
    } catch (failure) { setError(failure.message); reload() }
    finally { setPending(false) }
  }
  if (!available || (!['buyer', 'carrier'].includes(session.role)) || (!active.length && !(session.role === 'carrier' && canReviseQuote(load, quote)))) return null
  return <section className="freight-negotiation m3-form" aria-label="Negociação direta do frete">
    <h3>Negociação direta do frete</h3><p>O valor atual só muda com aprovação do comprador. Enquanto uma negociação estiver aberta, seleção, aceites e pagamento desta cotação ficam pausados.</p>
    {session.role === 'carrier' && !own && canReviseQuote(load, quote) && <details><summary>Registrar novo valor após conversar com o comprador</summary><form className="m3-form" onSubmit={e => {
      e.preventDefault(); const fields = Object.fromEntries(new FormData(e.currentTarget))
      const value = centsFromInput(fields.price)
      if (!Number.isFinite(value) || value <= 0 || value > 100000000 || value === Number(quote.total_cents)) { setError('Informe um valor diferente do atual, positivo e com até 2 casas decimais.'); return }
      act('request_price', null, { proposed_cents: value, reason: fields.reason, direct_contact: true })
    }}><p>Frete atual: <strong>{currency(quote.total_cents)}</strong></p><label className="field"><span>Novo frete proposto (R$)</span><input name="price" required inputMode="decimal" pattern="[0-9]+([,.][0-9]{1,2})?" /></label>
      <label className="field"><span>Resumo da conversa e motivo da mudança</span><textarea name="reason" required rows={3} maxLength={500} /></label>
      <label className="m3-check"><input type="checkbox" required />Conversei diretamente com o comprador e quero registrar este novo valor para aprovação.</label>
      <p className="inline-caption">Se o comprador recusar, você poderá manter o frete atual ou desistir com taxa simulada proporcional à urgência: 5% acima de 72h, 15% entre 24h e 72h, 30% com até 24h.</p>
      <button className="button button-outline" disabled={pending}>Enviar valor para aprovação</button>
    </form></details>}
    {active.map(n => <div className="negotiation-request" key={n.id}><p><strong>Novo frete proposto: {currency(n.proposed_cents)}</strong> · {n.status === 'pending' ? 'Aguardando decisão do comprador' : 'Novo valor recusado; aguardando transportadora'}</p><p>Motivo: {n.reason}</p>
      {session.role === 'buyer' && n.status === 'pending' && <div className="m2-actions"><button className="button" disabled={pending || !['awaiting_quotes','awaiting_final_approval','awaiting_payment'].includes(load.status)} onClick={() => act('approve_price', n)}>Aprovar novo frete</button><button className="button button-outline" disabled={pending} onClick={() => act('reject_price', n)}>Recusar novo frete</button></div>}
      {session.role === 'carrier' && <div className="m2-actions"><button className="button button-outline" disabled={pending} onClick={() => act('keep_price', n)}>Manter frete original</button>{n.status === 'rejected' && <button className="text-link" disabled={pending} onClick={() => act('preview_fee', n)}>Conferir taxa para desistir</button>}</div>}
    </div>)}
    {fee && own && <form className="m3-form cancellation-fee-preview" onSubmit={e => { e.preventDefault(); act('withdraw', own, { accept_fee: true, expected_fee_cents: fee.amount_cents, expected_rate_percent: fee.rate_percent }) }}>
      <h4>Desistência com taxa simulada</h4><p><strong>{fee.rate_percent}% de {currency(fee.base_cents)} = {currency(fee.amount_cents)}</strong></p>
      <p>Prazo mais próximo: {timestampLabel(fee.deadline)} (São Paulo). Considera a entrega e os vencimentos informados. {fee.expiry_missing && 'Há vencimento não informado; nesses itens, o cálculo usa a entrega.'}</p>
      <p>Metade para o comprador e metade aos produtores, proporcional aos alimentos. A proposta será encaminhada a outra transportadora compatível; se não houver, ficará aguardando transporte. Não há cobrança real.</p>
      <label className="m3-check"><input type="checkbox" required />Não aceito o frete original e confirmo a desistência com esta taxa simulada.</label><button className="button button-danger" disabled={pending}>Confirmar desistência e reenviar proposta</button>
    </form>}
    {error && <ErrorNotice autoFocus title="Não foi possível registrar a negociação">{error}</ErrorNotice>}{notice && <p className="success-notice" role="status">{notice}</p>}
  </section>
}

export function CancellationFees({ load, session }) {
  if (!load.cancellation_fees?.length) return null
  return <section className="cancellation-fees"><h3>Taxas de desistência · simulação</h3><p>Registros demonstrativos, sem cobrança ou transferência real. Não alteram o frete da próxima cotação nem descontam os alimentos.</p>
    {load.cancellation_fees.map(f => <article key={f.id}><p><strong>{currency(f.amount_cents)}</strong> · {f.rate_percent}% do frete original de {currency(f.base_cents)} · {f.carrier_id === session.id ? 'Sua transportadora é responsável pela taxa simulada.' : 'Responsabilidade da transportadora desistente.'}</p><p>Prazo usado: {timestampLabel(f.deadline)} (São Paulo). {f.expiry_missing && 'Vencimento ausente em parte ou todos os itens; nesses itens foi usada a entrega.'}</p><ul>{f.shares.map(s => <li key={s.recipient_id}>{s.kind === 'buyer' ? 'Comprador' : load.items.find(i => i.producer_id === s.recipient_id)?.producer_name || 'Produtor'}: {currency(s.amount_cents)}</li>)}</ul></article>)}
  </section>
}
