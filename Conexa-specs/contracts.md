# Contratos de serviços propostos

Interfaces abaixo são contratos lógicos, não endpoints de backend já implementados. CRUD simples usa cliente Supabase com RLS. Operações compostas usam funções transacionais; rotas externas usam servidor.

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

## Simulações — M5

- `payments.simulate(loadId, expectedVersion, outcome, idempotencyKey)` → tentativa e estado; mesmo pedido idempotente devolve mesmo resultado. Aprovado valida aceites, cotação, reservas e valores na mesma operação.
- `loads.startTransit(id)` → apenas transportador selecionado, carga scheduled com pagamento aprovado.
- `loads.confirmReceipt(id, discrepancies?)` → comprador; divergência cria ocorrência e segura repasses.
- `payouts.simulate(loadId)` → servidor usa snapshots aprovados; único por beneficiário/carga/tipo.

Controles de resultado de pagamento ficam no modo demo; não são desenho de pagamento de produção.
