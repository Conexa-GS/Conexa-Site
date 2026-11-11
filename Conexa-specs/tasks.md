# Tarefas e marcos

Atualização desta entrega — 11/11/2026: **T36/T37 implementadas e verificadas localmente**, em `feature/conversas-bot-ofertas`, da dev `b1867a5`. Rascunhos/comandos completam a estrutura local de T35. Nova migration `202611110002_site_offer_bot.sql`; nenhuma das duas migrations de Conversas aplicada ao demo. T35/T38/T41 continuam abertas pelos critérios remotos; voz T39–T42 e avaliação T43 pendentes. Evidências e limites em `validation.md` e contrato em `conversas-site.md`. Sem aceite de M6/M5, push ou integração presumidos.

Atualização de 11/11/2026: **priorizar a aba Conversas dentro do site** para produtor e comprador, com Bot Conexa, atualização de ofertas e mensagens entre participantes. T30/WhatsApp externo fica pausada, preservando o trabalho e as evidências existentes; não é dependência da nova entrega. **Primeira fatia local implementada em `feature/conversas-base`: T34 e base de mensagens de T35/T38; demais etapas pendentes.** Nova migration não aplicada ao demo. Voz com OpenAI Realtime é opcional; o usuário fará os testes pagos de voz. O agente usa simulações locais, sem consumir a API. Escopo, dependências e critérios em [conversas-site.md](conversas-site.md) e D018/D019. Não encerra M5/T28 ou o aceite da M6.

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
- [ ] T30 Integração WhatsApp oficial separada — **pausada em 11/11/2026 por mudança de direção do usuário**, substituída na prioridade por T34–T43 dentro do site. Especificação/base inicial em `feature/t30-preparacao` e `t30-whatsapp.md`; experimentos posteriores Twilio preservados em `feature/t30-twilio-supabase`. Não apagar histórico nem declarar concluída. A pausa do planejamento não desativa o endpoint já implantado no demo e não autoriza alterações remotas.
  - [x] Preparar escopo, contratos de identidade/persistência/envio e critérios WA01–WA07, preservando RN45 e pendências M5/M6.
  - [x] Preparar protocolo por texto com prévia versionada, correção/cancelamento, revalidação e pedido de publicação separado do resultado; handler com challenge, assinatura e receptor configurado.
  - [x] Exercitar protocolo/webhook em testes locais e demonstrador exclusivamente em memória; não equivale a WhatsApp ou Supabase conectado.
  - [ ] Avaliar escopo e implementar vínculo verificado, inbox/sessão/outbox persistidos e publicação atômica com autorização/RLS/idempotência; validar concorrência/recuperação no banco.
  - [ ] Concluir configuração Meta, ativar ambiente autorizado e verificar mensagens reais, oferta no site após recarga e aceite; conta Meta temporariamente bloqueada para criação do portfólio, conforme aviso apresentado pelo usuário.

Arquivos da primeira fatia: `src/domain/offer-chat.js`, `src/features/offers/OfferChat.jsx`, integração em `OffersPage.jsx`, estilos em `App.css`, `tests/offer-chat.test.js` e bancada `tests/ui/m6.*`. Complemento T29: `src/components/ui.jsx`, ajustes em `OfferChat.jsx`, `tests/helpers/offer-chat-dom.mjs`, testes de interação/remoto e jsdom como dependência exclusiva de desenvolvimento. Responsável: Codex, 10/11/2026. D015 e `validation.md` registram evidências e limites. Sem IA externa, áudio, WhatsApp, nova migration ou alteração no serviço/SQL. M6 permanece prévia em avaliação; T28/M5 e pendências anteriores preservados. A primeira fatia foi publicada na dev com autorização anterior; publicação/integração deste complemento depende de nova autorização após apresentação.

## Fechamento acadêmico

- [ ] T31 Conferir componentes/hooks, histórico e registros de IA.
- [ ] T32 README reproduzível, ZIP, acesso ao repo e deploy; autorização necessária para ações externas conforme contexto.
- [ ] T33 Registrar matriz de aceites efetivamente executados e limitações pendentes.

## M6 — Nova entrega: Conversas no site; iniciada localmente em 11/11/2026

IDs T31–T33 preservados para o fechamento acadêmico. T29 continua como base entregue; suas pendências visuais e o aceite da M6 permanecem abertos. Cada tarefa abaixo só será marcada após implementação e evidência correspondente.

| Tarefa | Entrega e verificação esperada | Depende de | Critérios |
| --- | --- | --- | --- |
| [x] T34 Aba Conversas | Interface local implementada: rotas `/produtor/conversas` e `/comprador/conversas`, lista, Bot Conexa fixo, balões, horário e envio/erro. Desktop em duas áreas; celular com Voltar. Verificação em bancada 1366×900/360×800 e teclado pelo Codex, 11/11/2026; seis testes de componente. Integração remota e avaliação humana pendentes; bot livre ainda indisponível. | T29; contrato T35 para conectar dados | AC24/AC23 no escopo local; limites em validation.md |
| [ ] T35 Persistência e acesso | Estrutura local de conversas/membros/mensagens/leitura e rascunhos/pedidos preparada nas duas migrations de 11/11. Histórico paginado, identidade por `auth.uid()`, RLS e reenvio verificados em PGlite; troca de conta/assinaturas em componente. Falta aplicar/verificar no demo com autorização: Auth/RLS, concorrência real, eventos privados e F5. | T29; modelo em conversas-site.md | AC25, AC26 locais parciais; critérios remotos pendentes |
| [x] T36 Bot por texto sem custo | Implementação local: domínio T29 reutilizado, intenções delimitadas de consultar/criar/editar/arquivar ofertas próprias, perguntas/opções, seleção por oferta, correção/cancelamento, quantidade total explícita e datas exatas. Prévia antes/depois e confirmação da revisão por botão; comprador apenas consulta. Três testes de domínio e quatro de componente pelo Codex em 11/11/2026; Supabase/aceite pendentes. | T35 local | AC27/28 no domínio/componente; limites remotos em T41 |
| [x] T37 Aplicação das alterações | Implementação local: `site_bot`, rascunhos/revisões/resultados auditáveis e gateway `save_offer` compartilhado com formulário. SQL revalida dono, versão, saldo, precisão/mínimo/datas e triggers de histórico; comando e resultado na mesma transação, replay pela mesma chave. Componente só notifica listas após oferta confirmada. PGlite/componente pelo Codex em 11/11/2026; concorrência real/demo pendentes. | T35 local, T36 | AC27–29 no banco local; limites remotos em T41 |
| [ ] T38 Conversas entre participantes | Contatos demo de produtores/compradores, conversa individual produtor↔produtor e produtor↔comprador, histórico persistido, não lidas e atualização por Supabase Realtime com reconciliação após reconectar. Texto entre pessoas não aciona o bot nem altera estoque/preço/aceites. Avisar que acordos precisam do fluxo formal. | T34, T35 | AC25, AC26, AC30 |
| [ ] T39 Adaptador OpenAI opcional | Preparar interpretação por texto/voz com Realtime API e ferramentas limitadas, mantendo modo simulado padrão e alternativa por texto sem API. Endpoint autenticado emite credencial efêmera; chave permanente só no servidor. Ferramenta propõe rascunho; backend valida e só executa revisão confirmada. Mock de provedor, limites por usuário/sessão e falhas sem repetição paga automática. Nenhuma chamada paga pelo agente. | T36, T37 | AC28, AC31 |
| [ ] T40 Voz opcional no navegador | WebRTC, botão explícito Iniciar/Encerrar voz, permissão de microfone, indicador de sessão paga ativa, transcrição corrigível e mesma confirmação da prévia. Encerrar tracks/conexão ao sair, trocar conta, cancelar ou atingir limite; não iniciar ao abrir a aba/reconectar. Limites de duração/consumo configurados no servidor antes da ativação manual. | T34, T39 | AC31, AC32 |
| [ ] T41 Verificação técnica sem API paga | Testes de domínio, componente e banco: edição concorrente, confirmação obsoleta/duplicada, perda de conexão, estoque reservado, mínimos, isolamento/RLS e atualização de listas. Executar lint/test/build e revisão 360 px/desktop/teclado. Preparar e, quando autorizado, executar teste demo de texto, F5 e duas sessões; distinguir mocks, PGlite e Supabase real. Voz/provedor somente simulados. | T34–T40 | AC23–AC32, com limites de AC31/32 explicitados |
| [ ] T42 Testes pagos de voz pelo usuário | Entregar roteiro para chave/configuração segura, início/fim de sessão, transcrição, correção, prévia, confirmação, custo/limites e interrupção. Usuário executa os testes reais; registrar apenas resultados relatados, sem presumir sucesso por passar mocks. Sem voz testada, manter a indicação de validação pendente. | T39, T40; ambiente configurado pelo usuário | AC31, AC32 reais |
| [ ] T43 Avaliação e documentação da entrega | Consolidar evidências de texto/DM/voz separadamente, pendências e uso real de IA. Apresentar para avaliação e solicitar autorização antes de push/integração na dev. M6 só encerra com seu aceite; M5/T28 e T30 continuam independentes. | T41; T42 para declarar voz validada | AC23–AC32 e aceite humano |

Ordem proposta: T35 + T34 → T36 → T37 → T38 → T39 → T40 → T41 → T42 → T43. Texto e mensagens podem ser avaliados antes da voz, com esse limite declarado. Não criar dependência de Meta, Twilio, telefone ou gasto com OpenAI para demonstrar texto e persistência.

Para cada tarefa concluída registrar: arquivos/commit, critério verificado, resultado, responsável e data. Responsáveis ainda não definidos; não atribuir nomes automaticamente.

Primeira fatia para avaliação — Codex, 11/11/2026, branch `feature/conversas-base` criada da dev `c72392e`:

- T34 implementada localmente em `ConversationsPage.jsx`, CSS, rotas e navegação por perfil. Bot é entrada identificada para o cadastro guiado T29/consulta de ofertas; não recebe texto livre nem fabrica resposta persistida.
- T35 parcial: migration `202611110001_site_conversations.sql`, RPC `site_chat`, serviço e hook. Conversas/membros/mensagens/leitura, par único, identidade por sessão, SELECT/RLS e escrita somente por gateway, chave vinculada ao remetente/conteúdo, páginas de 40 e cursores progressivos. Teste PGlite passou. Rascunhos/comandos do bot e aplicação atômica de ofertas serão implementados em T36/T37; schema remoto, concorrência real e Auth/RLS demo pendentes. Rascunho do campo humano fica somente em memória da conta nesta fatia.
- T38 parcial: contatos permitidos, envio individual, não lidas, assinatura Realtime com cleanup e reconsulta por cursor após reconexão/foco/rede, inclusive mais de 40 mensagens perdidas. Código preparado; testes de UI usam serviço em memória. Entrega entre duas sessões/websocket reais e isolamento de eventos no Supabase ainda não verificados; T38 permanece aberta.
- T41 parcial: lint sem avisos, 61 testes, sete scripts de banco local e build aprovados. Revisão visual/teclado limitada à bancada de Conversas, sem API paga nem Supabase real; não encerra os critérios globais de M6/T29.
- Sem push, merge, migration remota ou aceite humano. Próxima implementação: rascunhos/intérprete T36 e gateway compartilhado T37; próxima validação externa depende de autorização da migration e testes demo. Evidências e limites em `validation.md`, decisão D019 e registro 044 de `IA.md`.

Segunda fatia — Codex, 11/11/2026, `feature/conversas-bot-ofertas`, criada da dev limpa `b1867a5` (substitui somente a indicação de próxima implementação do registro acima):

- T36: `domain/site-bot.js`, `BotThread.jsx` e `services/site-bot.js`, reutilizando `offer-chat.js`/`validateOffer`. Consulta, criação guiada, edição/arquivamento, escolha de alvo, perguntas e correções por campo; total inclui reservas/compromissos. Datas relativas recebem pedido de data exata. Interpretação simulada delimitada, sem IA externa.
- T35/T37: migration `202611110002_site_offer_bot.sql` com RLS privado de rascunhos/pedidos e escrita exclusiva por RPC; revisão esperada, snapshot/versão/saldo, chave vinculada ao conteúdo e resultado atômico. Formulário e bot compartilham `conexa_private.write_offer` via `save_offer`; fallback do formulário conserva funcionamento anterior enquanto a migration não existe. Resposta perdida bloqueia edição e preserva o pedido entre conversas; conflito exige nova prévia e confirmação.
- Verificação local: lint, 68 testes Node/jsdom, oito scripts PGlite e build aprovados. Testes novos em `site-bot.test.js`, `site-bot-ui.test.js` e `site-bot-database.mjs`; revisão dirigida da bancada em 1366×900/360×800, teclado e falha/reenvio. `validation.md` detalha escopo; sem autoria de testes atribuída ao usuário.
- T35/T38/T41 continuam abertas: ainda faltam aplicação no demo, Auth/RLS/concorrência/websocket reais, F5 e duas sessões. T39/T40 não iniciadas; T42/aceite T43 dependem do usuário. M5/T28, T29 visual e T30 preservadas. Sem push/merge/deploy ou autorização remota nesta fatia; D020 e interação 045 de `IA.md`.
