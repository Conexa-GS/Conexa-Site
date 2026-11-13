import { Basket, Plant, Truck, SignOut, ChatCircleDots, ClipboardText } from '@phosphor-icons/react'
import { Logo, Link } from './ui'
import { isRemote } from '../services/supabase'
import { profileRoutes } from '../domain/profiles'
import TransportNotifications from './TransportNotifications'
const names = { producer: 'Produtor', buyer: 'Comprador', carrier: 'Transportador' }
const icons = { producer: Plant, buyer: Basket, carrier: Truck }
export default function AppLayout({ session, path, leave, children }) {
  const Icon = icons[session.role]
  return <div className="app-shell">
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="app-header"><Logo /><div className="session-controls"><span className="session-avatar"><Icon size={22} aria-hidden="true" /></span><div><strong>{session.display_name || session.name}</strong><small>{names[session.role]} · perfil fictício</small></div><button onClick={leave} className="switch-participant"><SignOut size={22} aria-hidden="true" /><span>Trocar participante</span></button></div></header>
    <nav className="app-nav" aria-label="Navegação do participante"><div className="app-nav-links">{profileRoutes[session.role].map(([href, label]) => {
      const NavIcon = href.endsWith('/conversas') ? ChatCircleDots : href.endsWith('/ofertas') ? Plant : href.endsWith('/veiculos') ? Truck : ClipboardText
      const active = path === href || (href.endsWith('/demandas') && path.startsWith(`${href}/`))
      return <Link key={href} href={href} aria-current={active ? 'page' : undefined}><NavIcon size={22} aria-hidden="true" />{label}</Link>
    })}<Link href="/operacoes" aria-current={path === '/operacoes' ? 'page' : undefined}><Truck size={22} aria-hidden="true" />Entregas e valores</Link></div></nav>
    <div className="demo-banner" role="note"><span className="status-dot" />Demonstração com dados fictícios. Sem pagamentos ou entregas reais.{!isRemote && ' Alterações são perdidas ao recarregar.'}</div>
    <main id="conteudo" className="app-content" tabIndex={-1}><TransportNotifications key={`notifications-${session.id}`} session={session} />{children}</main>
    <footer className="app-footer"><span>Conexa · Do campo pra cidade. Mais juntos.</span><span>Protótipo acadêmico · FIAP</span></footer>
  </div>
}
