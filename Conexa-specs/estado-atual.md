# Estado atual e evidências

Consolidação em **12/11/2026**, a partir dos registros até 11/11/2026 e do checkout inspecionado. Este documento orienta a continuidade; os relatos datados em [validation.md](validation.md), [decisions.md](decisions.md) e [IA.md](../IA.md) preservam o que se sabia em cada entrega. Não houve nova execução remota nesta consolidação.

Complemento posterior T28/D027, 12/11/2026: T28 encerrada tecnicamente no demo pelo Codex em `feature/t28-m5-verificacao`, da dev `3bdeee6`. API/Auth/RLS e concorrência reais, pagamento até entrega/divergência/resolução/repasses, navegador dos três perfis com recarga e revisão dirigida em 360 px/desktop. Corrigido recebimento bloqueado pelo repasse de alimento arredondado a zero centavos; migration aplicada ao demo. Aceite humano M5 e autorização de publicação/integração desta feature pendentes. [Evidências](validation.md#t28m5--fechamento-completo-no-demo--12112026).

Complemento funcional posterior na mesma data, T41/D026 em `feature/t41-rede-recuperacao` (da dev `5634533`): alerta de consulta do bot corrigido; lint, 109 testes e build aprovados. Falhas controladas, offline da aba, F5/replay e recuperação automática com duas sessões verificados no navegador integrado/Supabase; cinco DMs e um pedido do bot únicos. Não houve queda observada do WebSocket na emulação. Prova física adiada por escolha do usuário; T41 permanece parcial. [Evidências](validation.md#t41d026--recuperação-controlada-e-modo-offline-do-navegador--12112026). Feature ainda sem autorização de publicação/integração; não altera os aceites dos marcos.

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
| M5 / T25–T28 | Pagamento, compromisso, viagem, divergência, cancelamento e repasses exclusivamente simulados; D027 corrige parcela arredondada a zero | T28 encerrada tecnicamente em 12/11: AC18–21 com Auth/RLS/concorrência reais, persistência e ciclo completo; navegador dos três perfis/F5, 360 px/desktop; migration corretiva aplicada | Aceite humano M5 pendente; feature T28 sem autorização presumida de publicação/integração. Revisão dirigida não equivale a auditoria completa de acessibilidade |
| Revisões de cotação / RN47–49 | Revisão, negociação, avisos e desistência/taxa simulada | Migration e API demo com Auth/RLS/concorrência em 10/11; desistência sem substituta verificada | Avaliação humana da extensão, percurso conectado e encaminhamento a segunda transportadora compatível pendentes |
| M6 texto / T29, T34–T38 | Bot guiado, gateway compartilhado, DM, histórico, não lidas e recuperação D024/D025 | T35/T38 encerradas tecnicamente em 11/11: Auth/RLS/concorrência/Realtime, navegador conectado/F5, bot criar/editar, comprador, DM e proteção de estoque/histórico. Interface revista de forma dirigida em 360 px/desktop/teclado | T41 parcial pela interrupção física de rede não exercitada; T43/aceite M6 pendentes. T29/modal antigo permanece em bancadas, sem entrada no fluxo principal |
| M6 IA/voz / T39–T42 | Broker Node 24, WebRTC/sideband, cotas e painel opcionais, desligados por padrão | Somente mocks, testes locais e bancada sem microfone/API paga. Sem implantação ou Auth/provedor/áudio reais verificados | T42 é teste pago exclusivo do usuário; voz real e aceite M6 pendentes |
| T30 / WhatsApp | Preparação local e experimentos preservados, inclusive em feature separada | Evidências históricas próprias; não comprovam canal oficial ativo no fluxo do site | Pausada por D018; não retomar por instrução antiga nem inferir desativação de endpoint demo existente |
| T04, T31–T33 / entrega acadêmica | Arquivos e histórico existem | Não há conferência final completa registrada | Permanecem abertos; não declarar ZIP, permissões, deploy ou envio acadêmico concluídos |

Fontes de cada linha: seções datadas de [validation.md](validation.md#atualização-de-aceite-m1--07112026), [tarefas](tasks.md) e decisões D009–D025. Evidências de Conversas: [demo autorizado](validation.md#conversas--migrations-e-teste-demo-autorizados--11112026) e [T41/D025](validation.md#t41d025--bot-e-mensagens-após-recarga-recuperação-e-estoque--11112026). A revisão dirigida de Conversas não encerra AC23 para todos os fluxos nem substitui as pendências específicas de M5/cotações.

## Git e autorizações já utilizadas

T28/D027 — autorização posterior em 12/11: usuário respondeu “pode integrar” após apresentação de `ba8f30b`, autorizando publicação de `feature/t28-m5-verificacao` e integração/publicação na dev. Substitui as indicações de publicação/integração pendentes da entrega T28 nos documentos; não inclui main/deploy ou aceite humano M5. Registro em IA.md (053) e validation.md; referências Git identificam a integração.

T41/D026 — autorização posterior em 12/11: usuário respondeu “autorizo” após apresentação de `0c6e564`, autorizando publicação de `feature/t41-rede-recuperacao` e integração/publicação na dev. Substitui as indicações de autorização pendente da entrega D026; não inclui main/deploy ou conclusão da prova física/T41/M6. Registro em IA.md (052) e validation.md; o merge e as referências remotas identificam o resultado da publicação.

Referências observadas no checkout em 12/11, sem nova consulta ao servidor Git:

| Referência local conhecida | Commit | Evidência |
| --- | --- | --- |
| `origin/dev` | `5d25fa2` | Integra recuperação de Conversas `18c7c72` |
| `main` / `origin/main` | `e10883c` | Promoção da recuperação a partir da dev |

As interações 048/049, 050 e 051 de IA.md registram autorizações posteriores às entregas D022–D025. Opções guiadas/atalho e retomada de sessão foram integrados na dev; a interação 051 autorizou também a promoção para main do conteúdo acumulado, observada no histórico Git. As frases antigas “integração pendente” descrevem a entrega antes dessas autorizações. Nenhuma dessas autorizações encerra M5/M6, ativa voz ou comprova deploy. A presente consolidação foi preparada em `feature/consolidacao-documentacao`, criada de `origin/dev` em `5d25fa2`. Após apresentação do commit `d2e5edf`, usuário respondeu “autorizado” em 12/11/2026 à publicação da feature e integração na dev. Esta autorização não inclui promoção para main nem aceite de marcos; contexto em validation.md.

## Supabase demo: o que já foi aplicado

Projeto registrado nas evidências: `conexa` / `ppbneiusqlitvewwoact`. Não reaplicar SQL por diferença entre nome local e versão remota.

| Arquivo local | Versão remota registrada |
| --- | --- |
| `202611080001_m4_analysis.sql` | `20261110183413` |
| `202611090001_m5_operation_closure.sql` | `20261110183606` |
| `202611090002_quote_revisions.sql` | `20261110183652` |
| `202611110001_site_conversations.sql` | `20261111223622` |
| `202611110002_site_offer_bot.sql` | `20261111223632` |
| `20261112205456_m5_zero_cent_payouts.sql` | `20261112205536` |

M1 foi aplicado manualmente e não tem entrada no histórico remoto; M2/M3 já estavam aplicados, com diferenças históricas de versões M3 detalhadas em [validation.md](validation.md). Em ambiente existente, conferir schema, definições e histórico antes de qualquer migration; não executar `db push`, reset ou repair por suposição. Em instalação nova, seguir o README e a ordem dos arquivos. A consolidação não revalida o estado remoto nem autoriza nova escrita.

## Próximos passos sustentados pelas evidências

1. Quando o usuário quiser retomar, concluir a parte aberta de T41: interrupção física de rede no navegador e recuperação com a mesma chave. Falhas controladas e modo offline da aba já verificados não substituem isso; prova física foi explicitamente adiada em 12/11. Não atribuir queda/reabertura de WebSocket à emulação sem evento observado.
2. Manter T42 separada: usuário configura e testa voz real conforme [voz-manual.md](voz-manual.md), se desejar ativá-la. Texto/DM pode ser avaliado com voz ainda pendente.
3. Apresentar texto/DM e limites para T43/aceite humano M6; esta consolidação prepara a documentação, sem marcar a tarefa inteira como concluída.
4. Avaliar a entrega T28 tecnicamente verificada e decidir aceite humano M5; autorizar separadamente publicação/integração da feature. A extensão de cotações conserva avaliação/percurso e encaminhamento a segunda transportadora compatível pendentes.
5. Conferir T04/T31–T33 e entrega acadêmica com evidências reais.

Transporte físico e dinheiro real continuam fora do escopo. M5/M6 e páginas de exemplo devem permanecer identificadas como demonstração/prévia em avaliação.
