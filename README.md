# Conexa

Do campo pra cidade. Mais juntos.

Primeira versão React da Conexa, baseada no piloto visual fornecido pelo grupo. A home preserva as cenas vetoriais, o caminhão guiado pela rolagem e a opção de movimento reduzido. As telas internas reutilizam marca, cores, tipografia, ilustrações e linguagem.

## Executar

Requisitos: Node 22.12+ ou 24 e npm. Ambiente verificado: Node 24.21.0.

```powershell
npm ci
npm run dev
```

Abra o endereço local informado pelo Vite. Sem `.env`, a aplicação usa uma demonstração em memória, identificada na interface. As ofertas são compartilhadas entre perfis na mesma página aberta, mas reiniciam ao recarregar. Não há persistência de ofertas em localStorage.

```powershell
npm run lint
npm test
npm run test:db
npm run build
npm run preview
```

## O que está disponível

| Área | Caminho | Estado |
| --- | --- | --- |
| Apresentação do produto | `/` | Home do piloto integrada |
| Participantes fictícios | `/demo` | Ana, João, restaurante e transportador |
| Ofertas do produtor | `/produtor/ofertas` | Criar, consultar, editar, excluir e filtrar |
| Consulta do comprador | `/comprador/ofertas` | Mesma fonte de ofertas |
| Propostas do produtor | `/produtor/propostas` | Aceite/recusa persistidos, prazo e valores acordados |
| Demandas | `/comprador/demandas` | CRUD remoto, arquivo e propostas do comprador |
| Composição | `/comprador/demandas/:id/composicao` | Busca compatível, seleção e candidata; envio cria reservas atômicas |
| Solicitações e veículos | `/transportador/solicitacoes`, `/transportador/veiculos` | Prévias visuais |
| Operação e valores | `/operacoes/exemplo` | Roteiro textual e resumo fictício |
| Pagamento | `/operacoes/exemplo/pagamento` | Prévia de mensagens, sem cobrar/agendar |

O acesso a cada espaço exige selecionar um participante fictício. Ao recarregar, selecione o perfil novamente. Não representa autenticação segura de produção.

M2 usa as ofertas do Supabase para demandas, composição e reservas. Transporte, operação de exemplo e pagamento permanecem como prévias independentes (M3–M5). Sem Supabase, M2 explica a falta de configuração e não simula gravação.

## Conectar o Supabase de demonstração

1. Escolher um projeto de demonstração do grupo. O projeto demo configurado já recebeu as migrations M2 mediante autorização explícita em 07/11/2026; não reaplicá-las nele.
2. Em instalação nova, aplicar os arquivos SQL de `supabase/migrations` em ordem de nome (M1, M2 e índice complementar). Em projeto M1 existente, aplicar apenas M2 e complemento.
3. Criar no Supabase Auth os quatro usuários fictícios listados em `.env.example`, com emails confirmados e uma senha pública descartável exclusiva da demonstração. Sem contas pessoais ou credenciais de produção.
4. Executar `supabase/seed.sql`. O seed associa os UUIDs reais do Auth aos participantes e publica as ofertas iniciais. Ajustar o mapeamento do seed se alterar os emails.
5. Copiar `.env.example` para `.env.local`; preencher URL, chave pública/publishable e senha fictícia de demo. Reiniciar o Vite. Variáveis `VITE_` vão para o navegador: nunca usar `service_role` ou segredo administrativo.
6. Repetir os critérios AC01–04 e AC23 no projeto remoto: reload, troca produtor/comprador, erros de rede e requisições diretas entre identidades.

Com URL e chave configuradas, a aplicação usa Supabase Auth e PostgreSQL. Uma falha remota gera erro; não retorna silenciosamente ao mock. RLS limita acesso por participante. Produto, locais, preço/mínimo, datas, precisão, papel, versão e saldo são verificados no banco. Ofertas vinculadas preservam snapshots; excluir exige ausência de vínculos, e arquivar mantém o histórico.

**M1 e M2 concluídos em 07/11/2026.** M2 verificado por API no Supabase real pelo Codex, incluindo concorrência, e aprovado pelo usuário após revisão visual relatada em 360 px/desktop. T16 encerrado; próximo marco: M3/T17 (veículos, indicações e cotações). A revisão visual não foi executada pelo Codex; evidências e limites em [validation.md](Conexa-specs/validation.md).

## Experimentar a M2

1. Entre como comprador em `/demo`, crie uma demanda e abra **Buscar e compor**.
2. Selecione quantidades que atendam exatamente a demanda. A insuficiência não reduz a necessidade automaticamente. Salve a candidata (ainda sem reserva).
3. Na lista de propostas, envie aos produtores: o banco verifica saldo e reserva todos os itens na mesma transação. Padrão 24h, configurável de 1 a 168h, limitado pela disponibilidade e data desejada. O prazo efetivo aparece em horário de São Paulo.
4. Troque para cada produtor, abra **Propostas recebidas** e aceite ou recuse. Todos aceitam: aguarda cotação, sem agendamento/pagamento. Recusa ou cancelamento pelo comprador libera toda a reserva; remonte outra proposta para ajustar valores ou itens.
5. Reservas vencidas deixam de consumir saldo imediatamente; status e histórico são atualizados na próxima chamada M2. As listas atualizam a cada 30 segundos, ao recuperar foco ou por **Atualizar**.

O cenário 30 kg Ana + 20 kg João para 50 kg deixa 5 kg de João livres quando as ofertas iniciais estão disponíveis e não comprometidas. Cadastros já vinculados não são apagados fisicamente. Demanda vinculada deve ser arquivada/substituída; cancele antes a proposta ativa. Não existe conversão implícita de caixas para kg.

`npm run test:db` verifica M1/M2 em PostgreSQL local PGlite com identidade simulada. `node tests/remote-m2.mjs` cria fixtures próprias **somente no projeto demo autorizado**, usando `.env` sem imprimir credenciais; o relatório local em `artifacts/m2-remote.local.json` lista UUIDs para limpeza administrativa restrita a essas fixtures. A etapa `--verify-expiration` requer antecipar administrativamente o prazo da carga indicada no relatório, sem alterar operações de outras pessoas. O teste não executa limpeza administrativa automática nem substitui revisão de interface. Nesta entrega, fixtures foram removidas e as três ofertas anteriores preservadas.

## Organização

`src/components` contém layout e elementos compartilhados; `pages` reúne entrada e prévias M3+; `features/offers` e `features/demands` contêm os fluxos M1/M2; `hooks` coordena sessão e consultas; `services` isola Supabase e demonstração local; `domain` mantém validações e dinheiro; `pilot` preserva o estudo fornecido. Os vetores locais ficam em `public/assets`.

Tailwind está integrado pelo plugin Vite, com utilitários nas telas. O CSS original foi mantido e estendido para preservar a identidade visual. Não há dependência de fontes, imagens ou APIs de mapas externas para a avaliação local.

Documentos: [specs](Conexa-specs/README.md), [decisões](Conexa-specs/decisions.md), [validações e limites](Conexa-specs/validation.md), [uso de IA](IA.md).

## Git

Fluxo obrigatório: `feature/*` → `dev` → `main`. Nunca desenvolver diretamente na main. Commits seguem Conventional Commits. A versão de feature deve ser apresentada para avaliação; push/integração na dev depende de aprovação do usuário após a avaliação. Regras em [workflow.md](Conexa-specs/workflow.md).

A primeira versão foi publicada nas branches remotas `dev` e `main`, conforme autorização registrada em `IA.md`. A atualização documental do aceite M1 foi preparada em `feature/diagnostico-proximos-passos`; em 07/11/2026, o usuário autorizou sua integração e publicação na `dev`. Novas features devem partir da `dev` atualizada. Essa autorização não promove a atualização documental para `main`.

## Publicação

Nenhum deploy realizado. Ao hospedar o build `dist`, configurar fallback de rotas para `index.html`, pois os caminhos são de uma SPA. Rotas, credenciais e permissões remotas precisam ser verificadas no ambiente de destino.
