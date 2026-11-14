export const profileRoutes = {
  producer: [['/produtor/dashboard', 'Dashboard'], ['/produtor/ofertas', 'Produtos'], ['/produtor/pedidos', 'Pedidos'], ['/produtor/conversas', 'Mensagens'], ['/operacoes', 'Entregas'], ['/produtor/propostas', 'Propostas']],
  buyer: [['/comprador/ofertas', 'Produtos'], ['/comprador/demandas', 'Pedidos'], ['/comprador/conversas', 'Mensagens'], ['/operacoes', 'Entregas'], ['/comprador/propostas', 'Propostas']],
  carrier: [['/transportador/solicitacoes', 'Solicitações'], ['/transportador/veiculos', 'Meus veículos']],
}
export const homeFor = role => profileRoutes[role][0][0]
