# Verificação da primeira versão — 07/11/2026

Responsável pelas verificações locais da primeira versão: Codex. O histórico abaixo descreve essa execução; o aceite posterior do usuário está registrado a seguir.

## Atualização de aceite M1 — 07/11/2026

Após a orientação para corrigir a configuração e validar CRUD, persistência, sessões, RLS e interface no Supabase de demonstração, o usuário informou: “Corrigi os nomes, validei e testei, podemos seguir, pode marcar como concluido”.

**M1 marcado como concluído por confirmação do usuário.** A correção informada usa as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`, esperadas pelo cliente Vite. T07, T11 e T12 foram encerradas com base nesse aceite, e M2 passa a ser o próximo marco.

Fonte da evidência remota: relato do usuário nesta conversa. Não foram apresentados logs, capturas ou resultados separados de AC01–04/23. O Codex não executou nem observou esses testes remotos; os procedimentos específicos não devem ser atribuídos a ele. O aceite do marco não representa auditoria completa de acessibilidade ou segurança de produção. Valores do `.env` não são reproduzidos neste registro.

## Verificações executadas

| Procedimento | Resultado | Limite da evidência |
| --- | --- | --- |
| `npm run build` | Build Vite concluído | Não comprova backend |
| `npm run lint` | Sem erros após correções | Análise estática |
| `npm test` | 7 testes passaram | Validação, datas e dinheiro no domínio |
| `npm run test:db`: migration + seed em PGlite local | Schema executou; seed repetido sem duplicação; CRUD do dono, versão obsoleta e checks passaram | PostgreSQL local com auth.uid simulado; não é Supabase Auth real |
| RLS local | Outro produtor não altera oferta alheia; comprador lê publicadas e não exclui; transportador não lê ofertas; anon sem acesso | Repetir no Supabase escolhido antes do aceite M1 |
| Navegador: ofertas | Campos obrigatórios e mínimo rejeitados; tomate criado, editado para R$ 6,50, consultado pelo comprador e excluído após confirmação | Modo em memória, explicitamente identificado |
| Navegador: busca | Busca sem resultado exibe orientação | Não é consulta remota |
| Layout | Telas verificadas em desktop (1366 px) e celular (360 px), com medições DOM | Verificação dirigida, sem auditoria completa de acessibilidade |
| Teclado e movimento | Esc fecha formulário e devolve foco; controle de movimento da home alterna aria-pressed; retorno à home sem erro de console | Verificação dirigida, não auditoria completa |
| Prévias | Composição 30+10 indica 10 kg faltantes; pagamento aprovado mostra que não agenda; solicitações e veículos sem overflow em 360 px | Não grava operações |

## Matriz de aceite da execução inicial (histórico anterior ao aceite acima)

- AC01: comportamento de consulta compartilhada visto em modo local; persistência após reload no Supabase **pendente**.
- AC02: testes de validação + checks PostgreSQL local executados; validar chamadas diretas no banco remoto antes de fechar M1.
- AC03: editar/excluir preparados; RLS local verificada; permissões remotas **pendentes**.
- AC04: carregamento/erro/vazio e preservação de formulário implementados; falha real do Supabase **não exercitada**.
- AC23: responsividade e campos identificados verificados parcialmente; revisão humana e auditoria completa de teclado/leitor de tela **pendentes**.
- AC05–22: telas ilustrativas não comprovam reservas, cotação, pagamento, idempotência, rota ou entrega. Marcos seguintes continuam abertos.

## Dependências e contexto

Node 24.21.0, React 19.3.1, Vite 8.3.6, Tailwind 4.3.5 e Supabase JS 2.119.0 no ambiente desta verificação. Não há `.env` de Supabase no checkout inicial.

`npm audit` identificou quatro avisos moderados na árvore de desenvolvimento do ESLint/minimatch herdada da base. Não foi aplicado `audit fix --force`, que propunha mudança de versão principal. Não se trata de falha do build; revisão da ferramenta de lint pode ser feita em mudança própria.

## Git e transferência inicial (histórico)

O ambiente negou a criação de refs no `.git`, inclusive após solicitação de permissão. A execução elevada também foi rejeitada pela política automática. Os manifests da instalação inicial foram restaurados byte a byte ao HEAD; a implementação foi preparada fora do checkout até a criação manual de `dev` e `feature/primeira-versao-conexa` pelo usuário no VS Code. A feature foi conferida antes da transferência. O histórico da main foi preservado. Nenhum push/merge foi realizado; integração na dev aguarda avaliação e aprovação.

Atualização de 07/11/2026: a consulta ao Git após `fetch` confirmou a primeira versão em `origin/dev` e `origin/main` no commit `aa7ce74`. O usuário autorizou integrar/publicar na `dev` a documentação do diagnóstico e do aceite M1. Essa atualização é preparada na feature; o registro acima descreve somente a transferência inicial, não o estado atual das branches remotas.
