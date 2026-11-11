# Conversas no site — planejamento da evolução M6

Atualização de execução em 11/11/2026: migrations `site_conversations`/`site_offer_bot` aplicadas com autorização ao demo `conexa`, versões `20261111223622`/`20261111223632`. Roteiro de texto/DM passou em nove grupos com Auth/RLS, concorrência e websocket reais; nova autenticação conserva mensagem/leitura. Isso substitui a indicação de aplicação remota pendente nos registros históricos abaixo. F5/percurso conectado, rede real e demais limites de T35/T38/T41, T42 e aceite M6 permanecem pendentes. Evidências em [validation.md](validation.md), sem API paga/voz real.

Data: 11/11/2026. Status: **segunda fatia local implementada para avaliação**: aba T34, base de mensagens T35/T38 e bot por texto/comandos T36/T37. Duas migrations de Conversas ainda não aplicadas ao demo; voz pendente. Direção solicitada pelo usuário após os testes de integração WhatsApp. Tarefas T34–T43 em [tasks.md](tasks.md); decisões D018–D020 em [decisions.md](decisions.md). T29 é a base existente; T30 fica pausada. Não representa aceite da M6 nem conclusão da M5/T28.

Atualização posterior na mesma data: **terceira fatia local T39/T40** preparada na `feature/conversas-voz-opcional` da dev `aaa0adb`. O contrato D021 abaixo substitui a proposta de token efêmero, sem alterar o histórico das duas primeiras fatias. Voz/provedor reais continuam sem teste; T42/aceite M6 pendentes. Configuração e roteiro em [voz-manual.md](voz-manual.md).

## Experiência e escopo

Atualização local D022, 11/11/2026: menu inicial de ações por perfil, escolha de oferta/campos por botões e entrada guiada de valores/datas. Criar/editar/arquivar não exigem palavras-chave; texto livre fica em “Escrever uma mensagem (opcional)”. Vencimento permite “Não sei informar”. Durante preparo, cancelar fica visível; pedidos incertos bloqueiam opções até reconciliação. Campo em correção não apresenta confirmação até usar o valor ou voltar aos campos. Botões usam `turn`/`confirm` existentes, sem mudar RPCs/schema ou as permissões/validações. Avaliação/integração desta melhoria pendentes.

Aba **Conversas** nas contas de produtor e comprador, com interação familiar de mensageiro: lista de contatos/conversas, Bot Conexa destacado, balões, horários, não lidas e campo para escrever. Desktop mostra lista e conversa lado a lado; em 360 px mostra uma área por vez. Preservar identidade Conexa (creme, verde, laranja, marca vetorial e ilustrações locais), acessibilidade e navegação por teclado. Identificar como conversa dentro da Conexa; não usar marca ou estado que sugira WhatsApp conectado.

O produtor conversa com o bot para consultar, criar, atualizar e arquivar suas ofertas. O bot prepara os campos automaticamente a partir do que foi dito e aplica a revisão **após prévia e confirmação explícita**, mantendo RN45. A automação reduz preenchimento manual; não publica alterações ambíguas ou sem confirmação. O formulário continua disponível e compartilha serviços/validações com o chat.

O comprador também acessa o bot para consultar ofertas e receber orientação sobre o fluxo. Não pode editar ofertas de terceiros. Nesta entrega não há escrita de demandas, reservas, negociações de frete, pagamentos ou aceites pelo bot. Essas operações mantêm seus fluxos atuais.

Conversas individuais entre produtores e entre produtor/comprador permitem combinar acordos e parcerias. “Vendedor” corresponde ao perfil produtor existente; não criar um novo papel. Mensagem enviada a uma pessoa não é comando ao bot. Um acordo por texto não é venda, reserva nem mudança de preço confirmada: a interface orienta a formalizar no fluxo existente. Grupos, anexos e chamadas entre pessoas ficam para evolução; voz desta fatia é somente com o bot. Transportador mantém seu portal atual.

Somente participantes fictícios do demo. Contas demo compartilhadas não garantem privacidade pessoal e não devem receber conversas ou dados reais de terceiros.

## Modos e custos

1. **Texto simulado, padrão**: interpretador local com intenções delimitadas e perguntas de esclarecimento. Sem chamada de modelo ou gasto com tokens; testes usam frases previstas e fixtures. Deixar claro que a interpretação é simulada e pode orientar para o formulário. No ambiente conectado, mensagens e alterações confirmadas persistem no Supabase demo; “simulado” descreve a interpretação, não um banco fictício.
2. **OpenAI opcional**: adaptador de linguagem/voz para demonstrar interação com IA real; usar Realtime API como candidata para a sugestão “GPT live”. Modelo, limites de consumo e disponibilidade devem ser conferidos na implementação, sem fixar preço/modelo por suposição. Nenhuma dependência desse modo para o texto básico.
3. **Voz paga**: usuário inicia e executa testes manuais. O agente prepara interface, contratos, mocks e roteiro, sem criar sessão real, pedir microfone ou enviar texto/áudio para a API paga. Testes de texto do provedor também são simulados pelo agente. Abrir a aba, executar CI ou iniciar o projeto não pode consumir API.

Documentação oficial consultada em 11/11/2026: [Realtime API](https://developers.openai.com/api/docs/guides/realtime) e [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc). A API suporta texto/áudio e ferramentas; WebRTC no navegador pode usar credencial efêmera emitida por servidor. Esta é a opção técnica proposta, não uma integração executada.

## Fluxo do bot e regras de escrita

Exemplo de edição: “Minha oferta de tomate agora tem 20 kg e o quilo fica R$ 7”. Bot identifica a oferta própria; se houver mais de uma, pergunta qual. “20 kg” precisa distinguir quantidade total de saldo livre se houver reserva/compromisso; não presumir nem remover reservas. Perguntar campos faltantes, coleta/unidade incompatível ou datas ambíguas. Preço e mínimo são distintos; nunca diminuir o mínimo automaticamente. Datas relativas usam America/Sao_Paulo, são explicitadas na prévia e pedem esclarecimento quando ambíguas.

| Estado | Comportamento planejado |
| --- | --- |
| Identificação | Classificar intenção suportada; consulta não gera escrita no catálogo. Usar apenas dados acessíveis ao perfil autenticado. |
| Rascunho | Coletar/corrigir dados e escolher oferta alvo. Ausência de dado não autoriza inventar unidade, coleta, vencimento ou mínimo. |
| Prévia | Exibir criar/editar/arquivar, oferta alvo, campos antes/depois, unidade, preços, quantidade total/saldo e revisão. Sem alterar o catálogo. |
| Confirmação | Ação explícita associada à revisão atual (botão ou comando inequívoco); “sim” solto ou uma fala captada incidentalmente não autoriza mutação. Correção invalida confirmação antiga. |
| Execução | Backend deriva dono da sessão, revalida catálogo/saldo/mínimos/datas/versão e executa comando único. Modelo não recebe SQL, chave administrativa ou autoridade de escrita. |
| Resultado | Só anunciar mudança após resposta persistida com ID/versão. Reconsultar listas dos perfis. Em timeout, reconciliar pela chave do comando antes de tentar de novo. |
| Conflito/erro | Manter rascunho, explicar falha e recarregar estado. Mudança de versão/saldo exige nova prévia e confirmação. Cancelamento antes da execução não altera a oferta. |

Arquivar segue RN06; exclusão física via bot fica fora da primeira entrega. Atualizar oferta vinculada não muda snapshots/acordos de cargas existentes nem reduz quantidade abaixo de reservas e compromissos. Permissões, validação de valores e verificação atômica continuam no banco/servidor.

## Persistência e serviços propostos

Modelo abaixo orienta a entrega completa de T35. Contrato final da primeira fatia está registrado a seguir; rascunhos/comandos do bot ainda serão implementados.

| Entidade proposta | Dados e restrições |
| --- | --- |
| Conversa | ID, tipo bot/direta, criador e datas. Bot pertence a um participante; conversa direta tem exatamente dois membros permitidos. Evitar duplicar conversa para o mesmo par. |
| Membro | Conversa, participante, ingresso e cursor da última leitura. Consulta só por membros; cliente não adiciona a si mesmo em conversa alheia nem forja remetente. |
| Mensagem | ID, conversa, remetente/tipo, texto, data/ordem do servidor e ID de envio do cliente. Unicidade por remetente/ID de envio; conteúdo em texto, sem executar HTML. Escrita de resposta do bot restrita ao backend. |
| Rascunho do bot | Dono/conversa, intenção, oferta alvo, versão esperada da oferta, revisão do rascunho, campos estruturados, estado e datas. Não compartilhar entre perfis. |
| Comando confirmado | Chave idempotente, dono, conversa, revisão e payload confirmado, resultado/ID da oferta, estado e datas. Chave vinculada ao conteúdo; não aceitar mesma chave com outro payload. Aplicação e resultado auditável na mesma transação. |

Supabase Auth demo + RLS para mensagens/membros/rascunhos. Leitura e envio em conversa alheia, edição de remetente, inscrição Realtime não autorizada e consulta de comandos privados devem ser rejeitados também por requisição direta. Gateway verifica que o usuário continua membro e tem papel/dono corretos. Não confiar em `participant_id` enviado pelo navegador/modelo. RLS do catálogo continua com a visibilidade já prevista para compradores.

Paginar histórico e usar ordem determinística do servidor; manter rascunho de envio em falha. Supabase Realtime atualiza mensagens/não lidas, com reconsulta por cursor ao reconectar e deduplicação por ID. Esse recurso de banco é independente da OpenAI Realtime. Troca de perfil/logout limpa dados em memória, assinaturas e sessões de voz. Sem Supabase configurado, mostrar prévia identificada/indisponibilidade; nunca prometer histórico persistente por localStorage.

Reutilizar `src/domain/offer-chat.js`, `src/domain/offers.js`, `src/services/offers.js`, `useOffers` e protocolo T30 quando útil. Estender serviços compartilhados para gateway transacional se necessário; não criar um segundo caminho com validações mais fracas que o formulário. Os experimentos Twilio estão em outra feature, não são dependência nem entram por merge implícito neste planejamento.

## Contrato implementado da primeira fatia (local)

Migration `202611110001_site_conversations.sql`: `site_conversations`, `site_conversation_members`, `site_messages`; gateway `site_chat(p_action text, p_payload jsonb)`. Não cria tabelas de comandos/rascunhos do bot, não altera ofertas e não substitui seus serviços. Sem endpoint OpenAI. Rascunho de mensagem humana é volátil por conta/conversa; recarga descarta o rascunho, não promete recuperação durável.

| Ação | Payload / resultado |
| --- | --- |
| `inbox` | Sem identidade no payload. Garante bot privado único; retorna `conversations` (bot primeiro, título, último texto/horário, não lidas, cursor) e `contacts` demo permitidos. |
| `open_direct` | `peer_id`; retorna `id`, reutilizando par único ordenado. Exatamente dois membros inseridos pelo gateway. Permite produtor↔produtor e produtor↔comprador, sem transportador/autocontato/comprador↔comprador. |
| `messages` | `conversation_id`, opcional `before_seq` **ou** `after_seq`; retorna até 40 mensagens em ordem crescente e `has_more`. Sem cursor traz a última página; `before_seq` pagina passado, `after_seq` reconcilia mensagens novas, incluindo múltiplas páginas. `seq` é string decimal para não perder precisão no JavaScript. |
| `send` | `conversation_id`, `client_send_id` UUID, `body` (1–2000 caracteres após trim). Remetente e horário vêm da sessão/banco; não aceita mensagem em conversa bot nesta fatia. Unicidade remetente/chave; repetir conteúdo devolve mesmo registro, alterar conteúdo/conversa com a mesma chave é rejeitado. Retorna registro confirmado. |
| `read` | `conversation_id`, `seq` existente nessa conversa. Atualiza somente cursor do próprio membro, monotonicamente; não lidas conta mensagens de outros remetentes depois do cursor. |

RLS de SELECT usa `site_is_member(uuid)` com identidade atual; INSERT/UPDATE/DELETE diretos não são concedidos. Gateway SECURITY DEFINER com search_path vazio verifica participante demo/papel/membro em cada ação; não há autoridade de bot/SQL no frontend. Advisory lock por remetente/chave e lock de conversa antecedem a geração da ordem da mensagem. A serialização evita cursor avançar sobre mensagem dessa conversa ainda sem commit; concorrência real ainda precisa teste no demo.

Migration adiciona somente `site_messages` à publicação `supabase_realtime` quando existente; policy de SELECT limita o assinante. Serviço assina INSERT, reconcilia ao conectar/voltar à aba/rede e a cada 30s, e remove canal/listeners/timer ao desmontar. A página tem chave por conta; histórico e rascunhos em memória não são reaproveitados após troca de perfil. Interface conserva texto/chave após resultado incerto e exige verificar o mesmo envio antes de nova mensagem. Até aplicar/validar a migration, o site mostra impedimento explícito; a bancada `/tests/ui/conversations.html` usa memória identificada.

Evidências locais em `validation.md`; aplicação no demo e teste real de Realtime dependem de autorização.

## Contrato implementado da segunda fatia (local)

Migration `202611110002_site_offer_bot.sql`: `site_bot_drafts` (um rascunho por conversa, dono, intenção, revisão, campos, alvo, snapshot/versão/saldo e estado) e `site_bot_requests` (chave por dono, ação/payload imutável e resultado). SELECT privado por dono/membro; INSERT/UPDATE/DELETE diretos revogados. `site_messages.speaker` distingue humano/bot sem criar participante fictício com autoridade de escrita. Respostas de histórico vêm do servidor, em texto; perguntas contextuais vêm do intérprete local e dos campos persistidos, sem fabricar mensagens remotas.

RPC `site_bot(p_action,p_payload)` aceita somente o dono autenticado do bot demo:

| Ação | Contrato |
| --- | --- |
| `state` | `conversation_id`; devolve rascunho, ofertas visíveis pelo perfil com saldo e catálogo/coletas próprias. Comprador consulta ofertas publicadas vigentes, sem mutação. |
| `messages` | `conversation_id`, `before_seq` ou `after_seq` opcional; páginas de 40 ordenadas, `seq` em string, `speaker` e `has_more`. Cursores mutuamente exclusivos. Atualizar/reconectar reconcilia todas as páginas novas, preservando anteriores já carregadas. |
| `turn` | `request_id`, `revision` esperada (0 inicialmente), texto, intenção delimitada, campos em strings, alvo e `offer_version` quando houver. Não altera catálogo. Serializa conversa, cria revisão, captura snapshot/saldo reais e persiste mensagem/resposta junto do resultado. Cancelar conserva registro com estado cancelled; consulta não escreve oferta. |
| `confirm` | `request_id`, `revision` atual. Só produtor confirma create/edit/archive. Revalida versão e saldo sob lock da oferta; usa a função compartilhada de escrita e registra resultado na mesma transação. Falha de validação ou conflito retorna estado conflict, sem alterar oferta. Nova prévia/confirmar necessários. |

Repetir chave/conteúdo retorna o mesmo resultado; mudar ação/payload com a chave é rejeitado. Locks por chave/conversa e checks estão preparados; concorrência real ainda não verificada. Revisão defasada é rejeitada antes de escrever. Resultado incerto conserva o mesmo pedido na interface e bloqueia correção/cancelamento até verificar. Após F5, rascunho/estado são consultados do banco; testes locais não comprovam F5 remoto. Mensagem em conversa direta continua no gateway humano e não executa bot.

`conexa_private.write_offer` é usada pelo bot e pela RPC `save_offer` do formulário/arquivamento. Deriva dono da sessão; aceita valores canônicos em centavos/milésimos, mantém triggers existentes de datas/coleta, saldo reservado/comprometido e identidade de ofertas vinculadas. Não muda snapshots de cargas. Serviço de formulário tenta o gateway novo e só usa o CRUD anterior quando a função não existe; preserva RLS/triggers e compatibilidade do vencimento opcional. O bot não faz fallback de mutação sem sua migration/comando auditável. Resultado de sucesso com oferta confirmada dispara recarga das listas montadas; navegar para ofertas reconsulta o banco.

Intérprete determinístico reaproveita T29: `consultar`, `criar oferta`, `editar alface`, `arquivar alface`; identificador ou botão resolve múltiplos alvos. `total 20 kg`, `preço 7,00`, `mínimo: 4,00` e correções `campo: valor`. Criação pergunta os oito campos e oferece catálogo/coleta; vencimento aceita `não sei`. “Agora tenho 20 kg” pede distinguir total/saldo; datas relativas pedem data exata em São Paulo. Não converte unidades nem inventa preço/mínimo/local/datas. `sim` não autoriza mutação; botão confirma a revisão visível. Não é compreensão geral de linguagem natural. Prévia completa mostra antes/depois e saldo; durante perguntas de criação fica oculta para facilitar uso no celular. Formulário continua acessível.

Evidências: três testes de domínio, quatro de componente, script PostgreSQL local do bot e bancada 1366×900/360×800/teclado. Sem Supabase remoto, websocket, chamadas de OpenAI, voz ou aceite humano. T35/T38/T41 e M6 continuam abertos pelos critérios pendentes; histórico da primeira fatia acima é preservado.

## Proposta inicial de IA/voz — contrato substituído pelo D021 abaixo

- Endpoint autenticado de sessão verifica participante, modo habilitado, limites por usuário e duração antes de contatar a OpenAI. Chave permanente em segredo de servidor; nunca em variável `VITE_*`, bundle, histórico ou logs. Credencial efêmera não fica persistida no histórico.
- Navegador usa WebRTC apenas após ação explícita; indica microfone e sessão paga ativos. Fornecer transcrição corrigível e alternativa por texto. Não guardar áudio bruto nesta fatia; enviar ao provedor apenas contexto necessário da conversa com o bot, sem mensagens privadas entre pessoas.
- Ferramentas limitadas a consultar dados permitidos e propor rascunho. Confirmação cria comando validado pelo backend, vinculado à revisão, dono e versão esperada. Saída do modelo é entrada não confiável; instruções em mensagens não mudam regras/permissões.
- Configurar antes da ativação teto por sessão/usuário, duração máxima e limite de respostas. Interromper ao atingir os limites; não apresentar estimativa de tokens como valor exato cobrado. Limites de uso precisam ser aplicados no servidor, não apenas no cronômetro visual.
- Encerrar tracks de mídia e conexão ao sair, trocar perfil, cancelar ou atingir tempo máximo. Sessão não reinicia sozinha após falha/reconexão; pedir nova ação para uma nova sessão paga. Reconciliar comandos pendentes sem repetir mutações.
- Provedor indisponível, chave ausente, permissão de microfone negada ou limite atingido mantém texto simulado disponível e não gera sucesso fictício.

## Verificação e aceite

### Contrato local T39/T40 — D021

O servidor opcional `npm run dev:voice` (Node 24+, uma instância local) expõe `POST /api/voice/sessions` e `GET`/`DELETE /api/voice/sessions/:id`. Exige origem exata, JWT validado por Supabase Auth, participante demo produtor/comprador e acesso ao próprio bot via `site_bot state` antes de criar chamada. Só recebe `conversation_id`/SDP; ignora identidade/modelo/limites do navegador. Devolve SDP, ID opaco local, expiração e teto de respostas; nenhuma chave OpenAI chega ao browser. Sem configuração explícita, responde indisponível antes de autenticar/chamar provedor. Não foi implantado nem autenticado no demo nesta rodada.

Interface unificada de WebRTC cria a chamada no servidor; sideband acompanha respostas/configuração/perda de controle e hangup é solicitado pelo servidor. `.voice-data/quotas.sqlite` reserva tentativa antes de contatar provedor, aplica limite por participante/dia de São Paulo e uma sessão ativa; duração começa nessa reserva. Limites configurados no servidor: duração, tentativas diárias, respostas e saída por resposta. São tetos operacionais, não garantia de cobrança máxima exata: chamadas em andamento/áudio/transcrição e eventual queda do processo têm limites descritos em voz-manual.md. Erro incerto não repete chamada e bloqueia novas sessões; cotas persistem e leases conhecidos são encerrados na recuperação. Servidor não pode ser usado em múltiplas instâncias/serverless sem evolução de armazenamento/supervisão.

IA recebe somente instruções de domínio e papel do participante, além de texto/áudio enviado explicitamente nesta sessão. Sem histórico de DM, catálogo completo, localização ou credenciais. A única ferramenta `propose_offer_command` sugere comando em texto; argumentos/nomes desconhecidos são rejeitados. Nenhuma ferramenta escreve, confirma, chama RPC ou executa SQL. Transcrição e sugestão são corrigíveis; transferir ao campo simulado encerra a sessão sem enviar o comando. Depois, T36 interpreta, T37 registra rascunho/prévia e só o botão confirma a revisão pelo banco. Comprador continua somente consulta. Não há entendimento garantido de frase arbitrária ou catálogo pela IA.

Browser pede microfone apenas em Iniciar voz paga; Iniciar IA paga por texto usa a mesma API sem microfone. Respostas da IA são texto, sem síntese/reprodução de fala nesta fatia. Cleanup ao sair/ocultar/trocar conta/conversa, envio/cancelamento local, limite ou falha; sem reconexão paga automática. Nenhum áudio bruto é persistido. O histórico do bot recebe apenas o texto que a pessoa efetivamente envia pelo fluxo existente. Tudo fica desabilitado por padrão; sem servidor/configuração mantém texto simulado. Testes reais pagos continuam exclusivos do usuário, T42.

Critérios AC24–AC32 em [acceptance.md](acceptance.md): primeira evidência local de interface/mensagens em `validation.md`; verificações remotas, bot e voz ainda pendentes. T41 prepara testes sem custo de API, com domínio/componentes/provedor simulado e banco local. Teste remoto de texto/DM deve demonstrar RLS, persistência com F5 e duas sessões separadas, após autorização para a migration correspondente. Não atribuir persistência real a mocks/PGlite nem percepção visual a jsdom.

Roteiro T42 para o usuário: configurar segredo no servidor sem enviá-lo ao chat; conferir limites; iniciar voz manualmente; ditar criação e edição de oferta; corrigir transcrição/campo; cancelar uma prévia; confirmar outra; conferir a oferta persistida pelo comprador; interromper sessão; negar microfone/testar queda; verificar encerramento e consumo no provedor. Agente registra apenas os resultados que o usuário relatar. Até lá, voz permanece “validação manual pendente”.

Revisar UI em 360 px e desktop, teclado/foco, erro de envio, não lidas, histórico longo e troca de conta. Rodar `npm run lint`, `npm test` e `npm run build` na implementação. Avaliar texto/DM separadamente de voz, sem marcar a voz aprovada por testes simulados.

## Transição e limites

T30 fica pausada na prioridade, sem apagar código, migrations, evidências ou o trabalho preservado em `feature/t30-twilio-supabase`. Há endpoint demo implantado nessa evolução; pausar tarefas não o desativa. Nesta solicitação não há chamada, alteração ou remoção remota. Ao implementar a nova entrada, retirar o incentivo a depender do vínculo WhatsApp e explicar o canal interno; eventual desativação/limpeza remota exige conferir uso e autorização específica.

Planejamento inicial documental em `feature/planejamento-conversas-site`, criada de `dev` (`3197eaf`), depois integrado por autorização. Primeira implementação em `feature/conversas-base`, da dev `c72392e`, com interface e migration somente locais; sem deploy, aplicação remota ou API paga. Apresentar para avaliação antes de solicitar autorização de publicação/integração na dev. Main, M5/T28 e o aceite da M6 permanecem independentes.
