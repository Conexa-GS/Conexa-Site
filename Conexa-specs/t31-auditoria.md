# T31 — Conferência acadêmica — 12/11/2026

Responsável: Codex. Escopo solicitado: componentes, hooks, `useState`/`useEffect`, CRUD remoto, commits significativos e registros de IA. Conferência executada em `feature/t31-auditoria-academica`, criada da `dev` limpa em `5ac6fce`. Não houve fetch nesta auditoria: as contagens abaixo se referem ao histórico local desse commit, sem certificar o estado atual do GitHub.

**Resultado: conferência T31 concluída, com ressalva no conteúdo histórico de IA.md.** Os requisitos técnicos examinados têm evidências; o saneamento dos registros antigos e as entregas T32/T33 permanecem pendentes. Isto não é aceite humano, conclusão de todos os marcos ou autorização para publicar/integrar.

## Matriz dos requisitos

| Requisito | Resultado | Evidência verificável |
| --- | --- | --- |
| React com Vite | Atendido no código/build | `package.json`, `src/main.jsx` e `vite.config.js`; build Vite executado |
| Tailwind | Atendido no código/build | Plugin `@tailwindcss/vite` em `vite.config.js`, imports em `src/index.css` e classes utilitárias em `src/components/ui.jsx` |
| Pelo menos oito componentes úteis | Atendido | Dez componentes funcionais com consumidores reais inventariados abaixo; excluídos ícones de biblioteca, prévias e bancadas da contagem |
| `useState` e `useEffect` | Atendido | Estados de consulta/revisão em `useOffers`, sessão/erros em `useDemoSession`, efeitos com cancelamento lógico e remoção de listeners/assinaturas |
| Pelo menos dois custom hooks reais | Atendido | Seis hooks usados pela aplicação; `useOffers` e `useDemoSession` já satisfazem o mínimo |
| API externa com CRUD e separação da apresentação | Atendido no demo | Serviços reais de ofertas + Supabase Auth/REST/RPC; sete grupos remotos aprovados, incluindo exclusão física da própria fixture sem vínculos |
| Pelo menos 15 commits significativos | Atendido no histórico local | Quinze mudanças concretas inspecionadas abaixo, sem contar merges, autorizações documentais ou o commit inicial |
| AI.md/IA.md com as cinco seções e uso real | Parcial | `AI.md` encaminha ao canônico `IA.md`; todos os 52 registros anteriores têm cinco seções, mas existem consulta e esclarecimento antigos fora da regra atual. Nova interação 057 registra apenas o trabalho de programação/verificação desta entrega |

Os critérios acadêmicos locais estão em [acceptance.md](acceptance.md#conferência-acadêmica-antes-da-entrega), derivados do briefing conforme [README das specs](README.md#origem-e-precedência). O PDF original não está no checkout inspecionado; a comparação desta rodada usa esses critérios versionados, sem afirmar releitura do documento original ou certificação da disciplina.

## Componentes: responsabilidade e uso

| Componente | Arquivo | Consumidor e responsabilidade |
| --- | --- | --- |
| AppLayout | `src/components/AppLayout.jsx` | `src/App.jsx`: estrutura dos perfis e navegação |
| OffersPage | `src/features/offers/OffersPage.jsx` | `src/App.jsx`: listagem, filtros e ações do CRUD |
| OfferForm | `src/features/offers/OfferForm.jsx` | `OffersPage.jsx`: formulário validado de criação/edição |
| DemandsPage | `src/features/demands/DemandsPage.jsx` | `src/App.jsx`: demandas do comprador |
| DemandForm | `src/features/demands/DemandForm.jsx` | `DemandsPage.jsx`: cadastro/edição de demanda |
| CompositionPage | `src/features/demands/CompositionPage.jsx` | `src/App.jsx`: seleção de ofertas para a composição |
| ProducerProposals | `src/features/demands/ProducerProposals.jsx` | `src/App.jsx`: propostas e resposta do produtor |
| TransportPage | `src/features/transport/TransportPage.jsx` | `src/App.jsx`: veículos, cotações e acompanhamento demo |
| ConversationsPage | `src/features/conversations/ConversationsPage.jsx` | `src/App.jsx`: caixa de conversas e bot |
| RecordList | `src/components/RecordList.jsx` | `DemandsPage.jsx`, `Loads.jsx`, `TransportPage.jsx`: listagem com filtros/histórico |

A contagem é uma amostra conservadora de dez componentes, não a contagem de todos os exports JSX. Foram conferidas definições, imports e renderização condicional nos consumidores.

## Hooks e responsabilidades

| Hook | Arquivo | Uso real |
| --- | --- | --- |
| useOffers | `src/hooks/useOffers.js` | `OffersPage`: catálogo/lista, carregamento/erro, save/remove/archive e recarga |
| useDemoSession | `src/hooks/useDemoSession.js` | `App`: restauração/validação remota da sessão, entrar/sair, pendência/erro e limpeza da assinatura |
| useM2 | `src/hooks/useM2.js` | `DemandsPage` e `ProducerProposals`: consulta/recarga de demandas e propostas |
| useM3 | `src/hooks/useM3.js` | `TransportPage`: veículos, transportadores e cargas |
| useConversations | `src/hooks/useConversations.js` | `ConversationsPage`: caixa de conversas e atualização |
| useRouter | `src/hooks/useRouter.js` | `App`, páginas e links: pathname via `useSyncExternalStore` e assinatura de `popstate` |

Em `useOffers`, `useState` mantém os dados e a revisão; `useEffect` consulta serviços em paralelo e ignora respostas após desmontagem/troca de dependências, além de remover o listener de atualização. Em `useDemoSession`, o efeito restaura a sessão e controla geração/vida útil para uma resposta antiga não substituir a escolha atual. Não se exige que todo hook utilize ambos os hooks nativos; `useRouter` utiliza o mecanismo apropriado de assinatura externa.

Separação inspecionada: `OfferForm` valida com `src/domain/offers.js` e chama `save`; `OffersPage` consome `useOffers`; o hook delega para `src/services/offers.js`; este usa o cliente de `src/services/supabase.js`. Escrita normal passa por `save_offer`, e exclusão por REST sob RLS. O fallback legado só é tentado quando a RPC está ausente. A auditoria não afirma que todos os componentes do projeto só acessem dados por hooks.

## CRUD remoto executado nesta rodada

Roteiro novo: [tests/remote-t31.mjs](../tests/remote-t31.mjs), manual, fora de `npm test`. `--check` verifica configuração offline; `--run-demo` usa chave pública e contas fictícias já configuradas, recusando destino diferente de `ppbneiusqlitvewwoact`. Não usa chave administrativa, migrations, criação de contas, pagamentos, transporte, DMs ou API paga.

O roteiro carrega os **serviços reais da aplicação** por Vite SSR com o helper jsdom existente; não substitui persistência por mock. jsdom é infraestrutura de módulos, sem renderização visual ou execução de F5. A camada Auth/REST/RPC é o Supabase demo real.

| Grupo | Resultado observado |
| --- | --- |
| Create/Read | Ana cria uma oferta via `saveOffer` e consulta o mesmo ID via `listOffers`; dono derivado de Auth |
| Update/concorrência de versão | Preço muda de 531 para 532 centavos; versão incrementa; tentativa sequencial com versão antiga é rejeitada e não sobrescreve |
| Nova autenticação/leitura compartilhada | Comprador consulta o mesmo ID, produtor, quantidade e preço atualizado após encerrar a sessão anterior e autenticar novamente |
| Comprador | UPDATE/DELETE REST não alteram a oferta; gateway rejeita edição; estado permanece igual |
| Outro produtor | João não altera/exclui a oferta via REST nem edita pelo gateway; estado permanece igual |
| Anônimo | UPDATE/DELETE REST não alteram a oferta; gateway rejeita edição; estado permanece igual |
| Delete | Ana exclui fisicamente somente a oferta criada pelo roteiro, sem vínculos; consulta direta e listas do produtor/comprador confirmam ausência |

Relatório bruto local, ignorado pelo Git: `artifacts/t31-remote.local.json`. O resultado final, run ID e ID da fixture constam também no registro T31 de [validation.md](validation.md#t31--conferência-acadêmica--12112026), preservado no repositório. Não confundir arquivamento com o Delete físico aqui executado. A regra de arquivar cadastros vinculados e as proteções de estoque têm evidências anteriores; não foram reexercitadas nesta rodada. As negativas são testes com credenciais públicas/autenticadas, não consultas administrativas que contornem RLS.

Limites: reautenticação não é F5; não houve nova revisão visual/teclado, corrida simultânea, auditoria integral de RLS/produção, prova física de rede ou voz. A aplicação/interface não mudou; evidências anteriores de navegador mantêm seus próprios limites. Esta conferência não amplia nem recria o aceite de M1–M6.

## Histórico: quinze commits significativos conferidos

Base fixa: `dev` em `5ac6fce`, antes desta entrega. `git rev-list --count --no-merges dev`: **70**. Desses, **69** títulos seguem o formato Conventional Commits; exceção histórica: `063da7b first commit`. O comando por caminhos `git log --no-merges dev -- src server supabase tests` encontra **31** commits, incluindo esse inicial: **30 candidatos de código/banco/testes**, antes de qualquer commit T31. Não é necessário usar documentação isolada ou merges para atingir o mínimo.

Inspeção com `git show --stat <hash>` e correspondência com o código/histórico:

| Commit | Mudança concreta |
| --- | --- |
| `aa7ce74` | Site inicial, perfis, componentes, serviços e SQL |
| `c9ba25c` | Domínio M2, demandas e reservas transacionais no banco |
| `5bf018b` | Telas de demanda/composição e resposta do produtor |
| `3018a85` | Persistência de cotações e aprovações versionadas M3 |
| `6963a18` | Formulários de transporte e revisão financeira |
| `6d46cc6` | Envio de propostas e separação de histórico |
| `30e742d` | Análise de rotas e inclusão M4 |
| `882b772` | Fechamento simulado M5, domínio/banco/interface/testes |
| `4e9f6a9` | Revisões de cotação, negociação e desistência |
| `5acf064` | Cadastro guiado de ofertas por conversa com confirmação |
| `3b9fbf2` | Mensagens internas, hooks, persistência e interface |
| `e58d861` | Bot com comandos de oferta e gateway compartilhado |
| `f36db6d` | Broker/adaptador e controles de voz opcional com limites |
| `4e02c7d` | Retomada da sessão demo isolada por aba |
| `160d235` | Correções de responsividade, formulários e foco com regressões |

São entregas distintas, com alterações reais; não foram criados commits artificiais para contagem. A existência de um commit comprova uma mudança versionada, não aceite humano, deploy ou operação real de voz/transporte/pagamento.

## Registros de IA

Conferidos `AI.md`, `IA.md`, histórico e a regra das cinco seções em [workflow.md](workflow.md#registro-obrigatório-de-ia).

- `AI.md` existe e aponta para `IA.md`, como previsto no workflow. Ambos são arquivos rastreados.
- Antes desta entrega, existem **52 blocos de interação**, numerados 001–038 e 043–056; todos têm cinco subseções cobrindo ferramentas, interações, aplicação, verificação e análise crítica. O salto de numeração não permite concluir que houve interações omitidas; não se inventaram 039–042.
- As interações de implementação examinadas identificam uso efetivo e distinguem ambientes e limites: por exemplo, 007/M2, 010/M3, 035/T29, 044/Conversas, 045/bot e 056/interface. Não foi atribuída ao grupo a execução dos testes do agente.
- **Ressalva concreta:** a interação 003 transcreve uma consulta de diagnóstico e declara que nenhuma funcionalidade/configuração foi alterada. A interação 001 contém o esclarecimento “onde eu faço esses comandos? o vc code?”. Ambos conflitam com a regra vigente de registrar somente prompts de programação e excluir perguntas/consultas/esclarecimentos. A presença das cinco seções não elimina essa ressalva.
- O histórico foi preservado. **Pendência de saneamento:** separar as consultas/esclarecimentos antigos do registro canônico de programação, mantendo origem/rastreabilidade, sem apagar autorizações e evidências nem fabricar transcrições. Esta auditoria identifica a pendência; não reescreve silenciosamente os registros históricos.
- A nova interação 057 documenta a programação do roteiro remoto e sua validação real. O pedido desta T31 foi registrado nesse contexto de trabalho, sem acrescentar perguntas de acompanhamento ou aprovações inexistentes.

A conferência estrutural e amostral de conteúdo não certifica que todo uso de IA de todos os integrantes foi registrado; isso depende de revisão do grupo. Não há evidência suficiente para atestar completude absoluta ou autoria humana de cada trecho.

## Verificações e pendências

Resultados executados nesta entrega e eventuais ajustes do roteiro estão em [validation.md](validation.md#t31--conferência-acadêmica--12112026). Não houve alteração de UI, domínio, serviços da aplicação ou schema; a mudança de código é um roteiro manual com inclusão na cobertura do ESLint.

| Pendência | Encaminhamento |
| --- | --- |
| Conteúdo histórico de IA.md fora do recorte vigente | Sanear com rastreabilidade antes da entrega acadêmica; conferência T31 concluída com esta ressalva |
| Exceção inicial a Conventional Commits | Preservar histórico; requisito de 15 já atendido sem esse commit |
| PDF original indisponível no checkout | Grupo deve confrontar a entrega final com a rubrica/tarefa oficial; esta auditoria usa critérios versionados |
| T32 | README reproduzido em ambiente limpo, ZIP, privacidade/acesso de escrita dos professores, deploy e links não certificados por T31 |
| T33 | Matriz final de aceites efetivos e limites continua tarefa própria |
| Produto | Rede física T41, voz T42, aceite M5 e T43/M6, e segunda transportadora compatível continuam com o estado/limites registrados; T31 não os encerra |
| Entrega Git desta feature | Avaliação e autorização de publicação/integração na dev pendentes; sem push, merge ou promoção para main |
