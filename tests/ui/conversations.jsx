import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Logo } from '../../src/components/ui'
import ConversationsPage from '../../src/features/conversations/ConversationsPage'
import { createConversationsFixture } from '../helpers/conversations-fixture.mjs'
import '../../src/index.css'
import '../../src/App.css'

const fixture = createConversationsFixture('ana', 45)
export default function Review() {
  const [failure, setFailure] = useState(false)
  return <div className="app-shell"><header className="app-header"><Logo /></header><main id="conteudo" className="app-content"><p className="preview-notice">Bancada isolada · memória local · sem Supabase, persistência remota ou API paga.</p><label className="m3-check"><input type="checkbox" checked={failure} onChange={event => { setFailure(event.target.checked); fixture.setFailure(event.target.checked) }} />Simular falha no envio</label><ConversationsPage session={{ id: 'ana', role: 'producer' }} service={fixture.service} /></main></div>
}
createRoot(document.getElementById('root')).render(<Review />)
