import { useRef, useState } from 'react'
import { Basket, Plant, Truck, SignOut, ChatCircleDots, ClipboardText, SquaresFour, Package, List, X } from '@phosphor-icons/react'
import { Logo, Link } from './ui'
import { isRemote } from '../services/supabase'
import { profileRoutes } from '../domain/profiles'
import TransportNotifications from './TransportNotifications'
import './workspace.css'
const names = { producer: 'Produtor', buyer: 'Comprador', carrier: 'Transportador' }
const icons = { producer: Plant, buyer: Basket, carrier: Truck }
const navIcon = href => href.endsWith('/dashboard') ? SquaresFour : href.endsWith('/conversas') ? ChatCircleDots : href.endsWith('/ofertas') ? Plant : href.endsWith('/pedidos') || href.endsWith('/demandas') ? Package : href === '/operacoes' || href.endsWith('/veiculos') ? Truck : ClipboardText
export default function AppLayout({ session, path, leave, children }) {
  const Icon = icons[session.role]
  const [open, setOpen] = useState(false)
  const menuButton = useRef(null)
  const entries = session.role === 'carrier' ? [...profileRoutes.carrier, ['/operacoes', 'Entregas']] : profileRoutes[session.role]
  const activeLabel = entries.find(([href]) => path === href || (href.endsWith('/demandas') && path.startsWith(`${href}/`)))?.[1] || 'Meu espaço'
  function closeMenu() { setOpen(false); menuButton.current?.focus() }
  return <div className="app-shell workspace">
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <aside className={`workspace-sidebar ${open ? 'is-open' : ''}`} onKeyDown={event => { if (event.key === 'Escape') closeMenu() }}>
      <div className="workspace-brand"><Logo /><span>Do campo pra cidade.</span></div>
      <button className="workspace-close" onClick={closeMenu} aria-label="Fechar navegação"><X size={24} /></button>
      <p className="workspace-nav-label">MEU ESPAÇO</p>
      <nav id="workspace-navigation" aria-label="Navegação do participante"><div className="workspace-links">{entries.map(([href, label]) => {
        const NavIcon = navIcon(href)
        const active = path === href || (href.endsWith('/demandas') && path.startsWith(`${href}/`))
        return <div key={href} onClick={() => setOpen(false)}><Link href={href} aria-current={active ? 'page' : undefined}><NavIcon size={22} weight={active ? 'fill' : 'regular'} aria-hidden="true" />{label}</Link></div>
      })}</div></nav>
      <div className="workspace-sidebar-bottom">
      <button onClick={leave} className="workspace-signout"><SignOut size={22} aria-hidden="true" />{session.access === 'personal' ? 'Sair da conta' : 'Trocar participante'}</button></div>
    </aside>
    <div className="workspace-body">
      <header className="workspace-header"><div className="workspace-location"><button ref={menuButton} className="workspace-menu" aria-expanded={open} aria-controls="workspace-navigation" onClick={() => setOpen(!open)} aria-label={open ? 'Fechar navegação' : 'Abrir navegação'}><List size={25} /></button><span>Meu espaço <span aria-hidden="true">/</span> <strong>{activeLabel}</strong></span></div><div className="workspace-user"><span className="workspace-avatar"><Icon size={22} aria-hidden="true" /></span><div><strong>{session.display_name || session.name}</strong><small>{names[session.role]} · {session.access === 'personal' ? 'minha conta' : 'perfil de teste'}</small></div></div></header>
      <div className="workspace-demo" role="note"><span className="status-dot" />Ambiente de demonstração · dados fictícios, sem pagamentos ou entregas reais.{!isRemote && ' Alterações locais não persistem após recarregar.'}</div>
      <main id="conteudo" className="app-content" tabIndex={-1}><TransportNotifications key={`notifications-${session.id}`} session={session} />{children}</main>
      <footer className="app-footer"><span>Conexa · Mais juntos, do campo à cidade.</span><span>Protótipo acadêmico · FIAP</span></footer>
    </div>
  </div>
}
