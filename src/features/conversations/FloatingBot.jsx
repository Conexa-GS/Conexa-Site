import { useEffect, useRef, useState } from 'react'
import { X } from '@phosphor-icons/react'
import MotionArtwork from '../../components/MotionArtwork'
import { ErrorNotice } from '../../components/ui'
import { useConversations } from '../../hooks/useConversations'
import { createConversationOutbox } from '../../services/conversation-outbox'
import BotThread from './BotThread'
import './conversations.css'
import './floating-bot.css'

function BotContent({ session, service, botService }) {
  const inbox = useConversations(session, service)
  const [outbox] = useState(() => createConversationOutbox(session.id))
  const [drafts, setDrafts] = useState(() => outbox.load())
  const conversation = inbox.conversations.find(item => item.kind === 'bot')
  const conversationId = conversation?.id
  function updateComposer(draft, expectedKey) {
    if (!conversationId || !outbox.save(conversationId, draft, expectedKey)) return false
    setDrafts(previous => ({ ...previous, [conversationId]: draft }))
    return true
  }
  return <>
    {outbox.warning() && <p className="floating-bot-notice" role="status">{outbox.warning()}</p>}
    {inbox.error && <ErrorNotice retry={inbox.reload}>{inbox.error}</ErrorNotice>}
    {conversation ? <BotThread conversation={conversation} session={session} service={botService} revision={inbox.revision} refresh={inbox.reload} composer={drafts[conversationId] || { body: '', locked: false }} setComposer={updateComposer} />
      : <div className="floating-bot-empty" role="status"><p>{inbox.loading ? 'Abrindo seu Bot Conexa…' : 'Não foi possível abrir o bot.'}</p>{!inbox.loading && <button className="text-link" onClick={inbox.reload}>Tentar novamente</button>}</div>}
  </>
}

export default function FloatingBot({ session, path, service, botService }) {
  const panel = useRef(null)
  const [visited, setVisited] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const show = () => panel.current?.showPopover()
    window.addEventListener('conexa:open-bot', show)
    if (path?.endsWith('/conversas') && new URLSearchParams(window.location.search).get('conversa') === 'bot') show()
    return () => window.removeEventListener('conexa:open-bot', show)
  }, [path])
  return <div className="floating-bot">
    <button type="button" className="floating-bot-trigger" popoverTarget="conexa-bot-panel" aria-controls="conexa-bot-panel" aria-expanded={open} aria-label={open ? 'Fechar Bot Conexa' : 'Conversar com o Bot Conexa'} title="Bot Conexa">
      <MotionArtwork asset="flower" />
    </button>
    <div ref={panel} id="conexa-bot-panel" popover="auto" role="dialog" aria-label="Conversa com o Bot Conexa" className="floating-bot-panel" onBeforeToggle={event => { if (event.newState === 'open') setVisited(true) }} onToggle={event => {
      setOpen(event.newState === 'open')
      if (event.newState === 'open') (panel.current?.querySelector('#bot-title') || panel.current?.querySelector('button'))?.focus({ preventScroll: true })
    }} onClick={event => { if (event.target.closest('a[href]')) panel.current?.hidePopover() }}>
      <button type="button" autoFocus className="floating-bot-close" popoverTarget="conexa-bot-panel" popoverTargetAction="hide" aria-label="Minimizar conversa"><X size={20} aria-hidden="true" /></button>
      {visited && <BotContent session={session} service={service} botService={botService} />}
    </div>
  </div>
}
