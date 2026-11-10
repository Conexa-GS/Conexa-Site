# Modelo de dados proposto

Proposta técnica, a converter em migrations versionadas. Não criar todas as tabelas no M1. Supabase/PostgreSQL é a persistência; serviços não podem contornar integridade financeira ou de estoque.

## Convenções

- IDs UUID; datas de auditoria em UTC; exibição em America/Sao_Paulo.
- Preço unitário em centavos por unidade; quantidades em numeric com até três casas. Valores não negativos e quantidades estritamente positivas.
- Arredondar cada valor de linha ao centavo mais próximo, metade para cima, usando aritmética decimal ou inteiros escalados; somar linhas já arredondadas. Exibir quantidade e unidade. Definir precisão e validar antes de gravar.
- Totais financeiros calculados/validados no servidor; não confiar em total enviado pelo cliente.
- Intervalo de disponibilidade com início <= fim; moeda BRL no MVP.
- `archived_at` para arquivamento; `created_at` e `updated_at` nos cadastros.
- Índices nas chaves estrangeiras, status e filtros de produto/região.

## Entidades por marco

| Entidade | Principais campos e relações | Marco |
| --- | --- | --- |
| participants | id, display_name, role (producer/buyer/carrier), city, region, is_demo | M1 |
| products | id, name, unit (kg no primeiro cenário) | M1 |
| offers | id, producer_id, product_id, quantity_total, unit_price_cents, minimum_net_unit_cents, available_from, available_until, pickup_location_id, status | M1 |
| locations | id, city, region, display_address, latitude/longitude opcionais; localização fictícia identificada | M1 |
| demands | id, buyer_id, product_id, quantity, desired_date, destination_id, status | M2 |
| loads | id, buyer_id, status, version, scheduled_date, selected_quote_id opcional, subtotal_cents, freight_cents, platform_fee_cents=0, total_cents | M2/M3 |
| load_items | id, load_id, demand_id, offer_id, quantity, snapshots de produto/unidade/preço/mínimo, gross_cents, net_cents | M2 |
| reservations | id, load_item_id único, offer_id, quantity, expires_at, status (active/committed/released) | M2 |
| confirmations | id, load_id, participant_id, proposal_version, decision, decided_at; único por participante/versão | M2/M3 |
| vehicles | id, carrier_id, description, capacity_kg, vehicle_category, conservation_conditions | M3 |
| transport_quotes | id, load_id, carrier_id, vehicle_id, source (carrier/producer_indication), indicated_by opcional, status, total_cents, expires_at, services_included, departure_time, load_version | M3 |
| route_stops | id, load_id, position, location_id, kind (departure/pickup/destination/return), stop_minutes | M3 |
| payment_attempts | id, load_id, proposal_version, amount_cents, status (pending/approved/declined/refunded), idempotency_key, is_simulated=true | M5 |
| simulated_payouts | id, load_id, recipient_id, kind, amount_cents, status; único por carga/destinatário/tipo | M5 |
| operation_events | id, load_id, participant_id, event_type, from_status, to_status, version, reason, created_at | M2+ |
| delivery_occurrences | id, load_id, description, status, resolution, resolved_at | M5 |

Dados da rota externa: consultar sob demanda; não persistir respostas, geocodificação, polylines ou estimativas de fornecedor sem verificar seus termos de uso e armazenamento. Cotação acordada e roteiro próprio podem ser registrados; não tratá-los como cópia de resposta externa.

Primeira fatia M4 (08/11/2026): nenhuma tabela nova. `m4('route')` monta o roteiro próprio dos snapshots de `load_items`, `loads` e `transport_quotes`, ordenando coletas por UUID; não cria `route_stops` nem armazena conteúdo externo. `m4('candidates')` retorna somente agregados de cargas distintas `delivered` por produtor e idade de oferta; estados de entrega ainda dependem de M5. Não expõe registros de outras vendas nem cria histórico sintético. Migration preparada localmente, com validação remota pendente; detalhes em `m4-routes.md`.

## Relações centrais

Produtor 1:N ofertas. Comprador 1:N demandas/cargas. Carga 1:N itens. Cada item referencia uma oferta e uma demanda do mesmo comprador da carga. Carga 1:N cotações e 0:1 cotação selecionada. Cotação selecionada precisa pertencer à própria carga e à versão válida.

## Saldo

`livre = quantity_total - SUM(reservas active não expiradas) - SUM(reservas committed)`.

Pagamento aprovado converte reserva ativa em comprometida na mesma transação; não criar um segundo desconto. Entrega preserva o compromisso no histórico. Cancelamento pré-transporte libera; arquivamento de oferta não libera compromissos.

Não permitir reduzir quantity_total abaixo da soma reservada/comprometida. Reserva expirada nunca pode ser convertida em compromisso sem nova validação atômica.

## Snapshots e integridade

Guardar preço/mínimo acordados nos itens. Atualizar uma oferta não altera silenciosamente uma proposta existente. Validar `version` e aceites na confirmação. Ações dependentes de diversas linhas (reserva, aprovação, cancelamento, pagamento) são transacionais via RPC/função no banco ou serviço servidor.

## Acesso no modo de demonstração

Implementação M5 local em 09/11/2026: migration `202611090001_m5_operation_closure.sql` cria `payment_attempts`, `simulated_payouts` e `delivery_occurrences` com RLS e escrita exclusiva via RPC. `payment_attempts.outcome` preserva o resultado solicitado; `status` pode passar de approved para refunded com `refunded_at`. Chave UUID única e índice parcial sobre outcome=approved impedem segunda aprovação mesmo após estorno. Repasse tem unicidade carga/destinatário/tipo. Ocorrência guarda autor, chave de repetição, descrição, status, resolução, comprador responsável e datas. Histórico reutiliza `load_events` existente, sem criar `operation_events` paralelos. Uma demanda entregue permanece atendida; só cancelada/expirada permite remontagem. Arquivar demanda com carga scheduled/in_transit/delivery_review é bloqueado. Compromissos pagos não expiram com a reserva original. Migration/testes remotos ainda pendentes; PGlite não comprova Auth/RLS do demo.

Não usar seletor visual como identidade confiável. Plano técnico inicial: usuários fictícios previamente criados no Supabase Auth, um por participante, para o servidor/banco aplicar RLS; o seletor abre uma sessão de demonstração correspondente. Sem cadastro público de pessoas reais.

Escolher e documentar o mecanismo de sessão antes do M1: credenciais de demo têm acesso deliberadamente limitado, ou função servidor cria a sessão. Nunca expor service_role. Se a configuração ainda não existir, oferecer apenas modo local explicitamente simulado; isso não completa o aceite do CRUD remoto.

Políticas mínimas: produtor modifica suas ofertas; comprador modifica suas demandas; transportador modifica seus veículos/cotações. Comprador consulta ofertas publicadas; cada participante consulta cargas em que participa. Transições protegidas em funções com validação de identidade. Público não pode atualizar indiscriminadamente todos os registros. Testar RLS com identidades diferentes.


## Extensão local — revisão de cotação e negociação — 09/11/2026

- offers.expires_on: vencimento opcional distinto de disponibilidade; não antecede available_until. load_items.product_expires_on: snapshot capturado na composição, nullable para histórico desconhecido.
- transport_quotes.revision, previous_quote_id, superseded_at: revisões preservam linhas anteriores, preço e roteiro não mudam sem ações autorizadas. Revisão selecionada aponta a nova selected_quote_id e incrementa loads.version. Candidata revisada mantém a versão da composição até sua seleção.
- transport_notifications: destinatário, carga, cotação, versão, mensagem, JSON de alterações e created_at/read_at. RLS só do destinatário; marcar leitura via RPC autenticada. Aviso de substituição não revela negociação ou parcela da desistente à transportadora seguinte.
- freight_negotiations: cotação/carga, transportadora, comprador, novo valor em centavos, motivo, status pending/approved/rejected/kept_original/withdrawn/superseded e datas. Uma negociação aberta por cotação; só comprador e transportadora consultam. Mudança da carga encerra negociações obsoletas.
- carrier_cancellation_fees: única por negociação, base original, percentual 5/15/30, total em centavos, prazo considerado, flag de vencimento ausente, responsável e is_simulated sempre true. carrier_fee_shares: parcelas por beneficiário/tipo; soma preserva o total, sem alterar alimentos/frete/repasse M5.
- loads.replacement_carrier_id: transportadora compatível notificada automaticamente, sem aceitar/preencher cotação por ela; null quando não encontrada. Reservas existentes permanecem ativas e sujeitas ao prazo original.

Sem escrita REST direta em negociações, notificações, taxas ou parcelas. Gateways privados e advisory lock já usado pelas reservas/aceites/pagamento serializam mutações. Nenhum dado novo inventa vencimentos históricos, contas financeiras ou cobrança real. Contratos, distribuição e permissões em contracts.md; aplicação remota pendente.
