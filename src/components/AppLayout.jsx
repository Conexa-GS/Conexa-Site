import { Basket, Plant, Truck, SignOut, ArrowUpRight } from '@phosphor-icons/react'
import { Logo, Link } from './ui'
import { isRemote } from '../services/supabase'
import { profileRoutes } from '../domain/profiles'
const names = { producer: 'Produtor', buyer: 'Comprador', carrier: 'Transportador' }
const icons = { producer: Plant, buyer: Basket, carrier: Truck }
export default function AppLayout({ session, path, leave, children }) {
  const Icon = icons[session.role]
  return <div className="app-shell">
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="app-header"><Logo /><div className="session-controls"><span className="session-avatar"><Icon size={22} /></span><div><strong>{session.display_name || session.name}</strong><small>{names[session.role]} · perfil fictício</small></div><button onClick={leave} aria-label="Trocar participante" className="icon-button"><SignOut size={22} /></button></div></header>
    <nav className="app-nav" aria-label="Navegação do participante"><div className="app-nav-links">{profileRoutes[session.role].map(([href, label]) => <Link key={href} href={href} aria-current={path === href ? 'page' : undefined}>{label}</Link>)}<Link href="/operacoes" aria-current={path === '/operacoes' ? 'page' : undefined}>Transporte e valores</Link></div><Link href="/demo" className="switch-profile">Trocar perfil <ArrowUpRight size={17} /></Link></nav>
    <div className="demo-banner" role="note"><span className="status-dot" />{isRemote ? 'Demonstração conectada ao Supabase · participantes fictícios · sem transações reais.' : 'Demonstração local · dados fictícios · alterações duram até recarregar a página.'}</div>
    <main id="conteudo" className="app-content" tabIndex={-1}>{children}</main>
    <footer className="app-footer"><span>Conexa · Do campo pra cidade. Mais juntos.</span><span>Protótipo acadêmico · FIAP</span></footer>
  </div>
}
