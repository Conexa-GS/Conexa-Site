# Fluxo de desenvolvimento e uso de IA

Decisão do usuário em 07/11/2026. Estas regras se aplicam a todas as alterações futuras.

## Branches e avaliação

Fluxo: `feature/*` → `dev` → `main`.

- `main`: versão estável. Nunca desenvolver, editar ou criar commits diretamente nela.
- `dev`: integração das alterações avaliadas. Criar cada feature a partir de `dev`.
- `feature/<assunto>`: implementação, documentação e validações da mudança.
- Ao terminar uma alteração, apresentar comportamento, arquivos, verificações e pendências. Pedir aprovação do usuário para subir/integrar na `dev` depois da avaliação.
- Não fazer merge, push ou promoção para `dev`/`main` sem a autorização correspondente. A entrega da feature para avaliação não é aprovação de integração.
- Preservar alterações de outros integrantes. Conferir branch e `git status` antes de editar e antes de commitar.
- Se o ambiente impedir criar/trocar branch, preparar arquivos temporários e aguardar a feature ativa. Não usar a limitação como justificativa para trabalhar na `main`.

## Conventional Commits

Formato: `<tipo>(<escopo opcional>): <descrição>`.

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`, `revert`. Usar `!` e descrição de breaking change quando necessário.

Exemplos: `feat(ofertas): add producer offer management`; `fix(ofertas): preserve producer minimum`; `docs(ia): record implementation and validation`.

Commits devem corresponder a mudanças reais e coerentes. Não dividir artificialmente trabalho para atingir a contagem acadêmica.

## Documentação e evidências

Ao atualizar o estado do projeto, separar:

- Implementação: arquivos e comportamento preparados.
- Verificação técnica: procedimento executado, ambiente, responsável, resultado e limites; distinguir mocks/PGlite de Supabase e navegador reais.
- Aceite humano: manifestação explícita do usuário, restrita ao escopo apresentado; não presumir testes individuais sem relato.
- Integração/publicação Git: autorização e commits/branches correspondentes; não comprova deploy ou aceite de marco.

[estado-atual.md](estado-atual.md) consolida o estado vigente e aponta para os relatos datados em validation.md, decisões e registros de autorização. Preservar os relatos anteriores identificando seu contexto histórico; corrigir as instruções de continuidade quando uma evidência posterior as substituir. Uma pendência técnica não é encerrada apenas por integração Git, e um aceite com limites não deve ser ampliado por interpretação.

## Registro obrigatório de IA

O arquivo canônico é `IA.md`. `AI.md` aponta para ele para compatibilidade com o briefing. Registrar somente prompts de programação e o uso real de IA correspondente, distinguindo transcrição de resumo e preservando o histórico anterior. Perguntas, consultas e esclarecimentos não entram no registro. Cada registro de programação deve conter:

1. Ferramentas de IA e suas finalidades.
2. Prompts e respostas representativos, sem inventar interações.
3. Aplicação em funcionalidades, componentes ou trechos de código.
4. Como o grupo verificou, testou e ajustou os resultados, distinguindo verificação automatizada de avaliação humana ainda pendente.
5. Análise crítica de benefícios, limitações e dificuldades.

Não registrar segredos, tokens ou dados pessoais reais. Não afirmar que o grupo aprovou ou executou testes que ainda não realizou.
