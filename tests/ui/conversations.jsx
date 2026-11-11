import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Logo } from '../../src/components/ui'
import ConversationsPage from '../../src/features/conversations/ConversationsPage'
import { createConversationsFixture } from '../helpers/conversations-fixture.mjs'
import { createBotFixture } from '../helpers/site-bot-fixture.mjs'
import { createVoiceFixture } from '../helpers/voice-fixture.mjs'
import '../../src/index.css'
import '../../src/App.css'

const fixture = createConversationsFixture('ana', 45)
const bot = createBotFixture()
const voice = createVoiceFixture()
export default function Review() {
  const [failure, setFailure] = useState(false)
  return <div className="app-shell"><header className="app-header"><Logo /></header><main id="conteudo" className="app-content"><p className="preview-notice">Bancada isolada · memória local · sem Supabase, persistência remota, microfone ou API paga. Botões de IA/voz usam provedor simulado.</p><label className="m3-check"><input type="checkbox" checked={failure} onChange={event => { setFailure(event.target.checked); fixture.setFailure(event.target.checked); bot.setFailure(event.target.checked) }} />Simular falha no envio</label><button className="text-link" onClick={() => { voice.transcript('Minha oferta de alface agora tem vinte quilos no total'); voice.suggest('editar alface total 20 kg') }}>Simular transcrição e sugestão</button><ConversationsPage session={{ id: 'ana', role: 'producer' }} service={fixture.service} botService={bot.service} voice={{ enabled: true, service: voice.service }} /></main></div>
}
createRoot(document.getElementById('root')).render(<Review />)
