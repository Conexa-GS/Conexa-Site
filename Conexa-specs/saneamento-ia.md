# Saneamento de IA.md — T04/T31 — 12/11/2026

Responsável: Codex. Pedido explícito do usuário: retirar consultas e esclarecimentos do registro canônico, preservando a rastreabilidade, e remover a integração descontinuada com WhatsApp das tarefas. Alteração exclusivamente documental na `feature/saneamento-ia-tarefas`, criada da `dev` local `48ec847465d8320501a4c36044894786c4d0777d`, sem fetch.

## Critério e origem

[IA.md](../IA.md) mantém pedidos de programação e planejamento técnico aplicado à implementação, com uso real de IA, cinco seções, evidências e limites. Perguntas de orientação, esclarecimentos, preparação sem implementação e entradas exclusivamente de aceite/publicação ficam fora desse registro. Planejamento técnico concreto, como o contrato de Conversas da interação 043, permanece ligado à implementação que orientou.

A [cópia histórica integral](historico/ia-antes-saneamento-2026-11-12.md) preserva os 54 registros anteriores, inclusive autorizações e resultados. Sua origem é `IA.md` no commit acima; SHA-256 do conteúdo original versionado (LF): `26b300becb27261be37049045212403c5b4778d7ccee716a63e8b62cec872cf7`. O arquivo histórico é explicitamente não canônico e conserva o corpo original versionado byte a byte (LF) após seu cabeçalho; em checkouts CRLF, normalizar as quebras para comparar. Não foram renumerados IDs, reconstituídos os inexistentes 039–042 ou inventadas transcrições/aprovações.

## Mapa da separação

| Registros originais | Tratamento e motivo |
| --- | --- |
| 003 | Consulta de diagnóstico sem alteração de funcionalidade/configuração: integralmente no histórico |
| 006 | Preparação da M2 e perguntas ainda sem implementação: integralmente no histórico; execução real permanece na 007 |
| 002, 004, 005, 008, 009, 012, 013, 017, 019, 021–025, 027, 030, 032, 034, 036, 038 | Entradas exclusivamente de aceite, documentação de aprovação ou publicação/integração: integralmente no histórico, com seus limites e evidências |
| 001 | Dois parágrafos de orientação/confirmação de comandos segregados; pedido original de implementação, cinco seções e verificações preservados |
| 007, 010, 026, 029 | Transcrições de esclarecimentos/autorização segregadas; escopo aplicado, programação e verificações preservados. Na 007, resumo contextual identificado, sem inventar um novo prompt |
| 043–047, 049–056, 058 | Complementos exclusivamente de autorização segregados; na 047, continuação técnica de migrations/testes remotos mantida no canônico |
| Demais registros de programação | Conteúdo preservado; estados datados continuam históricos, sem transformar pendências antigas em pendências atuais |

Resultado: **32 registros canônicos**, todos com as cinco seções; **22 entradas completas segregadas**, além dos trechos mistos acima. As entradas alteradas apontam para a respectiva interação no histórico. O arquivo `AI.md` continua apontando ao canônico. Esta solicitação documental não foi adicionada como novo prompt de programação em `IA.md`.

## Tarefas e continuidade

T04 encerrada quanto aos artefatos versionados: README reproduzível, `AI.md`/`IA.md`, `.env.example` e histórico Git significativo já têm evidências em T31/T32; a ressalva de conteúdo foi saneada nesta revisão. T31 continua concluída como conferência, com a ressalva documental tratada por este complemento. A completude do uso de IA de todos os integrantes ainda depende da conferência do grupo; não se afirma certificação acadêmica ou aceite humano desta revisão.

T30 foi retirada da lista de tarefas e dependências: a integração com WhatsApp foi **descontinuada por pedido explícito do usuário**, substituindo o estado anterior de pausa. IDs posteriores permanecem iguais. [D029](decisions.md#d029--saneamento-de-ia-e-retirada-da-integração-whatsapp--12112026) registra a decisão. Código, experimentos e evidências antigos são históricos; esta alteração documental não executa desativação de endpoint ou limpeza de recursos remotos.

Os documentos de continuidade e a matriz de entrega apontam para este resultado. T32 externa, T41 física, T42 real, T43/aceite M6 e aceite M5 conservam suas pendências. O ZIP preparado anteriormente retrata aquela versão; não foi regenerado por esta revisão.

## Verificação

Resultados efetivamente executados nesta revisão estão no [registro de validação](validation.md#saneamento-documental-t04t31-e-retirada-de-t30--12112026). A comparação com o conteúdo original deve confirmar o hash do arquivo histórico, os IDs, as cinco seções e a preservação das partes de programação. Nenhuma interface foi alterada; revisão de telas em 360 px/desktop não se aplica.

Avaliação e autorização de publicação/integração na `dev` pendentes, conforme [workflow](workflow.md#branches-e-avaliação). Esta revisão não autoriza promoção à `main`.
