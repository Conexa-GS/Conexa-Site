# Registro de uso de inteligência artificial — Conexa

## Interação 001 — Primeira versão do site — 07/11/2026

### Ferramentas utilizadas

- **OpenAI Codex (aplicativo desktop):** leitura das specs e do piloto, planejamento, implementação React, preparação de SQL, revisão e documentação. Não foi utilizada outra IA nesta interação.
- Recursos operados pelo Codex: terminal PowerShell, Node/npm, Git, ESLint, testes nativos do Node, navegador de validação e PostgreSQL local PGlite. São ferramentas de execução e verificação, não modelos de IA independentes.
- Skill `design-taste-frontend`: apoio a componentes, responsividade e estados, respeitando o design fornecido. Referências técnicas oficiais: [Tailwind/Vite](https://tailwindcss.com/docs/installation/using-vite), [Supabase Auth](https://supabase.com/docs/reference/javascript/auth-signinwithpassword) e [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

### Interações realizadas

Prompt do usuário (transcrição integral do pedido de trabalho, com quebras de linha normalizadas):

> dentro da pasta F:\GS 2\Conexa-Site, preciso criar o site Conexa, siga as specs do projeto para a implementação e tenha como base a primeira pagina do do site com o arquivo de uma versão piloto.
> Siga o mesmo design da primeira pagina para fazer uma primeira versão das outras, elas vão ser alteradas posteriormente
>
> O projeto vai seguir uma linha de branchs main < dev < features, com um padrão de **Conventional Commits**. nada deve ser feito direto na main, e apos uma alteração, pedir para subir para a dev após avaliação. (anote isso em alguma spec)
> todas os prompts pedidos devem ser anotados no IA.md seguindo essas regras:
> Ferramentas utilizadas: nome das ferramentas de IA e suas finalidades.
> • Interações realizadas: exemplos representativos dos prompts enviados e das respostas obtidas.
> • Aplicação no projeto: descrição das funcionalidades, componentes ou trechos de código desenvolvidos,
> sugeridos ou modificados com auxílio da IA.
> • Validação das respostas: explicação de como o grupo verificou, testou e ajustou os resultados gerados.
> • Análise crítica: breve reflexão sobre os benefícios, as limitações e as dificuldades encontradas durante o
> uso da IA.

Arquivo de referência indicado: `F:\GS 2\conexa-design\conexa\`.

Respostas representativas do Codex nesta interação:

> Vou conferir as specs e a página piloto para implementar o site em uma branch de feature. Também vou registrar o fluxo de branches em uma spec e documentar o uso de IA no IA.md.

> Nesta versão, vou implementar a gestão e a consulta de ofertas e criar prévias navegáveis das etapas seguintes. Não há configuração do Supabase no repositório; vou preparar a integração e o banco, com um modo local claramente identificado para avaliação visual.

O ambiente bloqueou escrita nos metadados Git mesmo após a liberação do diretório. Foi solicitado ao usuário criar `dev` e `feature/primeira-versao-conexa` no terminal. A implementação foi preparada em área temporária até a feature estar ativa, e os manifests alterados durante a instalação foram restaurados exatamente ao HEAD no checkout original. O usuário criou as branches pelo terminal do VS Code. A branch foi conferida antes da transferência. O histórico da main permaneceu preservado.

Interação sobre o impedimento: o usuário respondeu “Criei a branch de feature” e, após nova orientação, “Executei os comandos com sucesso”. As consultas locais ainda retornaram apenas `main`, por isso foi solicitada a saída literal de `git branch --show-current` e `git branch --list` para resolver a divergência antes da transferência. Os cliques de confirmação não foram tratados como prova de estado do Git.

Novo prompt do usuário: “onde eu faço esses comandos? o vc code?”. O Codex explicou como abrir **Terminal → Novo Terminal** no VS Code e executar as três linhas de Git. Depois, o usuário enviou “só isso” com uma captura mostrando `Switched to a new branch 'feature/primeira-versao-conexa'` e o resultado de `branch --show-current`. O estado também foi confirmado por leitura do Git antes de aplicar o site. Resposta: “Sim, era só isso. O terminal confirma a branch correta; vou concluir a aplicação dos arquivos e a validação final.”

### Aplicação no projeto

- Preservação da home do piloto, sua marca, cenas vetoriais, percurso do caminhão e controle de movimento reduzido; entrada da home conectada à seleção de participante.
- Telas de produtor, comprador e transportador; formulário validado, edição, exclusão confirmada, filtros, estado vazio e consulta compartilhada de ofertas.
- Prévias identificadas para propostas, demanda, composição, solicitações, veículos, roteiro, resumo financeiro e estados de pagamento.
- Separação entre componentes, hooks, domínio e serviços. `useOffers` e `useDemoSession` possuem uso real. Valores monetários em centavos e arredondamento por linha.
- Cliente Supabase configurável, contas fictícias com Auth, migration e seed M1 com RLS, propriedade e controle de versão.
- `workflow.md`, `AGENTS.md`, README e este registro preparados. `AI.md` serve de referência para `IA.md`.

### Validação das respostas

As verificações foram executadas pelo Codex. A avaliação humana pelo grupo permanece pendente; não foi atribuída a integrantes que não participaram desta conversa.

- Build de produção e lint executados; correções de exports de Fast Refresh e atribuição redundante no movimento do piloto.
- Sete testes Node: entrada de moeda, precisão de quantidade, mínimo individual, datas, campos obrigatórios e arredondamento financeiro.
- Migration e seed executados em PGlite local com `auth.uid()` simulado; verificados CRUD do proprietário, bloqueios por perfil e anonimato, versão obsoleta, checks e repetição do seed. Não comprova integração com Supabase Auth nem persistência remota.
- Navegador local: cadastro de tomate, rejeição de campos vazios e preço inferior ao mínimo, edição e consulta pelo comprador; busca vazia, rotas e layout em 360 px e desktop. Resultados detalhados em `Conexa-specs/validation.md`.
- Não houve criação de projeto Supabase, deploy, pagamento ou push/merge remoto. M1 remoto e os marcos M2–M5 não foram concluídos por esta versão visual.

### Análise crítica

A IA acelerou a adaptação do piloto e a construção de telas consistentes, além de tornar as regras explícitas em validações e checks de banco. A inspeção humana continua necessária para avaliar linguagem, usabilidade e aderência ao cenário real. O modo local facilita a avaliação visual, mas não demonstra persistência remota ou concorrência de reservas. A configuração de Supabase e os testes reais de RLS continuam necessários. O bloqueio do Git exigiu preparação temporária e transferência somente após a feature estar ativa; não foram fabricados commits para contornar essa limitação.

## Interação 002 — Autorização de publicação — 07/11/2026

### Ferramentas utilizadas
OpenAI Codex para conferência e documentação; Git para commit, integração e publicação.

### Interações realizadas
Prompt integral: “pode subir para dev e depois para main, vou fazer deploy já”. Resposta: conferência das alterações, registro da autorização e promoção sequencial feature → dev → main.

### Aplicação no projeto
Autorização explícita para integrar e publicar a primeira versão nas branches dev e main, sem desenvolver diretamente na main. Commit segue Conventional Commits.

### Validação das respostas
Build, lint, sete testes de domínio e testes PostgreSQL locais passaram na implementação. Conferir referências remotas após os pushes. Supabase remoto continua pendente; páginas posteriores são prévias identificadas.

### Análise crítica
A autorização permite publicar a versão avaliada, mas não transforma a demonstração local em backend remoto validado. O Git precisou de execução fora do sandbox por bloqueio de escrita nos metadados.
