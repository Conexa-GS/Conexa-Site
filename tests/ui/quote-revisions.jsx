import { useCallback, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Logo, StatusBadge } from '../../src/components/ui'
import TransportNotifications from '../../src/components/TransportNotifications'
import QuoteStatus from '../../src/features/transport/QuoteStatus'
import CarrierQuote from '../../src/features/transport/CarrierQuote'
import FreightNegotiation, { CancellationFees } from '../../src/features/transport/FreightNegotiation'
import '../../src/index.css'
import '../../src/App.css'

// In-memory visual fixture. Database invariants are checked in quote-revisions-database.mjs.
const day = new Date(Date.now()+2*86400000).toISOString().slice(0,10)
const vehicles = [{ id: 'vehicle-a', description: 'Utilitário A fictício', capacity_kg:500 }, { id:'vehicle-b', description:'Utilitário B fictício', capacity_kg:500 }]
const initialQuote = { id:'quote-initial',carrier_id:'carrier',vehicle_id:'vehicle-a',revision:1,load_version:2,status:'confirmed',total_cents:8000,departure_time:`${day}T08:00:00-03:00`,delivery_time:`${day}T12:00:00-03:00`,expires_at:new Date(Date.now()+3600000).toISOString() }
const initial = { id:'fixture-load',version:2,status:'awaiting_final_approval',selected_quote_id:initialQuote.id,expires_at:new Date(Date.now()+86400000).toISOString(),scheduled_date:day,quotes:[initialQuote],negotiations:[],cancellation_fees:[],items:[{producer_id:'ana',producer_name:'Ana fictícia'}] }
const sessions = { carrier:{id:'carrier',role:'carrier'}, buyer:{id:'buyer',role:'buyer'}, producer:{id:'ana',role:'producer'}, other:{id:'other',role:'carrier'} }
export default function Review() {
  const [load,setLoad]=useState(initial), [profile,setProfile]=useState('carrier'), [notices,setNotices]=useState([]), [pending,setPending]=useState(false)
  const session=sessions[profile], quote=load.quotes.find(q=>q.id===load.selected_quote_id)
  const addNotices=(recipients,message,changes={reason:'Condição alterada na bancada local.'})=>setNotices(old=>[...old,...recipients.map(recipient_id=>({id:crypto.randomUUID(),recipient_id,load_id:load.id,quote_id:quote?.id || 'withdrawn',proposal_version:load.version+1,message,changes,created_at:new Date().toISOString()}))])
  const notificationRequest=useCallback(async(action,payload)=>{
    if(action==='read') {setNotices(old=>old.map(n=>n.id===payload.notification_id?{...n,read_at:new Date().toISOString()}:n));return {read:true}}
    return {available:true,notifications:notices.filter(n=>n.recipient_id===sessions[profile].id)}
  },[notices,profile])
  async function submit(action,payload) {
    if(action!=='revise_quote') throw new Error('A bancada começa com cotação confirmada.')
    setPending(true)
    const next={...quote,...payload,id:crypto.randomUUID(),revision:quote.revision+1,load_version:load.version+1}
    setLoad(old=>({...old,version:old.version+1,quotes:[next],selected_quote_id:next.id}))
    addNotices(['buyer','ana'],'A transportadora modificou a cotação. Frete preservado. Revise e confirme novamente.',{reason:payload.reason,before:{...quote,vehicle:'Utilitário A fictício'},after:{...next,vehicle:vehicles.find(v=>v.id===next.vehicle_id)?.description}})
    setPending(false); return true
  }
  async function negotiate(action,payload) {
    if(action==='preview_fee') return {base_cents:quote.total_cents,rate_percent:15,amount_cents:Math.round(quote.total_cents*.15),deadline:quote.delivery_time,expiry_missing:true}
    if(action==='request_price') {
      setLoad(old=>({...old,negotiations:[{id:crypto.randomUUID(),quote_id:quote.id,carrier_id:'carrier',proposed_cents:payload.proposed_cents,reason:payload.reason,status:'pending'}]}))
      addNotices(['buyer'],'Novo frete proposto; aprovação pendente.',{reason:payload.reason,proposed_cents:payload.proposed_cents})
    } else if(action==='approve_price') {
      const n=load.negotiations.find(n=>n.id===payload.negotiation_id), next={...quote,id:crypto.randomUUID(),revision:quote.revision+1,total_cents:n.proposed_cents,load_version:load.version+1}
      setLoad(old=>({...old,version:old.version+1,selected_quote_id:next.id,quotes:[next],negotiations:old.negotiations.map(n=>({...n,status:'approved'}))}))
      addNotices(['buyer','ana','carrier'],'Novo frete aprovado pelo comprador. Novos aceites necessários.',{reason:n.reason,before:{...quote,vehicle:'Veículo fictício'},after:{...next,vehicle:'Veículo fictício'}})
    } else if(action==='withdraw') {
      const amount=payload.expected_fee_cents
      setLoad(old=>({...old,version:old.version+1,status:'awaiting_quotes',selected_quote_id:null,quotes:[],replacement_carrier_id:'other',negotiations:old.negotiations.map(n=>({...n,status:'withdrawn'})),cancellation_fees:[{id:'fee',carrier_id:'carrier',base_cents:quote.total_cents,rate_percent:15,amount_cents:amount,deadline:quote.delivery_time,expiry_missing:true,shares:[{recipient_id:'buyer',kind:'buyer',amount_cents:Math.ceil(amount/2)},{recipient_id:'ana',kind:'producer',amount_cents:Math.floor(amount/2)}]}]}))
      addNotices(['buyer','ana','other'],'Desistência registrada em simulação. Proposta encaminhada à outra transportadora.')
    } else {
      setLoad(old=>({...old,negotiations:old.negotiations.map(n=>n.id===payload.negotiation_id?{...n,status:action==='reject_price'?'rejected':'kept_original'}:n)}))
      addNotices([action==='reject_price'?'carrier':'buyer'],action==='reject_price'?'Novo valor recusado. Mantenha o frete original ou confira a desistência.':'Frete original mantido.')
    }
    return {}
  }
  return <div className="app-shell"><header className="app-header"><Logo /></header><main className="app-content"><p className="eyebrow">BANCADA LOCAL · SEM ESCRITAS REMOTAS</p><h1>Transporte e condições</h1><p>Respostas controladas para revisar interface; não substituem Supabase.</p>
    <section className="wide-card m3-form"><label className="field"><span>Perfil da bancada</span><select value={profile} onChange={e=>setProfile(e.target.value)}><option value="carrier">Transportadora</option><option value="buyer">Comprador</option><option value="producer">Produtor</option><option value="other">Outra transportadora</option></select></label><button className="text-link" onClick={()=>{setLoad(initial);setNotices([])}}>Reiniciar cenário</button></section>
    <TransportNotifications key={profile} session={session} request={notificationRequest} />
    <article className={`wide-card m2-load${quote?' transport-proposal-confirmed':''}`}><div className="card-heading"><h2>Proposta fixture · v{load.version}</h2><StatusBadge tone={quote?'':'pending'}>{quote?'Condições em confirmação':'Aguardando nova cotação'}</StatusBadge></div>
      {quote && <QuoteStatus load={load} quote={quote} session={session} />}
      {load.replacement_carrier_id && <p className="inline-note">Encaminhada à outra transportadora fictícia. Nova cotação e aceites ainda necessários.</p>}
      {session.role==='carrier' && session.id==='carrier' && <CarrierQuote load={load} quote={quote} vehicles={vehicles} available pending={pending} submit={submit} withdrawn={Boolean(load.cancellation_fees.length)} />}
      <FreightNegotiation key={`${profile}-${quote?.id}`} load={load} quote={quote} session={session} available reload={()=>{}} request={negotiate} />
      <CancellationFees load={load} session={session} />
    </article><article className="wide-card m2-load"><div className="card-heading"><h2>Outra proposta aberta</h2><StatusBadge tone="pending">Aguardando cotação</StatusBadge></div><p>Ainda não tem cotação confirmada pela transportadora.</p></article>
  </main></div>
}
createRoot(document.getElementById('root')).render(<Review />)
