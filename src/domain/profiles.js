export const profileRoutes = {
  producer: [['/produtor/ofertas', 'Minhas ofertas'], ['/produtor/propostas', 'Propostas recebidas'], ['/produtor/conversas', 'Conversas']],
  buyer: [['/comprador/ofertas', 'Buscar alimentos'], ['/comprador/demandas', 'Meus pedidos'], ['/comprador/conversas', 'Conversas']],
  carrier: [['/transportador/solicitacoes', 'Solicitações'], ['/transportador/veiculos', 'Meus veículos']],
}
export const homeFor = role => profileRoutes[role][0][0]
