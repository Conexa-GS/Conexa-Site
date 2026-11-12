// Manual, development-only entry point. Real demo data, controlled delivery
// failures at the service boundary. Never included in the production entry.
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useDemoSession } from '../../src/hooks/useDemoSession'
import { accounts } from '../../src/services/offers'
import { conversationService } from '../../src/services/conversations'
import { siteBotService } from '../../src/services/site-bot'
import ConversationsPage from '../../src/features/conversations/ConversationsPage'
import { ErrorNotice, Logo } from '../../src/components/ui'
import '../../src/index.css'
import '../../src/App.css'

let failure = ''
async function deliver(operation) {
  const mode = failure
  failure = '' // One-shot; reloading/retrying never arms another failure.
  if (mode === 'before') throw new Error('T41: falha controlada antes de enviar ao Supabase.')
  const result = await operation()
  if (mode === 'after') throw new Error('T41: resposta descartada após retorno persistido do Supabase.')
  return result
}
const chat = { ...conversationService, send: (...args) => deliver(() => conversationService.send(...args)) }
const bot = { ...siteBotService, turn: payload => deliver(() => siteBotService.turn(payload)), confirm: payload => deliver(() => siteBotService.confirm(payload)) }

export default function Review() {
  const auth = useDemoSession()
  const [armed, setArmed] = useState('')
  const demo = import.meta.env.DEV && import.meta.env.VITE_SUPABASE_URL === 'https://ppbneiusqlitvewwoact.supabase.co'
  if (!demo) return <p>Bancada restrita ao desenvolvimento e ao Supabase demo Conexa.</p>
  return <div className="app-shell"><header className="app-header"><Logo /></header><main id="conteudo" className="app-content">
    <p className="preview-notice">T41 · Supabase demo real. Só dados fictícios. Falhas controladas na entrega do serviço; não é queda física de rede. Sem voz/API paga. Mensagens e histórico permanecem.</p>
    {auth.restoring ? <p role="status">Retomando participante…</p> : auth.session ? <>
      <p>{auth.session.display_name} · {auth.session.role}</p><button className="text-link" onClick={auth.leave}>Sair da bancada</button>
      <label>Falha no próximo envio<select value={armed} onChange={event => { failure = event.target.value; setArmed(event.target.value) }}><option value="">Nenhuma</option><option value="before">Antes de enviar</option><option value="after">Descartar resposta persistida</option></select></label>
      <p>A falha selecionada é usada uma vez. Após recarregar, abra a conversa e verifique o envio com a mesma chave.</p>
      <ConversationsPage key={auth.session.id} session={auth.session} service={chat} botService={bot} voice={{ enabled: false }} />
    </> : accounts.filter(a => ['producer', 'buyer'].includes(a.role)).map(account => <button className="button" key={account.id} disabled={auth.pending} onClick={() => auth.enter(account)}>Entrar: {account.name}</button>)}
    {auth.error && <ErrorNotice>{auth.error}</ErrorNotice>}
  </main></div>
}
createRoot(document.getElementById('root')).render(<Review />)
