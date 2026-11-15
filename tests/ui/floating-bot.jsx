import { createRoot } from 'react-dom/client'
import AppLayout from '../../src/components/AppLayout'
import FloatingBot from '../../src/features/conversations/FloatingBot'
import Tutorial from '../../src/features/tutorial/Tutorial'
import { openConexaBot } from '../../src/features/conversations/bot-launcher'
import { createConversationsFixture } from '../helpers/conversations-fixture.mjs'
import { createBotFixture } from '../helpers/site-bot-fixture.mjs'
import '../../src/index.css'
import '../../src/App.css'
import '../../src/participant.css'

const people = createConversationsFixture()
const bot = createBotFixture()
bot.offers.push({ ...bot.offers[0], id: 'oferta-exemplo-2', quantity_total: 50, quantity_free: 40, unit_price_cents: 650 })
const session = { id: 'ana', role: 'producer', display_name: 'Ana · Sítio Boa Semente' }
export default function Review() {
  return <><AppLayout session={session} path="/produtor/ofertas" leave={() => {}}><h1>Minhas ofertas</h1><p>Bancada isolada · memória local, sem Supabase ou API paga.</p><button className="button button-outline" onClick={openConexaBot}>Cadastrar com ajuda</button></AppLayout><FloatingBot session={session} service={people.service} botService={bot.service} /><Tutorial role="producer" /></>
}
createRoot(document.getElementById('root')).render(<Review />)
