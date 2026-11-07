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

Atualização M2 em 07/11/2026: demandas, composição, reservas e respostas implementadas e verificadas por API no Supabase demo pelo Codex. Usuário relatou revisão visual em 360 px/desktop e aprovou; M2/T16 concluídos. Próximo marco: M3/T17. M3+ permanece em prévias. Ver evidências e limites em `validation.md` e D008 em `decisions.md`.

## Origem e precedência

- Briefing: `Desafio-FIAP-GS-CitizenTech 1ES Paulista e Lins.pdf`, fornecido pelo usuário.
- Decisões de produto: conversa sobre CAMPOCIDADE, consolidada neste pacote.
- Referência acadêmica: pp. 39–42 e 58–61 do PDF para Front-end e Web; pp. 18–25 para regras gerais. Numeração pela posição da página, incluindo capa.
- Prazo no briefing: 19/11/2026 às 23h55, America/Sao_Paulo. Confirmar eventuais atualizações na tarefa oficial.

O briefing exige React com Vite ou Next.js, Tailwind, oito componentes, useState/useEffect, dois custom hooks, API externa com CRUD, 15 commits significativos, AI.md, README, repo privado e ZIP. Front-end exige também link do deploy. A mesma aplicação tem envios separados nas duas disciplinas e acesso de escrita aos professores. Este pacote escolhe Vite, conforme o planejamento do projeto.

Instruções de outros chats que alterem o escopo devem ser registradas. O chat implementador deve respeitar as instruções do usuário e as regras do repositório de destino. Este pacote não autoriza publicar, criar contas, gastar créditos ou operar transporte e pagamentos reais.
