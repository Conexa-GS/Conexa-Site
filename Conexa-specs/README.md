# Conexa — Pacote de especificações

Versão: 1.0 | Preparado em: 06/11/2026 | Estado: pronto para orientar o início da implementação.

Este pacote usa desenvolvimento guiado por especificação (Spec-Driven Development). A primeira implementação visual foi preparada em 07/11/2026 com base no piloto Conexa. Consulte `validation.md` para distinguir código e verificações locais de funcionalidades remotas ainda pendentes.

## Ordem de leitura

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

## Origem e precedência

- Briefing: `Desafio-FIAP-GS-CitizenTech 1ES Paulista e Lins.pdf`, fornecido pelo usuário.
- Decisões de produto: conversa sobre CAMPOCIDADE, consolidada neste pacote.
- Referência acadêmica: pp. 39–42 e 58–61 do PDF para Front-end e Web; pp. 18–25 para regras gerais. Numeração pela posição da página, incluindo capa.
- Prazo no briefing: 19/11/2026 às 23h55, America/Sao_Paulo. Confirmar eventuais atualizações na tarefa oficial.

O briefing exige React com Vite ou Next.js, Tailwind, oito componentes, useState/useEffect, dois custom hooks, API externa com CRUD, 15 commits significativos, AI.md, README, repo privado e ZIP. Front-end exige também link do deploy. A mesma aplicação tem envios separados nas duas disciplinas e acesso de escrita aos professores. Este pacote escolhe Vite, conforme o planejamento do projeto.

Instruções de outros chats que alterem o escopo devem ser registradas. O chat implementador deve respeitar as instruções do usuário e as regras do repositório de destino. Este pacote não autoriza publicar, criar contas, gastar créditos ou operar transporte e pagamentos reais.
