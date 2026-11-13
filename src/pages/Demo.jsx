import { useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { accounts } from '../services/offers'
import { Logo, PageHeading, ErrorNotice, BackLink } from '../components/ui'
import { navigate } from '../hooks/useRouter'
import { homeFor } from '../domain/profiles'
import { isRemote } from '../services/supabase'
import '../components/profile-photos.css'
import './demo.css'
const profiles = [
  { role: 'producer', title: 'Eu produzo', profile: 'produtor' },
  { role: 'buyer', title: 'Eu compro', profile: 'comprador' },
  { role: 'carrier', title: 'Eu transporto', profile: 'transportador' },
]
export default function Demo({ auth }) {
  const [producer, setProducer] = useState('ana')
  const preferred = new URLSearchParams(window.location.search).get('perfil')
  async function enter(role) {
    const account = accounts.find(a => role === 'producer' ? a.id === producer : a.role === role)
    const participant = await auth.enter(account)
    if (participant) navigate(homeFor(participant.role))
  }
  return <div className="app-shell demo-page"><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><header className="app-header"><Logo /><BackLink href="/login">Voltar para o login</BackLink></header><main id="conteudo" className="app-content" tabIndex={-1}>
    <PageHeading title="Acesso de desenvolvedor" />
    {auth.error && <ErrorNotice autoFocus title="Não foi possível entrar na demonstração">{auth.error}</ErrorNotice>}
    <div className="demo-profiles" aria-busy={auth.pending}>{profiles.map(({ role, title, profile }) => <section className={`demo-profile profile-photo home-profile-${profile}${preferred === profile ? ' preferred' : ''}`} key={role} aria-labelledby={`demo-${role}`}>
      <h2 id={`demo-${role}`}>{title}</h2>
      {role === 'producer' ? <fieldset className="demo-account demo-producer-options" aria-label="Produtor fictício" disabled={auth.pending}>{accounts.filter(a => a.role === 'producer').map(account => <label key={account.id}><input type="radio" name="demo-producer" value={account.id} checked={producer === account.id} onChange={() => setProducer(account.id)} aria-label={`${account.name} · ${account.label}`} /><span>{account.id === 'ana' ? 'Ana' : 'João'}</span></label>)}</fieldset> : <p className="demo-account">{accounts.find(a => a.role === role).name}</p>}
      <button className="demo-enter" disabled={auth.pending} onClick={() => enter(role)} aria-label={`Entrar como ${profile}`}>{auth.pending ? 'Abrindo…' : 'Entrar'}<ArrowUpRight size={21} aria-hidden="true" /></button>
    </section>)}</div>
    <p className="demo-context">{isRemote ? 'Contas fictícias compartilhadas' : 'Prévia local · alterações reiniciadas ao recarregar'} · Pagamentos e entregas simulados</p>
  </main></div>
}
