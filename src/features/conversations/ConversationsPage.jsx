import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ChatCircleDots, PaperPlaneTilt, Robot } from '@phosphor-icons/react'
import { ErrorNotice, PageHeading } from '../../components/ui'
import { useConversations } from '../../hooks/useConversations'
import { conversationService } from '../../services/conversations'
import './conversations.css'
import BotThread from './BotThread'
import { createConversationOutbox } from '../../services/conversation-outbox'

const time = value => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date(value))
const merge = (previous, next) => [...new Map([...previous, ...next].map(message => [message.id, message])).values()].sort((a, b) => BigInt(a.seq) < BigInt(b.seq) ? -1 : BigInt(a.seq) > BigInt(b.seq) ? 1 : 0)

function Thread({ conversation, session, service, revision, refresh, composer, setComposer }) {
  const [history, setHistory] = useState({ messages: [], loading: true, hasMore: false, error: '' })
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [notice, setNotice] = useState('')
  const alive = useRef(true)
  const request = useRef({ value: 0 })
  const sendingRef = useRef(false)
  const returnToComposer = useRef(false)
  const heading = useRef(null)
  const input = useRef(null)
  const end = useRef(null)
  const historyRef = useRef(null)
  const newestSeq = useRef(null)
  const scrollState = useRef({ height: 0, lastId: null })
  const id = conversation.id

  useEffect(() => {
    if (!sending && returnToComposer.current) {
      returnToComposer.current = false
      input.current?.focus()
    }
  }, [sending, history.messages])

  useEffect(() => {
    const scroller = historyRef.current
    const last = history.messages.at(-1)
    if (!scroller || !last) return
    const previous = scrollState.current
    if (last.id !== previous.lastId && (!previous.lastId || last.sender_id === session.id || scroller.scrollTop + scroller.clientHeight >= previous.height - 80)) scroller.scrollTop = scroller.scrollHeight
    scrollState.current = { height: scroller.scrollHeight, lastId: last.id }
  }, [history.messages, session.id])

  useEffect(() => { alive.current = true; heading.current?.focus(); return () => { alive.current = false } }, [])
  useEffect(() => {
    const lifecycle = request.current
    const current = ++lifecycle.value
    void (async () => {
      const after = newestSeq.current
      let page = await service.messages(id, null, after)
      const messages = [...page.messages]
      const initialHasMore = page.has_more
      // Cursor progressivo: mais de 40 mensagens durante a desconexão não deixa lacuna.
      while (after && page.has_more && page.messages.length) {
        if (!alive.current || current !== lifecycle.value) return
        page = await service.messages(id, null, page.messages.at(-1).seq)
        messages.push(...page.messages)
      }
      if (!alive.current || current !== lifecycle.value) return
      const last = messages.at(-1)
      if (last) newestSeq.current = last.seq
      setHistory(previous => ({ messages: merge(previous.messages, messages), loading: false, hasMore: after ? previous.hasMore : initialHasMore, error: '' }))
      const readCursor = newestSeq.current
      if (readCursor && document.visibilityState === 'visible' && BigInt(readCursor) > BigInt(conversation.last_read_seq)) {
        try { await service.read(id, readCursor); if (alive.current && current === lifecycle.value) refresh() }
        catch (error) { if (alive.current && current === lifecycle.value) setHistory(previous => ({ ...previous, error: `Leitura não sincronizada: ${error.message}` })) }
      }
    })().catch(error => { if (alive.current && current === lifecycle.value) setHistory(previous => ({ ...previous, loading: false, error: error.message })) })
    return () => { lifecycle.value++ }
  }, [id, service, revision, conversation.last_read_seq, refresh])

  async function older() {
    const current = ++request.current.value
    setHistory(previous => ({ ...previous, loading: true, error: '' }))
    try {
      const page = await service.messages(id, history.messages[0].seq)
      if (alive.current && current === request.current.value) setHistory(previous => ({ messages: merge(previous.messages, page.messages), loading: false, hasMore: page.has_more, error: '' }))
    } catch (error) { if (alive.current && current === request.current.value) setHistory(previous => ({ ...previous, loading: false, error: error.message })) }
  }

  async function send(event) {
    event.preventDefault()
    if (sendingRef.current || !composer.body.trim()) return
    const attempt = { body: composer.body.trim(), key: composer.key || crypto.randomUUID(), locked: true }
    sendingRef.current = true; setSending(true); setSendError(''); setNotice('')
    try {
      setComposer(attempt)
      const message = await service.send(id, attempt.key, attempt.body)
      // O mesmo identificador acompanha reenvios, inclusive após troca de conversa.
      if (!setComposer({ body: '', key: null, locked: false }, attempt.key)) return
      if (alive.current) {
        setHistory(previous => ({ ...previous, messages: merge(previous.messages, [message]) }))
        returnToComposer.current = true
        setNotice('Mensagem enviada.'); end.current?.scrollIntoView({ block: 'nearest' })
        refresh()
      }
    } catch (error) { if (alive.current) setSendError(error.message) }
    finally { sendingRef.current = false; if (alive.current) setSending(false) }
  }

  return <section className="conversation-thread" aria-labelledby="thread-title" aria-busy={sending}>
    <header className="conversation-thread-heading"><span className="conversation-avatar" aria-hidden="true"><ChatCircleDots size={25} /></span><div><h2 ref={heading} id="thread-title" tabIndex={-1}>{conversation.title}</h2><p>Participante fictício · conversa individual</p></div></header>
      <p className="conversation-agreement" role="note">Acordos por mensagem precisam ser formalizados nos fluxos de ofertas, demandas e confirmações. Use apenas dados fictícios; contas demo são compartilhadas.</p>
      {history.error && <ErrorNotice retry={refresh}>{history.error}</ErrorNotice>}
      <div ref={historyRef} className="conversation-history" role="region" tabIndex={0} aria-label="Histórico de mensagens">
        {history.hasMore && <button className="text-link" onClick={older} disabled={history.loading}>Carregar mensagens anteriores</button>}
        {history.loading && <p role="status">Carregando mensagens…</p>}
        {!history.loading && !history.error && !history.messages.length && <p className="conversation-empty">Uma nova conexão começa com uma mensagem.</p>}
        <ol>{history.messages.map(message => <li className={`conversation-bubble ${message.sender_id === session.id ? 'own' : ''}`} key={message.id}><span className="sr-only">{message.sender_id === session.id ? 'Você' : conversation.title}: </span><p>{message.body}</p><time dateTime={message.created_at}>{time(message.created_at)}</time></li>)}</ol><div ref={end} />
      </div>
      <div className="conversation-composer"><form onSubmit={send}>
        <label htmlFor="conversation-message">Sua mensagem</label>
        <textarea ref={input} id="conversation-message" maxLength={2000} rows={3} value={composer.body} disabled={sending || composer.locked} onChange={event => setComposer({ body: event.target.value, key: null, locked: false })} aria-describedby="message-help" />
        <div className="conversation-send-row"><small id="message-help">{composer.locked ? 'Envio a verificar. Reenvie com a mesma chave para evitar duplicação.' : `${composer.body.length}/2000 · texto dentro da Conexa`}</small><button className="button" disabled={sending || !composer.body.trim()} type="submit">{sending ? 'Enviando…' : composer.locked ? 'Verificar envio' : 'Enviar'}<PaperPlaneTilt size={18} aria-hidden="true" /></button></div>
      </form>{sendError && <ErrorNotice autoFocus title="Não foi possível confirmar o envio">{sendError} Seu texto foi preservado. Verifique o envio antes de escrever outra mensagem.</ErrorNotice>}<p className="sr-only" role="status">{notice}</p></div>
  </section>
}

export default function ConversationsPage({ session, service = conversationService, botService, voice, initialBot = false }) {
  const inbox = useConversations(session, service)
  const [selected, setSelected] = useState(initialBot ? 'bot' : null)
  const [outbox] = useState(() => createConversationOutbox(session.id))
  const [drafts, setDrafts] = useState(() => outbox.load())
  const [opening, setOpening] = useState(false)
  const [actionError, setActionError] = useState('')
  const openRef = useRef(false)
  const listHeading = useRef(null)
  const returnToList = useRef(false)
  useEffect(() => {
    if (selected === null && returnToList.current) {
      returnToList.current = false
      listHeading.current?.focus()
    }
  }, [selected])
  const conversation = inbox.conversations.find(item => selected === 'bot' ? item.kind === 'bot' : item.id === selected)
  function updateComposer(id, draft, expectedKey) {
    if (!outbox.save(id, draft, expectedKey)) return false
    setDrafts(previous => ({ ...previous, [id]: draft }))
    return true
  }
  async function openContact(peer) {
    if (openRef.current) return
    openRef.current = true; setOpening(true); setActionError('')
    try { const result = await service.openDirect(peer); await inbox.reload(); setSelected(result.id) }
    catch (error) { setActionError(error.message) }
    finally { openRef.current = false; setOpening(false) }
  }
  function back() { returnToList.current = true; setSelected(null) }
  return <>
    <PageHeading title="Conversas">Escolha uma pessoa para conversar ou peça ajuda ao Bot Conexa.</PageHeading>
    <p className="preview-notice">Prévia em avaliação · ajuda por texto sem custo. Confira e confirme os dados antes de salvar. Voz opcional em preparação.</p>
    {inbox.error && <ErrorNotice retry={inbox.reload}>{inbox.error}</ErrorNotice>}
    {actionError && <ErrorNotice autoFocus>{actionError}</ErrorNotice>}
    {outbox.warning() && <p role="status">{outbox.warning()} Confira o histórico antes de iniciar outro envio.</p>}
    {Object.values(drafts).some(draft => draft.locked) && <p role="status">Há envio a verificar nesta aba. Abra a conversa e use Verificar envio ou Verificar pedido pendente antes de iniciar outro.</p>}
    <div className={`conversations-layout ${conversation ? 'has-selection' : ''}`}>
      <aside className="conversation-sidebar" aria-label="Lista de conversas"><div className="conversation-list-heading"><h2 ref={listHeading} tabIndex={-1}>Conversas</h2><button className="text-link" onClick={inbox.reload}>Atualizar</button></div>
        {inbox.loading && <p role="status">Carregando conversas…</p>}
        <ul className="conversation-list">{inbox.conversations.map(item => <li key={item.id}><button aria-current={item.id === conversation?.id ? 'true' : undefined} onClick={() => setSelected(item.id)}><span className={`conversation-avatar ${item.kind === 'bot' ? 'bot' : ''}`} aria-hidden="true">{item.kind === 'bot' ? <Robot size={24} /> : <ChatCircleDots size={24} />}</span><span className="conversation-list-copy"><strong>{item.title}</strong><small>{item.kind === 'bot' ? 'Assistente Conexa · cadastro guiado' : item.last_body || 'Comece uma conversa'}</small>{item.last_at && <time dateTime={item.last_at}>{time(item.last_at)}</time>}</span>{item.unread > 0 && <span className="conversation-unread" aria-label={`${item.unread} mensagens não lidas`}>{item.unread}</span>}</button></li>)}</ul>
        {!inbox.loading && !inbox.error && <><h3>Contatos demo</h3><p className="field-help">Inicie uma conversa individual.</p><ul className="conversation-contacts">{inbox.contacts.map(peer => <li key={peer.id}><button disabled={opening} onClick={() => openContact(peer.id)}>{peer.display_name}<small>{peer.role === 'producer' ? 'Produtor' : 'Comprador'} fictício</small></button></li>)}</ul></>}
      </aside>
      <div className="conversation-main">{conversation ? <>
        <button className="conversation-back text-link" onClick={back}><ArrowLeft size={18} aria-hidden="true" />Voltar às conversas</button>
        {conversation.kind === 'bot'
          ? <BotThread key={conversation.id} conversation={conversation} session={session} service={botService} voice={voice} revision={inbox.revision} refresh={inbox.reload} composer={drafts[conversation.id] || { body: '', locked: false }} setComposer={(draft, expectedKey) => updateComposer(conversation.id, draft, expectedKey)} />
          : <Thread key={conversation.id} conversation={conversation} session={session} service={service} revision={inbox.revision} refresh={inbox.reload} composer={drafts[conversation.id] || { body: '', key: null, locked: false }} setComposer={(draft, expectedKey) => updateComposer(conversation.id, draft, expectedKey)} />}
      </> : <div className="conversation-welcome"><img src="/assets/marca/conexa-logo.svg" width="168" height="39" alt="Conexa" /><h2>{selected === 'bot' ? inbox.loading ? 'Abrindo Bot Conexa…' : 'Bot Conexa indisponível.' : 'Escolha uma conversa.'}</h2><p>{selected === 'bot' ? inbox.loading ? 'Carregando seu histórico e as opções do bot.' : 'Use Atualizar para tentar carregar seu bot novamente.' : 'O Bot Conexa fica no início da lista. Para falar com uma pessoa, escolha um contato demo.'}</p></div>}</div>
    </div>
  </>
}
