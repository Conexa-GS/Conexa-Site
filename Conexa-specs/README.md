# Conexa — Pacote de especificações

11/11/2026 — terceira fatia local de Conversas: T39/T40 preparadas na `feature/conversas-voz-opcional` da dev `aaa0adb`. Broker opcional Node 24 com cotas locais persistentes, WebRTC/sideband e transcrição/sugestão corrigíveis; resposta da IA em texto. D021 substitui credencial efêmera por SDP intermediado no servidor. Desabilitado por padrão; agente usou apenas mocks e bancada sem microfone/API paga. Roteiro [voz-manual.md](voz-manual.md), evidências em validation.md. T35/T38/T41 remotos, T42, avaliação M6 e M5/T28 continuam pendentes; nenhuma integração/publicação ou migration remota presumida.

Versão: 1.0 | Preparado em: 06/11/2026 | Estado: pronto para orientar o início da implementação.

Este pacote usa desenvolvimento guiado por especificação (Spec-Driven Development). A primeira implementação visual foi preparada em 07/11/2026 com base no piloto Conexa. Consulte `validation.md` para distinguir código e verificações locais de funcionalidades remotas ainda pendentes.

## Ordem de leitura

Direção vigente em 11/11/2026: [Conversas no site](conversas-site.md), tarefas T34–T43 e D018 planejam aba de mensagens para produtor/comprador, Bot Conexa para criação/atualização de ofertas e acordos entre participantes. T30/WhatsApp externo fica pausada; histórico e experimentos preservados. Texto simulado é padrão; OpenAI Realtime/voz opcional terá testes pagos pelo usuário, sem chamadas da API pelo agente. Esta atualização é somente planejamento e não encerra M6 ou M5/T28.

1. `constitution.md`: princípios e limites.
2. `spec.md`: escopo, requisitos e histórias de usuário.
3. `business-rules.md`: regras consolidadas da operação.
4. `data-model.md`: entidades, integridade e acesso.
5. `flows.md`: telas, fluxos e estados.
6. `contracts.md`: contratos de dados e serviços.
7. `acceptance.md`: exemplos verificáveis e rastreabilidade.
8. `plan.md`: decisões técnicas, etapas e pendências.
9. `tasks.md`: execução incremental.
10. `handoff.md`: instrução para o chat que vai implementar.
11. `workflow.md`: branches, avaliação, Conventional Commits e registro obrigatório em IA.md.
12. `validation.md`: resultados reais e pendências da primeira versão.

## Como trabalhar

Especificar → planejar → implementar uma fatia funcional → verificar os critérios → revisar documentação. Quando houver uma mudança de comportamento, atualizar os documentos afetados e registrar em `decisions.md`. Não transformar uma sugestão técnica em requisito de negócio sem explicitar a decisão.

O primeiro marco é o CRUD de ofertas persistido no Supabase e consultado por um comprador fictício. O restante está especificado para evitar retrabalho, mas será implementado por etapas.

Atualização em 07/11/2026: M1/M2/M3 concluídos por aceite do usuário. T20 aprovado explicitamente e promoção dev → main autorizada. M3 persiste veículos, indicações, cotações, totais e aceites no demo, com testes locais/remotos pelo Codex. O aceite não é apresentado como execução de testes visuais pelo agente; limites em `validation.md`. Próximo marco: M4/T21; M4+ continua em prévias. Ver `tasks.md` e D009/D010 em `decisions.md`.

Atualização em 08/11/2026: M4 iniciada localmente em `feature/m4-rotas-inclusao`. Pesquisa de fornecedor, roteiro manual autenticado, candidatas com histórico e comparação de cotações preparados; API externa, aplicação da migration no demo, validação remota e aceite ainda pendentes. M4 permanece prévia em avaliação. Escopo e pré-requisitos em `m4-routes.md` e D011.

Atualização em 09/11/2026: M4 confirmado explicitamente pelo usuário no escopo apresentado e publicado na dev. T21–T24 encerrados por aceite humano somado às verificações locais registradas. O aceite preserva como limites a ausência de API externa ativa, migration/testes M4 no Supabase demo e comparação de total entre composições com fretes próprios. Próximo marco: M5/T25.

Atualização em 09/11/2026: M5 iniciada em `feature/m5-fechamento-operacao`. T25–T27 implementadas e verificadas localmente: pagamento, compromisso de estoque, agendamento/viagem fictícios, divergência/resolução, cancelamento/estorno e repasses simulados. Comprador registra resolução e depois confirma recebimento, conforme confirmação explícita do usuário. T28, execução no Supabase demo e aceite da M5 continuam pendentes. Sem aplicação remota da migration nem integração/publicação desta feature. Evidências em `validation.md`.

Atualização em 10/11/2026: usuário autorizou aplicação/validação no demo; migrations M4, M5 e revisões de cotação aplicadas ao projeto configurado. Testes remotos por API com Auth/RLS reais e concorrência passaram, incluindo persistência após nova autenticação, negociação/avisos, desistência sem substituta, pagamento/estorno únicos e revisão versus pagamento. Navegador bloqueado pela ferramenta; recarga/percurso visual conectado e encaminhamento com segunda transportadora continuam pendentes. M5/T28 e avaliação humana da extensão não são declarados concluídos. Mapeamento de versões e limites em `validation.md`.

Atualização em 10/11/2026 — M6: primeira fatia local em `feature/m6-chat-acessivel`, com cadastro opcional de oferta por conversa guiada, correção, prévia e confirmação separada usando o mesmo serviço do formulário. Sem IA externa, áudio ou WhatsApp. T29 e M6 permanecem em avaliação: domínio/lint/build verificados; AC22 completo, visual/teclado e persistência via chat no demo pendentes por bloqueio do navegador. Nenhuma alteração no aceite/pendências da M5. Detalhes em `tasks.md`, D015 e `validation.md`.

Complemento em 10/11/2026 — T29: `feature/t29-chat-validacao`, da dev `11f295f`. Implementação e comportamento AC22 verificados por cinco testes do componente em jsdom e teste manual combinando o componente, serviço real e Auth/RLS do demo; ofertas próprias arquivadas. Total de 42 testes, lint e build aprovados. Fechamento durante envio e foco do impedimento de catálogo corrigidos. Substitui as pendências anteriores de execução do componente e persistência via serviço; revisão visual/teclado, F5 e aceite humano da M6 continuam pendentes. M6 permanece prévia, sem alteração de M5/T28 nem autorização de publicação deste complemento.

## Origem e precedência

Atualização em 11/11/2026 — segunda implementação de Conversas: `feature/conversas-bot-ofertas`, da dev `b1867a5`, acrescenta T36/T37 locais: intérprete delimitado por texto, perguntas/prévia/confirmar, rascunhos e comandos auditáveis, gateway de ofertas compartilhado e proteção de versão/saldo. Lint, 68 testes, oito scripts PGlite e build aprovados; bancada desktop/360 px/teclado revista. Duas migrations de Conversas continuam sem aplicação no demo. T35/T38/T41, voz e avaliação M6 pendentes; M5/T28/T30 preservadas. Contrato D020/conversas-site.md e evidências em validation.md; integração/publicação dependem de autorização após avaliação.

Atualização em 11/11/2026 — primeira implementação de Conversas: `feature/conversas-base` criada da dev `c72392e`; T34 local e base de mensagens T35/T38 preparadas. Rotas dos dois perfis, interface, RPC/migration local com RLS/idempotência/paginação/leitura e adaptador Realtime. Lint, 61 testes, sete scripts PGlite e build aprovados; bancada revista em desktop/360 px/teclado. Sem aplicar migration no demo ou validar websocket/Auth remotos. T35/T38/T41 parciais; T36/T37 e voz pendentes. Não encerra M6/M5 nem altera T30. Contrato final da fatia em `conversas-site.md`, decisão D019 e evidências em `validation.md`; integração depende de autorização após avaliação.

Atualização em 10/11/2026 — T30: especificação separada em `t30-whatsapp.md` e base local de conversa/webhook preparadas na `feature/t30-preparacao`, enquanto a conta Meta aguarda liberação. Demonstrador exclusivamente em memória, sem mensagens externas nem escrita no Supabase. Vínculo por telefone, persistência/idempotência no banco, envio pela Meta e aceite continuam pendentes. Não conclui M6 ou altera M5/T28.

- Briefing: `Desafio-FIAP-GS-CitizenTech 1ES Paulista e Lins.pdf`, fornecido pelo usuário.
- Decisões de produto: conversa sobre CAMPOCIDADE, consolidada neste pacote.
- Referência acadêmica: pp. 39–42 e 58–61 do PDF para Front-end e Web; pp. 18–25 para regras gerais. Numeração pela posição da página, incluindo capa.
- Prazo no briefing: 19/11/2026 às 23h55, America/Sao_Paulo. Confirmar eventuais atualizações na tarefa oficial.

O briefing exige React com Vite ou Next.js, Tailwind, oito componentes, useState/useEffect, dois custom hooks, API externa com CRUD, 15 commits significativos, AI.md, README, repo privado e ZIP. Front-end exige também link do deploy. A mesma aplicação tem envios separados nas duas disciplinas e acesso de escrita aos professores. Este pacote escolhe Vite, conforme o planejamento do projeto.

Instruções de outros chats que alterem o escopo devem ser registradas. O chat implementador deve respeitar as instruções do usuário e as regras do repositório de destino. Este pacote não autoriza publicar, criar contas, gastar créditos ou operar transporte e pagamentos reais.
