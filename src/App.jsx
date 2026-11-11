import { lazy, Suspense, useEffect } from 'react'
import { useRouter, navigate } from './hooks/useRouter'
import { useDemoSession } from './hooks/useDemoSession'
import AppLayout from './components/AppLayout'
import { homeFor } from './domain/profiles'
import { ActionLink, EmptyState, Logo } from './components/ui'
import Demo from './pages/Demo'
import OffersPage from './features/offers/OffersPage'
import { OperationPage, PaymentPage } from './pages/Previews'
import TransportPage from './features/transport/TransportPage'
import DemandsPage from './features/demands/DemandsPage'
import CompositionPage from './features/demands/CompositionPage'
import ProducerProposals from './features/demands/ProducerProposals'
import ConversationsPage from './features/conversations/ConversationsPage'
import './App.css'
const Landing = lazy(() => import('./components/Landing'))
const routes = {
  '/produtor/conversas': ['producer', 'Conversas'], '/comprador/conversas': ['buyer', 'Conversas'],
  '/produtor/ofertas': ['producer', 'Minhas ofertas'], '/produtor/propostas': ['producer', 'Propostas recebidas'],
  '/comprador/ofertas': ['buyer', 'Explorar alimentos'], '/comprador/demandas': ['buyer', 'Minhas demandas'],
  '/comprador/demandas/exemplo/composicao': ['buyer', 'Composição de exemplo'],
  '/transportador/solicitacoes': ['carrier', 'Solicitações'], '/transportador/veiculos': ['carrier', 'Meus veículos'],
  '/operacoes/exemplo': [null, 'Operação de exemplo'], '/operacoes/exemplo/pagamento': ['buyer', 'Pagamento de exemplo'],
  '/operacoes': [null, 'Transporte e confirmações'],
}
export default function App() {
  const path = useRouter(), auth = useDemoSession()
  const compositionId = path.match(/^\/comprador\/demandas\/([0-9a-f-]{36})\/composicao$/)?.[1]
  const route = compositionId ? ['buyer', 'Compor demanda'] : routes[path]
  useEffect(() => { document.title = path === '/' ? 'Conexa — Do campo pra cidade. Mais juntos.' : `${path === '/demo' ? 'Escolha seu perfil' : compositionId ? 'Compor demanda' : routes[path]?.[1] || 'Página não encontrada'} · Conexa`; document.getElementById('conteudo')?.focus({ preventScroll: true }) }, [path, compositionId])
  if (path === '/') return <Suspense fallback={<div className="initial-loading" role="status">Preparando o caminho…</div>}><Landing /></Suspense>
  if (path === '/demo') return <Demo auth={auth} />
  if (!route) return <div className="app-shell"><header className="app-header"><Logo /></header><EmptyState title="Esse caminho ainda não existe." action={<ActionLink href="/">Voltar ao início</ActionLink>}>Confira o endereço ou retorne à página inicial.</EmptyState></div>
  if (!auth.session) return <div className="app-shell"><header className="app-header"><Logo /></header><EmptyState title="Vamos escolher seu perfil?" action={<ActionLink href="/demo">Entrar na demonstração</ActionLink>}>Abra uma sessão fictícia para explorar este espaço.</EmptyState></div>
  const role = auth.session.role
  let page
  if (route[0] && route[0] !== role) page = <EmptyState title="Cada perfil tem seu caminho." action={<ActionLink href={homeFor(role)}>Ir para meu espaço</ActionLink>}>Troque de participante para explorar esta página.</EmptyState>
  else if (path.endsWith('/conversas')) page = <ConversationsPage key={auth.session.id} session={auth.session} initialBot={new URLSearchParams(window.location.search).get('conversa') === 'bot'} />
  else if (path.endsWith('/ofertas')) page = <OffersPage key={auth.session.id} session={auth.session} />
  else if (path === '/produtor/propostas') page = <ProducerProposals key={auth.session.id} session={auth.session} />
  else if (path === '/comprador/demandas') page = <DemandsPage key={auth.session.id} session={auth.session} />
  else if (compositionId) page = <CompositionPage key={compositionId} demandId={compositionId} />
  else if (path.endsWith('/composicao')) page = <EmptyState title="Escolha uma demanda cadastrada." action={<ActionLink href="/comprador/demandas">Minhas demandas</ActionLink>}>A composição agora usa ofertas consultadas no Supabase.</EmptyState>
  else if (path === '/transportador/solicitacoes' || path === '/operacoes') page = <TransportPage key={`${auth.session.id}-transport`} session={auth.session} />
  else if (path === '/transportador/veiculos') page = <TransportPage key={`${auth.session.id}-vehicles`} session={auth.session} vehiclesOnly />
  else if (path.endsWith('/pagamento')) page = <PaymentPage />
  else page = <OperationPage role={role} />
  return <AppLayout session={auth.session} path={path} leave={async () => { await auth.leave(); navigate('/demo') }}>{page}</AppLayout>
}
