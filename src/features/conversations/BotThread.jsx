import { useCallback, useEffect, useRef, useState } from 'react'
import { Robot } from '@phosphor-icons/react'
import { ActionLink, ErrorNotice } from '../../components/ui'
import { siteBotService } from '../../services/site-bot'
import { botQuestion, canConfirmBot, interpretSiteBot, offerFields } from '../../domain/site-bot'
import { offerChatSteps } from '../../domain/offer-chat'
import { currency, quantity } from '../../domain/offers'

function Preview({ draft, catalog }) {
  if (!draft || !['create', 'edit', 'archive'].includes(draft.intent)) return null
  const before = draft.before_offer ? offerFields(draft.before_offer) : {}
  function label(name, value) {
    if (value === undefined) return 'A informar'
    if (name === 'product_id') return catalog.products.find(item => item.id === value)?.name || value
    if (name === 'pickup_location_id') return catalog.locations.find(item => item.id === value)?.display_address || value
    if (name === 'quantity_total') return `${quantity(Number(String(value).replace(',', '.')))} kg (total)`
    if (name === 'price' || name === 'minimum') return currency(Math.round(Number(String(value).replace(',', '.')) * 100))
    return value || 'Desconhecido'
  }
  return <section className="bot-preview" aria-label="Prévia da oferta"><h3>{draft.intent === 'create' ? 'Criar oferta' : draft.intent === 'edit' ? 'Editar oferta' : 'Arquivar oferta'} · revisão {draft.revision}</h3>
    <p>Oferta: {draft.target_id || 'Nova oferta'}{draft.before_offer ? ` · versão ${draft.before_offer.version}` : ''}</p>
    {draft.before_offer && <p>Saldo livre na prévia: {quantity(draft.expected_balance)} kg. Reservas e compromissos fazem parte do total.</p>}
    <dl>{offerChatSteps.map(step => <div key={step.name}><dt>{step.label}</dt><dd>{draft.intent !== 'create' && <span>Antes: {label(step.name, before[step.name])}<br /></span>}Depois: {draft.intent === 'archive' ? 'Histórico preservado; oferta arquivada' : label(step.name, draft.fields[step.name])}</dd></div>)}</dl>
    <p>Alterações no cadastro preservam os valores e condições das cargas já registradas.</p>
  </section>
}

export default function BotThread({ conversation, session, service = siteBotService, refresh, revision, composer, setComposer }) {
  const [context, setContext] = useState(null)
  const [history, setHistory] = useState({ messages: [], has_more: false })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const live = useRef(false), lock = useRef(false), heading = useRef(null), input = useRef(null), feedback = useRef(null)
  const historyElement = useRef(null)
  const generation = useRef({ value: 0 })
  const newestSeq = useRef(null)
  const latestMessageId = history.messages.at(-1)?.id
  const cid = conversation.id
  const load = useCallback(async () => {
    const request = ++generation.current.value
    try {
      const after = newestSeq.current
      const [next, firstPage] = await Promise.all([service.state(cid), service.messages(cid, null, after)])
      let page = firstPage
      const arrived = [...page.messages]
      while (after && page.has_more && page.messages.length) {
        if (!live.current || request !== generation.current.value) return
        page = await service.messages(cid, null, page.messages.at(-1).seq)
        arrived.push(...page.messages)
      }
      if (live.current && request === generation.current.value) {
        if (arrived.length) newestSeq.current = arrived.at(-1).seq
        setContext(next)
        setHistory(previous => {
          const messages = [...new Map([...previous.messages, ...arrived].map(message => [message.id, message])).values()].sort((a, b) => BigInt(a.seq) < BigInt(b.seq) ? -1 : BigInt(a.seq) > BigInt(b.seq) ? 1 : 0)
          return { messages, has_more: after ? previous.has_more : firstPage.has_more }
        })
      }
    } catch (error) { if (live.current && request === generation.current.value) throw error }
  }, [cid, service])
  useEffect(() => {
    live.current = true; heading.current?.focus()
    const lifecycle = generation.current
    return () => { live.current = false; lifecycle.value++ }
  }, [])
  useEffect(() => { void Promise.resolve().then(load).catch(error => { if (live.current) setError(error.message) }) }, [load, revision])
  useEffect(() => { if (notice) feedback.current?.focus() }, [notice])
  useEffect(() => { if (historyElement.current) historyElement.current.scrollTop = historyElement.current.scrollHeight }, [latestMessageId])

  async function execute(action, payload) {
    if (lock.current) return
    lock.current = true; setBusy(true); setError(''); setNotice('')
    setComposer({ ...composer, pending: { action, payload }, locked: true })
    try {
      const result = await service[action](payload)
      setComposer({ body: '', key: null, locked: false })
      if (live.current) {
        setContext(previous => ({ ...previous, draft: result.draft }))
        setNotice(result.reply)
        if (result.offer) window.dispatchEvent(new window.Event('conexa:offers-changed'))
        await load(); refresh()
      }
    } catch (error) {
      if (error.definitive) setComposer({ ...composer, pending: null, locked: false })
      if (live.current) setError(error.message)
    } finally { lock.current = false; if (live.current) setBusy(false) }
  }
  function prepare(text, proposal) {
    const target = context.offers.find(item => item.id === proposal.target_id)
    void execute('turn', { conversation_id: cid, request_id: crypto.randomUUID(), revision: context.draft?.revision || 0, body: text, intent: proposal.intent, fields: proposal.fields, target_id: proposal.target_id || null, offer_version: target?.version || null })
  }
  function send(event) {
    event.preventDefault()
    const proposal = interpretSiteBot(composer.body, { ...context, role: session.role })
    if (proposal.error) { setError(proposal.error); return }
    prepare(composer.body, proposal)
  }
  async function older() {
    if (lock.current) return
    lock.current = true; setBusy(true)
    const request = ++generation.current.value
    try {
      const page = await service.messages(cid, history.messages[0].seq)
      if (live.current && request === generation.current.value) setHistory(previous => ({ messages: [...page.messages, ...previous.messages], has_more: page.has_more }))
    } catch (error) { if (live.current) setError(error.message) }
    finally { lock.current = false; if (live.current) setBusy(false) }
  }
  const draft = context?.draft
  const blocked = busy || Boolean(composer.pending)
  const missing = draft?.intent === 'create' || draft?.target_id ? offerChatSteps.find(step => !Object.hasOwn(draft.fields, step.name)) : null
  const choices = missing?.name === 'product_id' ? context.catalog.products.map(p => ({ id: p.id, title: p.name })) : missing?.name === 'pickup_location_id' ? context.catalog.locations.map(l => ({ id: l.id, title: l.display_address })) : []
  return <section className="conversation-thread" aria-labelledby="bot-title" aria-busy={busy}>
    <header className="conversation-thread-heading"><span className="conversation-avatar bot"><Robot size={25} aria-hidden="true" /></span><div><h2 id="bot-title" ref={heading} tabIndex={-1}>Bot Conexa</h2><p>Interpretação simulada por texto · sem API paga</p></div></header>
    <p className="conversation-agreement">Use dados fictícios. Escreva consultar, criar oferta, editar alface ou arquivar alface. Quantidade: total 20 kg; correções: preço: 7,00, início: 20/11/2026. Voz ainda indisponível.</p>
    {error && <ErrorNotice autoFocus title="Não foi possível continuar" retry={composer.pending ? undefined : () => { void load().catch(error => setError(error.message)) }}>{error} Seu rascunho foi preservado.</ErrorNotice>}
    {!context && !error && <p role="status">Carregando bot e ofertas…</p>}
    {!context && error && <button className="text-link" disabled={busy} onClick={() => { setError(''); void load().catch(error => setError(error.message)) }}>Recarregar bot</button>}
    {context && <>
      <div ref={historyElement} className="conversation-history" tabIndex={0} role="region" aria-label="Histórico do bot">
        {history.has_more && <button className="text-link" disabled={busy} onClick={older}>Carregar mensagens anteriores</button>}
        {!history.messages.length && <p>Olá! Prepare sua oferta por texto ou consulte o catálogo. Só salvo após confirmar uma prévia.</p>}
        <ol>{history.messages.map(message => <li key={message.id} className={`conversation-bubble ${message.speaker === 'human' ? 'own' : ''}`}><strong>{message.speaker === 'bot' ? 'Bot Conexa' : 'Você'}</strong><p>{message.body}</p><time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</time></li>)}</ol>
      </div>
      <p ref={feedback} tabIndex={-1} role="status" className="bot-feedback">{notice || botQuestion(draft, context.catalog)}</p>
      {notice && draft?.status === 'draft' && <p className="bot-feedback">{botQuestion(draft, context.catalog)}</p>}
      {(draft?.intent === 'consult' || (draft && ['edit', 'archive'].includes(draft.intent) && !draft.target_id)) && <ul className="bot-offer-options">{context.offers.map(offer => <li key={offer.id}><strong>{offer.products.name}</strong> · {quantity(offer.quantity_total)} kg total · {quantity(offer.quantity_free)} kg livres · {currency(offer.unit_price_cents)}/kg<small>{offer.id}</small>{session.role === 'producer' && draft.intent !== 'consult' && <button className="text-link" disabled={blocked} onClick={() => prepare(`Escolher oferta ${offer.id}`, { intent: draft.intent, fields: offerFields(offer), target_id: offer.id })}>Escolher esta oferta</button>}</li>)}{!context.offers.length && <li>Nenhuma oferta disponível.</li>}</ul>}
      <div className="bot-choices">{choices.map(choice => <button className="text-link" disabled={blocked} key={choice.id} onClick={() => {
        const proposal = interpretSiteBot(choice.id, { ...context, role: session.role })
        if (proposal.error) setError(proposal.error); else prepare(choice.title, proposal)
      }}>{choice.title}</button>)}</div>
      {(!missing || draft?.status === 'conflict') && <Preview draft={draft} catalog={context.catalog} />}
      {draft?.status === 'conflict' && <button className="button button-secondary" disabled={blocked} onClick={() => prepare('Preparar nova prévia após conflito', { ...draft })}>Preparar nova prévia</button>}
      {canConfirmBot(draft, context.catalog) && <button className="button bot-confirm" disabled={blocked} onClick={() => void execute('confirm', { conversation_id: cid, request_id: crypto.randomUUID(), revision: draft.revision })}>Confirmar revisão {draft.revision}</button>}
      <form className="conversation-composer" onSubmit={send}><label htmlFor="bot-message">Mensagem para o Bot Conexa</label><textarea id="bot-message" ref={input} rows={3} maxLength={2000} value={composer.body} disabled={blocked} onChange={event => setComposer({ body: event.target.value, locked: false })} aria-describedby="bot-help" /><div className="conversation-send-row"><small id="bot-help">Corrija com campo: valor. Cancelar descarta o rascunho. “Sim” não confirma.</small><button className="button" disabled={blocked || !composer.body.trim()}>Enviar ao bot</button></div></form>
      {composer.pending && <button className="button" disabled={busy} onClick={() => void execute(composer.pending.action, composer.pending.payload)}>Verificar pedido pendente</button>}
    </>}
    <ActionLink href={session.role === 'producer' ? '/produtor/ofertas' : '/comprador/ofertas'}>Abrir ofertas e formulário</ActionLink>
  </section>
}
