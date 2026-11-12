export const profileRoutes = {
  producer: [['/produtor/ofertas', 'Minhas ofertas'], ['/produtor/propostas', 'Propostas recebidas'], ['/produtor/conversas', 'Conversas']],
  buyer: [['/comprador/ofertas', 'Explorar alimentos'], ['/comprador/demandas', 'Minhas demandas'], ['/comprador/conversas', 'Conversas']],
  carrier: [['/transportador/solicitacoes', 'Solicitações'], ['/transportador/veiculos', 'Meus veículos']],
}
export const homeFor = role => profileRoutes[role][0][0]
