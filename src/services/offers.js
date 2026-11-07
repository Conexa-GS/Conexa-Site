import { futureDate, today } from '../domain/offers'
import { isRemote, supabase } from './supabase'

export const accounts = [
  { id: 'ana', name: 'Ana Oliveira', role: 'producer', label: 'Sítio Boa Semente', email: import.meta.env.VITE_DEMO_ANA_EMAIL || 'ana@conexa.invalid', art: 'produtora' },
  { id: 'joao', name: 'João Pereira', role: 'producer', label: 'Horta do João', email: import.meta.env.VITE_DEMO_JOAO_EMAIL || 'joao@conexa.invalid', art: 'produtora' },
  { id: 'buyer', name: 'Restaurante Raiz', role: 'buyer', label: 'Comprador fictício', email: import.meta.env.VITE_DEMO_BUYER_EMAIL || 'comprador@conexa.invalid', art: 'mercado' },
  { id: 'carrier', name: 'Transporte Caminho', role: 'carrier', label: 'Transportador fictício', email: import.meta.env.VITE_DEMO_CARRIER_EMAIL || 'transporte@conexa.invalid', art: 'transportadora' },
]
const products = [{ id: 'alface', name: 'Alface', unit: 'kg' }, { id: 'tomate', name: 'Tomate', unit: 'kg' }, { id: 'cenoura', name: 'Cenoura', unit: 'kg' }]
const locations = [{ id: 'sitio-ana', owner_id: 'ana', display_address: 'Sítio Boa Semente · ponto de coleta fictício' }, { id: 'sitio-joao', owner_id: 'joao', display_address: 'Horta do João · ponto de coleta fictício' }]
let localOffers = [
  { id: 'oferta-ana', producer_id: 'ana', product_id: 'alface', quantity_total: 30, unit_price_cents: 500, minimum_net_unit_cents: 400, pickup_location_id: 'sitio-ana' },
  { id: 'oferta-joao', producer_id: 'joao', product_id: 'alface', quantity_total: 25, unit_price_cents: 500, minimum_net_unit_cents: 450, pickup_location_id: 'sitio-joao' },
].map(offer => ({ ...offer, available_from: today(), available_until: futureDate(14), status: 'published', version: 1 }))
const hydrate = offer => ({ ...offer, products: products.find(p => p.id === offer.product_id), participants: { display_name: accounts.find(a => a.id === offer.producer_id)?.name }, locations: locations.find(l => l.id === offer.pickup_location_id) })
const check = result => { if (result.error) throw new Error('Não foi possível acessar os dados. Verifique a conexão e a configuração do Supabase.'); return result.data }
export async function signInDemo(account) {
  if (!isRemote) return { ...account, display_name: account.name }
  const { error } = await supabase.auth.signInWithPassword({ email: account.email, password: import.meta.env.VITE_DEMO_PASSWORD || '' })
  if (error) throw new Error('Não foi possível abrir a sessão de demonstração. Confira os usuários fictícios e a configuração do ambiente.')
  const { data: { user } } = await supabase.auth.getUser()
  const participant = check(await supabase.from('participants').select('*').eq('id', user.id).single())
  if (!participant.is_demo || participant.role !== account.role) { await supabase.auth.signOut(); throw new Error('Esse participante não corresponde ao perfil de demonstração selecionado.') }
  return { ...account, ...participant }
}
export const signOutDemo = async () => { if (isRemote) await supabase.auth.signOut() }
export async function listCatalog(session) {
  if (!isRemote) return { products, locations: locations.filter(l => l.owner_id === session.id) }
  const [productResult, locationResult] = await Promise.all([supabase.from('products').select('*').order('name'), supabase.from('locations').select('*').eq('owner_id', session.id)])
  return { products: check(productResult), locations: check(locationResult) }
}
export async function listOffers(session) {
  if (!isRemote) return localOffers.filter(o => o.status === 'published' && (session.role !== 'producer' || o.producer_id === session.id)).map(hydrate)
  let query = supabase.from('offers').select('*, products(name, unit), participants!producer_id(display_name), locations(display_address)').eq('status', 'published').order('created_at', { ascending: false })
  if (session.role === 'producer') query = query.eq('producer_id', session.id)
  else query = query.gte('available_until', today())
  return check(await query)
}
export async function saveOffer(session, input, previous) {
  if (!isRemote) {
    if (session.role !== 'producer' || (previous && previous.producer_id !== session.id)) throw new Error('Somente o produtor responsável pode alterar esta oferta.')
    const offer = { ...input, producer_id: session.id, id: previous?.id || crypto.randomUUID(), version: (previous?.version || 0) + 1 }
    localOffers = previous ? localOffers.map(o => o.id === previous.id ? offer : o) : [offer, ...localOffers]
    return
  }
  const query = previous
    ? supabase.from('offers').update(input).eq('id', previous.id).eq('version', previous.version).select('id').single()
    : supabase.from('offers').insert(input).select('id').single()
  const result = await query
  if (result.error?.code === 'PGRST116') throw new Error('Esta oferta mudou em outra sessão. Atualize a lista antes de editar novamente.')
  check(result)
}
export async function deleteOffer(session, offer) {
  if (!isRemote) {
    if (session.role !== 'producer' || offer.producer_id !== session.id) throw new Error('Apenas o responsável pode excluir esta oferta.')
    localOffers = localOffers.filter(o => o.id !== offer.id)
    return
  }
  check(await supabase.from('offers').delete().eq('id', offer.id).eq('version', offer.version).select('id').single())
}
