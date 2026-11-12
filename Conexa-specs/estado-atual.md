# Estado atual e evidências

Consolidação em **12/11/2026**, a partir dos registros até 11/11/2026 e do checkout inspecionado. Este documento orienta a continuidade; os relatos datados em [validation.md](validation.md), [decisions.md](decisions.md) e [IA.md](../IA.md) preservam o que se sabia em cada entrega. Não houve nova execução remota nesta consolidação.

## Como interpretar o estado

- **Implementação:** código, migrations ou interface existentes; não comprova execução no demo.
- **Verificação técnica:** procedimento efetivamente executado, com ambiente, responsável, resultado e limites. PGlite/jsdom/mocks não equivalem a Auth/RLS, navegador ou voz reais.
- **Aceite humano:** confirmação explícita do usuário sobre o escopo apresentado. Não atribui ao usuário testes sem relato nem converte verificações do agente em revisão humana.
- **Integração/publicação Git:** envio de commits e integração de branches autorizados. Não equivale a deploy, ativação de serviço, aceite de marco ou autorização para novas operações remotas.

Em divergências de status, usar esta síntese e a evidência posterior identificada abaixo; preservar os registros antigos como histórico. Requisitos de produto continuam em spec.md e business-rules.md; o pedido explícito do usuário prevalece.

## Implementação, verificação e aceite por escopo

| Escopo | Implementação | Verificação técnica registrada | Aceite humano / pendências |
| --- | --- | --- | --- |
| M1 / T05–T12 | CRUD de ofertas, sessão demo, seed e RLS | PGlite pelo Codex; validação do CRUD/persistência/sessões/RLS no demo relatada pelo usuário em 07/11. Sem logs individuais dessa validação; verificações posteriores do gateway de ofertas no demo não reconstituem todos os AC01–04 | M1 aceito em 07/11 pelo relato explícito do usuário. Não declarar nova validação completa pelo agente |
| M2 / T13–T16 | Demandas, composição, reservas e respostas persistidas | Codex: API demo com Auth/RLS e concorrência real, além de domínio/PGlite | Aceito em 07/11; usuário relatou revisão em 360 px/desktop. Sem relatório individual de teclado |
| M3 / T17–T20 | Veículos, indicações, cotações, totais e aceites persistidos | Codex: banco/API demo; limites visuais da entrega preservados | T20/M3 aceitos explicitamente em 07/11; não atribuir revisão visual ao agente |
| M4 / T21–T24 | Roteiro manual, candidatas inclusivas e comparação de cotações equivalentes | Domínio/PGlite e bancada local; migration aplicada no demo em 10/11. Aplicação não comprova percurso M4 completo conectado | Aceito em 09/11 no escopo manual. API externa e comparação de total entre composições com fretes próprios continuam fora do escopo executado |
| M5 / T25–T28 | Pagamento, compromisso, viagem, divergência, cancelamento e repasses exclusivamente simulados | T25–T27 locais; migration aplicada em 10/11, API demo parcial de pagamento/cancelamento e concorrência; D025 complementa compromisso/estorno/snapshots em 11/11 | T28 e aceite M5 pendentes: entrega/divergência/repasses completos no demo e percurso conectado dos três perfis não comprovados |
| Revisões de cotação / RN47–49 | Revisão, negociação, avisos e desistência/taxa simulada | Migration e API demo com Auth/RLS/concorrência em 10/11; desistência sem substituta verificada | Avaliação humana da extensão, percurso conectado e encaminhamento a segunda transportadora compatível pendentes |
| M6 texto / T29, T34–T38 | Bot guiado, gateway compartilhado, DM, histórico, não lidas e recuperação D024/D025 | T35/T38 encerradas tecnicamente em 11/11: Auth/RLS/concorrência/Realtime, navegador conectado/F5, bot criar/editar, comprador, DM e proteção de estoque/histórico. Interface revista de forma dirigida em 360 px/desktop/teclado | T41 parcial pela interrupção física de rede não exercitada; T43/aceite M6 pendentes. T29/modal antigo permanece em bancadas, sem entrada no fluxo principal |
| M6 IA/voz / T39–T42 | Broker Node 24, WebRTC/sideband, cotas e painel opcionais, desligados por padrão | Somente mocks, testes locais e bancada sem microfone/API paga. Sem implantação ou Auth/provedor/áudio reais verificados | T42 é teste pago exclusivo do usuário; voz real e aceite M6 pendentes |
| T30 / WhatsApp | Preparação local e experimentos preservados, inclusive em feature separada | Evidências históricas próprias; não comprovam canal oficial ativo no fluxo do site | Pausada por D018; não retomar por instrução antiga nem inferir desativação de endpoint demo existente |
| T04, T31–T33 / entrega acadêmica | Arquivos e histórico existem | Não há conferência final completa registrada | Permanecem abertos; não declarar ZIP, permissões, deploy ou envio acadêmico concluídos |

Fontes de cada linha: seções datadas de [validation.md](validation.md#atualização-de-aceite-m1--07112026), [tarefas](tasks.md) e decisões D009–D025. Evidências de Conversas: [demo autorizado](validation.md#conversas--migrations-e-teste-demo-autorizados--11112026) e [T41/D025](validation.md#t41d025--bot-e-mensagens-após-recarga-recuperação-e-estoque--11112026). A revisão dirigida de Conversas não encerra AC23 para todos os fluxos nem substitui as pendências específicas de M5/cotações.

## Git e autorizações já utilizadas

Referências observadas no checkout em 12/11, sem nova consulta ao servidor Git:

| Referência local conhecida | Commit | Evidência |
| --- | --- | --- |
| `origin/dev` | `5d25fa2` | Integra recuperação de Conversas `18c7c72` |
| `main` / `origin/main` | `e10883c` | Promoção da recuperação a partir da dev |

As interações 048/049, 050 e 051 de IA.md registram autorizações posteriores às entregas D022–D025. Opções guiadas/atalho e retomada de sessão foram integrados na dev; a interação 051 autorizou também a promoção para main do conteúdo acumulado, observada no histórico Git. As frases antigas “integração pendente” descrevem a entrega antes dessas autorizações. Nenhuma dessas autorizações encerra M5/M6, ativa voz ou comprova deploy. A presente consolidação está em `feature/consolidacao-documentacao`, criada de `origin/dev` em `5d25fa2`, e precisa de sua própria avaliação/autorização antes de subir/integrar.

## Supabase demo: o que já foi aplicado

Projeto registrado nas evidências: `conexa` / `ppbneiusqlitvewwoact`. Não reaplicar SQL por diferença entre nome local e versão remota.

| Arquivo local | Versão remota registrada |
| --- | --- |
| `202611080001_m4_analysis.sql` | `20261110183413` |
| `202611090001_m5_operation_closure.sql` | `20261110183606` |
| `202611090002_quote_revisions.sql` | `20261110183652` |
| `202611110001_site_conversations.sql` | `20261111223622` |
| `202611110002_site_offer_bot.sql` | `20261111223632` |

M1 foi aplicado manualmente e não tem entrada no histórico remoto; M2/M3 já estavam aplicados, com diferenças históricas de versões M3 detalhadas em [validation.md](validation.md). Em ambiente existente, conferir schema, definições e histórico antes de qualquer migration; não executar `db push`, reset ou repair por suposição. Em instalação nova, seguir o README e a ordem dos arquivos. A consolidação não revalida o estado remoto nem autoriza nova escrita.

## Próximos passos sustentados pelas evidências

1. Concluir a parte aberta de T41: interrupção física de rede no navegador e recuperação com a mesma chave; falhas controladas já verificadas não substituem isso.
2. Manter T42 separada: usuário configura e testa voz real conforme [voz-manual.md](voz-manual.md), se desejar ativá-la. Texto/DM pode ser avaliado com voz ainda pendente.
3. Apresentar texto/DM e limites para T43/aceite humano M6; esta consolidação prepara a documentação, sem marcar a tarefa inteira como concluída.
4. Retomar T28/M5 e a extensão de cotações com seus roteiros próprios; não aproveitar o sucesso de Conversas para encerrá-los.
5. Conferir T04/T31–T33 e entrega acadêmica com evidências reais.

Transporte físico e dinheiro real continuam fora do escopo. M5/M6 e páginas de exemplo devem permanecer identificadas como demonstração/prévia em avaliação.
