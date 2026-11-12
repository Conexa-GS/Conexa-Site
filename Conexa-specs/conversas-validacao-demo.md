# Conversas — preparação e roteiro T35/T38/T41

Complemento D025 executado em 11/11/2026: criação/edição pelo bot com F5, consulta pelo comprador, mensagens entre sessões e recuperação controlada foram verificadas no navegador conectado. T35/T38 encerradas tecnicamente; T41 continua parcial por rede física, e T42/avaliação M6 permanecem abertas. [Evidências atuais](validation.md). Os registros de percurso pendente abaixo descrevem o estado anterior a esse complemento.

## Roteiros adicionais da continuação D025

`node tests/remote-bot-stock.mjs --check` confere configuração offline. `node tests/remote-bot-stock.mjs --run-demo`, somente no demo autorizado e com contas ociosas, usa chave pública/Auth/RLS: cria uma oferta própria pelo bot e demanda/carga com reserva de 10 kg; verifica prévia obsoleta, redução bloqueada e snapshots; usa veículo demo compatível já existente, aceita fornecimento/cotação e simula pagamento para converter a reserva em compromisso. Confere edição/arquivamento sem mudar operação paga/histórico. Em finally, cancela somente a carga criada, arquiva oferta/demanda próprias e encerra sessões. Histórico/comandos/cotação/pagamento/estorno fictícios permanecem. Guarda contra rascunho de bot em andamento; não substituir trabalho anterior para forçar passagem. Uma interrupção pode exigir consultar IDs/estado no relatório antes de repetir. Não aplica schema, usa administrador, movimenta dinheiro ou inicia transporte real.

Resultado desta rodada: quatro grupos aprovados, relatório `artifacts/bot-stock-8b61aefc-0db5-4e6f-a1b7-8b050b753e6a.local.json`, oferta/demanda arquivadas, carga cancelada, pagamento refunded e reserva released. `.env` e relatório local não vão para o Git.

`/tests/ui/conversations-connected.html` é entrada manual exclusiva do Vite dev, restrita à URL do demo. Usa componentes/serviços reais e permite selecionar uma falha única antes de enviar ou descartar o resultado depois que o serviço retornou a persistência. Selecionar falha não envia nada; a próxima mensagem/turno/confirmação consome a seleção uma vez. Após erro, recarregar, abrir a conversa e usar Verificar envio/Verificar pedido pendente. Conferir sucesso persistido, chave única e ausência de duplicação; não repetir o texto como novo envio. As mensagens fictícias permanecem no banco. Voz está desabilitada. A bancada não é incluída na entrada do build e **não demonstra interrupção física de rede**. Esta última continua uma subtarefa aberta de T41.

11/11/2026. Preparado em `feature/conversas-validacao-demo`, criada da dev limpa `96e5f33`. **Execução remota autorizada e aprovada em nove grupos**, após apresentação do commit `76e306c`: migrations aplicadas ao demo, uma oferta própria arquivada e 82 mensagens fictícias preservadas. Relatório e versões em [validation.md](validation.md). Não encerra os critérios completos de T35/T38/T41, T42, M6 ou M5/T28. Sem OpenAI, microfone, WhatsApp ou cobrança.

## Avaliação antes da execução

A implementação já integrada contém `202611110001_site_conversations.sql` e `202611110002_site_offer_bot.sql`. A primeira cria conversas/membros/mensagens, RPC `site_chat`, RLS e publicação de mensagens no Supabase Realtime; a segunda acrescenta rascunhos/pedidos privados, `site_bot` e `save_offer`, compartilhado com o formulário. Esta preparação não altera esses arquivos.

O usuário autorizou esta rodada de migrations/testes e a publicação/integração da feature na dev. A autorização foi utilizada no **projeto demo `ppbneiusqlitvewwoact`**; não pedir novamente para concluir essa rodada nem reaplicar suas migrations. Em nova execução/ambiente, conferir escopo autorizado, projeto, histórico remoto e tabelas/RPCs; aplicar somente migrations ausentes, em ordem. Há divergências históricas de nomes/versões em `validation.md`: não usar `db push`, reset ou reaplicar SQL por comparação cega de nomes. Se houver aplicação parcial ou definição diferente, investigar antes de continuar.

Consultas de inspeção, sem escrita:

```sql
select to_regclass('public.site_conversations'),
       to_regclass('public.site_bot_requests'),
       to_regprocedure('public.site_chat(text,jsonb)'),
       to_regprocedure('public.site_bot(text,jsonb)'),
       to_regprocedure('public.save_offer(jsonb,uuid,integer,boolean)');
select tablename from pg_publication_tables
where pubname = 'supabase_realtime' and schemaname = 'public';
```

Não incluir chaves, senha, JWTs ou dados pessoais nas evidências. Os testes aceitam somente URL HTTPS exata do demo e chave pública anon/publishable; não usam credencial administrativa. Configuração offline aprovada não comprova que chave/contas/schema funcionam remotamente.

## Comandos preparados

1. `npm run test:conversations:check`: lê `.env` e confere destino/chave pública/configuração **offline**. Não autentica, abre websocket ou escreve. Pode ser executado antes da autorização remota.
2. **Somente após autorização e migrations conferidas:** `npm run test:conversations:demo`. É manual, separado de `npm test` e `npm run test:db`; não aplica schema nem ativa voz.
3. Consultar `artifacts/conversations-<run_id>.local.json`, ignorado pelo Git. Registra resultado, verificações concluídas, IDs e arquivamento. `FAIL` ou limpeza incompleta não é aceite; configuração inválida anterior ao início pode impedir a criação do relatório.

Executar com contas demo ociosas, sem outro avaliador trabalhando nelas. O teste para se o bot da Ana tiver rascunho em andamento ou a conversa Ana/comprador tiver mensagens anteriores não lidas; não descartar rascunhos/zerar leitura para forçar passagem. Cada cliente tem sessão Auth separada; a segunda sessão da Ana usa a mesma conta, sem storage compartilhado.

O teste cria **uma oferta própria**, turnos/rascunho/pedidos auditáveis e **82 mensagens humanas fictícias** na conversa Ana/comprador. Os textos incluem identificador da rodada. Mensagens, comandos e conversa permanecem no histórico; não há exclusão administrativa ou limpeza de dados anteriores. O cursor do comprador avança nas mensagens desta rodada. A oferta criada é arquivada pelo gateway em `finally`, com conferência de dono/ID/versão/status; em resposta de criação perdida, consulta o resultado auditável sem repetir uma mutação possivelmente não executada. Se interrompido, inspecionar relatório/rascunho antes de repetir: pode restar prévia própria a avaliar manualmente. Não há promessa de rollback do histórico ou limpeza após interrupção do processo/rede.

## Critérios exercitados pelo script

- Prévia sem publicação, quantidade 20,125 kg, preço 507 centavos e mínimo 400; mesma chave em duas sessões/replay retorna um resultado/oferta. Outra revisão com a mesma chave é rejeitada.
- Correção invalida revisão antiga; duas chaves para a mesma revisão produzem um vencedor. Gateway do formulário altera versão, confirmação antiga conserva campos sem aplicar; nova prévia/confirmar aplica a edição.
- Comprador lê a oferta persistida, mas não edita. Outro produtor não altera oferta e não lê bot/rascunhos/pedidos da Ana. Anônimo/transportador não acessam conversa. Rejeições precisam de código de regra/permissão esperado; falha de rede/schema não conta como bloqueio de acesso aprovado.
- Par Ana/comprador único, remetente derivado da sessão, reenvio sem duplicação e chave com outro conteúdo recusada. Mensagem humana com texto de comando não altera oferta/saldo.
- Duas assinaturas reais antes do envio: comprador recebe INSERT; João não recebe mensagens dessa conversa durante janela adicional de três segundos. Canal ausente/com falha torna o teste inconclusivo/falho. Ausência nessa janela é evidência limitada, não prova de isolamento irrestrito. SELECT/RLS conferido separadamente.
- Não lidas/leitura; nova autenticação local do comprador conserva mensagem/cursor. Recuperação por cursor de 81 mensagens adicionais em três páginas, sem duplicação; leitura não retrocede. Exercita reconciliação por API, **não uma queda de rede física ou F5**.
- Cancelar prévia não arquiva; nova prévia/confirmar arquiva preservando histórico.

O mesmo cenário passou no PGlite via `tests/conversations-acceptance-database.mjs`, incluindo uma segunda execução com perda simulada da resposta depois de criar a oferta: limpeza recupera seu ID pela auditoria e arquiva sem confirmar novamente. Ali a identidade é simulada e a conexão serializa as operações inteiras: `Promise.all` não comprova concorrência real. Valida contratos SQL do roteiro, não o adaptador HTTP/Auth/websocket remoto. Reservas/compromissos, mínimos inválidos, snapshots e escrita direta bloqueada continuam nos testes de banco existentes; este roteiro remoto não cobre todos eles.

## Percurso conectado ainda pendente

Complemento executado em 11/11/2026 (D024): sessão de Ana e 40 mensagens existentes do bot retomadas após recarga real em desktop; comprador independente retomado em 360 px; saída deste perfil persistiu após recarga, sem encerrar Ana. Teclado Enter para bot/Voltar/saída e foco do título da lista conferidos. Isso cobre retomada e consulta de histórico existente; os passos de criação/DM/rede abaixo continuam pendentes. Duas abas novas agora isolam armazenamento e canal Auth; evitar duplicar aba, pois o navegador pode copiar a sessão inicial. Não houve novo envio/confirmação nem aplicação de migration.

Depois do script autorizado, usar o site conectado, com voz desabilitada, em 360 px e desktop:

1. Como produtor, abrir Bot Conexa, preparar/corrigir/cancelar uma oferta e conferir ausência de escrita; criar outra apenas por prévia/confirmar. Registrar seu ID, recarregar com F5 e conferir histórico/resultado. Conferir a mesma oferta no comprador.
2. Usar **dois contextos de navegador com armazenamento separado** para Ana e comprador. Duas abas comuns compartilham sessão e não demonstram participantes independentes. Enviar texto fictício, conferir entrega, não lidas, leitura, F5 e ausência de duplicação.
3. Com João em outro contexto, conferir que o histórico Ana/comprador não aparece. Trocar conta enquanto consulta/envio está pendente e conferir limpeza de histórico/assinaturas. Não registrar conteúdo de outras rodadas/pessoas.
4. Por teclado, conferir abertura/lista/Voltar, campo/Enviar, prévia/confirmar/cancelar e foco em resultado/erro. Conferir ausência de rolagem horizontal em 360 px/desktop. Registrar viewport, percurso efetivamente executado e limites; bancada em memória não comprova integração remota.
5. Interromper rede antes do envio e durante uma resposta, preservando texto/chave; voltar e verificar envio antes de tentar novamente. Conferir que sucesso só aparece após resposta persistida. Registrar se chegou a gravar, sem presumir a posição da falha.

Avaliação humana, autorização para integrar/publicar na dev e teste pago T42 são decisões separadas. Voz real depende de `voz-manual.md`; M6 só encerra com seu aceite. M5/T28 e T30 mantêm seus próprios limites.
