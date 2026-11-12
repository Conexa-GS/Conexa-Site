import { useCallback, useEffect, useRef, useState } from 'react'
import { Robot } from '@phosphor-icons/react'
import { ActionLink, ErrorNotice } from '../../components/ui'
import { siteBotService } from '../../services/site-bot'
import { botQuestion, canConfirmBot, interpretSiteBot, offerFields } from '../../domain/site-bot'
import { answerOfferChat, offerChatSteps } from '../../domain/offer-chat'
import { currency, quantity } from '../../domain/offers'
import VoicePanel from './VoicePanel'

function FieldAnswer({ step, value, disabled, onAnswer, onCancel }) {
  const [answer, setAnswer] = useState(value || '')
  const field = useRef(null)
  useEffect(() => { field.current?.focus() }, [])
  return <form className="bot-field-answer" onSubmit={event => { event.preventDefault(); onAnswer(answer) }}>
    <label htmlFor="bot-field-answer">{step.label}</label>
    {step.help && <p id="bot-field-help">{step.help}</p>}
    <input id="bot-field-answer" ref={field} type={step.kind === 'date' ? 'date' : 'text'} inputMode={step.kind === 'decimal' ? 'decimal' : undefined} value={answer} onChange={event => setAnswer(event.target.value)} disabled={disabled} aria-describedby={step.help ? 'bot-field-help' : undefined} required={!step.optional} />
    <div className="bot-choices"><button className="button" disabled={disabled || (!answer.trim() && !step.optional)}>Usar este valor</button>{step.optional && <button type="button" className="button button-secondary" disabled={disabled} onClick={() => onAnswer('')}>Não sei informar</button>}{onCancel && <button type="button" className="text-link" disabled={disabled} onClick={onCancel}>Voltar aos campos</button>}</div>
  </form>
}

function Preview({ draft, catalog }) {
  if (!draft || !['create', 'edit', 'archive'].includes(draft.intent) || (draft.intent !== 'create' && !draft.target_id)) return null
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

export default function BotThread({ conversation, session, service = siteBotService, refresh, revision, composer, setComposer, voice }) {
  const [context, setContext] = useState(null)
  const [history, setHistory] = useState({ messages: [], has_more: false })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editField, setEditField] = useState(null)
  const live = useRef(false), lock = useRef(false), heading = useRef(null), input = useRef(null), feedback = useRef(null)
  const historyElement = useRef(null)
  const textOptions = useRef(null)
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
    try {
      setComposer({ ...composer, pending: { action, payload }, locked: true })
      const result = await service[action](payload)
      if (!setComposer({ body: '', key: null, locked: false }, payload.request_id)) return
      if (live.current) {
        setEditField(null)
        setContext(previous => ({ ...previous, draft: result.draft }))
        setNotice(result.reply)
        if (result.offer) window.dispatchEvent(new window.Event('conexa:offers-changed'))
        await load(); refresh()
      }
    } catch (error) {
      let message = error.message
      if (error.definitive) {
        try {
          if (!setComposer({ ...composer, pending: null, locked: false }, payload.request_id)) return
          // Another session may have changed the draft. Hide stale controls
          // even if revalidation fails; only a fresh state can confirm again.
          if (live.current) setContext(null)
          await load()
        } catch (failure) { message += ` ${failure.message}` }
      }
      if (live.current) setError(message)
    } finally { lock.current = false; if (live.current) setBusy(false) }
  }
  function prepare(text, proposal) {
    if (lock.current || composer.pending) return
    const target = context.offers.find(item => item.id === proposal.target_id)
    void execute('turn', { conversation_id: cid, request_id: crypto.randomUUID(), revision: context.draft?.revision || 0, body: text, intent: proposal.intent, fields: proposal.fields, target_id: proposal.target_id || null, offer_version: target?.version || null })
  }
  function answerField(name, answer) {
    const result = answerOfferChat(context.draft.fields, name, answer, context.catalog)
    if (result.error) { setError(result.error); return }
    const step = offerChatSteps.find(item => item.name === name)
    const label = name === 'product_id' ? context.catalog.products.find(item => item.id === answer)?.name : name === 'pickup_location_id' ? context.catalog.locations.find(item => item.id === answer)?.display_address : answer
    prepare(`${step.label}: ${label || 'Não sei informar'}`, { ...context.draft, fields: result.draft })
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
  const active = draft && ['draft', 'conflict'].includes(draft.status) && ['create', 'edit', 'archive'].includes(draft.intent)
  const missing = active && (draft.intent === 'create' || draft.target_id) ? offerChatSteps.find(step => !Object.hasOwn(draft.fields, step.name)) : null
  const currentField = active ? offerChatSteps.find(step => step.name === editField) || missing : null
  const choices = currentField?.name === 'product_id' ? context.catalog.products.map(p => ({ id: p.id, title: p.name })) : currentField?.name === 'pickup_location_id' ? context.catalog.locations.map(l => ({ id: l.id, title: l.display_address })) : []
  return <section className="conversation-thread" aria-labelledby="bot-title" aria-busy={busy}>
    <header className="conversation-thread-heading"><span className="conversation-avatar bot"><Robot size={25} aria-hidden="true" /></span><div><h2 id="bot-title" ref={heading} tabIndex={-1}>Bot Conexa</h2><p>Interpretação simulada por texto · sem API paga</p></div></header>
    <p className="conversation-agreement">Use dados fictícios. Escolha uma opção para começar. Só altero ofertas depois que você revisar e confirmar a prévia.</p>
    {error && <ErrorNotice autoFocus title="Não foi possível continuar" retry={composer.pending ? undefined : () => { void load().catch(error => setError(error.message)) }}>{error} Seu rascunho foi preservado.</ErrorNotice>}
    {!context && !error && <p role="status">Carregando bot e ofertas…</p>}
    {!context && error && <button className="text-link" disabled={busy} onClick={() => { setError(''); void load().catch(error => setError(error.message)) }}>Recarregar bot</button>}
    {context && <>
      <section className="bot-action-menu" aria-labelledby="bot-actions-title">
        <h3 id="bot-actions-title">{active ? 'Vamos preparar sua oferta' : 'O que você quer fazer?'}</h3>
        <p>{active ? 'Siga as opções abaixo. Você pode cancelar antes de confirmar.' : session.role === 'producer' ? 'Escolha uma ação. Vou ajudar em cada etapa.' : 'Consulte as ofertas disponíveis. Para comprar, continue em demandas e composição.'}</p>
        <div className="bot-choices">{active ? <button className="button button-secondary" disabled={blocked} onClick={() => prepare('Cancelar rascunho', { intent: 'cancel', fields: {} })}>Cancelar rascunho</button> : <>
          <button className="button button-secondary" disabled={blocked} onClick={() => prepare('Consultar ofertas', { intent: 'consult', fields: {} })}>Consultar ofertas</button>
          {session.role === 'producer' && <>
            <button className="button" disabled={blocked} onClick={() => prepare('Criar oferta', { intent: 'create', fields: {} })}>Criar oferta</button>
            <button className="button button-secondary" disabled={blocked || !context.offers.length} onClick={() => prepare('Editar oferta', { intent: 'edit', fields: {} })}>Editar oferta</button>
            <button className="button button-secondary" disabled={blocked || !context.offers.length} onClick={() => prepare('Arquivar oferta', { intent: 'archive', fields: {} })}>Arquivar oferta</button>
          </>}
        </>}</div>
        {!active && session.role === 'producer' && !context.offers.length && <p>Crie sua primeira oferta para depois editar ou arquivar.</p>}
      </section>
      <div ref={historyElement} className={`conversation-history ${history.messages.length ? '' : 'bot-history-empty'}`} tabIndex={0} role="region" aria-label="Histórico do bot">
        {history.has_more && <button className="text-link" disabled={busy} onClick={older}>Carregar mensagens anteriores</button>}
        {!history.messages.length && <p>Olá! Escolha uma das ações acima para começar.</p>}
        <ol>{history.messages.map(message => <li key={message.id} className={`conversation-bubble ${message.speaker === 'human' ? 'own' : ''}`}><strong>{message.speaker === 'bot' ? 'Bot Conexa' : 'Você'}</strong><p>{message.body}</p><time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</time></li>)}</ol>
      </div>
      <p ref={feedback} tabIndex={-1} role="status" className="bot-feedback">{notice || (active ? botQuestion(draft, context.catalog) : 'Escolha uma ação acima para continuar.')}</p>
      {notice && draft?.status === 'draft' && <p className="bot-feedback">{botQuestion(draft, context.catalog)}</p>}
      {(draft?.intent === 'consult' || (active && ['edit', 'archive'].includes(draft.intent) && !draft.target_id)) && <ul className="bot-offer-options">{context.offers.map(offer => <li key={offer.id}><strong>{offer.products.name}</strong> · {quantity(offer.quantity_total)} kg total · {quantity(offer.quantity_free)} kg livres · {currency(offer.unit_price_cents)}/kg<small>{offer.id}</small>{session.role === 'producer' && draft.intent !== 'consult' && <button className="text-link" disabled={blocked} onClick={() => prepare(`Escolher oferta ${offer.id}`, { intent: draft.intent, fields: offerFields(offer), target_id: offer.id })}>Escolher esta oferta</button>}</li>)}{!context.offers.length && <li>Nenhuma oferta disponível.</li>}</ul>}
      {currentField && choices.length > 0 && <div className="bot-choices" role="group" aria-label={currentField.label}>{choices.map(choice => <button className="button button-secondary" disabled={blocked} key={choice.id} onClick={() => answerField(currentField.name, choice.id)}>{choice.title}</button>)}</div>}
      {currentField && ['product', 'location'].includes(currentField.kind) && <>{!choices.length && <p>Nenhuma opção disponível no catálogo do seu perfil. Você pode cancelar e abrir o formulário de ofertas.</p>}{editField && <button className="text-link" disabled={blocked} onClick={() => setEditField(null)}>Voltar aos campos</button>}</>}
      {currentField && !['product', 'location'].includes(currentField.kind) && <FieldAnswer key={`${draft.revision}-${currentField.name}`} step={currentField} value={draft.fields[currentField.name]} disabled={blocked} onAnswer={answer => answerField(currentField.name, answer)} onCancel={editField ? () => setEditField(null) : undefined} />}
      {active && (draft.intent === 'create' || draft.target_id) && !missing && draft.intent !== 'archive' && <section className="bot-field-options" aria-label="Campos da oferta"><h3>{draft.intent === 'edit' ? 'O que você quer alterar?' : 'Quer corrigir algum dado?'}</h3><div className="bot-choices">{offerChatSteps.map(step => <button className="text-link" disabled={blocked} key={step.name} onClick={() => { setError(''); setEditField(step.name) }}>Alterar {step.label.toLocaleLowerCase('pt-BR')}</button>)}</div></section>}
      {(!missing || draft?.status === 'conflict') && <Preview draft={draft} catalog={context.catalog} />}
      {draft?.status === 'conflict' && <button className="button button-secondary" disabled={blocked || Boolean(editField)} onClick={() => prepare('Preparar nova prévia após conflito', { ...draft })}>Preparar nova prévia</button>}
      {canConfirmBot(draft, context.catalog) && !editField && <button className="button bot-confirm" disabled={blocked} onClick={() => void execute('confirm', { conversation_id: cid, request_id: crypto.randomUUID(), revision: draft.revision })}>Confirmar revisão {draft.revision}</button>}
      <VoicePanel conversationId={cid} disabled={blocked} {...voice} onUseText={text => { setComposer({ body: text, locked: false }); if (textOptions.current) textOptions.current.open = true; input.current?.focus() }} />
      <details className="bot-free-text" ref={textOptions}><summary>Escrever uma mensagem (opcional)</summary><p>Também pode escrever: consultar, criar oferta, editar alface ou arquivar alface. Para mudar um valor, use total 20 kg ou preço: 7,00.</p><form className="conversation-composer" onSubmit={send}><label htmlFor="bot-message">Mensagem para o Bot Conexa</label><textarea id="bot-message" ref={input} rows={3} maxLength={2000} value={composer.body} disabled={blocked} onChange={event => setComposer({ body: event.target.value, locked: false })} aria-describedby="bot-help" /><div className="conversation-send-row"><small id="bot-help">As opções acima ajudam sem palavras-chave. “Sim” não confirma: use o botão da prévia.</small><button className="button" disabled={blocked || !composer.body.trim()}>Enviar ao bot</button></div></form></details>
      {composer.pending && <button className="button" disabled={busy} onClick={() => void execute(composer.pending.action, composer.pending.payload)}>Verificar pedido pendente</button>}
    </>}
    <ActionLink href={session.role === 'producer' ? '/produtor/ofertas' : '/comprador/ofertas'}>Abrir ofertas e formulário</ActionLink>
  </section>
}
