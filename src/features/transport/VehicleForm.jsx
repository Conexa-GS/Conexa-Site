import { ErrorNotice } from '../../components/ui'

export default function VehicleForm({ pending, onSubmit, error, initialValues = {} }) {
  return <form className="wide-card m3-form" onSubmit={event => { event.preventDefault(); onSubmit(Object.fromEntries(new FormData(event.currentTarget)), event.currentTarget) }}><h3>Cadastrar veículo fictício</h3>
    <label className="field"><span>Descrição</span><input name="description" defaultValue={initialValues.description} required maxLength={120} /></label>
    <label className="field"><span>Categoria do veículo</span><input name="vehicle_category" defaultValue={initialValues.vehicle_category} required maxLength={80} /></label>
    <label className="field"><span>Capacidade em kg</span><input name="capacity_kg" defaultValue={initialValues.capacity_kg} type="number" min="0.001" max="1000000" step="0.001" required /></label>
    <label className="field"><span>Conservação disponível</span><select name="conservation_conditions"><option value="ambient">Ambiente protegido</option><option value="refrigerated">Refrigerado</option></select></label>
    {error && <ErrorNotice autoFocus title="Não foi possível salvar o veículo">{error}</ErrorNotice>}<button className="button" disabled={pending}>{pending ? 'Salvando…' : 'Salvar veículo'}</button>
  </form>
}
