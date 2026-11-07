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
| Propostas do produtor | `/produtor/propostas` | Prévia visual |
| Demandas | `/comprador/demandas` | Prévia com exercício de formulário |
| Composição | `/comprador/demandas/exemplo/composicao` | Exercício ilustrativo 30 + 20 kg, sem reserva |
| Solicitações e veículos | `/transportador/solicitacoes`, `/transportador/veiculos` | Prévias visuais |
| Operação e valores | `/operacoes/exemplo` | Roteiro textual e resumo fictício |
| Pagamento | `/operacoes/exemplo/pagamento` | Prévia de mensagens, sem cobrar/agendar |

O acesso a cada espaço exige selecionar um participante fictício. Ao recarregar, selecione o perfil novamente. Não representa autenticação segura de produção.

As páginas posteriores a ofertas foram solicitadas para avaliação do design. Não correspondem à conclusão dos marcos M2–M5, nem acompanham automaticamente as ofertas criadas no formulário.

## Conectar o Supabase de demonstração

1. Escolher um projeto de demonstração do grupo. Nenhum projeto remoto foi criado ou modificado por esta entrega.
2. Aplicar `supabase/migrations/202611070001_offers.sql` no projeto escolhido.
3. Criar no Supabase Auth os quatro usuários fictícios listados em `.env.example`, com emails confirmados e uma senha pública descartável exclusiva da demonstração. Sem contas pessoais ou credenciais de produção.
4. Executar `supabase/seed.sql`. O seed associa os UUIDs reais do Auth aos participantes e publica as ofertas iniciais. Ajustar o mapeamento do seed se alterar os emails.
5. Copiar `.env.example` para `.env.local`; preencher URL, chave pública/publishable e senha fictícia de demo. Reiniciar o Vite. Variáveis `VITE_` vão para o navegador: nunca usar `service_role` ou segredo administrativo.
6. Repetir os critérios AC01–04 e AC23 no projeto remoto: reload, troca produtor/comprador, erros de rede e requisições diretas entre identidades.

Com URL e chave configuradas, a aplicação usa Supabase Auth e PostgreSQL. Uma falha remota gera erro; não retorna silenciosamente ao mock. RLS limita alterações ao produtor dono. Produto, local de coleta, preço/mínimo, datas, precisão, papel e versão são verificados no banco. Ainda não existem reservas ou histórico vinculado; antes de M2, ampliar integridade e arquivamento conforme as specs.

**M1 concluído por confirmação do usuário em 07/11/2026:** após corrigir os nomes das variáveis para `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`, o usuário informou que validou e testou a aplicação e autorizou encerrar o marco. A validação remota foi relatada pelo usuário, sem logs individuais por critério; não foi executada pelo Codex. Evidências e limites em [validation.md](Conexa-specs/validation.md). Próximo passo: M2, começando pelo CRUD de demandas (T13), seguido de composição e reservas transacionais.

## Organização

`src/components` contém layout e elementos compartilhados; `pages` reúne entrada e prévias; `features/offers` contém o fluxo de ofertas; `hooks` coordena sessão e consultas; `services` isola Supabase e demonstração local; `domain` mantém validações e dinheiro; `pilot` preserva o estudo fornecido. Os vetores locais ficam em `public/assets`.

Tailwind está integrado pelo plugin Vite, com utilitários nas telas. O CSS original foi mantido e estendido para preservar a identidade visual. Não há dependência de fontes, imagens ou APIs de mapas externas para a avaliação local.

Documentos: [specs](Conexa-specs/README.md), [decisões](Conexa-specs/decisions.md), [validações e limites](Conexa-specs/validation.md), [uso de IA](IA.md).

## Git

Fluxo obrigatório: `feature/*` → `dev` → `main`. Nunca desenvolver diretamente na main. Commits seguem Conventional Commits. A versão de feature deve ser apresentada para avaliação; push/integração na dev depende de aprovação do usuário após a avaliação. Regras em [workflow.md](Conexa-specs/workflow.md).

A primeira versão foi publicada nas branches remotas `dev` e `main`, conforme autorização registrada em `IA.md`. A atualização documental do aceite M1 foi preparada em `feature/diagnostico-proximos-passos`; em 07/11/2026, o usuário autorizou sua integração e publicação na `dev`. Novas features devem partir da `dev` atualizada. Essa autorização não promove a atualização documental para `main`.

## Publicação

Nenhum deploy realizado. Ao hospedar o build `dist`, configurar fallback de rotas para `index.html`, pois os caminhos são de uma SPA. Rotas, credenciais e permissões remotas precisam ser verificadas no ambiente de destino.
