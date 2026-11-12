# Registro de decisões

Leitura vigente em 12/11/2026: [estado-atual.md](estado-atual.md) consolida execução e autorizações posteriores. As decisões datadas preservam o contexto original: D009/T20/M3 receberam aceite explícito; D022–D025 foram integradas conforme IA.md e Git. D021 substitui o token efêmero proposto; D023 substitui a entrada pelo modal; D025 substitui pedidos incertos apenas em memória. Publicação Git não encerra M5/M6. Esta revisão organiza evidências, sem criar decisão de produto ou novo aceite.

## D001 — Direção do produto — consolidada em 06/11/2026

Site como produto central, React/Vite/Tailwind, Supabase, três perfis, WhatsApp posterior. Origem: decisões da conversa; Vite escolhido no planejamento técnico.

## D002 — Financeiro — consolidada em 06/11/2026

Frete do comprador, taxa zero e mínimo líquido individual obrigatório. Pagamentos e repasses simulados. Substitui a proposta antiga de dividir frete entre produtores.

## D003 — Transporte e inclusão — consolidada em 06/11/2026

Empresas e autônomos, indicação pelo produtor, cotação confirmada pelo transportador. Proximidade orienta logística sem exclusão automática dos mais distantes. Preferência inclusiva condicionada a viabilidade de todos.

## D004 — Propostas para tornar a implementação verificável — 06/11/2026

RLS com sessões demo, reserva inicial configurável de 24h, heurística de inclusão, precisão monetária e exclusão/arquivamento detalhados neste pacote são propostas técnicas explícitas. Implementador deve registrar resolução antes do marco correspondente. Não são funcionalidades já construídas nem decisões validadas em campo.

## D005 — Nome e escopo desta versão — aceita em 07/11/2026

O nome atual é **Conexa**, substituindo CAMPOCIDADE na aplicação. Origem: pedido explícito do usuário. O piloto em `F:\GS 2\conexa-design\conexa` é a referência visual. Além da fatia de ofertas M1, o usuário solicitou uma primeira versão das demais páginas; elas são prévias navegáveis identificadas, sem antecipar reservas, transações ou conclusão dos marcos M2–M5. Esta solicitação prevalece sobre a orientação anterior do handoff de não criar telas posteriores no M1.

## D006 — Linguagem, estilo e sessão demo — aceita em 07/11/2026

JavaScript/JSX sobre o checkout React/Vite existente. Tailwind via plugin Vite e utilitários; CSS e vetores do piloto preservados para fidelidade visual. Domínio/serviços separados da apresentação. Supabase Auth com quatro contas fictícias pré-criadas e RLS; senha pública descartável limitada ao ambiente acadêmico. Sem configuração, demonstração em memória explicitamente identificada, reiniciada no reload, sem alegar persistência. Migration/seed preparados; aplicação remota depende de projeto escolhido pelo grupo.

## D007 — Git e registro de IA — aceita em 07/11/2026

Fluxo obrigatório `feature/*` → `dev` → `main`, Conventional Commits, nunca desenvolver diretamente na main. Após a alteração, apresentar para avaliação e pedir aprovação antes de subir/integrar na dev. Registrar prompts e análise em `IA.md`. Regras completas em `workflow.md` e `AGENTS.md`. Origem: pedido explícito do usuário nesta interação.

## D008 — Implementação da M2 e prazo de reserva — aceita em 07/11/2026

Origem: respostas explícitas do usuário nesta conversa: “M2 completa (T13–T16)”, “Sim, usar 24 horas” e “Autorizar migration e testes no projeto demo”. Autorização restrita ao projeto demo configurado; não autoriza push, merge ou deploy.

M2 deixa de ser prévia; demandas, composição e reservas passam a usar Supabase. M3+ continua ilustrativo. Substitui essa parte de D005 para as telas da M2. Modo sem configuração mantém ofertas em memória, mas M2 exibe erro explicando a necessidade de Supabase, sem persistência simulada silenciosa.

Reserva padrão 24h, configurável de 1 a 168 horas por composição; prazo efetivo é o menor entre esse intervalo, fim da disponibilidade de todas as ofertas e fim da data desejada (America/Sao_Paulo). A faixa de configuração é escolha técnica do protótipo. O prazo começa ao enviar, não ao salvar candidata. Expiração é processada sob demanda nas chamadas M2; cálculo de saldo ignora reservas vencidas imediatamente, mesmo sem cron. Respostas tardias são rejeitadas no banco.

Uma proposta ativa por demanda. Rascunhos já vinculam histórico e guardam snapshots; alterações posteriores exigem cancelamento/remontagem. Demanda vinculada não é editada; deve ser arquivada e substituída, após cancelar proposta ativa. Oferta vinculada pode mudar preço e quantidade livre sem mudar valores acordados; alimento/produtor/coleta ficam protegidos. Exclusão física só sem vínculo; arquivo preserva snapshots.

Funções privilegiadas no schema privado, gateway público `security invoker`, permissões explícitas e identidade derivada de `auth.uid()`. Sem escrita REST direta em cargas/reservas/aceites. Operações M2 serializadas com advisory lock transacional para simplificar concorrência no pequeno ambiente demo; ofertas bloqueadas em ordem de UUID para proteger saldo contra edição simultânea. Essa serialização global não é proposta de arquitetura para escala de produção.

Arquivos: migrations M2, `features/demands`, `services/m2.js`, `domain/demands.js`, hooks, integração de ofertas e testes. Verificação remota real executada pelo Codex, incluindo concorrência; revisão visual bloqueada e aceite humano pendente, conforme `validation.md`.

## D009 — Transporte manual e confirmações M3 — implementada, avaliação humana pendente — 07/11/2026

Origem: “vamos seguir para o m3, siga o padrão de branch e commits, pergunte o que não ficou claro”. Autorização complementar explícita: “Sim, autorizar migration e testes do M3 no demo”. Restrita ao mesmo projeto demo; não autoriza push/merge/deploy. Substitui D005/D008 quanto à condição de prévia do M3. M4+ continua ilustrativo.

Cotação manual completa, sem API de rotas (M4). Saída + coletas em ordem estável de UUID dos itens + destino + retorno opcional compõem roteiro próprio; sem distância, tempo de direção, paradas ou pedágio individuais inventados. Frete final fechado deve incluir combustível, pedágios, coletas, descarga e retorno acordado. Essa restrição resolve serviços obrigatórios extras consolidando-os no valor antes da aprovação, sem dupla soma. O pedágio individual continua “a confirmar”, com cobertura pelo preço fechado.

Produtor indica somente o transportador fictício cadastrado; preço sugerido não confirma cotação. O transportador indicado vincula a indicação ao publicar uma cotação completa; somente ele pode fazê-lo. Veículos/cotações são imutáveis nesta fatia; cadastro de outro veículo para novas condições e cancelamento/remontagem para mudar roteiro/preço/datas. Não há edição silenciosa de coletas; AC14 coberto por rejeição de alterações fora do estado e cancelamento/remontagem com histórico preservado.

Conservação declarada explicitamente pelo transportador (`ambient`/`refrigerated`) e ratificada pelos demais participantes na versão final; não é parecer sanitário. Todos os itens precisam estar em kg, capacidade suficiente e condição coincidente. A validade não ultrapassa a reserva. Cotação selecionada gera snapshot e incrementa versão: comprador, todos os produtores e transportador precisam de novos aceites. Só então `awaiting_payment`, sem agendamento ou pagamento M5. Banco calcula e persiste subtotal/frete/taxa zero/total; mínimos são validados por item, sem descontos no MVP. Expiração/cancelamento mantêm o mecanismo de liberação M2.

Arquivos: migrations M3, `features/transport`, domínio/serviço/hook, integração de rotas internas e testes. Testes locais e remotos executados; revisão visual bloqueada pelo suporte de navegador da ferramenta. T20 e autorização de integração pendentes.

## D010 — Envio direto e organização das listas — implementada, avaliação pendente — 07/11/2026

Origem: avaliação do usuário sobre o caminho demanda → proposta → envio e a poluição de registros cancelados/arquivados. Ajuste da feature M3 ainda não integrada, sem criar outra feature a partir de trabalho pendente. Cadastro de demanda abre automaticamente a composição; envio passa a ocorrer nessa tela, usando as ações `draft` e `submit` existentes. Minhas propostas acompanha respostas; não exige aprovação intermediária. Duas ações continuam separadas no banco, mas falha preserva a candidata para reenvio com mesmo UUID; perda de resposta após envio é conferida por consulta. Não foi criada migration nem alterada regra de estoque/aceite.

Listas de demandas, propostas e transporte mostram Ativas por padrão, com Histórico e Ocultas acessíveis por filtros e contagens. Produtor separa novas propostas sem resposta das em andamento. Ocultar é preferência reversível de visualização no navegador, isolada por participante e lista; não é arquivamento/cancelamento no banco. Ocultas mantém aviso de prazos/reservas ativos. Só UUIDs de preferências ficam em localStorage; cadastros continuam no Supabase. Indisponibilidade de storage limita preferência à sessão. Avaliação visual em 360 px/desktop e teclado ainda pendente pelo bloqueio de navegador já registrado.

## D011 — Início local da M4 com roteiro manual e inclusão explicável — 08/11/2026

Origem: “comece a implementar a M4 seguindo as regras do projeto”. Implementada uma primeira fatia na feature criada da dev, preservando M1–M3. M4 continua em avaliação, com rótulo de prévia. Sem autorização nova de envio/integração, migration remota ou cobrança.

Google Routes segue candidato; pesquisa oficial e pendências em `m4-routes.md`. Não habilitar estimativa externa com endereços fictícios sem coordenadas, perfil/cobertura validado, termos, credencial de servidor e orçamento/quota autorizados. Roteiro manual é consultado no PostgreSQL com dono, papel e versão validados; dados geográficos desconhecidos permanecem nulos. Não criar infraestrutura externa vazia nem presumir rota real para nomes fictícios.

Inclusão usa somente cargas distintas entregues por produtor na plataforma e idade da oferta. Duas heurísticas locais com saldo real e centavos; sem índice arbitrário nem promessa de ótimo global. Antes de M5, zero vendas concluídas é histórico vazio legítimo. Custo dos alimentos pode ser comparado, mas frete/viabilidade de cada composição continuam pendentes. Cotações da mesma carga só entram no mesmo grupo quando roteiro/horários/conservação/serviços coincidem. Não ampliar para duas propostas ativas por demanda nem reaproveitar cotação de outra composição. Comparação final entre composições cotadas permanece pendente.

Arquivos: migration M4, serviço, domínio, componentes em demandas/transporte, testes e bancada visual isolada. PGlite e fixtures de UI não substituem Supabase demo nem aceite humano; resultados em `validation.md`. Nenhum pagamento, transporte físico ou avanço de M5.

## D012 — Fechamento simulado da M5 — implementação local em avaliação — 09/11/2026

Origem: “seguindo o padrão de commits e branchs, anotando as mudanças concluídas no tasks.md, comece a implementar a M5. pergunte o que não ficar claro”. Branch `feature/m5-fechamento-operacao` criada a partir da dev limpa. Pergunta sobre resolução de divergência respondida explicitamente: “Sim, o comprador resolve e confirma”. A resolução escrita fica a cargo do comprador, seguida de confirmação separada do recebimento, sem liberar repasses no simples registro da resolução.

M5 usa o mesmo gateway privado/invoker, advisory lock M2/M3 e bloqueio de ofertas ordenado no pagamento. Tentativas têm resultado imutável e status próprio; aprovado pode virar estornado. Mesmo UUID e payload compatível recuperam a tentativa, inclusive após cancelamento; chave reutilizada com outro resultado/carga é rejeitada. Pendente/recusado permite uma nova tentativa com outra chave, sem atualização silenciosa nem callback externo. Só uma aprovação por carga em toda a sua história. Cancelada/expirada pode ser remontada; entregue continua atendendo a demanda, evitando compra duplicada para a mesma necessidade. Estoque comprometido permanece após vencimento do prazo original e recebimento.

Cancelamento pré-transporte e estorno são atômicos; após início, pedido abre ocorrência e bloqueia recebimento/repasses até resolução, sem liberar estoque. Participantes envolvidos podem reportar ocorrência; comprador registra resolução de todas e confirma recebimento. Repasse único por carga/beneficiário/tipo usa snapshots e frete aprovado, taxa zero e sem desconto; não há ação autônoma de repasse antecipado. Eventos reutilizam `load_events`. Tudo é demonstração com dados fictícios, sem cartão/conta, dinheiro ou transporte reais.

Interface em `/operacoes`, preservando marca/paleta e prévias de exemplo independentes. RPC indisponível retorna consulta M3 com aviso, sem habilitar M5; erros de rede preservam dados já carregados. Bancada isolada e PGlite permitem revisão local sem escrever no Supabase. T25–T27 implementadas localmente, T28 e aceite do marco pendentes. A resposta sobre resolução não autoriza migration remota, push, merge, main ou deploy. Arquivos/validações em tasks.md e validation.md.

## D013 — Feedback visível para falhas de ações — implementada, avaliação pendente — 09/11/2026

Origem: usuário relata que só percebe o erro da cotação ao subir toda a página e solicita feedback mais nítido, seguindo branches/commits e verificando atualização da versão. Criada `feature/feedback-validacao` a partir da dev limpa e sincronizada com origin/dev em `25cdca9` após fetch.

O aviso compartilhado ganha ícone, título, texto maior e contorno ao receber foco. Somente falhas de ações usam foco e rolagem automática; erros de consultas/recargas mantêm o foco atual. No transporte, o erro pertence à proposta que originou a ação e a falha da cotação aparece imediatamente antes de seu botão. Se a proposta expirar/sair da lista ativa após recarga, o aviso continua disponível acima da lista com foco e orientação para o Histórico.

Antes de enviar cotação, a interface verifica saída futura, validade futura limitada à reserva, entrega após saída e data desejada em São Paulo, reproduzindo as restrições M3 existentes. Os campos inválidos têm mensagem associada, indicação visual e foco no primeiro campo; erro remoto preserva os dados. Banco e RPCs continuam como autoridade; sem migration ou mudança de regra de negócio. Arquivos e verificação em tasks.md/validation.md. Sem push/merge/deploy nesta entrega; autorização correspondente será solicitada após apresentação.

## D014 — Cotação distinta, revisão e negociação com desistência simulada — implementação local em avaliação — 09–10/11/2026

Origem: usuário aprovou o feedback apresentado com “otimo” e solicitou design diferente após confirmar cotação, edição de datas/veículo, avisos a comprador/produtores e frete bloqueado salvo negociação direta com o pagador. Na pergunta sobre preço, determinou aprovação do comprador; recusa seguida de desistência da transportadora deve gerar taxa e envio a outra transportadora. Pediu taxa maior perto da entrega/vencimento e aprovou faixas propostas de 5%/15%/30%, vencimento opcional com fallback explícito pela entrega e destinação a comprador e produtores (“pode, ambos”). Isso aprova essas regras de produto, sem autorizar publicação, integração ou migration remota.

O comprador paga frete no MVP. Cotação confirmada ganha cartão verde com ícone, revisão e valor protegido; formulário inicial é substituído por Modificar proposta. Edição altera veículo/horários/validade, preserva frete e dados de roteiro/serviços; data desejada e reserva permanecem limitantes. Revisões preservam snapshots anteriores, notificam envolvidos no site e, quando selecionadas, incrementam versão da carga e exigem todos os aceites finais. Edição/negociação são anteriores ao pagamento aprovado.

Negociação separada exige registro de contato direto, novo valor/motivo e decisão explícita do comprador. Preço não muda durante pendência ou recusa; seleção, confirmação e pagamento da cotação ficam bloqueados no banco. Transportadora pode manter o original sem taxa. Após recusa, desistência exige prévia e aceite da taxa simulada; aprovação de preço cria revisão com novos avisos/aceites. Mudanças de versão/encerramento fecham negociações obsoletas sem penalidade automática.

Taxa: 5% acima de 72h, 15% com mais de 24h até 72h, 30% até 24h, pelo menor prazo até entrega/fim do vencimento informado em São Paulo. Vencimento não é deduzido da disponibilidade; campo opcional na oferta é copiado ao snapshot, sem backfill inventado. Ausência usa entrega no item com aviso. Usuário escolheu ambos os beneficiários; divisão operacional adotada e comunicada: metade comprador/metade produtores, proporcional ao valor dos alimentos, preservando todos os centavos. Regras de arredondamento/caso zero em RN48.

Desistência reabre a proposta, preserva reservas/fornecimentos, invalida aceites finais e notifica automaticamente outra transportadora demo com veículo compatível, por nome/UUID. Não presume oferta, preço ou aceite da substituta. Sem candidata, fica pendente de transporte. Taxa não debita dinheiro nem altera preço dos alimentos/frete futuro. Outra transportadora não recebe dados da negociação/parcelas da desistente. Avisos individuais são persistidos, com leitura e consulta a cada 30s/foco; sem mensagens externas.

Mantida feature/feedback-validacao, criada da dev e ainda não integrada, preservando 1037ff4. RN02/RN36/RN47–49, contratos, modelo, fluxos, tasks e evidências foram atualizados. Migration e bancada locais, sem aplicação remota/deploy. Validação em validation.md; revisão humana, execução conectada e autorização de envio/integração pendentes.

## D015 — M6 por conversa guiada e confirmação explícita — implementada localmente, avaliação pendente — 10/11/2026

Origem: pedido integral do usuário: “comece a implementar a M6, seguindo o padrão de branch e commits, atualizando a tasks.md e pergunte se algo não ficou claro”. Checkout limpo na dev `6741d8c`, fetch confirmou dev/origin/dev iguais; criada `feature/m6-chat-acessivel` antes de editar. Escopo de RF11/RN45/AC22 suficiente para iniciar sem pergunta bloqueante.

Primeira fatia é um chat demonstrativo guiado opcional no produtor, sem modelo de IA, reconhecimento de áudio ou WhatsApp. Oito respostas explícitas alimentam rascunho em memória; produto/coleta usam catálogo do perfil e não há inferência de datas, unidade ou vencimento. Prévia corrigível e confirmação separada precedem a única chamada de escrita. Mesmos `validateOffer`, hook e serviço do formulário; sem nova infraestrutura, migration ou mudança no banco. Conversa não é persistida. Resposta inválida/falha preserva dados, fechar descarta rascunho e envio em andamento bloqueia repetição no diálogo.

O formato guiado é decisão de implementação comunicada ao usuário, não aprovação humana de escopo adicional. Não atende frases livres/áudio; WhatsApp/T30 depende de pedido separado. M5/T28 não é reaberto nem declarado concluído. Limites: teclado/visual/AC22 completo e persistência pelo chat no demo pendentes, navegador bloqueado pela política da ferramenta; sem testes remotos nesta rodada. CRUD herdado não é idempotente após resposta perdida; interface orienta conferir lista antes de reenvio. Publicação/integração na dev aguardam autorização após apresentação, sem promoção para main. Arquivos/validações em tasks.md e validation.md.

Complemento D015 — 10/11/2026: pedido “implemente a T29, seguindo o padrão de branch e commits, perguntando o que não estiver nitido”. Mantido o escopo guiado já implementado; criada `feature/t29-chat-validacao` da dev `11f295f`. Nenhuma decisão de negócio adicional exigiu esclarecimento. Para verificar eventos reais do componente sem contornar o bloqueio de navegador, adicionados testes em jsdom (dependência de desenvolvimento), com simulações explícitas das APIs de diálogo/rolagem. Isso não comprova layout, foco preso pelo diálogo nativo, Tab/Escape físicos ou leitor de tela. Corrigidos foco de catálogo indisponível e estado desabilitado do botão Fechar durante envio. Teste manual combina componente em DOM simulado com o serviço existente no Supabase demo, nova autenticação e RLS, arquivando dados próprios. T29 tem implementação e verificação automatizada de AC22; AC23 visual/F5 e aceite da M6 seguem pendentes. Evidências em `validation.md`; sem nova autorização de push/integração ou main.

## D016 — T30 por texto: especificação e base local isoladas — em avaliação — 10/11/2026

Origem: “vamos seguir com o resto então”, após proposta de preparar especificação e estrutura local enquanto a criação do portfólio Meta está bloqueada. Mantida `feature/t30-preparacao`, já criada da dev local `af7174f`; preservados ajustes anteriores autorizados de AGENTS.md/workflow.md para registrar somente prompts de programação. Sem perguntas/consultas no IA.md.

Primeira fatia proposta reaproveita perguntas/validações da T29, com protocolo por texto, escolhas numeradas, prévia versionada e confirmação exata. Domínio em `server/whatsapp/conversation.js` emite intenção de publicação separada do resultado; resultado incerto bloqueia edição/cancelamento até reconciliação. Handler `server/whatsapp/webhook.js` valida challenge/assinatura/receptor/corpo e só reconhece lote após o adaptador confirmar recebimento. Nenhum adaptador persistente padrão, Edge Function, migração ou cliente de envio. Demonstrador de terminal estritamente em memória para tornar o fluxo avaliável sem Meta.

Contratos de identidade, gateway privado, inbox/sessão/publicação/outbox, autorização, concorrência e ativação estão em `t30-whatsapp.md`. Banco e envio externo são próxima fatia, não promessas de idempotência/durabilidade já verificadas. Sem IA externa, áudio, contatos reais ou mudança nas regras de dinheiro/estoque. Testes/lint/build e limites em validation.md; T30/M6 seguem em avaliação e M5/T28 preservadas. Publicação/integração dependem da autorização do usuário após avaliação.

## D018 — Conversas no site como prioridade; voz opcional testada pelo usuário — direção solicitada, implementação planejada — 11/11/2026

Origem: usuário pede atualizar as tarefas após os testes com integrações WhatsApp: aba semelhante a mensageiro nas contas produtor/comprador, bot que atualiza ofertas e conversas para acordos/parcerias; sugere “api de gpt live” para demonstração e reserva para si os testes de voz por ser API paga.

Priorizar T34–T43 e pausar T30, sem declarar conclusão ou apagar experimentos. D015/T29 permanece base; D016 e a evolução Twilio na feature separada deixam de ser caminho prioritário. ID D017 reservado ao registro Twilio já existente nessa feature não integrada. Não incorporar código/histórico da feature Twilio nem alterar o endpoint demo nesta atualização.

Aba Conversas terá bot e mensagens individuais entre produtores e compradores. Atualização automática prepara campos por conversa e aplica após prévia/confirmar, preservando RN45. Bot produtor gerencia apenas ofertas próprias; comprador consulta e conversa. Conversas humanas não executam acordos/estoque/pagamento nem ampliam o bot para demandas ou transporte. Vendedor usa o papel produtor existente.

Texto simulado sem custo é padrão. OpenAI Realtime é opção técnica proposta para interpretação/voz demo, com credencial efêmera via servidor autenticado, ferramentas restritas e limites. Documentação oficial consultada, sem teste da API. Agente prepara implementação/testes simulados; usuário executa voz paga. Modelo, orçamento e ativação permanecem configurações a validar na implementação, sem gasto autorizado para o agente.

Arquivos afetados: tasks.md, conversas-site.md, spec.md, business-rules.md (RN45), acceptance.md (AC24–32), plan.md, README do pacote, t30-whatsapp.md e IA.md. Branch `feature/planejamento-conversas-site` criada da dev `3197eaf`, preservando a feature Twilio. Entrega apenas documental, sem código/migration/deploy, teste humano inventado ou encerramento de M5/T28/M6. Publicação/integração depende de autorização após avaliação conforme workflow.md.

## D019 — Primeira fatia de Conversas: interface e mensagens; bot livre posterior — implementada localmente, em avaliação — 11/11/2026

Origem: pedido “comece as novas implementações atualizadas na tasks.md. siga as regras do projeto e pergunte caso tenha duvidas”. Criada `feature/conversas-base` da dev limpa `c72392e`, sem fetch/alterações remotas. Escopo inicial T35+T34 seguido de T36/T37, conforme execução incremental do pacote; nenhuma nova regra de negócio exigiu pergunta bloqueante.

T34 implementada com rotas/navegação produtor/comprador, lista e conversa responsivas, Bot Conexa fixo identificado, horários, histórico paginado, envio/erro e orientação de formalização. Nesta fatia, bot encaminha para cadastro guiado T29/consulta; não interpreta texto livre nem persiste respostas fictícias. T36/T37 implementarão rascunhos, comandos e escrita de ofertas. Mínimos/estoque/snapshots/serviços anteriores permanecem sob suas regras existentes.

Base T35/T38: novas tabelas `site_conversations`, `site_conversation_members`, `site_messages` e RPC `site_chat`; tabela de mensagens na publicação Realtime se disponível. Identidade deriva de Auth; leitura só por membros; escrita direta revogada. Par direto único, bot por dono, cursor monotônico, ordem de servidor e chave por remetente vinculada ao conteúdo. Serialização por chave/conversa antes de alocar sequência; testes concorrentes reais pendentes. Cursores anterior/posterior paginam 40 mensagens e permitem reconciliação sem lacuna após longas desconexões. Assinaturas/timers/listeners são limpos ao sair; rascunhos humanos em memória são privados à conta/conversa, sem promessa de durabilidade após reload.

Aba depende do novo schema; ausência mostra impedimento. Bancada explícita em memória permite avaliar sem tocar no demo. Testes SSR recebem caches Vite temporários isolados, pois o cache compartilhado com dev estava deixando o navegador sem renderizar durante as suítes; após isolar e reiniciar dev, revisão visual ficou disponível. Evidências locais/limites em `validation.md`, contratos em `conversas-site.md`. Sem OpenAI, microfone, WhatsApp, Supabase remoto, autorização de publicação presumida ou aceite dos marcos. T35/T38/T41 continuam parciais; T30 pausada, M5/T28 e avaliação M6 preservadas.

## D020 — Bot por texto e escrita de ofertas compartilhada — implementação local em avaliação — 11/11/2026

Origem: continuação do pedido de iniciar as implementações atualizadas de tasks.md, respeitando o fluxo incremental D018/D019. Branch `feature/conversas-bot-ofertas` criada da dev limpa `b1867a5`. Sem subagentes ou ações remotas. T36/T37 recebem conclusão de implementação/verificação local, sem encerrar os critérios remotos de T35/T38/T41, M6 ou M5/T28.

Interpretação determinística por intenções delimitadas e perguntas T29. Datas relativas exigem data exata; quantidade tem semântica explícita de total incluindo reservas/compromissos. Alvos ambíguos exigem seleção. Texto livre não é compreensão geral por IA; consultas do comprador não autorizam edição. Botão confirma revisão, `sim` não executa. Cancelamento não altera catálogo; respostas incertas bloqueiam novos pedidos até reconciliar a mesma chave.

Nova migration guarda rascunho/revisões, snapshot/versão/saldo e pedidos com conteúdo/resultado imutáveis por chave e dono. RPC deriva identidade, restringe bot ao dono, serializa chave/conversa e revalida oferta sob lock. Mutação e resultado são atômicos; conflito/falha preserva campos com estado conflict, exigindo nova prévia. Formulário e bot compartilham a função privada `write_offer`, mantendo triggers de estoque/vínculos e regras de centavos/datas. Serviço do formulário preserva CRUD anterior somente quando a nova RPC não existe, para não bloquear a demo ainda sem migration; bot não escreve por esse fallback.

Sem mudança nas regras de negócio ou API paga. Evidências locais em validation.md e contrato em conversas-site.md. PGlite não comprova corrida entre sessões reais nem Auth/websocket/F5 remoto. Revisão visual restrita à bancada em memória; voz T39/T40 não iniciada, T42 continua do usuário e T43/integração dependem de avaliação/autorização. Migrations somente preparadas/testadas localmente, sem aplicar no demo.

## D021 — IA/voz opcional com controle no servidor — 11/11/2026

Status: implementada/verificada **localmente para avaliação**, sem aceite, implantação, sessão paga ou teste de áudio real. Origem: pedido de continuar as implementações da tasks.md, preservando a restrição de testes pagos exclusivos do usuário (D018).

A proposta inicial de T39 emitia credencial efêmera ao navegador. A documentação oficial informa que configurações associadas ao token podem ser sobrescritas pelo cliente; expiração do token não comprova duração da chamada. Substituída essa proposta técnica por WebRTC unificado: servidor autentica o demo/bot, reserva cota durável e cria chamada; navegador recebe apenas SDP e ID local. Chave permanente fica no servidor; sideband acompanha respostas/configuração/perda de controle e servidor solicita hangup. Nenhuma mudança na confirmação de ofertas ou autorização para uso pago.

Broker Node 24 local com SQLite, lock de instância única e limites obrigatórios de duração, tentativas por participante/dia de São Paulo, respostas e tokens de saída por resposta. Reserva conta mesmo em falha; resultado incerto bloqueia novas chamadas e exige conciliação, sem repetição paga automática. Recuperação encerra leases conhecidos; não libera automaticamente criação sem ID. Os limites são operacionais, não garantia de valor exato cobrado. Queda do processo ainda exige recuperação/supervisão e impede tratar este broker como infraestrutura pública pronta.

A única ferramenta sugere comando em texto. Transcrição/sugestão podem ser corrigidas e transferidas ao campo simulado, encerrando sessão sem envio/escrita. Intérprete T36, prévia/revisão e confirmação atômica T37 permanecem obrigatórios. Modelo não recebe DM, catálogo completo, localização, SQL, token Auth ou autoridade de confirmar; papel comprador continua consulta. Resposta da IA é texto nesta fatia, sem fala sintetizada.

Arquivos: `server/voice*.mjs`, `server/openai-voice.mjs`, `VoicePanel.jsx`, serviços/contrato de voz, testes e [voz-manual.md](voz-manual.md). Flags desabilitadas por padrão; sem migrations novas. `ws` 8.22.2, já instalado transitivamente por jsdom, passa a dependência explícita do servidor; lock sincronizado offline. Evidências locais em validation.md. T35/T38/T41 remotos, T42, T43 e aceites M6/M5 continuam pendentes. Não há autorização implícita de publicação/integração nem de migrations demo.

Fontes oficiais consultadas em 11/11/2026: [credenciais efêmeras](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create), [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc), [sideband](https://developers.openai.com/api/docs/guides/voice-server-controls?api=realtime&voice-api=realtime), [hangup](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/hangup). Consulta não comprova acesso, custo ou funcionamento real do provedor no demo.

## D022 — Opções visíveis e valores guiados no Bot Conexa — 11/11/2026

Origem: usuário relatou que só descobriu as palavras-chave após receber erro e pediu opções no lugar de depender de comandos digitados. Implementação local em `feature/bot-opcoes-guiadas`, criada da dev `727930c`; avaliação/integração pendentes.

Menu inicial do produtor: consultar, criar, editar e arquivar ofertas. Comprador recebe consulta. Durante preparo, cancelar fica visível; edição/arquivamento primeiro pedem selecionar oferta, e edição oferece campos para escolher. Criação e correção usam `answerOfferChat`/mesmo catálogo/validações, com valores numéricos e datas em campos rotulados; alimento/coleta e vencimento desconhecido têm opções. Texto livre com exemplos permanece em seção opcional; sugestão de voz abre essa seção antes de focar o texto.

Não há inferência de valores/datas, confirmação por “sim” ou mudança de permissões. Escolher opção prepara `turn` auditável; somente a confirmação da revisão chama `confirm`. Correção ainda não enviada oculta confirmar; resultado incerto bloqueia ações até verificar o mesmo pedido. Campos/prévia de edição só aparecem após escolher alvo. Sem alteração de SQL/serviços remotos, API paga ou ampliação de aceite M6/M5. Arquivos: `BotThread.jsx`, `conversations.css`, três novos testes de componente e documentação. Bancada em memória e DOM não equivalem a novo percurso conectado no demo.

## D023 — Cadastro por conversa aponta ao Bot Conexa — 11/11/2026

Origem: usuário pediu que “Cadastrar por conversa” encaminhasse ao bot, sem janela separada. Complemento de D022 na mesma feature derivada da dev; avaliação/integração pendentes. `OffersPage` usa link interno para `/produtor/conversas?conversa=bot`; App transmite seleção inicial ao carregar Conversas. Seleção aguarda a caixa, destaca o bot e abre a mesma interface em celular/desktop. Não dispara `turn` ou confirmação, não substitui rascunho nem muda o acesso normal à lista/Voltar. Removida somente a entrada do antigo modal em ofertas; componente/testes históricos preservados. Sem mudança de banco/permissões ou API paga. Teste do App completo detectou chave React duplicada entre notificações e página, corrigida com prefixo próprio nas notificações. Arquivos: OffersPage, App, ConversationsPage, AppLayout e teste de entrada. Evidências em validation.md.

## D024 — Retomada da sessão demo na mesma aba — 11/11/2026

Origem: continuação das tasks solicitada pelo usuário; lacuna de recarga da T41 encontrada na configuração `persistSession: false` e no hook que só mantinha o participante em memória. Implementada para avaliação em `feature/t41-retomada-sessao`, criada da dev `785442d`.

Auth passa a usar sessionStorage por aba, sem fallback para localStorage. Cada documento tem `storageKey` exclusivo para isolar também o BroadcastChannel interno do SDK; adaptador mapeia as chaves a um nome estável por projeto no storage da aba. Recarregar retoma o token, consulta `getUser` no servidor e carrega o participante com RLS; somente email demo configurado, `is_demo` e papel correspondentes são admitidos. Perfil não é aceito a partir do storage. Sessões e ofertas locais sem Supabase continuam voláteis.

Saída usa scope local e troca explícita encerra a sessão anterior antes de autenticar o novo participante. Hook ignora resultados obsoletos e limpa dados ao receber SIGNED_OUT; falha de retomada/saída recebe mensagem. Enquanto valida, páginas internas mostram carregamento. Storage bloqueado limita a sessão à memória. Abas duplicadas podem copiar a sessão inicial por comportamento do navegador; os eventos Auth posteriores permanecem isolados. Fechar/reabrir abas pode restaurar sessionStorage conforme o navegador, portanto usar Trocar participante para sair explicitamente. Não há promessa de autenticação de produção.

Revisão dirigida também corrigiu foco de Voltar às conversas: título da lista é focado após ela voltar a ficar visível. Evidências e limites em validation.md; sem mudança de SQL, regras de oferta ou aceite M6/M5. T41 continua parcial; publicação/integração dependem de autorização após avaliação. Referências oficiais: [getUser](https://supabase.com/docs/reference/javascript/auth-getuser), [getSession](https://supabase.com/docs/reference/javascript/auth-getsession), [eventos Auth](https://supabase.com/docs/reference/javascript/auth-onauthstatechange); comportamento de broadcast conferido no SDK instalado.

## D025 — Pedidos incertos sobrevivem à recarga — 11/11/2026

Status: implementada/verificada para avaliação em `feature/t41-bot-persistencia`, da dev `b4f203e`. Origem: pedido explícito de verificar e corrigir bot após recarga, mensagens entre sessões, recuperação e proteção de estoque/histórico, atualizando tasks.md. Substitui somente a limitação de D020/D024 que mantinha pedidos incertos exclusivamente em memória.

Antes da chamada de envio/turno/confirmação, guardar texto/payload e chave em sessionStorage por aba/participante. Somente pedidos iniciados são retidos; texto ainda não enviado continua volátil e o histórico fica no Supabase. Ao recarregar, mostrar aviso para abrir a conversa e verificar explicitamente com a mesma chave; nunca reenviar sozinho. Remover somente o pedido cuja chave recebeu o resultado; respostas tardias não podem apagar pedidos novos. Storage bloqueado impede novo envio sem chave durável. Trocar participante oculta o journal anterior, mas o dono pode retomá-lo na mesma aba até conciliar; não apagar uma chave incerta ao sair. RLS/identidade/revisão permanecem no servidor.

Rejeição definitiva por revisão concorrente remove a prévia antiga e exige estado atual, inclusive quando a reconsulta falha. Falhas controladas no limite do serviço com banco real/F5 demonstraram recuperação sem duplicação, e Auth/RLS real verificou reservas/compromissos/snapshots sem alterar regras de negócio. T35/T38 recebem conclusão técnica; T41 mantém interrupção física de rede pendente; T42, avaliação T43/M6 e M5/T28 preservadas. Evidências em validation.md. Sem API paga, nova migration ou autorização presumida de push/integração.

## D026 — Recuperação da consulta não confirma envio incerto — 12/11/2026

Status: implementada/verificada para avaliação na `feature/t41-rede-recuperacao`, da dev `5634533`; sem autorização de publicação/integração. Origem: pedido explícito de continuar T41 e corrigir falhas de recuperação, mantendo os tipos de interrupção distintos.

Na continuação de T41, separar o erro da consulta do bot do erro de uma ação. Carregar estado/histórico com sucesso remove o alerta da consulta anterior, mas não elimina o alerta de um pedido incerto, não desbloqueia seu compositor e não limpa sua chave durável. Somente o resultado do reenvio explícito correspondente pode reconciliar o pedido (D025). Teste de regressão e bancada em memória verificam essa distinção; evidências remotas e limites de rede são registrados separadamente em validation.md.

## Modelo de novo registro

ID / data / status (proposta, aceita, substituída) / contexto / decisão / justificativa / arquivos e critérios afetados / limitações / origem da autorização quando necessária.

Nunca apagar decisões anteriores para esconder mudança; marcar substituição e atualizar a especificação atual.
