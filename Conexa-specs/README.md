# Conexa — Pacote de especificações

Atualização vigente em 12/11/2026: [saneamento T04/T31](saneamento-ia.md) concluído documentalmente, com consultas/esclarecimentos e aceites/publicações segregados em histórico rastreável; T04 encerrada quanto aos artefatos versionados. T30/WhatsApp **descontinuada** por pedido do usuário e retirada do planejamento (D029). Menções anteriores a saneamento pendente ou canal pausado são históricas. Avaliação desta revisão e autorização de publicação/integração na dev pendentes; demais aceites e verificações mantêm seus limites.

Complemento T32/T33/T43, 12/11/2026: [entrega para avaliação](entrega/README.md) reúne README reproduzível, matriz com evidências/aceites separados, limitações, roteiro e empacotador/ZIP local verificado. T33 concluída como registro documental; T32 parcial por repo/permissões/deploy/envios, T43/aceite M6 e aceite M5 pendentes. Voz real/T42 e rede física/T41 continuam abertas. Nenhuma publicação/integração, implantação ou aprovação humana presumida. Este complemento atualiza as indicações anteriores de ausência de artefatos T32/T33; [verificações desta entrega](validation.md#t32t33t43--artefatos-para-avaliação--12112026).

Complemento T31, 12/11/2026: conferência acadêmica executada com componentes/hooks, useState/useEffect, CRUD/Auth/RLS reais e histórico significativo comprovados. Conteúdo histórico de IA.md tem consulta/esclarecimento fora da regra vigente; T31 concluída como conferência com ressalva, sem encerrar saneamento de IA, T04/T32–T33 ou aceites de produto. [Relatório e evidências](t31-auditoria.md). Feature em avaliação, sem publicação/integração presumida.

Estado consolidado em **12/11/2026**: o site está implementado; M1–M4 têm aceite humano no escopo registrado. Texto/DM está tecnicamente verificado no demo, inclusive F5; T35/T38 encerradas tecnicamente. T28/M5 também encerrada tecnicamente no demo; aceite M5 pendente. T41 mantém rede física pendente; voz/T42 e avaliação T43/M6 continuam abertas.

Complemento T28/D027, 12/11: AC18–21 verificados com Auth/RLS e concorrência reais; pagamento até entrega/divergência/resolução/repasses percorridos no navegador conectado dos três perfis, com F5 e revisão em 360 px/desktop. Corrigido bloqueio de recebimento quando o alimento arredonda a zero centavos; migration corretiva aplicada ao demo. [Evidências](validation.md#t28m5--fechamento-completo-no-demo--12112026). Feature `feature/t28-m5-verificacao` ainda em avaliação, sem autorização presumida de publicação/integração.

Complemento local D026, 12/11: recuperação de consulta do bot corrigida; offline da aba, reconciliação automática, F5 e reenvio único de DM/pedido do bot verificados no navegador integrado/demo. Lint, 109 testes/build aprovados; cinco DMs e um pedido auditável únicos. Usuário optou por adiar a prova física; a emulação não comprovou queda do WebSocket. Feature ainda em avaliação, sem publicação/integração presumida. [Evidências](validation.md#t41d026--recuperação-controlada-e-modo-offline-do-navegador--12112026).

Complemento cotações, 12/11: revisão, negociação, desistência/taxa e avisos percorridos no site conectado com quatro sessões/recarga; comprador em 360 px/desktop. Segunda transportadora indisponível (uma conta demo), sem conta nova. Avaliação humana e publicação/integração deste registro pendentes. [Evidências](validation.md#cotações--percurso-conectado-recarga-e-desistência--12112026).

## Leitura para continuar o projeto

Complemento M4, 12/11: histórico, justificativas, candidatas inclusivas, roteiro manual e valores desconhecidos verificados no demo com Auth/RLS reais e site/F5; comprador em 360 px/desktop. Fixtures próprias encerradas/arquivadas, sem API externa ou alteração da aplicação/schema. [Evidências e limites](validation.md#m4--rotas-manuais-e-sugestões-inclusivas-no-demo--12112026). Feature para avaliação, sem publicação/integração presumida; aceite anterior M4 preservado.

1. [Estado atual e evidências](estado-atual.md): implementação, verificação, aceite, integrações e próximos passos.
2. [spec.md](spec.md) e [business-rules.md](business-rules.md): requisitos e regras de produto.
3. [workflow.md](workflow.md): branches, avaliação, autorização e registro de IA.
4. [tasks.md](tasks.md) e [validation.md](validation.md): tarefas e resultados reais.
5. [handoff.md](handoff.md) e [plan.md](plan.md): continuidade e arquitetura.
6. [conversas-site.md](conversas-site.md), [conversas-validacao-demo.md](conversas-validacao-demo.md) e [voz-manual.md](voz-manual.md): contratos e roteiros de texto/DM e voz.
7. [constitution.md](constitution.md), [data-model.md](data-model.md), [flows.md](flows.md), [contracts.md](contracts.md), [acceptance.md](acceptance.md) e [decisions.md](decisions.md): princípios, modelo, fluxos, critérios e decisões.

Para executar, consulte o [README do projeto](../README.md). Migrations M4/M5/revisões e Conversas já aplicadas ao demo autorizado; confira versões e definições antes de alterar um ambiente existente. Integração Git não comprova deploy nem aceite de marco. Não reiniciar M0/M1 ou reaplicar migrations por instruções antigas.

## Histórico do pacote e origem

Os registros abaixo são preservados como relatos das respectivas etapas. Expressões como “pendente”, “próximo marco” e “sem integração” valem para a data/entrega indicada; o estado vigente está na síntese acima. A versão 1.0 de 06/11 é a origem do pacote, não o estágio atual de implementação.

11/11/2026 — complemento T41/D025 em `feature/t41-bot-persistencia`: criação/edição pelo bot e DM entre sessões verificados após F5 no site conectado; recuperação controlada antes/depois da persistência e quatro grupos de estoque/histórico aprovados no demo. Corrigidos perda de chave na recarga, resposta tardia e prévia obsoleta após rejeição. T35/T38 encerradas tecnicamente; T41 conserva pendência de rede física, e voz/T42/avaliação T43/M6/M5 permanecem abertas. [Evidências](validation.md). Sem nova migration, publicação ou integração presumida.

11/11/2026 — complemento local T41/D024 na `feature/t41-retomada-sessao`: retomada de sessão por aba e revalidação remota, isolamento de Auth e foco de Voltar corrigidos. Recarga real do bot/histórico de Ana e do perfil comprador em abas distintas verificada no site conectado, desktop/360 px; saída do comprador preservou Ana. Sem novo CRUD/envio ou teste pago. [Evidências e limites](validation.md). T41, avaliação M6 e M5/T28 continuam pendentes; integração/publicação desta feature dependem de autorização.

11/11/2026 — execução autorizada de Conversas: duas migrations aplicadas ao demo `conexa`; nove grupos de testes passaram com Auth/RLS, concorrência e Realtime reais, uma oferta própria arquivada e 82 mensagens fictícias preservadas. Publicação/integração da feature na dev autorizadas pelo usuário. [Evidências e versões remotas](validation.md); F5/percurso conectado e T42/M6/M5 continuam pendentes. Os registros anteriores de migrations ainda não aplicadas são históricos.

11/11/2026 — preparação de T41 em `feature/conversas-validacao-demo`, da dev `96e5f33`: teste manual de texto/DM, configuração offline e cenário compartilhado exercitado no PostgreSQL local. Não houve autenticação, mensagens ou migrations remotas. [Roteiro do demo](conversas-validacao-demo.md) descreve autorização, efeitos persistentes e percurso F5/duas sessões ainda pendente. T35/T38/T41, T42 e aceite M6 continuam abertos.

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
