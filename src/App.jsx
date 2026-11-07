import { lazy, Suspense, useEffect } from 'react'
import { useRouter, navigate } from './hooks/useRouter'
import { useDemoSession } from './hooks/useDemoSession'
import AppLayout from './components/AppLayout'
import { homeFor } from './domain/profiles'
import { ActionLink, EmptyState, Logo } from './components/ui'
import Demo from './pages/Demo'
import OffersPage from './features/offers/OffersPage'
import { CompositionPage, DemandsPage, OperationPage, PaymentPage, ProducerProposals, TransportRequests, VehiclesPage } from './pages/Previews'
import './App.css'
const Landing = lazy(() => import('./components/Landing'))
const routes = {
  '/produtor/ofertas': ['producer', 'Minhas ofertas'], '/produtor/propostas': ['producer', 'Propostas recebidas'],
  '/comprador/ofertas': ['buyer', 'Explorar alimentos'], '/comprador/demandas': ['buyer', 'Minhas demandas'],
  '/comprador/demandas/exemplo/composicao': ['buyer', 'Composição de exemplo'],
  '/transportador/solicitacoes': ['carrier', 'Solicitações'], '/transportador/veiculos': ['carrier', 'Meus veículos'],
  '/operacoes/exemplo': [null, 'Operação de exemplo'], '/operacoes/exemplo/pagamento': ['buyer', 'Pagamento de exemplo'],
}
export default function App() {
  const path = useRouter(), auth = useDemoSession()
  useEffect(() => { document.title = path === '/' ? 'Conexa — Do campo pra cidade. Mais juntos.' : `${path === '/demo' ? 'Escolha seu perfil' : routes[path]?.[1] || 'Página não encontrada'} · Conexa`; document.getElementById('conteudo')?.focus({ preventScroll: true }) }, [path])
  if (path === '/') return <Suspense fallback={<div className="initial-loading" role="status">Preparando o caminho…</div>}><Landing /></Suspense>
  if (path === '/demo') return <Demo auth={auth} />
  if (!routes[path]) return <div className="app-shell"><header className="app-header"><Logo /></header><EmptyState title="Esse caminho ainda não existe." action={<ActionLink href="/">Voltar ao início</ActionLink>}>Confira o endereço ou retorne à página inicial.</EmptyState></div>
  if (!auth.session) return <div className="app-shell"><header className="app-header"><Logo /></header><EmptyState title="Vamos escolher seu perfil?" action={<ActionLink href="/demo">Entrar na demonstração</ActionLink>}>Abra uma sessão fictícia para explorar este espaço.</EmptyState></div>
  const role = auth.session.role
  let page
  if (routes[path][0] && routes[path][0] !== role) page = <EmptyState title="Cada perfil tem seu caminho." action={<ActionLink href={homeFor(role)}>Ir para meu espaço</ActionLink>}>Troque de participante para explorar esta página.</EmptyState>
  else if (path.endsWith('/ofertas')) page = <OffersPage key={auth.session.id} session={auth.session} />
  else if (path === '/produtor/propostas') page = <ProducerProposals />
  else if (path === '/comprador/demandas') page = <DemandsPage />
  else if (path.endsWith('/composicao')) page = <CompositionPage />
  else if (path === '/transportador/solicitacoes') page = <TransportRequests />
  else if (path === '/transportador/veiculos') page = <VehiclesPage />
  else if (path.endsWith('/pagamento')) page = <PaymentPage />
  else page = <OperationPage role={role} />
  return <AppLayout session={auth.session} path={path} leave={async () => { await auth.leave(); navigate('/demo') }}>{page}</AppLayout>
}
