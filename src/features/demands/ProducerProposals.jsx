import { ErrorNotice, PageHeading } from '../../components/ui'
import { useM2 } from '../../hooks/useM2'
import Loads from './Loads'

export default function ProducerProposals({ session }) {
  const state = useM2(session)
  return <><PageHeading title="Propostas recebidas">Confira os valores acordados e o prazo da reserva. Aceitar fornecimento ainda não confirma venda, pagamento ou transporte.</PageHeading>{state.error ? <ErrorNotice retry={state.reload}>{state.error}</ErrorNotice> : state.loading ? <p role="status">Carregando propostas…</p> : <Loads loads={state.loads} session={session} reload={state.reload} />}</>
}
