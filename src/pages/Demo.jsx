import { useState } from 'react'
import { ArrowUpRight, Plant, Basket, Truck } from '@phosphor-icons/react'
import { accounts } from '../services/offers'
import { Logo, PageHeading, ErrorNotice, BackLink } from '../components/ui'
import { navigate } from '../hooks/useRouter'
import { homeFor } from '../domain/profiles'
import { isRemote } from '../services/supabase'
import MotionArtwork from '../components/MotionArtwork'
const profiles = [
  { role: 'producer', title: 'Eu produzo.', copy: 'Cadastre alimentos para vender e responda às propostas de compra.', art: 'farmer', icon: Plant },
  { role: 'buyer', title: 'Eu compro.', copy: 'Busque alimentos, faça pedidos e acompanhe suas compras.', art: 'buyer', icon: Basket },
  { role: 'carrier', title: 'Eu transporto.', copy: 'Cadastre seu veículo, informe o frete e acompanhe as entregas simuladas.', art: 'carrier', icon: Truck },
]
export default function Demo({ auth }) {
  const [producer, setProducer] = useState('ana')
  const preferred = new URLSearchParams(window.location.search).get('perfil')
  async function enter(role) {
    const account = accounts.find(a => role === 'producer' ? a.id === producer : a.role === role)
    const participant = await auth.enter(account)
    if (participant) navigate(homeFor(participant.role))
  }
  return <div className="app-shell demo-page"><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><header className="app-header"><Logo /><BackLink href="/">Voltar ao início</BackLink></header><main id="conteudo" className="app-content" tabIndex={-1}>
    <PageHeading title="O que você quer fazer?">Escolha um participante fictício e conheça a Conexa por dentro.</PageHeading>
    <div className="demo-explanation"><span className="seed" />{isRemote ? 'Ambiente acadêmico conectado. A sessão é retomada ao recarregar esta aba. O botão Trocar participante encerra a sessão atual.' : 'Prévia local para explorar. Os dados de exemplo e suas alterações são reiniciados ao recarregar.'}</div>
    {auth.error && <ErrorNotice autoFocus title="Não foi possível entrar na demonstração">{auth.error}</ErrorNotice>}
    <div className="profile-grid">{profiles.map(({ role, title, copy, art, icon: Icon }) => <section className={`profile-card ${preferred === ({ producer: 'produtor', buyer: 'comprador', carrier: 'transportador' })[role] ? 'preferred' : ''}`} key={role}><div className={`profile-art gif-profile gif-profile-${art}`}><MotionArtwork asset={`${art}-full`} /><Icon size={24} className="profile-symbol" /></div><h2>{title}</h2><p>{copy}</p>{role === 'producer' ? <label className="field compact"><span>Participante fictício</span><select value={producer} onChange={e => setProducer(e.target.value)}><option value="ana">Ana · Sítio Boa Semente</option><option value="joao">João · Horta do João</option></select></label> : <div className="participant-label">{accounts.find(a => a.role === role).name}<small>Participante fictício</small></div>}<button className="button" disabled={auth.pending} onClick={() => enter(role)}>{auth.pending ? 'Abrindo demonstração…' : 'Entrar como ' + ({ producer: 'produtor', buyer: 'comprador', carrier: 'transportador' })[role]}<ArrowUpRight size={19} /></button></section>)}</div>
    <p className="demo-footnote">Nenhum pagamento ou transporte real é realizado. As telas das próximas etapas estão identificadas como prévias.</p>
  </main><footer className="app-footer"><span>Pequenas ofertas. Novas conexões.</span><span>Protótipo acadêmico · FIAP</span></footer></div>
}
