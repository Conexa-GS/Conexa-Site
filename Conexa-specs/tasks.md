# Tarefas e marcos

Atualização de 07/11/2026: **M1 concluído por confirmação do usuário**. M2 implementado e verificado por API no Supabase demo pelo Codex; revisão visual em 360 px/desktop e avaliação humana ainda pendentes. Não encerrar o marco integralmente antes dessa revisão. Evidências em `validation.md`.

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
- [x] T15 Seleção 30+20 kg, insuficiência, aceite/recusa e expiração — interface e regras preparadas; comportamento de API local/remoto verificado pelo Codex em 07/11/2026; revisão visual pendente.
- [ ] T16 Verificar AC05–09/21, incluindo concorrência e liberação de saldo — verificações de domínio e banco passaram, incluindo concorrência real, Auth/RLS e liberação; falta percorrer a interface e conferir 360 px/desktop (AC23 transversal). Bloqueio do navegador em `validation.md`.

Entrega M2 na branch `feature/m2-demandas-composicao`, migrations `20261107213117_m2_demands_reservations.sql` e `20261107220459_m2_event_actor_index.sql`; testes `demands.test.js`, `m2-database.mjs` e `remote-m2.mjs`. Avaliação humana e autorização para push/integração ainda pendentes. M3 não iniciado.

Commits de implementação: `c9ba25c` (domínio, banco, serviços e testes) e `5bf018b` (interface, hooks e integração). Responsável pelas verificações relatadas: Codex, 07/11/2026.

## M3 — Transporte e financeiro; depende de M2

- [ ] T17 Veículos, indicações e cotações com confirmação do transportador.
- [ ] T18 Resumo por produtor e total do comprador; mínimos, taxa zero e frete separado.
- [ ] T19 Aceites por versão e validação de capacidade/conservação/prazo.
- [ ] T20 Verificar AC10–14/21.

## M4 — Rotas e inclusão; depende da composição e cotação

- [ ] T21 Validar fornecedor de rotas, credenciais, termos, cobertura e orçamento autorizado.
- [ ] T22 Função de rotas no servidor, roteiro completo, nulos e fallback manual explícito.
- [ ] T23 Comparação de composições e justificativa inclusiva baseada no histórico.
- [ ] T24 Verificar AC15–17; não alegar economia ou distância fictícias.

## M5 — Fechamento da operação; depende de M3

- [ ] T25 Pagamento simulado idempotente e conversão de reserva em compromisso.
- [ ] T26 Agendamento, transporte, entrega e divergência com histórico.
- [ ] T27 Cancelamento/estorno/liberação e repasses únicos.
- [ ] T28 Verificar AC18–21; percorrer os três perfis no cenário-base.

## M6 — Evolução de acessibilidade

- [ ] T29 Chat demonstrativo opcional com confirmação e mesmo serviço de ofertas; verificar AC22.
- [ ] T30 Especificar integração WhatsApp oficial separadamente se solicitada; não implementar por pressuposição.

## Fechamento acadêmico

- [ ] T31 Conferir componentes/hooks, histórico e registros de IA.
- [ ] T32 README reproduzível, ZIP, acesso ao repo e deploy; autorização necessária para ações externas conforme contexto.
- [ ] T33 Registrar matriz de aceites efetivamente executados e limitações pendentes.

Para cada tarefa concluída registrar: arquivos/commit, critério verificado, resultado, responsável e data. Responsáveis ainda não definidos; não atribuir nomes automaticamente.
