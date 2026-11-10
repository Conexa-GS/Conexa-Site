import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Logo, PageHeading } from '../../src/components/ui'
import OfferChat from '../../src/features/offers/OfferChat'
import '../../src/index.css'
import '../../src/App.css'

// Isolated visual fixture. No Supabase calls, authentication or persistence.
export default function Review() {
  const [open, setOpen] = useState(false)
  const [failure, setFailure] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [writes, setWrites] = useState([])
  const [attempts, setAttempts] = useState(0)
  async function save(data) {
    setAttempts(value => value + 1)
    if (failure) throw new Error('Falha controlada da bancada local; nenhuma escrita remota.')
    setWrites(value => [...value, data])
  }
  return <div className="app-shell"><header className="app-header"><Logo /></header><main id="conteudo" className="app-content">
    <PageHeading eyebrow="BANCADA LOCAL · FIXTURES EM MEMÓRIA" title="Cadastro por conversa," accent="em avaliação.">Componente real M6 com catálogo e serviço controlados. Não comprova persistência nem RLS.</PageHeading>
    <section className="wide-card m3-form">
      <label className="m3-check"><input type="checkbox" checked={failure} onChange={event => setFailure(event.target.checked)} />Simular falha ao publicar</label>
      <label className="m3-check"><input type="checkbox" checked={empty} onChange={event => setEmpty(event.target.checked)} />Catálogo sem local de coleta</label>
      <button className="button" onClick={() => setOpen(true)}>Cadastrar por conversa</button>
      <p role="status">Tentativas de salvar: {attempts}. Ofertas confirmadas nesta bancada: {writes.length}.</p>
      <p>Responda sem confirmar e descarte: os contadores devem continuar em zero. Corrija na prévia, simule falha, tente novamente e confirme; revise em 360 px/desktop e por teclado.</p>
      {writes.map((data, index) => <pre key={index} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(data, null, 2)}</pre>)}
    </section>
    {open && <OfferChat products={[{ id: 'alface', name: 'Alface', unit: 'kg' }, { id: 'tomate', name: 'Tomate', unit: 'kg' }]} locations={empty ? [] : [{ id: 'sitio', display_address: 'Sítio Boa Semente · ponto de coleta fictício' }]} save={save} close={() => setOpen(false)} onSaved={() => {}} />}
  </main></div>
}
createRoot(document.getElementById('root')).render(<Review />)
