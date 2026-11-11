# T30 — WhatsApp oficial: especificação e preparação local

**Atualização de 11/11/2026: T30 pausada por mudança de direção do usuário (D018).** Priorizar [conversas-site.md](conversas-site.md) e T34–T43. Texto abaixo é histórico; preservar também os experimentos em `feature/t30-twilio-supabase`, sem declarar o canal concluído nem desativar recursos remotos nesta atualização documental.

Data: 10/11/2026. Status: **em avaliação, integração externa inativa**.

Origem: “vamos seguir com o resto então”, respondendo à proposta de preparar especificação e estrutura local enquanto a criação do portfólio Meta está bloqueada. Autoriza esta preparação; não representa liberação da conta, custos, deploy, mensagens reais ou aplicação remota de SQL.

## Primeira fatia

Conversa guiada por texto para cadastrar ofertas: OFERTA → alimento em kg → quantidade → preço → mínimo líquido → disponibilidade → vencimento opcional → coleta → prévia → correção/cancelamento/confirmação separada. Publicação não é venda; frete continua separado e operações são de demonstração. Ofertas futuras deverão aparecer nas mesmas consultas do site.

Áudio deve receber orientação para responder por texto, sem download/transcrição. Imagens, documentos, mensagens interativas, interpretação livre por IA, notificações proativas, demandas, aceites de transporte e pagamentos ficam fora desta fatia. O site permanece alternativa se o canal falhar. Não usar automação de WhatsApp Web.

## Entrega local

- `server/whatsapp/conversation.js`: protocolo sem acesso à rede/banco, reutilizando `offerChatSteps`, `answerOfferChat` e `validateChatDraft` da T29.
- `server/whatsapp/webhook.js`: factory Web Request/Response, GET challenge, POST HMAC-SHA256 nos bytes originais, receptor configurado, limite de 256 KiB e 100 mensagens por lote. Sem entrada de deploy nem fila padrão.
- `scripts/whatsapp-demo.mjs`: percurso automático com catálogo/remetente/segredos fictícios, payloads assinados e adaptador em memória. Não lê `.env`, abre servidor HTTP, usa rede ou grava arquivos/banco. **Não é WhatsApp conectado.**
- `tests/whatsapp.test.js`: protocolo/handler locais; não comprovam vínculo real, RLS, persistência, concorrência de banco ou entrega pela Meta.

Execute `npm run demo:whatsapp` (`npm.cmd run demo:whatsapp` se PowerShell bloquear npm.ps1). O terminal apresenta perguntas, prévia, correção, rejeição da confirmação antiga e uma oferta fictícia em memória. Tudo desaparece ao encerrar; nada entra na lista do site. Sem alteração de interface nesta etapa.

## Estados e contrato da conversa

| Estado | Entrada | Resultado |
| --- | --- | --- |
| idle | OFERTA | Primeira pergunta; nenhum efeito de escrita |
| collecting | Resposta válida/inválida | Próxima pergunta ou explicação, preservando rascunho |
| preview | CORRIGIR 1 a 8 | Reabre campo e invalida confirmação anterior |
| preview | CONFIRMAR `<sessão>:<revisão>` exato | Revalida catálogo/datas, muda para submitting e emite pedido de publicação |
| preview | “sim”, token antigo ou de outra sessão | Não publica; orienta confirmação da prévia atual |
| idle/collecting/preview | CANCELAR | Descarta rascunho, encerra sessão |
| submitting | Texto do usuário | Aguarda reconciliação; não emite outro efeito nem cancela escrita incerta |
| submitting | Resultado confiável com ID da oferta | Confirma publicação e limpa rascunho |
| submitting | Recusa definitiva sem gravação | Não anuncia sucesso; volta à prévia preservando rascunho/chave |
| submitting | Resultado incerto/sem ID | Vai para reconciling, preservando rascunho/chave; bloqueia correção/cancelamento/nova publicação |
| reconciling | Resultado recuperado pelo servidor | Confirma ID encontrado ou volta à prévia somente após recusa definitiva sem gravação |
| confirmed/cancelled | Qualquer texto | Não reutiliza a sessão; adaptador gera nova sessão para nova oferta |

O ID da sessão deve ser UUID gerado no servidor. Código longo por texto é deliberado nesta base; botões poderão transportar o token em evolução separada. Opções numéricas guardam os IDs exibidos na pergunta, evitando troca por reordenação do catálogo. Antes da confirmação, revalidar catálogo e datas. Correção que invalida outro campo exige nova resposta e prévia.

Efeito: `{type:'publish_offer',idempotencyKey:'<sessão>:<revisão>',data}`. Dados equivalem ao payload validado do formulário; ator não vem do texto. Reducer pressupõe estado protegido/validado e associado pelo servidor ao vínculo correto. `settlePublication` só recebe resultado confiável do adaptador de banco, nunca `offerId` escolhido pelo remetente. Ausência de resultado é incerta por padrão; `outcome:'rejected'` só pode ser usado se o servidor comprovar que não gravou. Timeout não é recusa definitiva. Pedido emitido não comprova gravação. O protocolo não é, sozinho, garantia de idempotência no banco.

## Contrato do receptor

`createWebhookHandler({verifyToken,appSecret,businessAccountId,phoneNumberId,acceptBatch})`:

- Configuração incompleta/sem adaptador: 503, inclusive GET. Não habilitar receptor que possa perder eventos.
- GET confere modo subscribe, token e challenge; devolve só o challenge. Token não substitui assinatura POST.
- POST verifica `X-Hub-Signature-256` por Web Crypto nos bytes originais antes de interpretar JSON. Confere WABA/Phone Number ID configurados no servidor. Payload inválido: 400; assinatura inválida: 401; receptor incorreto: 403; corpo excessivo: 413.
- Valida todo o lote antes de chamar `acceptBatch`. Mensagens normalizadas: `{id,from,timestamp,type,text,phoneNumberId,businessAccountId}`. Nome de contato/mídia/dados extras não viram identidade ou resposta. Status de entrega/leitura não avança perguntas. Áudio/outros tipos têm `text:null`; worker deverá orientar uso de texto sem chamar o reducer.
- `acceptBatch` deve resolver somente após **persistir o lote inteiro de forma idempotente**. Não esperar worker/Graph API para reconhecer recebimento. Falha: 503 sem detalhes privados; 200 somente após recebimento confirmado. Eventos sem mensagens relevantes não avançam a conversa.
- Hospedagem futura precisa de limite de requisições, tempo de leitura e monitoramento. O módulo limita bytes, mas não implementa infraestrutura de rate limit nem é um servidor exposto.

O demonstrador injeta adaptador sequencial em memória. Map/Set **não comprovam durabilidade, lote atômico, recuperação após reinício ou concorrência entre workers**. Não implantar esse adaptador.

## Banco e autorização — próxima fatia, não implementada

Nomes planejados, não tabelas já existentes:

| Entidade | Responsabilidade |
| --- | --- |
| whatsapp_bindings | Vínculo verificado remetente/receptor/produtor demo; unicidade e revogação |
| whatsapp_sessions | UUID, vínculo, revisão, rascunho/opções, expiração e versão concorrente |
| whatsapp_inbox | Unicidade `(WABA,phone_number_id,message_id)`, hash de conteúdo e processamento |
| whatsapp_publications | Chave única sessão/revisão, hash de payload/ator e ID da oferta |
| whatsapp_outbox | Respostas da transação, correlação, tentativas/lease e ID/status da Meta |

Fluxo: webhook assinado → inbox durável → worker serializado por vínculo → catálogo/produtor autorizados → reducer → transação de oferta/publicação/estado/outbox → envio Meta. Restrição única e transação impedem duas ofertas na mesma confirmação. Mesma chave com ator/conteúdo diferente é recusada. A transação revalida vínculo ativo, papel, coleta própria, produto, valores e datas. O ator vem do vínculo confiável; webhook não ganha escrita REST irrestrita em ofertas.

`saveOffer` atual depende do cliente/sessão do navegador: não importar diretamente no servidor. Extrair/adaptar acesso a ofertas sem duplicar domínio, preservando constraints/RLS. Se worker usar credencial elevada, gateway deve limitar explicitamente ator/propriedade/ações; não expor credencial nem RPC administrativa ao navegador/anônimo.

Proposta de vínculo para avaliação: produtor autenticado solicita código descartável no site e o envia pelo WhatsApp; servidor verifica uso único/prazo/identidade demo antes de ativar vínculo. Nome do contato ou seleção do produtor por texto não bastam. Prever revogação e revalidar ao publicar. Prazo sugerido do código: 10 minutos. Nenhum número real é solicitado/armazenado nesta preparação.

Reentrega não pode avançar duas perguntas; serializar processamento e recusar ID reutilizado com conteúdo diferente. Não presumir ordem de entrega: guardar timestamp/contexto, bloquear evento anterior ao último processado e orientar revisão/reinício quando ambíguo. Prévia completa obrigatória. Testar confirmação versus correção/cancelamento/revogação e sessões expiradas. Proposta: rascunho expira após 24h de inatividade, exigindo nova prévia; não é regra já validada.

Resposta perdida após gravar deve consultar publicação pela mesma chave, sem criar outra oferta. Outbox usa tentativas limitadas e respeita condições/janela de mensagens; envio incerto requer reconciliação antes de repetir. Não prometer entrega exatamente uma vez pelo provedor. `200` do webhook não significa publicação ou entrega ao telefone.

Dados de contato/rascunhos ficam restritos aos serviços necessários e schemas privados; não registrar corpo, telefone ou tokens em logs. Definir retenção/limpeza de inbox/outbox e consentimento de contatos de teste antes da conexão. Nada nesta entrega autoriza coleta de contatos de terceiros ou operação de produção.

## Ativação futura

O exemplo `server/whatsapp/.env.example` lista nomes planejados. Os módulos atuais recebem parâmetros, não carregam variáveis automaticamente. **Segredos da Meta nunca entram em `VITE_*` ou arquivos versionados.**

1. Concluir portfólio/app e habilitar recursos de teste. Prazo do aviso não garante liberação da conta.
2. Identificar WABA/Phone Number ID, App Secret, token e versão Graph suportada no painel; configurar no servidor sem enviar segredos no chat. Conferir condições/orçamento antes de tráfego cobrado.
3. Implementar migration, vínculo, inbox/worker/outbox e publicação atômica; aplicar no demo somente com autorização correspondente.
4. Preparar Edge Function HTTPS com assinatura obrigatória; autenticação da plataforma deve permitir chamada da Meta sem remover assinatura. Nenhuma Edge Function/configuração JWT foi criada ou implantada nesta fase.
5. Com ativação autorizada, configurar callback/token e destinatários de teste consentidos, exercitar mensagens reais, reinício/concorrência e oferta no produtor/comprador após F5. Registrar evidências e obter aceite.

## Critérios próprios

| ID | Resultado exigido | Evidência atual |
| --- | --- | --- |
| WA01 | Challenge correto; assinatura/corpo/receptor inválidos rejeitados | Testes locais |
| WA02 | Perguntas/prévia/correção/cancelamento sem escrita; só token atual emite publicação | Testes locais |
| WA03 | Mesmas validações/catálogo/calendário; falha preserva dados e não anuncia sucesso | Testes locais |
| WA04 | Áudio/status não são respostas; lote inválido não parcialmente aceito | Normalização local; resposta de worker pendente |
| WA05 | Vínculo verificado/revogado, propriedade e RLS impedem escrita indevida | Pendente no banco/demo |
| WA06 | Reentrega, corrida e reinício mantêm uma publicação e recuperam resultado | Pendente no banco; demo cobre repetição sequencial em memória |
| WA07 | Receber/enviar na Meta e consultar oferta no site após F5 | Pendente de configuração/ativação autorizada |

T30 e integração ficam em avaliação. Não conclui M6 nem altera pendências M5/T28 ou T29 visual.

## Fontes e limites

- [Portal oficial WhatsApp](https://whatsappbusiness.com/developers/developer-hub/): recursos de teste.
- [Referência oficial histórica de webhooks](https://whatsapp.github.io/WhatsApp-Nodejs-SDK/api-reference/webhooks/start/): challenge/assinatura. SDK arquivado, não instalado/adotado. Documentação detalhada atual da Meta retornou 429/login; confirmar payloads/versão com eventos do painel antes da ativação.
- [Autenticação Edge Functions](https://supabase.com/docs/guides/functions/auth) e [headers de autorização](https://supabase.com/docs/guides/functions/auth-headers): assinatura de webhook independente da sessão demo.
- [Preços oficiais](https://whatsappbusiness.com/products/platform-pricing/): conferir mercado/categoria/condições ao ativar; nenhum custo contratado/verificado para esta conta.
