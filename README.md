# Conexa

Do campo pra cidade. Mais juntos.

Aplicação React da Conexa, baseada no piloto visual fornecido pelo grupo. A home usa as ilustrações de referência locais, o caminhão guiado pela rolagem e a opção de movimento reduzido. Marca vetorial, creme, verde e laranja são preservados; as telas internas compartilham os novos personagens.

Revisão visual de 08/11/2026: caminhão vazio/carregado, cenas, retratos, banners e flor usam diretamente os GIFs fornecidos em `F:/animação/`. Os desenhos e movimentos vetoriais da revisão anterior foram removidos. Os 15 GIFs estão preservados byte a byte em `public/assets/animations`, com origem, quadros, duração e SHA-256 em `sources.json`; 12 versões são usadas e três variantes alternativas ficam catalogadas. A moldura SVG apenas enquadra o arquivo original, sem redesenhar sua arte. Fora da tela ou com movimento reduzido, aparece o primeiro quadro estático; a preferência manual é mantida durante a navegação. O caminhão continua seguindo a estrada pela rolagem e o percurso é ilustrativo. Validações e limites em `Conexa-specs/validation.md`; integração desta revisão na dev aguarda avaliação e autorização.

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
| Solicitações e veículos | `/transportador/solicitacoes`, `/transportador/veiculos` | M3: cadastro de veículos e cotações persistidas |
| Transporte e valores | `/operacoes` | M3: indicações, cotação, mínimos e aceites finais por versão |
| Operação e valores | `/operacoes/exemplo` | Roteiro textual e resumo fictício |
| Pagamento | `/operacoes/exemplo/pagamento` | Prévia de mensagens, sem cobrar/agendar |

O acesso a cada espaço exige selecionar um participante fictício. Ao recarregar, selecione o perfil novamente. Não representa autenticação segura de produção.

M2 e M3 usam Supabase para demandas, composição, reservas, transporte, totais e aceites. Operação e pagamento de exemplo permanecem como prévias independentes. Sem Supabase, M2/M3 explicam a falta de configuração e não simulam gravação.

## Conectar o Supabase de demonstração

1. Escolher um projeto de demonstração do grupo. O projeto demo configurado já recebeu as migrations M1–M3 mediante autorização explícita em 07/11/2026; não reaplicá-las nele.
2. Em instalação nova, aplicar os arquivos SQL de `supabase/migrations` em ordem de nome. Em projeto existente, aplicar apenas migrations ausentes conforme histórico; M3 tem a migration principal e complementos de compatibilidade/totais.
3. Criar no Supabase Auth os quatro usuários fictícios listados em `.env.example`, com emails confirmados e uma senha pública descartável exclusiva da demonstração. Sem contas pessoais ou credenciais de produção.
4. Executar `supabase/seed.sql`. O seed associa os UUIDs reais do Auth aos participantes e publica as ofertas iniciais. Ajustar o mapeamento do seed se alterar os emails.
5. Copiar `.env.example` para `.env.local`; preencher URL, chave pública/publishable e senha fictícia de demo. Reiniciar o Vite. Variáveis `VITE_` vão para o navegador: nunca usar `service_role` ou segredo administrativo.
6. Repetir os critérios AC01–04 e AC23 no projeto remoto: reload, troca produtor/comprador, erros de rede e requisições diretas entre identidades.

Com URL e chave configuradas, a aplicação usa Supabase Auth e PostgreSQL. Uma falha remota gera erro; não retorna silenciosamente ao mock. RLS limita acesso por participante. Produto, locais, preço/mínimo, datas, precisão, papel, versão e saldo são verificados no banco. Ofertas vinculadas preservam snapshots; excluir exige ausência de vínculos, e arquivar mantém o histórico.

**M1, M2 e M3 concluídos por aceite do usuário em 07/11/2026.** T20 aprovado explicitamente e promoção dev → main autorizada. Inclui envio direto e separação/ocultação de listas. Verificações locais e de API no Supabase demo pelo Codex; o aceite humano não é apresentado como teste visual executado pelo agente. Próximo marco: M4/T21. Evidências e limites em [validation.md](Conexa-specs/validation.md).

## Experimentar a M2

1. Entre como comprador em `/demo` e clique em **Nova demanda**. **Continuar: escolher produtores** salva a necessidade e abre automaticamente a composição.
2. Selecione quantidades que atendam exatamente a demanda. A insuficiência não reduz a necessidade automaticamente. Revise valores e prazo e clique em **Enviar proposta aos produtores** nessa mesma tela.
3. O serviço salva a candidata e a envia; o banco verifica saldo e reserva todos os itens na mesma transação do envio. Não há aprovação intermediária em Minhas propostas. Em falha, o rascunho é preservado para reenvio pelo mesmo UUID, sem duplicar proposta. Padrão 24h, configurável de 1 a 168h, limitado pela disponibilidade e data desejada. O prazo efetivo aparece em horário de São Paulo.
4. Troque para cada produtor, abra **Propostas recebidas** e aceite ou recuse. Todos aceitam: aguarda cotação, sem agendamento/pagamento. Recusa ou cancelamento pelo comprador libera toda a reserva; remonte outra proposta para ajustar valores ou itens.
5. Reservas vencidas deixam de consumir saldo imediatamente; status e histórico são atualizados na próxima chamada M2. As listas atualizam a cada 30 segundos, ao recuperar foco ou por **Atualizar**.

O cenário 30 kg Ana + 20 kg João para 50 kg deixa 5 kg de João livres quando as ofertas iniciais estão disponíveis e não comprometidas. Cadastros já vinculados não são apagados fisicamente. Demanda vinculada deve ser arquivada/substituída; cancele antes a proposta ativa. Não existe conversão implícita de caixas para kg.

Demandas, propostas e transporte abrem em **Ativas**; canceladas, expiradas e arquivadas ficam no **Histórico**. No produtor, as novas propostas para responder aparecem primeiro. **Ocultar da lista** envia o cartão para **Ocultas**, onde pode ser reexibido. Essa preferência é local por participante e por lista; não cancela proposta nem altera reserva/prazo ou dados no Supabase.

`npm run test:db` verifica M1–M3 em PostgreSQL local PGlite com identidade simulada. `node tests/remote-m2.mjs` cria fixtures próprias **somente no projeto demo autorizado**, usando `.env` sem imprimir credenciais; o relatório local em `artifacts/m2-remote.local.json` lista UUIDs para limpeza administrativa restrita a essas fixtures. A etapa `--verify-expiration` requer antecipar administrativamente o prazo da carga indicada no relatório, sem alterar operações de outras pessoas. O teste não executa limpeza administrativa automática nem substitui revisão de interface. Na entrega M2, fixtures foram removidas e as três ofertas anteriores preservadas.

## Experimentar o M3

1. Complete o aceite de fornecimento M2 nos dois produtores. Acesse **Transporte e valores** em `/operacoes`.
2. Como produtor, indique transportador fictício e preço opcionalmente. A indicação permanece pendente; não pode ser selecionada como cotação.
3. Como transportador, cadastre veículo em **Meus veículos**. Em **Solicitações**, preencha veículo, saída fictícia, conservação exigida, datas/validade, preço final e retorno opcional. Confirme cobertura de combustível, pedágios, todas as coletas, descarga e retorno acordado. A validade não ultrapassa a reserva. Capacidade insuficiente ou conservação incompatível bloqueiam a confirmação.
4. Como comprador, selecione uma cotação confirmada. Isso abre nova versão; confira alimentos, frete separado, taxa zero, total e mínimos individuais. Cada produtor, comprador e transportador selecionado confirma as condições finais pelo próprio perfil.
5. Quatro aceites levam a **Aceites completos · pagamento futuro (M5)**. Nenhum transporte é agendado. Para mudar itens/coletas/datas/frete, cancele com motivo e remonte: reservas são liberadas e aceites antigos permanecem no histórico.

Distâncias/tempos não são calculados; pedágio individual a confirmar, coberto pelo frete fechado. Condições são declarações fictícias, sem certificado sanitário. Veículos e cotações são imutáveis nesta etapa para preservar o acordado.

`npm run test:db` inclui M3. `node tests/remote-m3.mjs` usa `.env` e cria fixtures próprias somente no demo autorizado. Ofertas/demanda de teste são arquivadas após cancelamento; histórico e veículos fictícios de teste permanecem. IDs/resultados locais: `artifacts/m3-remote.local.json` (ignorado no Git). Não executar fora do demo nem tratar o teste por API como revisão visual.

## Organização do código

`src/components` contém layout e elementos compartilhados; `pages` reúne entrada e prévias; `features/offers`, `features/demands` e `features/transport` contêm os fluxos M1–M3; `hooks` coordena sessão e consultas; `services` isola Supabase e demonstração local; `domain` mantém validações e dinheiro; `pilot` preserva o estudo fornecido. Os vetores locais ficam em `public/assets`.

Tailwind está integrado pelo plugin Vite, com utilitários nas telas. O CSS original foi mantido e estendido para preservar a identidade visual. Não há dependência de fontes, imagens ou APIs de mapas externas para a avaliação local.

Documentos: [specs](Conexa-specs/README.md), [decisões](Conexa-specs/decisions.md), [validações e limites](Conexa-specs/validation.md), [uso de IA](IA.md).

## Git

Fluxo obrigatório: `feature/*` → `dev` → `main`. Nunca desenvolver diretamente na main. Commits seguem Conventional Commits. A versão de feature deve ser apresentada para avaliação; push/integração na dev depende de aprovação do usuário após a avaliação. Regras em [workflow.md](Conexa-specs/workflow.md).

A primeira versão foi publicada nas branches remotas `dev` e `main`, conforme autorização registrada em `IA.md`. A atualização documental do aceite M1 foi preparada em `feature/diagnostico-proximos-passos`; em 07/11/2026, o usuário autorizou sua integração e publicação na `dev`. Novas features devem partir da `dev` atualizada. Essa autorização não promove a atualização documental para `main`.

## Publicação

Nenhum deploy realizado. Ao hospedar o build `dist`, configurar fallback de rotas para `index.html`, pois os caminhos são de uma SPA. Rotas, credenciais e permissões remotas precisam ser verificadas no ambiente de destino.
