# Conversas no site — planejamento da evolução M6

Data: 11/11/2026. Status: **primeira fatia local implementada para avaliação**: aba T34 e base de mensagens T35/T38; bot livre, comandos e voz pendentes. Nova migration ainda não aplicada ao demo. Direção solicitada pelo usuário após os testes de integração WhatsApp. Tarefas T34–T43 em [tasks.md](tasks.md); decisões D018/D019 em [decisions.md](decisions.md). T29 é a base existente; T30 fica pausada. Não representa aceite da M6 nem conclusão da M5/T28.

## Experiência e escopo

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

## Adaptador de IA e voz propostos

- Endpoint autenticado de sessão verifica participante, modo habilitado, limites por usuário e duração antes de contatar a OpenAI. Chave permanente em segredo de servidor; nunca em variável `VITE_*`, bundle, histórico ou logs. Credencial efêmera não fica persistida no histórico.
- Navegador usa WebRTC apenas após ação explícita; indica microfone e sessão paga ativos. Fornecer transcrição corrigível e alternativa por texto. Não guardar áudio bruto nesta fatia; enviar ao provedor apenas contexto necessário da conversa com o bot, sem mensagens privadas entre pessoas.
- Ferramentas limitadas a consultar dados permitidos e propor rascunho. Confirmação cria comando validado pelo backend, vinculado à revisão, dono e versão esperada. Saída do modelo é entrada não confiável; instruções em mensagens não mudam regras/permissões.
- Configurar antes da ativação teto por sessão/usuário, duração máxima e limite de respostas. Interromper ao atingir os limites; não apresentar estimativa de tokens como valor exato cobrado. Limites de uso precisam ser aplicados no servidor, não apenas no cronômetro visual.
- Encerrar tracks de mídia e conexão ao sair, trocar perfil, cancelar ou atingir tempo máximo. Sessão não reinicia sozinha após falha/reconexão; pedir nova ação para uma nova sessão paga. Reconciliar comandos pendentes sem repetir mutações.
- Provedor indisponível, chave ausente, permissão de microfone negada ou limite atingido mantém texto simulado disponível e não gera sucesso fictício.

## Verificação e aceite

Critérios AC24–AC32 em [acceptance.md](acceptance.md): primeira evidência local de interface/mensagens em `validation.md`; verificações remotas, bot e voz ainda pendentes. T41 prepara testes sem custo de API, com domínio/componentes/provedor simulado e banco local. Teste remoto de texto/DM deve demonstrar RLS, persistência com F5 e duas sessões separadas, após autorização para a migration correspondente. Não atribuir persistência real a mocks/PGlite nem percepção visual a jsdom.

Roteiro T42 para o usuário: configurar segredo no servidor sem enviá-lo ao chat; conferir limites; iniciar voz manualmente; ditar criação e edição de oferta; corrigir transcrição/campo; cancelar uma prévia; confirmar outra; conferir a oferta persistida pelo comprador; interromper sessão; negar microfone/testar queda; verificar encerramento e consumo no provedor. Agente registra apenas os resultados que o usuário relatar. Até lá, voz permanece “validação manual pendente”.

Revisar UI em 360 px e desktop, teclado/foco, erro de envio, não lidas, histórico longo e troca de conta. Rodar `npm run lint`, `npm test` e `npm run build` na implementação. Avaliar texto/DM separadamente de voz, sem marcar a voz aprovada por testes simulados.

## Transição e limites

T30 fica pausada na prioridade, sem apagar código, migrations, evidências ou o trabalho preservado em `feature/t30-twilio-supabase`. Há endpoint demo implantado nessa evolução; pausar tarefas não o desativa. Nesta solicitação não há chamada, alteração ou remoção remota. Ao implementar a nova entrada, retirar o incentivo a depender do vínculo WhatsApp e explicar o canal interno; eventual desativação/limpeza remota exige conferir uso e autorização específica.

Planejamento inicial documental em `feature/planejamento-conversas-site`, criada de `dev` (`3197eaf`), depois integrado por autorização. Primeira implementação em `feature/conversas-base`, da dev `c72392e`, com interface e migration somente locais; sem deploy, aplicação remota ou API paga. Apresentar para avaliação antes de solicitar autorização de publicação/integração na dev. Main, M5/T28 e o aceite da M6 permanecem independentes.
