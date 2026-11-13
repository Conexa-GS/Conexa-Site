# M4 — Preparação de rotas e inclusão — 08/11/2026

Extensão **D034 — 13/11/2026**: Google Routes escolhido para estimar distância/tempo e permitir calcular frete/entrega na nova cotação, conforme pedido do usuário e [contrato próprio](frete-google-maps.md). Base + tarifa/km + adicionais explícitos, chave privada/servidor, Auth carrier e fallback manual. Exemplo usa coordenadas Botucatu; uma cotação usa seus próprios locais somente após Calcular. Não traduz nomes fictícios para participantes/negócios reais. Os trechos abaixo que dizem “sem Routes/frete automático” descrevem o escopo histórico D033/T21; não impedem esta extensão local. Ativação e verificação Google reais continuam pendentes.

Extensão em **13/11/2026 (D033)**: Google Maps Embed escolhido para visualizar percurso fictício em Botucatu (SP). Componente `DemoRouteMap` na operação de exemplo e após consulta autenticada do roteiro M4; recebe apenas contagem de coletas e existência de retorno, nunca endereços/identidades do servidor. Até seis pontos de coleta predefinidos; acima disso informa limite sem omitir paradas do roteiro manual. URL Embed com coordenadas inventadas, modo `driving`, pt-BR, unidades métricas e sequência original; retorno deixa a entrega como waypoint antes de voltar à base. Não otimiza ordem.

Chave pública exclusiva `VITE_GOOGLE_MAPS_EMBED_KEY`, restrita a Embed e HTTP referrers. Esta chave de exibição é exceção explícita à proposta histórica de credencial apenas no servidor; eventual credencial de Routes continua no servidor. Nenhuma chamada Embed sem chave ou antes de **Abrir mapa simulado**; apenas origem no referrer. Sem cache/persistência do conteúdo Google, sem Routes API ou migração. Atribuições/controles do Google ficam no iframe sem sobreposição; nomes/POIs do mapa base não são participantes Conexa. Não certifica percurso para veículo comercial.

Usuário escolheu deixar a configuração preparada sem chave. Inspeção local de lista/controles/fallback em desktop e 360 px; testes de contrato/componentes sem rede Google. Traçado, cobertura, credencial/restrições e retorno efetivo do fornecedor pendentes até configurar e verificar. Erros dentro do iframe cross-origin não são inspecionáveis pelo app; instrução de fallback e controles de recarregar/fechar permanecem visíveis. O evento load não comprova sucesso da API. Configuração e fontes oficiais no README; nenhuma ampliação de aceite M4 ou implantação presumida.

Estado atualizado em 12/11/2026: M4 aceito em 09/11 no escopo manual; migration aplicada ao demo em 10/11. Histórico, justificativas, candidatas, roteiro e nulos verificados em 12/11 com Auth/RLS reais, site/F5 de comprador/transportador e comprador em 360 px/desktop. API externa e comparação total entre composições cotadas continuam fora do escopo executado; duas cotações remotas equivalentes não foram exercitadas nesta rodada. Os relatos de preparação abaixo preservam seus limites originais. [Evidências](validation.md#m4--rotas-manuais-e-sugestões-inclusivas-no-demo--12112026).

Roteiro manual de repetição, **somente no demo autorizado**: `node tests/remote-m4.mjs --check` não faz rede/escrita; `--prepare-ui` cria duas ofertas/demandas próprias e verifica candidatas. No site, consultar ambas as demandas e enviar a inclusiva de 50 kg; então `--prepare-route artifacts/m4-<run_id>.local.json` confirma fornecimentos/cotação fictícios e verifica roteiro. Após revisão no navegador, `--finish` com o mesmo relatório cancela/arquiva somente as fixtures. Cada etapa autentica novamente; nenhuma credencial entra no relatório. Erro intermediário preserva os IDs para diagnóstico/encerramento. O roteiro tem pré-condições explícitas de saldo e histórico; não fabrica dados para satisfazê-las. Histórico de teste fica preservado no demo.

## Estado desta entrega

Primeira fatia implementada em `feature/m4-rotas-inclusao`, criada da dev e publicada na dev em `5598cc7`. Em 09/11/2026, o usuário confirmou explicitamente o M4 e autorizou marcar T21–T24 como concluídos no escopo demonstrado. M5/M6 permanecem prévias. Migration M4 foi preparada e verificada em PostgreSQL local, sem aplicação remota. Não houve ativação de fornecedor, credencial criada, cobrança ou deploy; esses limites não são convertidos em evidência técnica pelo aceite humano.

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
