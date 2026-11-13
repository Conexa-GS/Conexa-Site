import { useEffect, useState } from 'react'
import { ActionLink, ErrorNotice, Modal, PageHeading, StatusBadge } from '../../components/ui'
import { useM2 } from '../../hooks/useM2'
import { listCatalog } from '../../services/offers'
import { m2 } from '../../services/m2'
import { dateLabel, quantity } from '../../domain/offers'
import DemandForm from './DemandForm'
import Loads from './Loads'
import RecordList from '../../components/RecordList'
import { navigate } from '../../hooks/useRouter'

export default function DemandsPage({ session }) {
  const state = useM2(session)
  const [catalog, setCatalog] = useState(null)
  const [catalogError, setCatalogError] = useState('')
  const [editing, setEditing] = useState(null)
  const [removing, setRemoving] = useState(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  useEffect(() => { let active = true; listCatalog(session).then(data => { if (active) { setCatalog(data); setCatalogError('') } }).catch(failure => { if (active) setCatalogError(failure.message) }); return () => { active = false } }, [session])
  async function remove(action) {
    setPending(true); setError('')
    try { await m2(action, { id: removing.id, version: removing.version }); setRemoving(null); setNotice(action === 'remove_demand' ? 'Pedido excluído.' : 'Pedido arquivado.'); state.reload() }
    catch (failure) { setError(failure.message) }
    finally { setPending(false) }
  }
  return <><PageHeading title="Meus pedidos">Informe o alimento e a quantidade de que precisa. Depois, escolha os produtores.</PageHeading>
    <div className="section-toolbar"><h2>Pedidos de alimentos</h2><button className="button" disabled={!catalog || Boolean(state.error)} onClick={() => setEditing({})}>Novo pedido</button></div>
    {catalogError && <ErrorNotice>{catalogError} Recarregue a página para tentar novamente.</ErrorNotice>}{state.error && <ErrorNotice retry={state.reload}>{state.error}</ErrorNotice>}{notice && <p className="success-notice" role="status">{notice}</p>}
    {state.loading ? <p role="status">Carregando pedidos…</p> : !state.error && <>
      <RecordList records={state.demands} scope="demands" participantId={session.id} label="Pedidos" renderRecord={demand => {
        const proposal = state.loads.find(load => load.demand_id === demand.id && !['cancelled', 'expired'].includes(load.status))
        const linked = state.loads.some(load => load.demand_id === demand.id)
        return <article className="wide-card m2-demand"><div className="card-heading"><h3>{demand.product_name} · {quantity(demand.quantity)} {demand.unit}</h3><StatusBadge tone={demand.status === 'archived' ? 'pending' : ''}>{demand.status === 'archived' ? 'Arquivada' : proposal && proposal.status !== 'draft' ? 'Proposta enviada' : 'Escolha os produtores'}</StatusBadge></div><p>{dateLabel(demand.desired_date)} · {demand.destination_address}</p><div className="m2-actions">{demand.status === 'open' && <>{!proposal || proposal.status === 'draft' ? <ActionLink href={`/comprador/demandas/${demand.id}/composicao`}>{proposal ? 'Continuar envio' : 'Escolher produtores'}</ActionLink> : <ActionLink href="#minhas-propostas">Acompanhar respostas</ActionLink>}{!linked && <button className="button button-outline" disabled={!catalog} onClick={() => setEditing(demand)}>Editar</button>}</>}<button className="text-link" onClick={() => { setRemoving(demand); setError('') }}>Excluir / arquivar</button></div></article>
      }} />
      <div id="minhas-propostas"><Loads loads={state.loads} session={session} reload={state.reload} /></div>
    </>}
    {editing && catalog && <DemandForm previous={editing.id ? editing : null} catalog={catalog} close={saved => { setEditing(null); if (saved) { if (!editing.id) navigate(`/comprador/demandas/${saved.id}/composicao`); else { setNotice('Pedido atualizado.'); state.reload() } } }} />}
    {removing && <Modal title="Excluir ou arquivar pedido?" closeDisabled={pending} onClose={() => { if (!pending) setRemoving(null) }}><p>Excluir remove somente cadastros sem propostas vinculadas. Arquivar preserva o histórico; cancele antes qualquer proposta ativa.</p>{error && <ErrorNotice autoFocus title="Não foi possível concluir a ação">{error}</ErrorNotice>}<div className="form-actions"><button className="button button-outline" disabled={pending} onClick={() => setRemoving(null)}>Voltar</button><button className="button button-outline" disabled={pending || removing.status === 'archived'} onClick={() => remove('archive_demand')}>Arquivar</button><button className="button button-danger" disabled={pending} onClick={() => remove('remove_demand')}>Excluir</button></div></Modal>}
  </>
}
