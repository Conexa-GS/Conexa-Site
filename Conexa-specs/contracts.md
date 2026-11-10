# Contratos de serviços propostos

Interfaces abaixo são contratos lógicos, não endpoints de backend já implementados. CRUD simples usa cliente Supabase com RLS. Operações compostas usam funções transacionais; rotas externas usam servidor.

T30/WhatsApp: contrato separado em [t30-whatsapp.md](t30-whatsapp.md), com protocolo de texto e handler local sem adaptador persistente. `acceptBatch` deve garantir recebimento durável do lote antes de responder 200; `publish_offer` é pedido, não confirmação de gravação. Banco, identidade e envio externo ainda não implementados.

## Implementação M2 — 07/11/2026

`src/services/m2.js` usa `supabase.rpc('m2', { action, payload })`. O gateway é `security invoker`; a função privada valida sessão, papel, propriedade, versão, estado e saldo. Ações: `list`, `balances`, `save_demand`, `remove_demand`, `archive_demand`, `candidates`, `draft`, `submit`, `respond`, `cancel`. `draft` recebe `{id: demandId, items: [{offer_id, quantity}], hours}`; ações de proposta recebem `{id: loadId, version}`; resposta adiciona `decision` accepted/rejected e cancelamento exige `reason`.

Os nomes abaixo seguem como contratos lógicos. A implementação M2 usa esse único gateway, lança erros traduzidos pelo serviço e retorna JSON. `save_demand` recebe `{product_id,quantity,destination_id,desired_date,id?,version?}`. `list` retorna demandas do comprador e propostas visíveis ao participante, itens em snapshot, confirmações e histórico. Produtor vê somente seus itens e não vê rascunhos. `balances` retorna somente id e saldo de ofertas que o perfil pode consultar. Não há endpoint M2 para editar carga: cancelar e remontar preserva os aceites/snapshots anteriores.

## Padrões

### Implementação M3 — 07/11/2026

`src/services/m3.js` usa `supabase.rpc('m3', {action,payload})`; gateway público invoker e função privada com identidade, papel, propriedade, versão e estado validados. Ações: `list`, `save_vehicle`, `indicate`, `quote`, `select_quote`, `confirm`. Payload de proposta: `{id:loadId,version}`. `indicate` adiciona `{carrier_id,total_cents}`; `select_quote` adiciona `{quote_id}`; `confirm` registra aceite final da versão selecionada. Cancelamento reutiliza `m2('cancel', ...)`, estendido aos estados M3.

`save_vehicle` recebe `{description,capacity_kg,vehicle_category,conservation_conditions}`. Veículos são imutáveis no M3 para preservar condições cotadas; outro cadastro representa outras condições. Conservação: `ambient` ou `refrigerated`, declarada pelo transportador e aceita na versão final, sem certificação sanitária. Peso conhecido vem exclusivamente de itens em kg.

`quote` recebe `{id,version,vehicle_id,indication_id?,total_cents,departure_address,departure_time,delivery_time,expires_at,conservation_required,services_included,return_address?}`. Os quatro serviços `fuel,tolls,pickups,unloading` devem ser `true`: frete manual final cobre todos, inclusive eventual retorno acordado. Validade futura limitada à reserva; saída futura; entrega na data da carga. Condições e capacidade incompatíveis impedem publicar/selecionar/ratificar. Sem editor de cotação: cancelar/remontar para alterar roteiro/preço/data.

`list` retorna `{vehicles,carriers,loads}` com itens, cotações, aceites e eventos; produtor recebe apenas seus itens. Transportador consulta cargas abertas a cotação e histórico em que cotou/foi indicado, com suas próprias cotações. Nenhuma escrita REST direta é concedida. Seleção incrementa versão e copia cotação imutável; aceites anteriores ficam no histórico. Trigger calcula `subtotal_cents`, `freight_cents`, `platform_fee_cents=0` e `total_cents` no banco. Sem cotação selecionada, frete/total são nulos.

- IDs string UUID; quantidade decimal válida até três casas; moeda em centavos inteiros; timestamps ISO 8601.
- Resultado: `{ data, error }`; erro com `code`, `message` em português e `fieldErrors` quando aplicável.
- Códigos: VALIDATION_ERROR, FORBIDDEN, NOT_FOUND, INSUFFICIENT_STOCK, INVALID_STATE, EXPIRED_PROPOSAL, VERSION_CONFLICT, EXTERNAL_UNAVAILABLE.
- Identidade é obtida da sessão validada; IDs enviados pelo navegador não concedem autorização.
- Cliente nunca escolhe total final confiável, estoque disponível ou destinatário de pagamento arbitrário.

## Cadastros — M1/M2

### Adaptador de conversa M6 — implementação local em avaliação — 10/11/2026

`answerOfferChat(draft,name,answer,catalog)` valida uma resposta explícita e retorna `{draft,error}`, preservando o rascunho anterior quando inválida. `validateChatDraft` reutiliza `validateOffer`, acrescenta datas de calendário e opções do catálogo/coleta do perfil. Quantidade aceita até três casas, reais até duas e conversão para centavos é a mesma do formulário. Datas DD/MM/AAAA são normalizadas para ISO; vencimento desconhecido vira `null`. Nenhuma escrita ocorre nesses adaptadores.

Somente a confirmação separada da prévia chama `useOffers.save(data,null)` → `saveOffer(session,data,null)`. Payload real: `{product_id,quantity_total,unit_price_cents,minimum_net_unit_cents,available_from,available_until,expires_on,pickup_location_id,status:'published'}`. Dono continua derivado da sessão/banco; texto da conversa não é persistido nem enviado a IA externa. Não há endpoint, tabela ou migration M6 nova. RLS/validações do Supabase existentes continuam como autoridade; sem ambiente remoto mantém a demonstração em memória identificada. Bloqueio em memória evita confirmações simultâneas no mesmo diálogo, sem prometer idempotência em queda de resposta ou entre abas. Em 10/11/2026, AC22 foi exercitado por eventos do componente em jsdom e pelo serviço real com Auth/RLS demo; revisão de navegador, teclado/360 px e F5 continuam pendentes.

### Serviços de cadastro

- `offers.listPublished(filters)` → ofertas publicadas com produtor, produto, saldo, preço e disponibilidade.
- `offers.listMine()` → ofertas do produtor autenticado na demo.
- `offers.create(input)` → nova oferta validada; dono derivado da sessão.
- `offers.update(id, input, expectedVersion)` → atualiza sem reduzir estoque abaixo de compromisso.
- `offers.remove(id)` → apaga apenas sem vínculos; com vínculos responde instrução de arquivamento.
- `offers.archive(id)` → indisponível para novas seleções, preservando histórico.
- `demands.create/listMine/update/remove` → mesmas regras de propriedade e histórico.

Exemplo de entrada de oferta:

```json
{
  "productId": "<uuid-alface>",
  "quantityTotal": "30.000",
  "unitPriceCents": 500,
  "minimumNetUnitCents": 400,
  "availableFrom": "<data-ISO>",
  "availableUntil": "<data-ISO>",
  "pickupLocationId": "<uuid-local-ficticio>"
}
```

Validar que início/fim fazem sentido para a data corrente; dados seed precisam datas configuráveis, evitando exemplos vencidos.

## Operação — M2/M3

- `matching.findCandidates(demandId)` → compatíveis, incompatibilidades e motivo de inclusão; sem preço de frete inventado.
- `loads.createDraft(demandId, items[])` → composição editável sem reserva.
- `loads.submit(id, expectedVersion)` → reserva transacional, status e expiresAt; falha reverte todas as reservas.
- `loads.respondProducer(id, decision, expectedVersion)` → aceita/recusa somente seus itens da versão atual.
- `quotes.indicate(loadId, carrierId, proposedPrice)` → indicação pendente, não cotação aceita.
- `quotes.confirm/create(loadId, vehicleId, itinerary, finalPrice, inclusions, expiresAt)` → transportador responsável confirma.
- `loads.approveBuyer(id, quoteId, expectedVersion)` → aceite do total; `loads.confirmCarrier` ratifica viagem.
- `viability.evaluate(loadId)` → `{status: pending|needs_adjustment|eligible, checks[], perProducer[], totals}`; eligible financeiro não significa agendado/pago.
- `loads.cancel(id, reason)` → autorização e estado validados; libera saldo e estorna uma vez quando necessário.

## Rotas — M4

### Primeira fatia local — 08/11/2026

`src/services/m4.js` chama gateway `public.m4(action,payload)` invoker e função privada com identidade demo validada. `candidates` recebe `{id:demandId}`, reutiliza M2 e acrescenta `completed_sales` (cargas distintas entregues do produtor) e `waiting_days` (idade da oferta). Herda a manutenção de expiração M2. `route` recebe `{id:loadId,version,quote_id}` e exige comprador proprietário ou transportador dono da cotação confirmada da versão atual. Não recebe paradas/preços arbitrários do navegador.

`route` retorna `{loadId,version,quoteId,stops,status:'manual',provider:null,isSimulated:false,distanceMeters:null,drivingSeconds:null,stopSeconds:null,tollAmountCents:null,currency:'BRL',freightCents,servicesIncluded,warnings}`. Cada parada contém `kind,address,stopSeconds:null`; coleta inclui `itemId,producerName`. Nenhuma estimativa externa, gravação de rota ou novo aceite é criado. `isSimulated:false` significa ausência de estimativa sintética; os dados da demo continuam fictícios. Migration preparada localmente; ativação remota e API externa pendentes. Detalhes em `m4-routes.md`.

### Contrato planejado de estimativa externa

`routes.estimate(stops[], departureTime, vehicleProfile)` → `{distanceMeters, drivingSeconds, stopSeconds, tollAmountCents: number|null, currency, provider, isSimulated, warnings[]}`.

Validações: perfil do veículo suportado; pelo menos partida/destino; pontos completos; dados desconhecidos nulos. Retornar polyline apenas para exibição conforme termos do fornecedor. Nunca substituir falha por dados fictícios sem marcação. Não mostrar “sem pedágio” quando informação não retornou.

Integração final com Google Routes é proposta, não credencial ou cobertura já verificadas para o cenário. Confirmar faturamento, limites, suporte de veículo e termos antes de habilitar. Chamada autenticada e limitada no servidor; evitar proxy aberto que exponha custos.

## Simulações — M5 (contrato lógico)

- `payments.simulate(loadId, expectedVersion, outcome, idempotencyKey)` → tentativa e estado; mesmo pedido idempotente devolve mesmo resultado. Aprovado valida aceites, cotação, reservas e valores na mesma operação.
- `loads.startTransit(id)` → apenas transportador selecionado, carga scheduled com pagamento aprovado.
- `loads.confirmReceipt(id, discrepancies?)` → comprador; divergência cria ocorrência e segura repasses.
- `payouts.simulate(loadId)` → servidor usa snapshots aprovados; único por beneficiário/carga/tipo.

Controles de resultado de pagamento ficam no modo demo; não são desenho de pagamento de produção.

### Implementação local — 09/11/2026

`services/m5.js` chama `public.m5(action,payload)` invoker e função privada com identidade demo, propriedade, papel, versão e estado validados. Ações: `list`, `pay`, `cancel`, `start`, `report`, `discrepancy`, `resolve`, `receive`. Mutação recebe `{id:loadId,version}`. Sem escrita REST direta nas tabelas M5. A migration ainda não foi aplicada ao demo.

`pay` acrescenta `{outcome:'pending'|'approved'|'declined',idempotency_key:uuid}`. Mesma chave/carga/versão/resultado devolve a tentativa original (com status atual, inclusive estorno); reutilização incompatível é rejeitada. Total, destinatários e estoque nunca vêm do cliente. Revalida cotação, partida futura, reserva válida/quantidade, aceites, peso/conservação e mínimos. Aprovação converte a própria reserva em compromisso e agenda atomicamente; resultado pendente/recusado não agenda. Outra chave pode iniciar nova tentativa antes da aprovação; não atualiza tentativa pendente nem presume callback. Uma aprovação por carga, inclusive após estorno.

`cancel` exige `{reason}` de até 500 caracteres. Antes do transporte cancela, libera e estorna uma única vez; repetir carga cancelada não repete efeitos. Em trânsito/análise, acrescentar `idempotency_key` abre ocorrência sem estorno/liberação. `start` é exclusivo do transportador selecionado após pagamento aprovado. `report` permite ocorrência pelos participantes da carga em trânsito; `discrepancy` é exclusivo do comprador. Ambos exigem `{reason,idempotency_key}`; repetição compatível devolve a mesma ocorrência. Uma carga pode ter várias ocorrências.

`resolve` recebe `{occurrence_id,resolution}`: comprador registra texto sem concluir recebimento. `receive`, também exclusivo do comprador, exige trânsito iniciado e todas as ocorrências resolvidas; cria repasses únicos na mesma transação e marca delivered. Repetição não gera novos repasses. Não existe endpoint separado que permita antecipar repasses.

`list` preserva o envelope M3 e acrescenta por carga `{payments,payouts,occurrences}`. Comprador vê tentativas de suas cargas e todos os seus beneficiários; produtor/transportador selecionado veem seus próprios repasses, não tentativas do comprador. Ocorrências são compartilhadas apenas com os participantes envolvidos; transportador não selecionado não ganha acesso às tabelas M5. O serviço usa M3 como fallback **somente** quando a RPC M5 não existe, informa `m5Available:false` e não oferece mutações M5. Falhas de rede não são convertidas em sucesso/fallback. Consultas preservam a expiração M3 exclusivamente pré-pagamento.

Transportador que cotou e não foi escolhido conserva a consulta de sua cotação, mas o histórico de eventos fica vazio após a seleção de outro transportador, inclusive no gateway M3: descrições/resoluções de ocorrência não podem vazar por eventos textuais.


## Revisão de cotações, negociação e avisos — implementação local

Migration 202611090002_quote_revisions.sql acrescenta quoteRevisionAvailable:true à lista M3/M5. Sem a migration, a apresentação confirmada funciona e o botão de edição fica desabilitado com aviso. A consulta de avisos retorna indisponibilidade explícita quando a RPC não existe, preservando o fluxo anterior.

Gateway public.transport_updates(action,payload), invoker, delega ao schema privado. Mutações validam usuário demo, papel, carga/versão, cotação atual/dono, estado pré-pagamento e reservas. Compartilha advisory lock M2/M3/M5. Datas mantêm data desejada em São Paulo e validade limitada à reserva. Veículo pertence ao transportador, com capacidade/conservação compatíveis. Roteiro/itens/serviços não são editados por este endpoint.

- list → {available:true,notifications:[]}, exclusivamente destinatário da sessão. read recebe notification_id; grava read_at só do destinatário.
- revise recebe {id,version,quote_id,vehicle_id,departure_time,delivery_time,expires_at,reason}. Frete vem da cotação no banco; adulteração de total_cents é rejeitada. Cria snapshot de cotação com revision/previous_quote_id, marca a anterior superseded_at e notifica comprador/produtores com antes/depois/motivo. Se selecionada, incrementa versão da carga e retorna awaiting_final_approval. Se candidata, mantém versão da carga; a escolha futura continua exigindo todos os aceites finais.
- request_price recebe {id,version,quote_id,proposed_cents,reason,direct_contact:true}. Proposta não muda até a decisão do comprador. approve_price/reject_price recebem os IDs da carga/versão/cotação e negotiation_id; somente comprador responsável decide. Aprovação ignora valor enviado pelo navegador e usa proposed_cents persistido, gera revisão e avisos. Recusa abre a escolha da transportadora entre keep_price e preview_fee/withdraw. Negociação pendente/recusada bloqueia seleção/aceites/pagamento da respectiva cotação, incluindo chamadas diretas ao banco. Mudança de versão/encerramento da carga fecha negociações obsoletas como superseded, avisa comprador/transportadora e não cobra taxa.
- preview_fee usa os mesmos IDs mais negotiation_id recusada. Retorna {base_cents,rate_percent,amount_cents,deadline,expiry_missing,is_simulated:true}, calculados no servidor: menor prazo até entrega/fim do vencimento informado em São Paulo, 5% acima de 72h, 15% acima de 24h até 72h e 30% até 24h. Vencimento ausente usa entrega, sem presumir validade alimentar.
- withdraw exige negotiation_id, accept_fee:true, expected_fee_cents e expected_rate_percent. Recalcula e recusa confirmação desatualizada. Registra uma taxa simulada por negociação, parcelas exatas, encerra a negociação, invalida aceites finais e reabre a carga em awaiting_quotes. Reserva não é liberada, ampliada ou descontada novamente. Fornecimentos dos produtores são preservados para posterior seleção/novos aceites finais.

A taxa fica em carrier_cancellation_fees com base/percentual/valor/prazo/ausência de vencimento; carrier_fee_shares guarda metade para comprador e metade distribuída proporcionalmente aos alimentos dos produtores. Centavo ímpar vai ao comprador; resíduos dos produtores ficam no último UUID; alimentos de total zero usam divisão igual. Não integra pagamento, repasse M5 ou conta financeira real. Gateway e RLS restringem taxa/parcelas aos envolvidos; produtor vê sua própria parcela, comprador e transportadora responsável veem a distribuição.

Encaminhamento escolhe outra transportadora demo com veículo compatível, por nome/UUID, excluindo desistentes da mesma carga. Persiste replacement_carrier_id e aviso individual. Sem candidata, mantém null e pendência explícita. Não cria cotação/aceite/preço automaticamente. A desistente não publica nova cotação nessa carga; futuras cargas seguem livres. Cotação substituída não pode ser selecionada, comparada ou usada para roteiro. Duplicatas legadas são preservadas no banco e apenas a selecionada, ou a mais recente de cada transportadora/versão, segue visível.

Oferta recebe expires_on opcional; constraint exige data igual/posterior ao fim da disponibilidade. Trigger copia product_expires_on nos novos load_items. Não preenche histórico por suposição nem muda snapshot quando a oferta é editada. CRUD de ofertas sem vencimento mantém fallback para o schema anterior; vencimento explícito em schema sem a coluna retorna orientação de atualização, preservando campos.

Avisos do site são persistidos por destinatário, consultados na entrada e a cada 30s/foco da janela; ação local também solicita atualização. Não há e-mail, WhatsApp, push externo ou promessa de entrega instantânea. Sem migration remota/validação conectada nesta entrega.
