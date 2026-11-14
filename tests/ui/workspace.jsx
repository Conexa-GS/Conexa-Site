import { createRoot } from 'react-dom/client'
import AppLayout from '../../src/components/AppLayout'
import { SalesDashboardContent } from '../../src/features/workspace/SalesDashboard'
import { today } from '../../src/domain/offers'
import '../../src/index.css'
import '../../src/App.css'
import '../../src/participant.css'
// Bancada visual: números exclusivamente fictícios, sem chamadas de operações ou escrita.
const session = { id: 'visual-producer', role: 'producer', name: 'Produtor da bancada', access: 'developer' }
const date = today()
const loads = ['delivered', 'awaiting_producers', 'scheduled'].map((status, index) => ({ id: `fixture-${index}`, scheduled_date: date, status, items: [{ producer_id: session.id, product_name: 'Alface', gross_cents: 12500 + index * 500 }] }))
createRoot(document.getElementById('root')).render(<AppLayout session={session} path="/produtor/dashboard" leave={() => {}}><SalesDashboardContent session={session} state={{ loads, loading: false, error: '', reload() {} }} /></AppLayout>)
