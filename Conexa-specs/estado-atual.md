# Estado atual e evidências

Complemento T32/T33/T43, 12/11/2026: [artefatos para avaliação](entrega/README.md) preparados na `feature/t32-t33-t43-entrega`, criada da dev `17d2684`: README reproduzível, matriz, limitações, roteiro e ZIP de fontes com seleção/inspeção de credenciais e hashes. T33 concluída como registro, sem transformar verificação técnica em aceite; T32 parcial por repo privado/permissões/deploy/envios. T43/aceite M6, aceite M5, rede física/T41, voz real/T42 e saneamento histórico de IA permanecem pendentes. [Resultados desta preparação](validation.md#t32t33t43--artefatos-para-avaliação--12112026); sem push/merge/deploy presumidos. Este complemento substitui somente as indicações anteriores de artefatos T32/T33 ainda ausentes.

Complemento T31, 12/11/2026: conferência acadêmica executada na `feature/t31-auditoria-academica`, da dev `5ac6fce`. Dez componentes úteis e seis hooks em uso, useState/useEffect, CRUD remoto completo com Auth/RLS e exclusão da própria fixture, e quinze commits significativos conferidos. IA.md tem as cinco seções, mas consulta/esclarecimento antigos exigem saneamento; T31 concluída como conferência com ressalva. T04/T32–T33, aceites e demais limites de produto preservados. [Relatório](t31-auditoria.md) e [execuções](validation.md#t31--conferência-acadêmica--12112026). Avaliação e publicação/integração desta feature pendentes.

Complemento de interface, 12/11/2026: revisão dirigida em 360×800/1366×900 na `feature/revisao-fluxos-acessibilidade`, da dev `dd9311f`. Corrigidos navegação cortada, botão causando overflow, ações de diálogo, destinos/retorno de foco, bloqueio de formulários durante envio, orientação da composição, busca vazia e foco após DM. Site conectado dos três perfis consultado; falhas/sucessos de escrita em bancadas isoladas. Lint, 113 testes e build aprovados. [Evidências e limites](validation.md#revisão-de-fluxos-responsividade-e-teclado--12112026); decisão D028. Sem novas operações de negócio no demo, mudança de schema ou ampliação de aceite de marco; avaliação humana e autorização de publicação/integração pendentes.

Consolidação em **12/11/2026**, a partir dos registros até 11/11/2026 e do checkout inspecionado. Este documento orienta a continuidade; os relatos datados em [validation.md](validation.md), [decisions.md](decisions.md) e [IA.md](../IA.md) preservam o que se sabia em cada entrega. Não houve nova execução remota nesta consolidação.

Complemento posterior T28/D027, 12/11/2026: T28 encerrada tecnicamente no demo pelo Codex em `feature/t28-m5-verificacao`, da dev `3bdeee6`. API/Auth/RLS e concorrência reais, pagamento até entrega/divergência/resolução/repasses, navegador dos três perfis com recarga e revisão dirigida em 360 px/desktop. Corrigido recebimento bloqueado pelo repasse de alimento arredondado a zero centavos; migration aplicada ao demo. Aceite humano M5 e autorização de publicação/integração desta feature pendentes. [Evidências](validation.md#t28m5--fechamento-completo-no-demo--12112026).

Complemento funcional posterior na mesma data, T41/D026 em `feature/t41-rede-recuperacao` (da dev `5634533`): alerta de consulta do bot corrigido; lint, 109 testes e build aprovados. Falhas controladas, offline da aba, F5/replay e recuperação automática com duas sessões verificados no navegador integrado/Supabase; cinco DMs e um pedido do bot únicos. Não houve queda observada do WebSocket na emulação. Prova física adiada por escolha do usuário; T41 permanece parcial. [Evidências](validation.md#t41d026--recuperação-controlada-e-modo-offline-do-navegador--12112026). Feature ainda sem autorização de publicação/integração; não altera os aceites dos marcos.

Complemento cotações, 12/11: revisão, recusa/manutenção, aprovação de novo frete, aceites, bloqueio de pagamento, desistência/taxa e avisos verificados no site conectado com quatro sessões/recarga; comprador em 360 px/desktop. Demo tem uma única transportadora; encaminhamento à segunda conta não testado, sem conta nova. Fixtures próprias liberadas/arquivadas, histórico preservado. [Evidências](validation.md#cotações--percurso-conectado-recarga-e-desistência--12112026). Avaliação humana e publicação/integração deste registro pendentes.

## Como interpretar o estado

Complemento M4, 12/11: rotas manuais e sugestões inclusivas verificadas no demo com Auth/RLS reais, site conectado e F5 de comprador/transportador; comprador em 360 px/desktop. Histórico 7/4 conferido, candidatas R$290/R$310 com justificativa, insuficiência sem redução da demanda, roteiro com retorno e nulos explícitos sem dupla soma. Fixtures próprias encerradas/arquivadas, sem mapas externos ou alteração da aplicação/schema. [Evidências](validation.md#m4--rotas-manuais-e-sugestões-inclusivas-no-demo--12112026). Publicação/integração de `feature/m4-verificacao-demo` pendentes; aceite anterior M4 e limites de API externa/composições com fretes próprios preservados.

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
| M4 / T21–T24 | Roteiro manual, candidatas inclusivas e comparação de cotações equivalentes | Domínio/PGlite; migration aplicada em 10/11. Em 12/11, histórico/justificativas/candidatas/roteiro/nulos verificados com Auth/RLS e site/F5; 360 px/desktop. Duas cotações remotas equivalentes não exercitadas nesta rodada | Aceito em 09/11 no escopo manual. API externa e comparação de total entre composições com fretes próprios continuam fora do escopo executado |
| M5 / T25–T28 | Pagamento, compromisso, viagem, divergência, cancelamento e repasses exclusivamente simulados; D027 corrige parcela arredondada a zero | T28 encerrada tecnicamente em 12/11: AC18–21 com Auth/RLS/concorrência reais, persistência e ciclo completo; navegador dos três perfis/F5, 360 px/desktop; migration corretiva aplicada | Aceite humano M5 pendente; feature T28 sem autorização presumida de publicação/integração. Revisão dirigida não equivale a auditoria completa de acessibilidade |
| Revisões de cotação / RN47–49 | Revisão, negociação, avisos e desistência/taxa simulada | API/Auth/RLS/concorrência em 10/11; site com quatro sessões/F5, revisão, negociação, aceites, desistência/parcelas/avisos em 12/11; comprador em 360 px/desktop | Avaliação humana e encaminhamento a segunda transportadora compatível pendentes; demo tem uma conta transportadora |
| M6 texto / T29, T34–T38 | Bot guiado, gateway compartilhado, DM, histórico, não lidas e recuperação D024/D025 | T35/T38 encerradas tecnicamente em 11/11: Auth/RLS/concorrência/Realtime, navegador conectado/F5, bot criar/editar, comprador, DM e proteção de estoque/histórico. Interface revista de forma dirigida em 360 px/desktop/teclado | T41 parcial pela interrupção física de rede não exercitada; T43/aceite M6 pendentes. T29/modal antigo permanece em bancadas, sem entrada no fluxo principal |
| M6 IA/voz / T39–T42 | Broker Node 24, WebRTC/sideband, cotas e painel opcionais, desligados por padrão | Somente mocks, testes locais e bancada sem microfone/API paga. Sem implantação ou Auth/provedor/áudio reais verificados | T42 é teste pago exclusivo do usuário; voz real e aceite M6 pendentes |
| T30 / WhatsApp | Preparação local e experimentos preservados, inclusive em feature separada | Evidências históricas próprias; não comprovam canal oficial ativo no fluxo do site | Pausada por D018; não retomar por instrução antiga nem inferir desativação de endpoint demo existente |
| T31 / conferência acadêmica | Componentes/hooks, CRUD remoto, histórico e IA inspecionados | Relatório T31 e sete grupos remotos; registros antigos de IA com ressalva | Conferência concluída; saneamento de IA.md e avaliação da feature pendentes |
| T04, T32–T33 / entrega acadêmica | README reproduzível, matriz, roteiro, limitações e ZIP local preparados | Empacotador e cópia extraída verificados nesta entrega; evidências em validation.md | T33 registra matriz concluída; T32 parcial, T04/saneamento de IA, permissões, deploy e envios acadêmicos pendentes |

Fontes de cada linha: seções datadas de [validation.md](validation.md#atualização-de-aceite-m1--07112026), [tarefas](tasks.md) e decisões D009–D025. Evidências de Conversas: [demo autorizado](validation.md#conversas--migrations-e-teste-demo-autorizados--11112026) e [T41/D025](validation.md#t41d025--bot-e-mensagens-após-recarga-recuperação-e-estoque--11112026). A revisão dirigida de Conversas não encerra AC23 para todos os fluxos nem substitui as pendências específicas de M5/cotações.

## Git e autorizações já utilizadas

M4 — autorização posterior em 12/11: usuário respondeu “autorizo” após apresentação de `4ace62c`, autorizando publicação de `feature/m4-verificacao-demo` e integração/publicação na dev. Substitui as indicações de autorização pendente desta entrega; sem main/deploy, mapa externo ou ampliação do aceite M4. Registro em IA.md (055) e validation.md; referências remotas conferidas ao concluir.

Cotações — autorização posterior em 12/11: usuário respondeu “autorizo” após apresentação de `82932d6`, autorizando publicação de `feature/cotacoes-validacao-conectada` e integração/publicação na `dev`. Substitui as indicações de autorização pendente deste registro; avaliação humana da extensão e encaminhamento à segunda transportadora continuam pendentes. Sem autorização de `main`/deploy. Registro em IA.md (054) e validation.md; referências remotas conferidas ao concluir.

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
4. Avaliar a entrega T28 tecnicamente verificada e decidir aceite humano M5; integração T28 já autorizada conforme registro acima. Cotações tiveram percurso conectado/recarga verificados em 12/11; avaliação humana e encaminhamento a segunda transportadora compatível continuam pendentes, pois só existe uma conta demo transportadora.
5. Avaliar o pacote T32/T33/T43 e sanear as ressalvas de IA.md identificadas na T31; conferir T04, partes externas de T32 e entrega acadêmica com evidências reais. A matriz T33 já está registrada; aprovar pacote não comprova deploy/envios ou voz real.

Transporte físico e dinheiro real continuam fora do escopo. M5/M6 e páginas de exemplo devem permanecer identificadas como demonstração/prévia em avaliação.
