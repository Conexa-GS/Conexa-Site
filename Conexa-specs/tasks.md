# Tarefas e marcos

Atualização de 09/11/2026: **M1, M2, M3 e M4 concluídos por aceite do usuário**. M4 foi confirmado explicitamente após a primeira fatia de rotas e inclusão ser apresentada, validada localmente e publicada na dev. O aceite encerra T21–T24 no escopo demonstrado; não atribui ao usuário novos testes nem transforma API externa, migration remota ou comparação entre composições cotadas em funcionalidades executadas. **M5 em avaliação local: T25–T27 implementadas; T28 e aceite do marco pendentes.** Evidências e limites em `validation.md`.

## M0 — Preparação

- [x] T01 Ler pacote, checkout e instruções locais; identificar implementação existente antes de criar arquivos.
- [x] T02 Registrar escolhas de linguagem, sessão demo e migrations em decisions.md.
- [x] T03 Criar estrutura React/Vite/Tailwind e arquivos de configuração sem segredos.
- [ ] T04 Preparar README, AI.md, .env.example e histórico Git real.

## M1 — Primeira fatia: ofertas

- [x] T05 Migrations de participantes, produtos, localizações e ofertas com checks, FKs e RLS — arquivos e teste PostgreSQL local; aceite remoto conforme confirmação do usuário.
- [x] T06 Seed de dois produtores, comprador e transportador fictícios; datas relativas à execução — arquivo e repetição local verificados; aceite remoto conforme confirmação do usuário.
- [x] T07 Sessões demo e seleção de perfil, com acesso limitado pelo banco — aceite conforme confirmação do usuário.
- [x] T08 Serviço de ofertas e hooks useOffers/useDemoSession — código preparado e incluído no aceite do M1 pelo usuário.
- [x] T09 Formulário validado e lista do produtor: criar, editar e excluir oferta sem vínculos — verificação local e aceite do M1 pelo usuário.
- [x] T10 Consulta de ofertas pelo comprador, sem duplicar dados — verificação local e aceite do M1 pelo usuário.
- [x] T11 Carregamento, erro, vazio e confirmação de exclusão; revisão em celular e teclado — aceite conforme confirmação do usuário, sem relatório individual dos procedimentos.
- [x] T12 Verificar AC01–04/23, persistência após reload e proteção entre participantes; registrar evidências e limitações — M1 aceito pelo usuário; fonte e limitações em `validation.md`.

Registro de conclusão T05–T12: 07/11/2026; responsável pelo aceite informado: usuário nesta conversa; arquivos: migration/seed, serviços/hooks e interface de ofertas existentes. Resultado: autorização explícita para marcar M1 concluído após validação e testes relatados. Não foram fornecidos logs ou resultados individuais por critério, nem realizada nova verificação remota pelo Codex. Sem novo commit nesta atualização documental.

Definição de pronto M1: CRUD remoto funciona, comprador lê os mesmos registros, configuração é reproduzível e dados são fictícios. Build passando sozinho não comprova esse marco.

## M2 — Demanda e composição; depende de M1

- [x] T13 CRUD de demandas e candidatos compatíveis — serviços, domínio, formulário e migrations; CRUD remoto verificado pelo Codex em 07/11/2026.
- [x] T14 Modelo de cargas/itens/reservas; snapshots e funções de reserva transacional — migrations M2, gateway RPC e RLS; testes locais e remotos pelo Codex em 07/11/2026.
- [x] T15 Seleção 30+20 kg, insuficiência, aceite/recusa e expiração — comportamento de API local/remoto verificado pelo Codex em 07/11/2026; revisão visual em 360 px/desktop aprovada pelo usuário.
- [x] T16 Verificar AC05–09/21, incluindo concorrência e liberação de saldo — domínio e banco passaram, incluindo concorrência real, Auth/RLS e liberação; usuário informou revisão em 360 px/desktop e autorizou aprovação em 07/11/2026. Sem relatório individual de teclado ou testes visuais observado pelo Codex; limites em `validation.md`.

Entrega M2 na branch `feature/m2-demandas-composicao`, migrations `20261107213117_m2_demands_reservations.sql` e `20261107220459_m2_event_actor_index.sql`; testes `demands.test.js`, `m2-database.mjs` e `remote-m2.mjs`. Usuário autorizou publicação/integração na dev em 07/11/2026 (“pode aprovar”). Não informou procedimentos de revisão visual executados; T16 permanece aberto. M3 não iniciado.

Atualização posterior de aceite: “acabei de revisasr em 360 px/desktop e pode aprovar”. Usuário responsável pela revisão visual e aprovação; T16 e M2 encerrados com base nesse relato e nas verificações técnicas acima. A pendência descrita no parágrafo anterior é histórica. M3 ainda não iniciado.

Commits de implementação: `c9ba25c` (domínio, banco, serviços e testes) e `5bf018b` (interface, hooks e integração). Responsável pelas verificações relatadas: Codex, 07/11/2026.

## M3 — Transporte e financeiro; depende de M2

- [x] T17 Veículos, indicações e cotações com confirmação do transportador — gateway M3, RLS e interface; testes locais e API demo pelo Codex em 07/11/2026.
- [x] T18 Resumo por produtor e total do comprador; mínimos, taxa zero e frete separado — centavos/snapshots, total persistido calculado no banco; R$330 e mínimos R$120/R$90 verificados.
- [x] T19 Aceites por versão e validação de capacidade/conservação/prazo — seleção abre nova versão, quatro aceites finais, bloqueios no banco; testes locais e remotos.
- [x] T20 Verificar AC10–14/21 — API e banco verificados pelo Codex; aceite explícito do usuário em 07/11/2026 encerra a tarefa. Não houve relatório de procedimentos visuais/teclado, nem nova execução visual pelo agente. AC14 usa cancelamento/remontagem explícitos, sem editor de coletas.

Entrega em `feature/m3-transporte-financeiro`, migrations `20261107223721_m3_transport_finance.sql`, `20261107224534_m3_quote_compatibility.sql` e `20261107224716_m3_financial_totals.sql`. Testes `transport.test.js`, `m3-database.mjs` e `remote-m3.mjs`. Autorizações de migration/testes no demo dadas pelo usuário nesta interação; nenhum push/merge autorizado. M3 não declarado concluído.

## M4 — Rotas e inclusão; confirmado no escopo demonstrado

- [x] T21 Validar fornecedor de rotas, credenciais, termos, cobertura e orçamento autorizado — Google Routes avaliado como candidato; sem território roteável, credencial ou orçamento autorizados, a ativação externa foi rejeitada para este escopo e o fallback manual foi aceito.
- [x] T22 Função de rotas no servidor, roteiro completo, nulos e fallback manual explícito — gateway M4 preparado, roteiro manual autenticado com saída, coletas, destino e retorno; distância, duração e pedágio desconhecidos permanecem nulos/a confirmar.
- [x] T23 Comparação de composições e justificativa inclusiva baseada no histórico — candidatas por preço dos alimentos e por menos vendas concluídas/maior espera, com mínimos preservados, frete pendente e sem alegar ótimo global.
- [x] T24 Verificar AC15–17; não alegar economia ou distância fictícias — domínio, PGlite e revisão dirigida local cobrem o escopo registrado; aceite explícito do usuário em 09/11/2026 encerra M4, preservando os limites de `validation.md`.

Entrega M4 publicada na dev em `5598cc7`, com implementação principal `30e742d`: pesquisa técnica de T21 em `m4-routes.md`; gateway manual autenticado de T22 em `202611080001_m4_analysis.sql`; T23 em domínio/componentes M4; testes `inclusion.test.js`, `route-analysis.test.js` e `m4-database.mjs`. Usuário confirmou em 09/11/2026: “atualize o tasks.md e deixe como o m4 confirmado”. O aceite encerra o marco no escopo apresentado. API externa, aplicação/testes da migration no demo e comparação do total entre composições com fretes próprios não foram executados e ficam registrados como evoluções/limites, sem reabrir T21–T24. Nenhum avanço de M5.

## M5 — Fechamento da operação; implementação local em avaliação

- [x] T25 Pagamento simulado idempotente e conversão de reserva em compromisso — gateway M5, chave por tentativa, total do banco e conversão atômica sem dupla baixa; verificação local em PGlite, aplicação remota pendente.
- [x] T26 Agendamento, transporte, entrega e divergência com histórico — transportador selecionado inicia; comprador resolve por escrito e confirma recebimento em ação separada, conforme resposta explícita do usuário; verificação local e bancada visual.
- [x] T27 Cancelamento/estorno/liberação e repasses únicos — cancelamento pré-transporte libera reservas/compromissos e estorna uma vez; após saída abre ocorrência, preserva estoque e segura repasses; recebimento gera parcelas únicas pelos snapshots. Verificação local, sem dinheiro real.
- [ ] T28 Verificar AC18–21; percorrer os três perfis no cenário-base — migration M5 aplicada ao demo em 10/11/2026; testes reais por API cobrem pagamento/cancelamento concorrentes e revisão versus pagamento, além de Auth/RLS da extensão. Caminho completo de entrega/divergência/repasses no demo, recarga/percurso no navegador e aceite humano continuam pendentes. Evidências locais anteriores e nova validação remota em validation.md.

Entrega local preparada em `feature/m5-fechamento-operacao`, a partir da dev. Arquivos: `202611090001_m5_operation_closure.sql`, `services/m5.js`, `OperationClosure.jsx`, hook/listas integradas, `tests/m5-database.mjs` e bancada `tests/ui/m5.html`. Responsável pelas verificações: Codex, 09/11/2026. Critérios AC18–21 passaram no PostgreSQL local com identidade simulada: cenário 30+20 kg, total R$330, João com 5 kg livres antes/depois do pagamento, estorno único, divergências e repasses de R$150/R$100/R$80; repetição sequencial não duplicou efeitos. Lint, 26 testes Node, suíte PGlite M1–M5 e build aprovados; revisão visual dirigida em 1366×900 e 360×800, sem overflow na bancada. Limites em `validation.md`. T25–T27 registram conclusão de implementação local, **não conclusão/aceite da M5 nem persistência remota verificada**. M5 permanece prévia em avaliação; nenhum push, merge, deploy ou migration remota executado nesta entrega.

## Ajuste transversal — feedback de erros — 09/11/2026

- [x] Tornar falhas de ações visíveis e orientar correção das datas da cotação — `components/ui.jsx`, `App.css`, formulários/listas de ofertas e demandas, transporte/M5 e entrada demo. Criada `feature/feedback-validacao` a partir da dev sincronizada com origin/dev em `25cdca9`. Codex verificou lint, 29 testes Node, build e bancada local em desktop/360 px; detalhes e limites em `validation.md`. Avaliação humana e autorização de publicação/integração pendentes; não altera o aceite dos marcos.

## Ajuste transversal — revisão de cotação e negociação — 09–10/11/2026

- [x] Diferenciar cotação confirmada, revisar veículo/horários com avisos persistidos, negociar frete com aprovação do comprador e registrar desistência/taxa simulada por urgência com encaminhamento a outra transportadora — código, migration `202611090002_quote_revisions.sql`, teste `quote-revisions-database.mjs` e bancada `tests/ui/quote-revisions.html` preparados na mesma feature já derivada da dev. Vencimento opcional acrescentado à oferta e aos snapshots; faixas 5%/15%/30% e destinatários comprador/produtores aprovados pelo usuário nesta conversa. Verificações locais por Codex em `validation.md`.
- [x] Aplicar migrations M4, M5 e revisões no Supabase demo autorizado; validar revisões/negociação/notificações por API com Auth/RLS reais, sessões independentes e concorrência — Codex, 10/11/2026; script tests/remote-quote-revisions.mjs e evidências em validation.md. Nova autenticação conserva revisão/avisos/leitura; não equivale a F5 no navegador. Desistência sem substituta confirmada; dados próprios cancelados/arquivados.
- [ ] Percorrer o site conectado, incluindo recarga real e telas em 360 px/desktop, e demonstrar encaminhamento a uma segunda transportadora com veículo compatível — navegador bloqueado pela ferramenta e demo com apenas uma transportadora. Avaliação humana da extensão continua pendente; nenhum marco declarado concluído por esta rodada. Publicação/integração das novas alterações de teste/documentação na dev autorizadas em 10/11/2026, conforme interação 032 de IA.md; sem nova promoção para main.

## M6 — Evolução de acessibilidade; T29 implementada, avaliação visual pendente

- [x] T29 Chat demonstrativo opcional com confirmação e mesmo serviço de ofertas; verificar AC22 — implementação e verificação automatizada do comportamento AC22 concluídas pelo Codex em 10/11/2026, complementando a primeira fatia já integrada. Branch `feature/t29-chat-validacao`, criada da dev `11f295f`. Componente real exercitado em jsdom e persistência pelo mesmo `saveOffer` verificada no Supabase demo com Auth/RLS reais. Isso não encerra a avaliação visual/AC23 nem o aceite da M6.
  - [x] Conversa guiada opcional no produtor, oito respostas explícitas, correção/prévia, descarte e confirmação separada antes de chamar `useOffers.save`/`saveOffer`, os mesmos do formulário; vencimento opcional permanece desconhecido quando omitido.
  - [x] Reutilizar `validateOffer`, preservar mínimo/precisão/datas e restringir catálogo/coleta do perfil; erros preservam rascunho e envio em andamento bloqueia nova confirmação. Cinco testes de domínio novos, lint e build aprovados pelo Codex em 10/11/2026.
  - [x] Exercitar o componente por eventos DOM: prévia/correção/descarte sem escrita, erro/reenvio, bloqueio de confirmação simultânea e fechamento pendente, catálogo vazio, foco programático e vencimento invalidado por correção. Cinco testes novos em `tests/offer-chat-ui.test.js`; total de 42 testes, lint e build aprovados. Corrigidos botão Fechar habilitado durante envio e foco do impedimento de catálogo.
  - [x] Confirmar uma oferta fictícia pelo componente em DOM simulado e `saveOffer` real; consultar pelo produtor e comprador após nova autenticação, validar centavos/vencimento e RLS entre perfis/anônimo. Script manual `tests/remote-offer-chat.mjs`, dados próprios arquivados e relatório local ignorado pelo Git. Nova autenticação não equivale a F5.
  - [ ] Revisar visualmente e por teclado em 360 px/desktop, incluindo foco/diálogo nativos, falha/reenvio e recarga real no navegador; obter avaliação humana da M6. Ferramenta novamente bloqueou navegador Windows. Bancada `/tests/ui/m6.html` disponível, sem alegar execução visual por jsdom.
- [ ] T30 Especificar integração WhatsApp oficial separadamente se solicitada; não implementar por pressuposição.

Arquivos da primeira fatia: `src/domain/offer-chat.js`, `src/features/offers/OfferChat.jsx`, integração em `OffersPage.jsx`, estilos em `App.css`, `tests/offer-chat.test.js` e bancada `tests/ui/m6.*`. Complemento T29: `src/components/ui.jsx`, ajustes em `OfferChat.jsx`, `tests/helpers/offer-chat-dom.mjs`, testes de interação/remoto e jsdom como dependência exclusiva de desenvolvimento. Responsável: Codex, 10/11/2026. D015 e `validation.md` registram evidências e limites. Sem IA externa, áudio, WhatsApp, nova migration ou alteração no serviço/SQL. M6 permanece prévia em avaliação; T28/M5 e pendências anteriores preservados. A primeira fatia foi publicada na dev com autorização anterior; publicação/integração deste complemento depende de nova autorização após apresentação.

## Fechamento acadêmico

- [ ] T31 Conferir componentes/hooks, histórico e registros de IA.
- [ ] T32 README reproduzível, ZIP, acesso ao repo e deploy; autorização necessária para ações externas conforme contexto.
- [ ] T33 Registrar matriz de aceites efetivamente executados e limitações pendentes.

Para cada tarefa concluída registrar: arquivos/commit, critério verificado, resultado, responsável e data. Responsáveis ainda não definidos; não atribuir nomes automaticamente.
