export const profileRoutes = {
  producer: [['/produtor/ofertas', 'Minhas ofertas'], ['/produtor/propostas', 'Propostas recebidas']],
  buyer: [['/comprador/ofertas', 'Explorar alimentos'], ['/comprador/demandas', 'Minhas demandas']],
  carrier: [['/transportador/solicitacoes', 'Solicitações'], ['/transportador/veiculos', 'Meus veículos']],
}
export const homeFor = role => profileRoutes[role][0][0]
