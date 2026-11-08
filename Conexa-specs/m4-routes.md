# M4 — Preparação de rotas e inclusão — 08/11/2026

## Estado desta entrega

Primeira fatia local em `feature/m4-rotas-inclusao`, criada da dev. M4 continua em avaliação; M5/M6 permanecem prévias. Migration M4 preparada e verificada em PostgreSQL local, sem aplicação remota. Sem ativação de fornecedor, credencial criada, cobrança ou deploy. Não declarar T21–T24 ou M4 concluídos.

Após apresentação do commit `30e742d`, usuário autorizou em 08/11/2026: “pode mandar para dev”. Envio e integração desta fatia na dev autorizados. Permanecem pendentes aplicação/validação no demo e demais itens de M4; não há autorização de promoção à main ou deploy nesta interação. Registro em IA.md, interação 021.

## T21 — Pesquisa técnica inicial

Google Routes permanece **candidato**, conforme plan.md. Documentação oficial consultada em 08/11/2026:

- [Uso e faturamento](https://developers.google.com/maps/documentation/routes/usage-and-billing): requer faturamento habilitado e chave/OAuth; recursos determinam a categoria cobrada. Limites diários precisam ser configurados para controlar consumo. Não foi contratado plano nem autorizado orçamento.
- [Políticas e atribuições](https://developers.google.com/maps/documentation/routes/policies): há restrições de armazenamento/cache, atribuição visual e requisitos para termos de uso e privacidade. Esta fatia não armazena nem exibe conteúdo Google.
- [Pedágios](https://developers.google.com/maps/documentation/routes/calculate_toll_fees): disponibilidade depende do local; a estimativa padrão documentada para veículos não comerciais não comprova preço comercial. Pedágio desconhecido permanece nulo, a confirmar.

Pendências concretas antes de habilitar: território/pontos geográficos de demonstração que possam ser roteados, cobertura validada nesses pontos e no perfil do veículo, fornecedor aprovado, termos/atribuição adequados, credencial exclusivamente no servidor, teto de gasto/quota autorizado e limite de chamadas autenticadas. Os endereços atuais são nomes fictícios sem coordenadas; não enviá-los a geocodificação presumindo locais reais. Não é necessário preencher uma chave agora: não há cliente externo habilitado nesta fatia.

## T22 — Roteiro manual no servidor

`m4('route', {id,version,quote_id})` lê a cotação confirmada da versão atual. Comprador precisa ser dono da carga; transportador precisa ser dono da cotação. Produtor continua vendo somente seus itens pela M3, sem acesso ao roteiro completo de outros produtores por essa RPC. Não existe proxy externo aberto.

Roteiro próprio: saída, cada coleta na ordem estável dos UUIDs dos itens, destino e retorno somente se acordado. Resposta traz `status: manual`, `provider: null`, `isSimulated: false`; distância, direção, paradas e pedágio são nulos. `isSimulated` refere-se à origem da estimativa: nenhuma estimativa de rota é gerada. Os participantes e a cotação continuam fictícios. Não inferir direção pelo intervalo entre saída e entrega. Frete já inclui serviços obrigatórios e retorno; pedágio individual não é somado novamente. A consulta não altera cotação, versão, aceites, totais ou reservas.

API externa e fallback após uma falha real de fornecedor continuam pendentes. A interface permite continuar no fluxo manual M3 se a análise M4 falhar ou ainda não estiver disponibilizada no ambiente.

## T23 — Duas candidatas e cotações equivalentes

`m4('candidates', {id: demandId})` reutiliza as validações M2 de comprador, propriedade, produto, unidade, disponibilidade e saldo. Acrescenta apenas contagem agregada de cargas distintas `delivered` por produtor e dias desde criação da oferta. Não revela IDs, preços nem compradores das outras vendas. Herda o processamento M2 de expiração de reservas; não cria reservas novas. Como M5 ainda não permite concluir entregas, o histórico atual pode legitimamente ser zero para todos; não gerar vendas fictícias para mudar o ranking.

Heurísticas: ordenar por preço de alimentos ou por menos vendas concluídas, com desempate pela oferta mais antiga e depois UUID. Selecionar até atender exatamente a demanda com saldo conhecido. Comparar valores em centavos com arredondamento por linha; diferenças referem-se somente aos alimentos das duas candidatas avaliadas. Sem ótimo global, menor frete, garantia de venda ou índice numérico de inclusão. Produto/unidade incompatível ou mínimo violado não entra na sugestão. Saldo insuficiente mantém a demanda e impede usar a candidata incompleta.

Sugestão altera campos apenas após **Usar esta candidata**; envio continua pela reserva atômica M2, que revalida saldo. Candidatas diferentes continuam com frete/viabilidade final pendentes. A diferença de custo total entre composições com suas próprias cotações ainda não foi implementada: o modelo atual admite uma proposta ativa por demanda.

Em transporte, comparar somente cotações confirmadas, válidas, da versão atual, de uma mesma carga ativa e com mesma saída/retorno/horários/conservação/serviços. Todas as coletas e o destino vêm da mesma carga imutável. Distintas saídas ou serviços formam grupos separados; um grupo só tem comparação quando possui pelo menos duas cotações. Mostrar frete e total comprador sem somar pedágio novamente. Essa análise não seleciona nem aprova automaticamente a cotação.

## Revisão local reproduzível

Com Vite em execução, abrir `/tests/ui/m4.html`. Bancada explicitamente identificada com fixtures em memória, usando os mesmos componentes React com adaptador de consulta injetado. Permite revisar seleção, diferença de alimentos, cotações, roteiro manual e erro/repetição sem escrever no Supabase. Não compõe a entrada do build de produção e não comprova persistência remota.

`npm test` cobre domínio; `npm run test:db` inclui `tests/m4-database.mjs`, com migrations reais em PGlite e identidades simuladas. O teste de histórico futuro usa uma transação local revertida para representar `delivered`, sem alterar o conjunto de estados permitido nas migrations do produto. Limites e resultados efetivamente executados estão em validation.md.
