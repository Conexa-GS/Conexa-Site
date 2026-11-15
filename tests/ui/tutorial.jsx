import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import '../../src/index.css'
import '../../src/App.css'
import Tutorial from '../../src/features/tutorial/Tutorial'
export default function Bench() {
  const [role, setRole] = useState('buyer')
  return <main style={{ padding: 30 }}><h1>Bancada local do tutorial</h1><p>Fixtures isoladas, sem operações no Supabase.</p><label>Perfil<select value={role} onChange={event => setRole(event.target.value)}><option value="producer">Produtor</option><option value="buyer">Comprador</option><option value="carrier">Transportadora</option></select></label><Tutorial key={role} role={role} /></main>
}
createRoot(document.getElementById('root')).render(<Bench />)
