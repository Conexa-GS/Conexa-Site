import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Plant, Basket, Truck } from '@phosphor-icons/react'
import { accounts } from '../services/offers'
import { Logo, PageHeading, ErrorNotice, BackLink } from '../components/ui'
import { navigate } from '../hooks/useRouter'
import { homeFor } from '../domain/profiles'
import { isRemote } from '../services/supabase'
import AnimatedCharacter from '../components/AnimatedCharacter'
const profiles = [
  { role: 'producer', title: 'Eu produzo.', copy: 'Sua colheita encontra novos caminhos. Publique alimentos e acompanhe suas ofertas.', art: 'farmer', icon: Plant },
  { role: 'buyer', title: 'Eu compro.', copy: 'Aproxime seu negócio de quem cultiva. Conheça os alimentos disponíveis na rede.', art: 'buyer', icon: Basket },
  { role: 'carrier', title: 'Eu transporto.', copy: 'Conecte o campo à cidade. Veja as primeiras telas de coletas e transporte.', art: 'carrier', icon: Truck },
]
export default function Demo({ auth }) {
  const profileGrid = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('art-offscreen', !entry.isIntersecting)), { rootMargin: '80px' })
    profileGrid.current.querySelectorAll('.profile-art').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  const [producer, setProducer] = useState('ana')
  const preferred = new URLSearchParams(window.location.search).get('perfil')
  async function enter(role) {
    const account = accounts.find(a => role === 'producer' ? a.id === producer : a.role === role)
    const participant = await auth.enter(account)
    if (participant) navigate(homeFor(participant.role))
  }
  return <div className="app-shell demo-page"><header className="app-header"><Logo /><BackLink href="/">Voltar ao início</BackLink></header><main id="conteudo" className="app-content">
    <PageHeading eyebrow="UM CAMINHO PARA CADA PESSOA" title="Como você quer" accent="se conectar?">Escolha um participante fictício e conheça a Conexa por dentro.</PageHeading>
    <div className="demo-explanation"><span className="seed" />{isRemote ? 'Ambiente acadêmico conectado. Cada participante tem uma sessão de demonstração limitada.' : 'Prévia local para explorar. Os dados de exemplo e suas alterações são reiniciados ao recarregar.'}</div>
    {auth.error && <ErrorNotice>{auth.error}</ErrorNotice>}
    <div className="profile-grid" ref={profileGrid}>{profiles.map(({ role, title, copy, art, icon: Icon }) => <section className={`profile-card ${preferred === ({ producer: 'produtor', buyer: 'comprador', carrier: 'transportador' })[role] ? 'preferred' : ''}`} key={role}><div className="profile-art reference-profile"><AnimatedCharacter role={art} /><Icon size={24} className="profile-symbol" /></div><h2>{title}</h2><p>{copy}</p>{role === 'producer' ? <label className="field compact"><span>Participante fictício</span><select value={producer} onChange={e => setProducer(e.target.value)}><option value="ana">Ana · Sítio Boa Semente</option><option value="joao">João · Horta do João</option></select></label> : <div className="participant-label">{accounts.find(a => a.role === role).name}<small>Participante fictício</small></div>}<button className="button" disabled={auth.pending} onClick={() => enter(role)}>{auth.pending ? 'Abrindo demonstração…' : 'Entrar como ' + ({ producer: 'produtor', buyer: 'comprador', carrier: 'transportador' })[role]}<ArrowUpRight size={19} /></button></section>)}</div>
    <p className="demo-footnote">Nenhum pagamento ou transporte real é realizado. As telas das próximas etapas estão identificadas como prévias.</p>
  </main><footer className="app-footer"><span>Pequenas ofertas. Novas conexões.</span><span>Protótipo acadêmico · FIAP</span></footer></div>
}
