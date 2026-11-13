import { useCallback, useEffect, useRef, useState } from 'react'
import { PaperPlaneTilt, Robot } from '@phosphor-icons/react'
import { ActionLink, ErrorNotice } from '../../components/ui'
import { siteBotService } from '../../services/site-bot'
import { botQuestion, canConfirmBot, interpretSiteBot, offerFields } from '../../domain/site-bot'
import { answerOfferChat, offerChatSteps } from '../../domain/offer-chat'
import { currency, quantity } from '../../domain/offers'
import VoicePanel from './VoicePanel'

function Preview({ draft, catalog }) {
  if (!draft || !['create', 'edit', 'archive'].includes(draft.intent) || (draft.intent !== 'create' && !draft.target_id)) return null
  const before = draft.before_offer ? offerFields(draft.before_offer) : {}
  function label(name, value) {
    if (value === undefined) return 'A informar'
    if (name === 'product_id') return catalog.products.find(item => item.id === value)?.name || value
    if (name === 'pickup_location_id') return catalog.locations.find(item => item.id === value)?.display_address || value
    if (name === 'quantity_total') return `${quantity(Number(String(value).replace(',', '.')))} kg (total)`
    if (name === 'price' || name === 'minimum') return currency(Math.round(Number(String(value).replace(',', '.')) * 100))
    if (['available_from', 'available_until', 'expires_on'].includes(name) && value) return value.split('-').reverse().join('/')
    return value || 'Desconhecido'
  }
  return <section className="bot-preview" aria-label="Prévia da oferta"><h3>{draft.intent === 'create' ? 'Criar oferta' : draft.intent === 'edit' ? 'Editar oferta' : 'Arquivar oferta'} · revisão {draft.revision}</h3>
    <p>{label('product_id', draft.fields.product_id)} · {draft.intent === 'archive' ? 'O histórico será preservado.' : 'Confira os dados antes de salvar.'}</p>
    {draft.before_offer && <p>Saldo livre na prévia: {quantity(draft.expected_balance)} kg. Reservas e compromissos fazem parte do total.</p>}
    {draft.intent !== 'archive' && <dl>{offerChatSteps.map(step => <div key={step.name}><dt>{step.label}</dt><dd>{draft.intent === 'edit' && before[step.name] !== draft.fields[step.name] && <span>Antes: {label(step.name, before[step.name])}<br /></span>}Depois: {label(step.name, draft.fields[step.name])}</dd></div>)}</dl>}
    {draft.target_id && <details className="bot-record-details"><summary>Identificação da oferta</summary><p>{draft.target_id} · versão {draft.before_offer?.version}</p></details>}
    <p>Alterações no cadastro preservam os valores e condições das cargas já registradas.</p>
  </section>
}

export default function BotThread({ conversation, session, service = siteBotService, refresh, revision, composer, setComposer, voice }) {
  const [context, setContext] = useState(null)
  const [history, setHistory] = useState({ messages: [], has_more: false })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [notice, setNotice] = useState('')
  const [editField, setEditField] = useState(null)
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
        setLoadError('')
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
  useEffect(() => { void Promise.resolve().then(load).catch(error => { if (live.current) setLoadError(error.message) }) }, [load, revision])
  useEffect(() => { if (notice) feedback.current?.focus({ preventScroll: true }) }, [notice, latestMessageId])
  useEffect(() => {
    const scroller = historyElement.current
    if (!scroller) return
    const latest = scroller.querySelector(':scope > ol > li:last-child')
    // Start a long response at its question and choices; the composer stays outside the scroll area.
    if (latest && latest.offsetHeight > scroller.clientHeight) scroller.scrollTop += latest.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 16
    else scroller.scrollTop = scroller.scrollHeight
  }, [latestMessageId, editField])

  async function execute(action, payload) {
    if (lock.current) return
    // Retain questions already shown during this visit when the next reply arrives.
    // This is presentation only; the remote audit messages are left untouched.
    setHistory(previous => ({ ...previous, messages: previous.messages.map(message => message.id === lastBotId && /^(Rascunho revisão|Oferta persistida:|Consulta de ofertas|Rascunho descartado)/.test(message.body) ? { ...message, displayBody: question } : message) }))
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
          if (live.current) { setContext(null); setEditField(null) }
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
  function answerField(name, answer, message) {
    const result = answerOfferChat(context.draft.fields, name, answer, context.catalog)
    if (result.error) { setError(result.error); return }
    const step = offerChatSteps.find(item => item.name === name)
    const label = name === 'product_id' ? context.catalog.products.find(item => item.id === answer)?.name : name === 'pickup_location_id' ? context.catalog.locations.find(item => item.id === answer)?.display_address : answer
    prepare(message || `${step.label}: ${label || 'Não sei informar'}`, { ...context.draft, fields: result.draft })
  }
  function send(event) {
    event.preventDefault()
    if (blocked || !context || !composer.body.trim()) return
    const text = composer.body.trim()
    const unknownDate = /^(não sei|nao sei|desconhecido|não sei informar|nao sei informar)$/i.test(text)
    // A plain value answers the question currently being asked, including corrections.
    // Commands still go through the interpreter (cancel, consult, explicit field changes).
    if (currentField && !['product', 'location'].includes(currentField.kind) && (/^[-\d.,/]+$/.test(text) || unknownDate)) {
      answerField(currentField.name, currentField.optional && unknownDate ? '' : text, text)
      return
    }
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
  const answeringInChat = Boolean(currentField && !['product', 'location'].includes(currentField.kind))
  useEffect(() => {
    if (answeringInChat && !blocked && !error && !loadError) input.current?.focus({ preventScroll: true })
  }, [answeringInChat, blocked, error, loadError, currentField?.name, draft?.revision])
  const choices = currentField?.name === 'product_id' ? context.catalog.products.map(p => ({ id: p.id, title: p.name })) : currentField?.name === 'pickup_location_id' ? context.catalog.locations.map(l => ({ id: l.id, title: l.display_address })) : []
  const offerSelection = draft?.intent === 'consult' || (active && ['edit', 'archive'].includes(draft.intent) && !draft.target_id)
  const lastBotId = history.messages.findLast(message => message.speaker === 'bot')?.id
  const question = editField && currentField ? `Vamos alterar ${currentField.label.toLocaleLowerCase('pt-BR')}. ${currentField.name === 'quantity_total' ? 'Qual é a quantidade total ofertada em kg? Inclua reservas e compromissos no total.' : currentField.question}${currentField.help ? ` ${currentField.help}` : ''}` : active ? botQuestion(draft, context.catalog) : draft?.intent === 'consult' ? 'Estas são as ofertas disponíveis. Qual você quer ver ou alterar?' : draft?.status === 'applied' ? 'Tudo certo! Sua alteração foi salva. O que você quer fazer agora?' : draft?.status === 'cancelled' ? 'Rascunho descartado. Nenhuma oferta foi alterada. Como posso ajudar agora?' : 'Olá! Sou o Bot Conexa. Posso ajudar você com suas ofertas e colheitas. O que vamos fazer hoje?'
  function historyText(message) {
    if (message.speaker !== 'bot') return message.body
    if (message.displayBody) return message.displayBody
    if (/^Rascunho revisão/.test(message.body)) return 'Recebi os dados para preparar sua oferta. Nada foi salvo no catálogo nesta etapa.'
    if (/^Oferta persistida:/.test(message.body)) return 'Sua oferta foi salva com sucesso.'
    return message.body
  }
  const responseControls = context && <>
      {offerSelection && <ul className="bot-offer-options" aria-label="Ofertas disponíveis">{context.offers.map(offer => <li key={offer.id}>
        <div className="bot-offer-top"><strong>{offer.products.name}</strong><span>{currency(offer.unit_price_cents)}<small>/kg</small></span></div>
        <p>{quantity(offer.quantity_free)} kg livres <span>de {quantity(offer.quantity_total)} kg no total</span></p>
        <p className="bot-offer-meta">Disponível de {offer.available_from.split('-').reverse().join('/')} até {offer.available_until.split('-').reverse().join('/')}</p>
        <p className="bot-offer-meta">{context.catalog.locations.find(location => location.id === offer.pickup_location_id)?.display_address || 'Local de coleta não informado'}</p>
        <details className="bot-record-details"><summary>Identificação da oferta</summary><p>{offer.id}</p></details>
        {session.role === 'producer' && <button className="text-link" disabled={blocked} onClick={() => prepare(`Escolher oferta de ${offer.products.name}, ${quantity(offer.quantity_total)} kg, disponível até ${offer.available_until.split('-').reverse().join('/')}`, { intent: draft.intent === 'consult' ? 'edit' : draft.intent, fields: offerFields(offer), target_id: offer.id })}>{draft.intent === 'consult' ? 'Editar esta oferta' : 'Escolher esta oferta'}</button>}
      </li>)}{!context.offers.length && <li>Nenhuma oferta disponível por enquanto.</li>}</ul>}
      {currentField && choices.length > 0 && <div className="bot-choices" role="group" aria-label={currentField.label}>{choices.map(choice => <button className="button button-secondary" disabled={blocked} key={choice.id} onClick={() => answerField(currentField.name, choice.id)}>{choice.title}</button>)}</div>}
      {currentField && ['product', 'location'].includes(currentField.kind) && <>{!choices.length && <p>Nenhuma opção disponível no catálogo do seu perfil. Você pode cancelar e abrir o formulário de ofertas.</p>}{editField && <button className="text-link" disabled={blocked} onClick={() => setEditField(null)}>Voltar aos campos</button>}</>}
      {answeringInChat && <div className="bot-choices bot-answer-options">{currentField.optional && <button className="button button-secondary" disabled={blocked} onClick={() => answerField(currentField.name, '')}>Não sei informar</button>}{editField && <button className="text-link" disabled={blocked} onClick={() => setEditField(null)}>Voltar aos campos</button>}</div>}
      {active && (draft.intent === 'create' || draft.target_id) && !currentField && draft.intent !== 'archive' && <section className="bot-field-options" aria-label="Campos da oferta"><h3>{draft.intent === 'edit' ? 'O que você quer alterar?' : 'Quer corrigir algum dado?'}</h3><div className="bot-choices">{offerChatSteps.map(step => <button className="text-link" disabled={blocked} key={step.name} onClick={() => { setError(''); setEditField(step.name) }}>Alterar {step.label.toLocaleLowerCase('pt-BR')}</button>)}</div></section>}
      {active && !editField && (!missing || draft?.status === 'conflict') && <Preview draft={draft} catalog={context.catalog} />}
      {draft?.status === 'conflict' && <button className="button button-secondary" disabled={blocked || Boolean(editField)} onClick={() => prepare('Preparar nova prévia após conflito', { ...draft })}>Preparar nova prévia</button>}
      {canConfirmBot(draft, context.catalog) && !editField && <button className="button bot-confirm" disabled={blocked} onClick={() => void execute('confirm', { conversation_id: cid, request_id: crypto.randomUUID(), revision: draft.revision })}>Confirmar revisão {draft.revision}</button>}
      {active && <button className="text-link bot-cancel" disabled={blocked} onClick={() => prepare('Cancelar rascunho', { intent: 'cancel', fields: {} })}>Cancelar rascunho</button>}
    </>
  return <section className="conversation-thread bot-thread" aria-labelledby="bot-title" aria-busy={busy}>
    <header className="conversation-thread-heading"><span className="conversation-avatar bot"><Robot size={25} aria-hidden="true" /></span><div><h2 id="bot-title" ref={heading} tabIndex={-1}>Bot Conexa</h2><p>Seu assistente de ofertas · texto simulado</p></div><details className="conversation-info"><summary>Sobre o bot</summary><div><p>Use dados fictícios. Só altero ofertas depois que você revisar e confirmar. Propostas, demandas e confirmações continuam nos seus fluxos.</p><ActionLink href={session.role === 'producer' ? '/produtor/propostas' : '/comprador/demandas'}>{session.role === 'producer' ? 'Ver propostas' : 'Ver demandas'}</ActionLink><ActionLink href={session.role === 'producer' ? '/produtor/ofertas' : '/comprador/ofertas'}>Abrir ofertas e formulário</ActionLink><VoicePanel conversationId={cid} disabled={blocked} {...voice} onUseText={text => { setComposer({ body: text, locked: false }); input.current?.focus() }} /></div></details></header>
    <div ref={historyElement} className="conversation-history bot-history" tabIndex={0} role="region" aria-label="Histórico do bot">
      <p className="conversation-date">Conversa com o Bot Conexa</p>
      {history.has_more && <button className="text-link" disabled={busy} onClick={older}>Carregar mensagens anteriores</button>}
      <ol>{history.messages.map(message => <li key={message.id} className={`conversation-bubble ${message.speaker === 'human' ? 'own' : ''}`}><strong className="conversation-speaker">{message.speaker === 'bot' ? 'Bot Conexa' : 'Você'}</strong><p ref={message.id === lastBotId ? feedback : undefined} tabIndex={message.id === lastBotId ? -1 : undefined} className={message.id === lastBotId ? 'bot-feedback' : undefined}>{message.id === lastBotId && context && /^(Rascunho revisão|Oferta persistida:|Consulta de ofertas|Rascunho descartado)/.test(message.body) ? question : historyText(message)}</p>
        {message.id === lastBotId && responseControls}
        <time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' })}</time></li>)}
        {!history.messages.length && context && <li className="conversation-bubble bot-introduction"><strong className="conversation-speaker">Bot Conexa</strong><p ref={feedback} tabIndex={-1} className="bot-feedback">{question}</p>{responseControls}</li>}
      </ol>
      {!context && !error && !loadError && <p role="status">Carregando bot e ofertas…</p>}
      {(error || loadError) && <ErrorNotice autoFocus title="Não foi possível continuar" retry={composer.pending ? undefined : () => { void load().catch(error => setLoadError(error.message)) }}>{error || loadError} Seu rascunho foi preservado.</ErrorNotice>}
      {!context && (error || loadError) && <button className="text-link" disabled={busy} onClick={() => { setLoadError(''); void load().catch(error => setLoadError(error.message)) }}>Recarregar bot</button>}
      {busy && <p className="bot-typing" role="status">Bot Conexa está respondendo…</p>}
    </div>
    <div className="bot-compose-area">
      <p role="status" className="bot-status sr-only">{notice}</p>
      {context && <section className="bot-action-menu" aria-label="Sugestões para a conversa">
        {!active && <><span className="bot-suggestions-label">Para começar</span><div className="bot-choices">
          <button className="button button-secondary" disabled={blocked} onClick={() => prepare('Consultar ofertas', { intent: 'consult', fields: {} })}>Consultar ofertas</button>
          {session.role === 'producer' && <><button className="button button-secondary" disabled={blocked} onClick={() => prepare('Criar oferta', { intent: 'create', fields: {} })}>Criar oferta</button><button className="button button-secondary" disabled={blocked || !context.offers.length} onClick={() => prepare('Editar oferta', { intent: 'edit', fields: {} })}>Editar oferta</button><button className="button button-secondary" disabled={blocked || !context.offers.length} onClick={() => prepare('Arquivar oferta', { intent: 'archive', fields: {} })}>Arquivar oferta</button></>}
        </div></>}
      </section>}
      {composer.pending && <button className="button bot-recover" disabled={busy} onClick={() => void execute(composer.pending.action, composer.pending.payload)}>Verificar pedido pendente</button>}
      <form className="conversation-composer bot-free-text" onSubmit={send}>
        <label className="sr-only" htmlFor="bot-message">Mensagem para o Bot Conexa</label>
        <div className="conversation-input-row"><textarea id="bot-message" ref={input} rows={2} maxLength={2000} inputMode={currentField?.kind === 'decimal' ? 'decimal' : undefined} placeholder={answeringInChat ? currentField.kind === 'date' ? 'Responda aqui: dia/mês/ano' : 'Digite o valor aqui…' : 'Escreva sua mensagem…'} value={composer.body} disabled={blocked || !context} onChange={event => setComposer({ body: event.target.value, locked: false })} aria-describedby="bot-help" onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(event) } }} /><button className="button conversation-send" aria-label="Enviar ao bot" disabled={blocked || !context || !composer.body.trim()}><PaperPlaneTilt size={21} aria-hidden="true" /></button></div>
        <small id="bot-help">{answeringInChat ? 'Responda à pergunta pelo chat e envie. Salvar exige confirmar a prévia.' : 'Texto simulado · tente “consultar” ou “editar alface”. Salvar exige confirmar a prévia.'}</small>
      </form>
    </div>
  </section>
}
