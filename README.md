# Conexa

Estado consolidado em **12/11/2026**: consulte [implementação, verificação técnica e aceite humano](Conexa-specs/estado-atual.md). M1–M4 aceitos no escopo registrado; texto/DM e T28/M5 tecnicamente verificados no demo. T41/rede física, T42/voz real, T43/aceite M6 e aceite M5 continuam pendentes. Integração Git não comprova deploy; a feature T28 ainda depende de autorização de publicação/integração.

Do campo pra cidade. Mais juntos.

Aplicação React da Conexa, baseada no piloto visual fornecido pelo grupo. A home usa as ilustrações de referência locais, o caminhão guiado pela rolagem e a opção de movimento reduzido. Marca vetorial, creme, verde e laranja são preservados; as telas internas compartilham os novos personagens.

Revisão visual de 08/11/2026: caminhão vazio/carregado, cenas, retratos, banners e flor usam diretamente os GIFs fornecidos em `F:/animação/`. Os desenhos e movimentos vetoriais da revisão anterior foram removidos. Os 15 GIFs estão preservados byte a byte em `public/assets/animations`, com origem, quadros, duração e SHA-256 em `sources.json`; 12 versões são usadas e três variantes alternativas ficam catalogadas. A moldura SVG apenas enquadra o arquivo original, sem redesenhar sua arte. Fora da tela ou com movimento reduzido, aparece o primeiro quadro estático; a preferência manual é mantida durante a navegação. O caminhão continua seguindo a estrada pela rolagem e o percurso é ilustrativo. Validações e limites em `Conexa-specs/validation.md`; envio e integração desta revisão na dev autorizados pelo usuário em 08/11/2026.

## Executar

Preparação T30/WhatsApp: `npm run demo:whatsapp` percorre conversa, prévia, correção e confirmação em um demonstrador de terminal exclusivamente em memória. Não envia mensagens nem grava ofertas no site/Supabase. Escopo, contratos e próximos passos em [t30-whatsapp.md](Conexa-specs/t30-whatsapp.md); integração oficial continua inativa e em avaliação.

Requisitos: Node 22.12+ ou 24 e npm. Ambiente verificado: Node 24.21.0.

```powershell
npm ci
npm run dev
```

Abra o endereço local informado pelo Vite. Sem `.env`, a aplicação usa uma demonstração em memória, identificada na interface. As ofertas são compartilhadas entre perfis na mesma página aberta, mas reiniciam ao recarregar. Não há persistência de ofertas em localStorage.

Com Supabase, a sessão demo é retomada ao recarregar a mesma aba e o participante é validado no servidor. **Trocar participante** encerra a sessão atual; outra aba nova pode entrar com perfil diferente. Auth usa sessionStorage por aba; se o navegador bloquear esse armazenamento, a sessão dura apenas até recarregar. Evite duplicar abas para demonstrar identidades independentes: o navegador pode copiar a sessão inicial. Histórico/ofertas continuam no Supabase. Evidências D024 e pendências da T41 em [validation.md](Conexa-specs/validation.md).

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
| Cadastro por conversa | `/produtor/ofertas` → Cadastrar por conversa | M6 em avaliação: perguntas guiadas, correção e prévia antes da confirmação |
| Conversas internas | `/produtor/conversas`, `/comprador/conversas` | Texto/DM persistidos e verificados no demo, inclusive F5; M6 em avaliação; voz desabilitada e validação real pendente |
| Consulta do comprador | `/comprador/ofertas` | Mesma fonte de ofertas |
| Propostas do produtor | `/produtor/propostas` | Aceite/recusa persistidos, prazo e valores acordados |
| Demandas | `/comprador/demandas` | CRUD remoto, arquivo e propostas do comprador |
| Composição | `/comprador/demandas/:id/composicao` | Busca compatível, seleção e candidata; envio cria reservas atômicas |
| Solicitações e veículos | `/transportador/solicitacoes`, `/transportador/veiculos` | M3: cadastro de veículos e cotações persistidas |
| Transporte e valores | `/operacoes` | M3 persistida; T28/M5 verificada no demo por API/navegador, com aceite M5 pendente |
| Operação e valores | `/operacoes/exemplo` | Roteiro textual e resumo fictício |
| Pagamento | `/operacoes/exemplo/pagamento` | Prévia de mensagens, sem cobrar/agendar |

O acesso a cada espaço exige selecionar um participante fictício. Com Supabase e sessionStorage disponível, recarregar a mesma aba retoma o participante validado. Não representa autenticação segura de produção.

M2 e M3 usam Supabase para demandas, composição, reservas, transporte, totais e aceites. M5 foi verificada no demo em 12/11: pagamento, agendamento, viagem fictícia, divergência/resolução, recebimento e repasses, com Auth/RLS, concorrência e recarga nos três perfis. Aceite humano M5 pendente. Operação e pagamento de exemplo permanecem como prévias independentes. Sem Supabase, M2/M3/M5 explicam a falta de configuração e não simulam gravação persistida.

## Experimentar a M6 — prévia em avaliação

No perfil de produtor, abra **Minhas ofertas → Cadastrar por conversa** para ir ao **Bot Conexa** na aba Conversas. Use as opções **Consultar, Criar, Editar ou Arquivar oferta**. O cadastro pergunta alimento, quantidade em kg, preço e mínimo por kg, disponibilidade, vencimento opcional e coleta fictícia. Campos e botões orientam as respostas; texto com comandos delimitados é alternativa opcional. IA/voz é opcional, desabilitada por padrão e com validação real pendente.

A prévia permite corrigir campos; **Confirmar revisão N** aplica a alteração pelo gateway compartilhado com o formulário. Respostas preparam um rascunho auditável, sem alterar a oferta até confirmar. **Cancelar rascunho** descarta o preparo; falha preserva dados e pedido para verificação. Recarregar consulta histórico/rascunho estruturado do bot no Supabase. Sem configuração, Conversas explica a indisponibilidade; o cadastro por formulário continua disponível em memória identificada.

Para revisão isolada sem escrita remota, execute Vite e abra `/tests/ui/m6.html`. A bancada tem contadores de tentativas/gravações em memória, catálogo vazio e falha controlada. `npm test` inclui domínio e cinco testes do componente real em [jsdom](https://github.com/jsdom/jsdom), sem carregar `.env` ou escrever no demo. Verificam confirmação explícita, descarte, correção, falha/reenvio, bloqueio durante envio, catálogo vazio e foco programático. jsdom é uma dependência de desenvolvimento e não verifica layout, teclado nativo ou leitor de tela.

T29 implementada e comportamento AC22 verificado automaticamente. Teste remoto manual: `node tests/remote-offer-chat.mjs`, com credenciais demo de `.env`, restrito ao projeto autorizado. Exercita o componente em DOM simulado com `saveOffer` real, leitura pelo comprador após nova autenticação e Auth/RLS; cria uma oferta fictícia própria e a arquiva ao terminar. Relatório em `artifacts/offer-chat-remote.local.json`, ignorado pelo Git, sem credenciais. Não é executado por `npm test`. Esse teste refere-se ao componente T29 antigo, hoje restrito às bancadas. O bloqueio de navegador relatado em 10/11 é histórico: o Bot Conexa vigente teve revisão dirigida em 360 px/desktop/teclado e F5 conectado em 11/11 (D023–D025). Isso não valida o modal antigo nem encerra o aceite M6 ou a auditoria global de acessibilidade. Evidências em [validation.md](Conexa-specs/validation.md).

## Experimentar a aba Conversas — texto/DM em avaliação

Produtor e comprador têm **Conversas** na navegação. A aba apresenta Bot Conexa identificado e mensagens individuais entre os contatos demo permitidos. O bot interpreta intenções delimitadas por texto, sem API paga: consultar, criar, editar e arquivar ofertas próprias, com perguntas, correção e prévia antes da confirmação. IA/voz opcional está preparada localmente e desabilitada por padrão, com validação real pendente. Mensagens humanas não executam mudanças em ofertas ou operações. Não use informações pessoais reais: as contas são compartilhadas.

Serviços: `site_chat` da migration `202611110001_site_conversations.sql` e `site_bot`/`save_offer` da `202611110002_site_offer_bot.sql`. **As duas migrations foram aplicadas e verificadas no demo autorizado em 11/11/2026**; não reaplicá-las. Auth/RLS, concorrência e Realtime foram exercitados por API/websocket. Criação/edição pelo bot, consulta pelo comprador, mensagens entre sessões e F5 foram revistos no site conectado. Falhas controladas antes do envio/depois da resposta persistida e proteção de reservas/compromissos/snapshots foram verificadas nesta continuação; interrupção física de rede permanece pendente. Sem schema/configuração, a aba explica a indisponibilidade e não inventa histórico. O formulário usa o gateway compartilhado, com compatibilidade para instalações antigas. Contrato em [conversas-site.md](Conexa-specs/conversas-site.md) e versões/evidências em [validation.md](Conexa-specs/validation.md).

Para avaliar sem rede/escrita remota, execute Vite e abra `/tests/ui/conversations.html`. A bancada usa memória, histórico longo, bot e falha controlada, explicitamente identificados. Ela foi revista em 1366×900 e 360×800 e com teclado. `npm test` inclui testes de domínio/componente e `npm run test:db` verifica SQL/RLS em PGlite. Esses procedimentos não comprovam Supabase real, websocket, F5 conectado ou voz. Texto ainda não enviado fica em memória. Antes de enviar, texto/payload e chave são guardados em sessionStorage por aba/participante até a confirmação do resultado. Após F5, abra a conversa e use **Verificar envio** ou **Verificar pedido pendente**; não há reenvio automático. Outro perfil não recebe o journal anterior; voltar ao mesmo perfil na mesma aba permite reconciliá-lo. Storage bloqueado impede novo envio sem chave durável. Rascunhos estruturados do bot e resultados de comandos permanecem no Supabase. Evidências em [validation.md](Conexa-specs/validation.md).

Verificação manual conectada, **com escrita fictícia persistente e somente no demo autorizado**: `/tests/ui/conversations-connected.html` usa os mesmos componentes/serviços reais e permite falhar antes da chamada ou descartar uma resposta após persistir. É entrada exclusiva de desenvolvimento, fora do build de produção; falha controlada no limite do serviço não equivale a rede física desligada. Para reservas/compromissos/histórico, `node tests/remote-bot-stock.mjs --check` valida configuração offline; `--run-demo` cria oferta/demanda/carga próprias, simula pagamento, verifica proteção e cancela/arquiva ao terminar. A execução deixa mensagens, comandos e histórico auditáveis. Consulte [o roteiro](Conexa-specs/conversas-validacao-demo.md) antes de executar.

No bot, experimente `editar alface total 20 kg e preço 7,00`, depois `mínimo: 4,00` ou `fim: 25/11/2026`. Para criar, escreva `criar oferta` e responda às perguntas; selecione alimento/coleta nas opções. Datas exigem dia/mês/ano ou ISO, e vencimento aceita `não sei`. Havendo duas ofertas do alimento, escolha o identificador mostrado. `Cancelar` descarta; `sim` não autoriza salvar. Use **Confirmar revisão N**. Mudança de versão/saldo exige nova prévia; resposta perdida bloqueia correção até **Verificar pedido pendente**. O intérprete não entende linguagem arbitrária nem converte saldo livre em quantidade total.

## Conectar o Supabase de demonstração

IA/voz opcional T39/T40 preparada localmente: configuração desabilitada por padrão, broker Node 24 separado, WebRTC com respostas em texto e sugestão corrigível antes do fluxo de prévia/confirmar. Não foi implantada nem testada com microfone/provedor reais. Consulte [configuração e roteiro T42](Conexa-specs/voz-manual.md) antes de ativar manualmente; não coloque chave OpenAI em variáveis `VITE_`. A bancada de Conversas simula esses controles em memória sem áudio/API paga. Voz real e aceite da M6 continuam pendentes; migrations de texto/DM já foram aplicadas ao demo.

1. Escolher um projeto de demonstração do grupo. O projeto demo configurado recebeu M1–M3 em 07/11/2026 e M4/M5/revisões em 10/11/2026 mediante autorização; não reaplicá-las nele. O histórico remoto tem versões diferentes dos nomes locais; conferir o mapeamento em validation.md.
2. Em instalação nova, aplicar os arquivos SQL de `supabase/migrations` em ordem de nome. Em projeto existente, aplicar apenas migrations ausentes conforme histórico; M3 tem a migration principal e complementos de compatibilidade/totais.
3. Criar no Supabase Auth os quatro usuários fictícios listados em `.env.example`, com emails confirmados e uma senha pública descartável exclusiva da demonstração. Sem contas pessoais ou credenciais de produção.
4. Executar `supabase/seed.sql`. O seed associa os UUIDs reais do Auth aos participantes e publica as ofertas iniciais. Ajustar o mapeamento do seed se alterar os emails.
5. Copiar `.env.example` para `.env.local`; preencher URL, chave pública/publishable e senha fictícia de demo. Reiniciar o Vite. Variáveis `VITE_` vão para o navegador: nunca usar `service_role` ou segredo administrativo.
6. Repetir os critérios AC01–04 e AC23 no projeto remoto: reload, troca produtor/comprador, erros de rede e requisições diretas entre identidades.

Com URL e chave configuradas, a aplicação usa Supabase Auth e PostgreSQL. Uma falha remota gera erro; não retorna silenciosamente ao mock. RLS limita acesso por participante. Produto, locais, preço/mínimo, datas, precisão, papel, versão e saldo são verificados no banco. Ofertas vinculadas preservam snapshots; excluir exige ausência de vínculos, e arquivar mantém o histórico.

**M1–M4 concluídos por aceite do usuário; M5 em avaliação.** M4 foi confirmado em 09/11/2026 no escopo manual; sua migration foi aplicada em 10/11/2026, sem API externa. T25–T27 estão implementadas; T28 foi encerrada tecnicamente em 12/11, com aceite humano M5 ainda pendente. Evidências e limites em [validation.md](Conexa-specs/validation.md#t28m5--fechamento-completo-no-demo--12112026).

## Experimentar a M2

1. Entre como comprador em `/demo` e clique em **Nova demanda**. **Continuar: escolher produtores** salva a necessidade e abre automaticamente a composição.
2. Selecione quantidades que atendam exatamente a demanda. A insuficiência não reduz a necessidade automaticamente. Revise valores e prazo e clique em **Enviar proposta aos produtores** nessa mesma tela.
3. O serviço salva a candidata e a envia; o banco verifica saldo e reserva todos os itens na mesma transação do envio. Não há aprovação intermediária em Minhas propostas. Em falha, o rascunho é preservado para reenvio pelo mesmo UUID, sem duplicar proposta. Padrão 24h, configurável de 1 a 168h, limitado pela disponibilidade e data desejada. O prazo efetivo aparece em horário de São Paulo.
4. Troque para cada produtor, abra **Propostas recebidas** e aceite ou recuse. Todos aceitam: aguarda cotação, sem agendamento/pagamento. Recusa ou cancelamento pelo comprador libera toda a reserva; remonte outra proposta para ajustar valores ou itens.
5. Reservas vencidas deixam de consumir saldo imediatamente; status e histórico são atualizados na próxima chamada M2. As listas atualizam a cada 30 segundos, ao recuperar foco ou por **Atualizar**.

O cenário 30 kg Ana + 20 kg João para 50 kg deixa 5 kg de João livres quando as ofertas iniciais estão disponíveis e não comprometidas. Cadastros já vinculados não são apagados fisicamente. Demanda vinculada deve ser arquivada/substituída; cancele antes a proposta ativa. Não existe conversão implícita de caixas para kg.

Demandas, propostas e transporte abrem em **Ativas**; canceladas, expiradas e arquivadas ficam no **Histórico**. No produtor, as novas propostas para responder aparecem primeiro. **Ocultar da lista** envia o cartão para **Ocultas**, onde pode ser reexibido. Essa preferência é local por participante e por lista; não cancela proposta nem altera reserva/prazo ou dados no Supabase.

`npm run test:db` verifica M1–M5 em PostgreSQL local PGlite com identidade simulada. `node tests/remote-m2.mjs` cria fixtures próprias **somente no projeto demo autorizado**, usando `.env` sem imprimir credenciais; o relatório local em `artifacts/m2-remote.local.json` lista UUIDs para limpeza administrativa restrita a essas fixtures. A etapa `--verify-expiration` requer antecipar administrativamente o prazo da carga indicada no relatório, sem alterar operações de outras pessoas. O teste não executa limpeza administrativa automática nem substitui revisão de interface. Na entrega M2, fixtures foram removidas e as três ofertas anteriores preservadas.

## Experimentar o M3

1. Complete o aceite de fornecimento M2 nos dois produtores. Acesse **Transporte e valores** em `/operacoes`.
2. Como produtor, indique transportador fictício e preço opcionalmente. A indicação permanece pendente; não pode ser selecionada como cotação.
3. Como transportador, cadastre veículo em **Meus veículos**. Em **Solicitações**, preencha veículo, saída fictícia, conservação exigida, datas/validade, preço final e retorno opcional. Confirme cobertura de combustível, pedágios, todas as coletas, descarga e retorno acordado. A validade não ultrapassa a reserva. Capacidade insuficiente ou conservação incompatível bloqueiam a confirmação.
4. Como comprador, selecione uma cotação confirmada. Isso abre nova versão; confira alimentos, frete separado, taxa zero, total e mínimos individuais. Cada produtor, comprador e transportador selecionado confirma as condições finais pelo próprio perfil.
5. Quatro aceites levam a **Aguardando pagamento simulado**. O M3 termina aqui, sem agendamento. Com a migration M5, o comprador poderá seguir a simulação descrita abaixo. Para mudar itens/coletas, cancele com motivo e remonte. A extensão de revisão de cotação abaixo permite alterar veículo/horários e negociar frete antes do pagamento, depois da aplicação da migration correspondente; aceites anteriores ficam no histórico.

Distâncias/tempos não são calculados; pedágio individual a confirmar, coberto pelo frete fechado. Condições são declarações fictícias, sem certificado sanitário. Veículos e cotações são imutáveis nesta etapa para preservar o acordado.

`npm run test:db` inclui M3. `node tests/remote-m3.mjs` usa `.env` e cria fixtures próprias somente no demo autorizado. Ofertas/demanda de teste são arquivadas após cancelamento; histórico e veículos fictícios de teste permanecem. IDs/resultados locais: `artifacts/m3-remote.local.json` (ignorado no Git). Não executar fora do demo nem tratar o teste por API como revisão visual.

## M4 confirmado no escopo manual

Primeira fatia em `feature/m4-rotas-inclusao`, publicada na dev e aceita pelo usuário em 09/11/2026: sugestões de composição por preço de alimentos ou inclusão (menos vendas entregues na plataforma, desempate pela idade da oferta); comparação estrita de cotações do mesmo roteiro; consulta autenticada de roteiro manual completo. Interface mantém o aviso de prévia da análise. Não há cálculo externo de km/tempo/pedágios, cobrança ou aprovação automática.

Migration `supabase/migrations/202611080001_m4_analysis.sql` aplicada ao demo em 10/11/2026, com consulta remota autenticada de roteiro validada por API. Análise de histórico/inclusão segue com evidência local; revisão completa no navegador pendente. A indisponibilidade da análise não bloqueia composição/envio e cotação manual M2/M3. `npm run test:db` cobre M1–M5 em PGlite com identidade simulada.

Para avaliar componentes sem escrever no demo, inicie Vite e abra `/tests/ui/m4.html`. É uma bancada com fixtures em memória, explicitamente identificada, fora da entrada do build de produção. Não comprova integração remota. API externa depende de T21; pesquisa técnica, instruções e limitações em [M4: rotas e inclusão](Conexa-specs/m4-routes.md). Nenhuma chave de rotas deve ser colocada em variável `VITE_`.

## M5 em avaliação

Implementação originada em `feature/m5-fechamento-operacao`: `supabase/migrations/202611090001_m5_operation_closure.sql`, serviço M5 e controles em `/operacoes`. **T28 tecnicamente verificada em 12/11/2026**, com API/Auth/RLS/concorrência reais e percurso conectado dos três perfis, recarga e revisão dirigida em 360 px/desktop. **Aceite humano M5 pendente.** Correção `20261112205456_m5_zero_cent_payouts.sql`, aplicada ao demo como `20261112205536`, permite repasse simulado de zero centavos quando o alimento arredonda a zero, preservando uma parcela por beneficiário; negativos continuam proibidos (D027).

Após aplicar as migrations ausentes em ordem **no demo autorizado** e validar a configuração:

1. Termine os quatro aceites M3. Como comprador, em `/operacoes`, escolha resultado **Pendente**, **Recusado** ou **Aprovado** e registre o pagamento simulado. O total vem do banco; sem cartão, conta ou dinheiro reais.
2. Pendente/recusado não agenda; nova tentativa usa outra chave. Aprovado converte a reserva em compromisso sem descontar duas vezes e libera o agendamento fictício uma vez. Reenvio da mesma tentativa recupera o resultado, inclusive se houver estorno posterior.
3. Como transportador selecionado, inicie a viagem fictícia. Produtores acompanham a mesma carga e podem registrar ocorrência após a saída.
4. Como comprador, confirme recebimento ou registre divergência. Com ocorrência aberta, recebimento/repasses ficam bloqueados. Registre resolução escrita de cada ocorrência, depois confirme recebimento em ação separada: gera R$150/R$100/R$80 no cenário-base, apenas em simulação e uma vez por beneficiário.
5. Antes do transporte, comprador cancela com motivo: libera o estoque e estorna uma única vez eventual pagamento aprovado. Após saída, o pedido vira ocorrência, sem estorno nem liberação automática. Entregues/canceladas ficam no Histórico.

Sem a RPC M5, a consulta mantém o M3 e informa M5 em preparação; nenhum controle de pagamento é habilitado. Não substitui falha de rede por dados em memória. Páginas `/operacoes/exemplo` e `/operacoes/exemplo/pagamento` seguem independentes e ilustrativas.

`npm run test:db` cobre M1–M5 em PGlite com identidade simulada. Para revisar a interface sem escrever no demo, inicie Vite e abra `/tests/ui/m5.html`: bancada identificada com fixtures em memória, fora do build de produção. Não comprova Auth/RLS remoto ou persistência. Evidências e pendências em [validation.md](Conexa-specs/validation.md).

Roteiro remoto M5: `npm run test:m5:check` valida configuração offline. **Somente com autorização para o demo**, `npm run test:m5:demo` cria suas próprias ofertas/demandas/cargas, autentica os participantes, verifica AC18–21 e arquiva apenas seus cadastros ao terminar. Histórico, compromissos entregues e repasses fictícios permanecem. Relatórios com UUIDs em `artifacts/m5-*.local.json`, ignorados no Git. Usa apenas chave pública e contas demo de `.env`, sem credencial administrativa. `node tests/remote-m5.mjs --prepare-ui` prepara uma carga em awaiting_payment para percurso manual; `--finish-ui artifacts/m5-….local.json` confere entrega/resolução/repasses e arquiva os cadastros dessa rodada. `--recover` usa o relatório de uma rodada que falhou no caso de zero centavos para concluir essa carga após a correção. Não executar `db push`/reset ou reaplicar migrations já registradas no demo.

## Organização do código

Complemento de 12/11/2026, D026: corrigido erro de consulta do bot que permanecia após recuperação. No navegador integrado/demo, falhas controladas, offline da aba, F5/replay e reconciliação automática entre duas sessões verificados; cinco DMs e um pedido do bot únicos. Lint, 109 testes e build aprovados. Offline emulado não comprova desligamento físico ou queda do WebSocket; usuário preferiu deixar a prova física pendente. Feature `feature/t41-rede-recuperacao` ainda depende de avaliação/autorização de publicação e integração. [Evidências e chaves](Conexa-specs/validation.md#t41d026--recuperação-controlada-e-modo-offline-do-navegador--12112026).

Atualização de 11/11/2026: migrations de Conversas aplicadas ao Supabase demo com autorização; `npm run test:conversations:demo` passou em nove grupos com Auth/RLS, concorrência e websocket reais. Oferta própria arquivada; 82 mensagens fictícias e auditoria preservadas. Complemento D025 verificou F5/percurso conectado de bot/DM e quatro grupos de estoque/histórico; sete mensagens humanas adicionais preservadas uma vez cada, duas ofertas próprias arquivadas. [Resultados e limites](Conexa-specs/validation.md). Interrupção física de rede, voz real e aceite M6 continuam pendentes.

Preparação T41 de Conversas: `npm run test:conversations:check` confere `.env` **offline**, sem login ou escrita. O roteiro manual `npm run test:conversations:demo` depende de autorização para migrations/testes no demo e cria histórico fictício persistente; não está incluído nas suítes automáticas. Cenário equivalente verificado localmente em PGlite, com identidade simulada/conexão serial. Instruções, efeitos/limpeza e percurso conectado pendente em [conversas-validacao-demo.md](Conexa-specs/conversas-validacao-demo.md). Não comprova F5, concorrência/Auth/websocket remotos ou aceite M6.

`src/components` contém layout e elementos compartilhados; `pages` reúne entrada e prévias; `features/offers`, `features/demands` e `features/transport` contêm os fluxos M1–M5; `hooks` coordena sessão e consultas; `services` isola Supabase e demonstração local; `domain` mantém validações e dinheiro; `pilot` preserva o estudo fornecido. Os vetores locais ficam em `public/assets`.

Tailwind está integrado pelo plugin Vite, com utilitários nas telas. O CSS original foi mantido e estendido para preservar a identidade visual. Não há dependência de fontes, imagens ou APIs de mapas externas para a avaliação local.

Documentos: [specs](Conexa-specs/README.md), [decisões](Conexa-specs/decisions.md), [validações e limites](Conexa-specs/validation.md), [uso de IA](IA.md).

## Git

Fluxo obrigatório: `feature/*` → `dev` → `main`. Nunca desenvolver diretamente na main. Commits seguem Conventional Commits. A versão de feature deve ser apresentada para avaliação; push/integração na dev depende de aprovação do usuário após a avaliação. Regras em [workflow.md](Conexa-specs/workflow.md).

A primeira versão foi publicada nas branches remotas `dev` e `main`, conforme autorização registrada em `IA.md`. A atualização documental do aceite M1 foi preparada em `feature/diagnostico-proximos-passos`; em 07/11/2026, o usuário autorizou sua integração e publicação na `dev`. Novas features devem partir da `dev` atualizada. Essa autorização não promove a atualização documental para `main`.

## Publicação

Nenhum deploy realizado. Ao hospedar o build `dist`, configurar fallback de rotas para `index.html`, pois os caminhos são de uma SPA. Rotas, credenciais e permissões remotas precisam ser verificadas no ambiente de destino.


## Revisão de cotação e negociação — em avaliação

Percurso conectado verificado pelo Codex em 12/11/2026: revisão, recusa/manutenção, aprovação de novo frete/aceites, pagamento pausado, desistência/taxa e avisos em quatro sessões, com recarga; comprador em 360 px/desktop. Segunda transportadora não testada: banco/seletor oferecem somente Transporte Caminho, sem conta nova criada. Fixtures próprias liberadas/arquivadas; avaliação humana permanece pendente. [Evidências e limites](Conexa-specs/validation.md#cotações--percurso-conectado-recarga-e-desistência--12112026).

A feature/feedback-validacao preserva o feedback de erros e acrescenta cartão distinto após confirmar cotação, Modificar proposta para veículo/horários/validade e avisos persistidos dentro do site. O preço permanece protegido: após conversa direta, transportadora registra novo frete e o comprador aprova ou recusa. Aprovação gera revisão; cotação selecionada exige todos os aceites finais novamente. Edição/negociação não são permitidas após pagamento aprovado.

Se o comprador recusar, a transportadora pode manter o original ou desistir com taxa exclusivamente simulada. Faixas aprovadas para a demo: 5% acima de 72h, 15% com mais de 24h até 72h, 30% com até 24h, pelo menor prazo até entrega/vencimento informado. Vencimento é opcional na oferta e separado da disponibilidade; ausência usa entrega com aviso. Metade da taxa fica para o comprador e metade para produtores, proporcional aos alimentos. A desistência preserva reservas e reabre a proposta, notificando outra transportadora com veículo compatível. Sem alternativa, informa pendência, sem inventar cotação ou aceite.

Migrations M4, M5 e revisões aplicadas ao demo autorizado em 10/11/2026. Testes remotos por API com sessões reais validaram revisões, negociação, avisos/RLS, nova autenticação e concorrência. Sem essa migration em outros ambientes, edição/negociação ficam indisponíveis com aviso; o CRUD antigo sem vencimento é preservado. Para demonstrar reenvio, precisa existir outra transportadora demo com veículo compatível; o demo atual tem apenas uma. Notificações são consultadas a cada 30s e ao voltar à janela; não enviam mensagem externa. Nenhuma cobrança real.

Teste local: npm run test:db inclui revisões/negociação/taxas/encaminhamento/RLS em PGlite, com identidade simulada. A bancada /tests/ui/quote-revisions.html mostra componentes reais com respostas controladas, sem escrita remota. Teste remoto manual: `node tests/remote-quote-revisions.mjs`, somente no demo autorizado; cria fixtures próprias e ao terminar cancela cargas e arquiva suas ofertas/demandas. Histórico, avisos, taxas simuladas e veículos de teste permanecem; IDs/resultados em `artifacts/quote-revisions-remote.local.json`, ignorado no Git. Credenciais são lidas de `.env` sem impressão.

Recarga/percurso visual conectado não executados: a ferramenta bloqueou o navegador Windows por ausência de suporte à política de URLs. Nova autenticação via API não substitui essa revisão. Encaminhamento sem substituta passou; caminho conectado com outra transportadora e avaliação humana seguem pendentes. Publicação/integração das novas alterações de teste/documentação na dev autorizadas pelo usuário em 10/11/2026, conforme interação 032 de IA.md. Evidências e mapeamento dos nomes/versões remotas em [validation.md](Conexa-specs/validation.md); não reaplicar SQL já executado nem usar `db push` automaticamente com o histórico divergente deste demo.
