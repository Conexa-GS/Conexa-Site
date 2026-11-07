import { useEffect, useState } from 'react'
import { ActionLink, EmptyState, ErrorNotice, Modal, PageHeading, StatusBadge } from '../../components/ui'
import { useM2 } from '../../hooks/useM2'
import { listCatalog } from '../../services/offers'
import { m2 } from '../../services/m2'
import { dateLabel, quantity } from '../../domain/offers'
import DemandForm from './DemandForm'
import Loads from './Loads'

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
    try { await m2(action, { id: removing.id, version: removing.version }); setRemoving(null); setNotice(action === 'remove_demand' ? 'Demanda excluída.' : 'Demanda arquivada.'); state.reload() }
    catch (failure) { setError(failure.message) }
    finally { setPending(false) }
  }
  return <><div className="page-top"><PageHeading eyebrow="SEU NEGÓCIO, MAIS PERTO DO CAMPO" title="O que sua cozinha" accent="precisa hoje?">Registre sua necessidade e reúna ofertas reais do ambiente de demonstração.</PageHeading><div className="page-illustration"><img src="/assets/svg/mercado.svg" alt="" /></div></div>
    <div className="section-toolbar"><h2>Minhas demandas</h2><button className="button" disabled={!catalog || Boolean(state.error)} onClick={() => setEditing({})}>Nova demanda</button></div>
    {catalogError && <ErrorNotice>{catalogError} Recarregue a página para tentar novamente.</ErrorNotice>}{state.error && <ErrorNotice retry={state.reload}>{state.error}</ErrorNotice>}{notice && <p className="success-notice" role="status">{notice}</p>}
    {state.loading ? <p role="status">Carregando demandas…</p> : !state.error && <>{!state.demands.length && <EmptyState title="Sua próxima compra começa aqui.">Cadastre alimento, quantidade, data e destino fictício.</EmptyState>}
      {state.demands.map(demand => <article className="wide-card m2-demand" key={demand.id}><div className="card-heading"><h3>{demand.product_name} · {quantity(demand.quantity)} {demand.unit}</h3><StatusBadge tone={demand.status === 'archived' ? 'pending' : ''}>{demand.status === 'archived' ? 'Arquivada' : 'Necessidade registrada'}</StatusBadge></div><p>{dateLabel(demand.desired_date)} · {demand.destination_address}</p><div className="m2-actions">{demand.status === 'open' && <><ActionLink href={`/comprador/demandas/${demand.id}/composicao`}>Buscar e compor</ActionLink><button className="button button-outline" disabled={!catalog} onClick={() => setEditing(demand)}>Editar</button></>}<button className="text-link" onClick={() => { setRemoving(demand); setError('') }}>Excluir / arquivar</button></div></article>)}
      <Loads loads={state.loads} session={session} reload={state.reload} />
    </>}
    {editing && catalog && <DemandForm previous={editing.id ? editing : null} catalog={catalog} close={saved => { setEditing(null); if (saved) { setNotice('Demanda salva no Supabase.'); state.reload() } }} />}
    {removing && <Modal title="Excluir ou arquivar demanda?" onClose={() => { if (!pending) setRemoving(null) }}><p>Excluir remove somente cadastros sem propostas vinculadas. Arquivar preserva o histórico; cancele antes qualquer proposta ativa.</p>{error && <ErrorNotice>{error}</ErrorNotice>}<div className="form-actions"><button className="button button-outline" disabled={pending} onClick={() => setRemoving(null)}>Voltar</button><button className="button button-outline" disabled={pending || removing.status === 'archived'} onClick={() => remove('archive_demand')}>Arquivar</button><button className="button button-danger" disabled={pending} onClick={() => remove('remove_demand')}>Excluir</button></div></Modal>}
  </>
}
