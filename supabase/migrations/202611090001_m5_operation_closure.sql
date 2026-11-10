begin;
alter table public.loads drop constraint loads_status_check;
alter table public.loads add constraint loads_status_check check(status in ('draft','awaiting_producers','awaiting_quotes','awaiting_final_approval','awaiting_payment','scheduled','in_transit','delivery_review','delivered','cancelled','expired'));
drop index public.one_active_load_per_demand;
create unique index one_active_load_per_demand on public.loads(demand_id) where status not in ('cancelled','expired');
-- Extend only the demand archive guard; paid stock must never use M2 cancellation/expiry.
do $$
declare definition text:=pg_get_functiondef('conexa_private.m2(text,jsonb)'::regprocedure); updated text;
begin
 updated:=replace(definition,
  'where demand_id=d.id and status in (''draft'',''awaiting_producers'',''awaiting_quotes'',''awaiting_final_approval'',''awaiting_payment''))',
  'where demand_id=d.id and status in (''draft'',''awaiting_producers'',''awaiting_quotes'',''awaiting_final_approval'',''awaiting_payment'',''scheduled'',''in_transit'',''delivery_review''))');
 if updated=definition then raise exception 'Revisar guarda de arquivamento M2 antes de aplicar M5.'; end if;
 execute updated;
end $$;

create table public.payment_attempts (
 id uuid primary key default gen_random_uuid(), load_id uuid not null references public.loads(id),
 proposal_version integer not null, amount_cents bigint not null check(amount_cents>0),
 outcome text not null check(outcome in ('pending','approved','declined')),
 status text not null check(status in ('pending','approved','declined','refunded')),
 idempotency_key uuid not null unique, is_simulated boolean not null default true check(is_simulated),
 created_at timestamptz not null default now(), refunded_at timestamptz,
 check((status='refunded' and outcome='approved' and refunded_at is not null) or (status=outcome and refunded_at is null))
);
create unique index one_approved_payment on public.payment_attempts(load_id) where outcome='approved';
create index on public.payment_attempts(load_id);
create table public.simulated_payouts (
 id uuid primary key default gen_random_uuid(), load_id uuid not null references public.loads(id),
 recipient_id uuid not null references public.participants(id), kind text not null check(kind in ('producer','carrier')),
 amount_cents bigint not null check(amount_cents>0), status text not null default 'completed' check(status='completed'),
 is_simulated boolean not null default true check(is_simulated), created_at timestamptz not null default now(),
 unique(load_id,recipient_id,kind)
);
create index on public.simulated_payouts(recipient_id);
create table public.delivery_occurrences (
 id uuid primary key default gen_random_uuid(), load_id uuid not null references public.loads(id),
 reported_by uuid not null references public.participants(id), request_key uuid not null unique,
 description text not null check(length(trim(description)) between 1 and 500),
 status text not null default 'open' check(status in ('open','resolved')),
 resolution text, resolved_by uuid references public.participants(id), resolved_at timestamptz,
 created_at timestamptz not null default now(),
 check((status='open' and resolution is null and resolved_at is null and resolved_by is null) or
 (status='resolved' and resolution is not null and length(trim(resolution)) between 1 and 500 and resolved_at is not null and resolved_by is not null))
);
create index on public.delivery_occurrences(load_id);
create index on public.delivery_occurrences(reported_by);
create index on public.delivery_occurrences(resolved_by);

create function conexa_private.m5_participant(target uuid) returns boolean language sql stable security definer set search_path='' as $$
 select conexa_private.can_read_load(target) or exists(select 1 from public.loads l join public.transport_quotes q on q.id=l.selected_quote_id where l.id=target and q.carrier_id=auth.uid());
$$;
revoke all on function conexa_private.m5_participant(uuid) from public,anon;
grant execute on function conexa_private.m5_participant(uuid) to authenticated;
-- A carrier may keep its old quotation in M3, but must not read M5 occurrence
-- descriptions embedded in shared events after another carrier is selected.
do $$
declare definition text:=pg_get_functiondef('conexa_private.m3(text,jsonb)'::regprocedure); updated text;
begin
 updated:=replace(definition,
  'from public.load_events e where e.load_id=l.id) events',
  'from public.load_events e where e.load_id=l.id and (role_name<>''carrier'' or l.selected_quote_id is null or conexa_private.m5_participant(l.id))) events');
 if updated=definition then raise exception 'Revisar leitura do histórico M3 antes de aplicar M5.'; end if;
 execute updated;
end $$;
alter table public.payment_attempts enable row level security;
alter table public.simulated_payouts enable row level security;
alter table public.delivery_occurrences enable row level security;
revoke all on public.payment_attempts,public.simulated_payouts,public.delivery_occurrences from public,anon,authenticated;
grant select on public.payment_attempts,public.simulated_payouts,public.delivery_occurrences to authenticated;
create policy payment_read on public.payment_attempts for select to authenticated using(exists(select 1 from public.loads l where l.id=load_id and l.buyer_id=(select auth.uid())));
create policy payout_read on public.simulated_payouts for select to authenticated using(recipient_id=(select auth.uid()) or exists(select 1 from public.loads l where l.id=load_id and l.buyer_id=(select auth.uid())));
create policy occurrence_read on public.delivery_occurrences for select to authenticated using(conexa_private.m5_participant(load_id));

create function conexa_private.m5(action text,payload jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
#variable_conflict use_column
declare uid uuid:=auth.uid(); role_name text; l public.loads; q public.transport_quotes; v public.vehicles;
 attempt public.payment_attempts; occurrence public.delivery_occurrences; result jsonb; entry jsonb; augmented jsonb:='[]';
 request_id uuid; message text; weight numeric;
begin
 select role into role_name from public.participants where id=uid and is_demo;
 if uid is null or role_name is null then raise exception 'Escolha um participante demo autorizado.'; end if;
 perform pg_advisory_xact_lock(726002);
 if action='list' then
  result:=conexa_private.m3('list','{}'::jsonb);
  for entry in select value from jsonb_array_elements(result->'loads') loop
   select * into l from public.loads where id=(entry->>'id')::uuid;
   entry:=entry||jsonb_build_object(
    'payments',coalesce((select jsonb_agg(to_jsonb(p) order by p.created_at,p.id) from public.payment_attempts p where p.load_id=l.id and l.buyer_id=uid),'[]'::jsonb),
    'payouts',coalesce((select jsonb_agg(to_jsonb(p) order by p.kind,p.recipient_id) from public.simulated_payouts p where p.load_id=l.id and (l.buyer_id=uid or p.recipient_id=uid)),'[]'::jsonb),
    'occurrences',coalesce((select jsonb_agg(to_jsonb(o) order by o.created_at,o.id) from public.delivery_occurrences o where o.load_id=l.id and conexa_private.m5_participant(l.id)),'[]'::jsonb));
   augmented:=augmented||jsonb_build_array(entry);
  end loop;
  return result||jsonb_build_object('loads',augmented);
 end if;
 select * into l from public.loads where id=(payload->>'id')::uuid for update;
 if l.id is null or not conexa_private.m5_participant(l.id) then raise exception 'Operação indisponível para este participante.'; end if;
 if l.version is distinct from (payload->>'version')::integer then raise exception 'Proposta alterada; atualize a lista.'; end if;
 select * into q from public.transport_quotes where id=l.selected_quote_id and load_id=l.id and load_version=l.version and status='confirmed';

 if action='pay' then
  if role_name<>'buyer' or l.buyer_id<>uid then raise exception 'Somente comprador simula pagamento.'; end if;
  request_id:=(payload->>'idempotency_key')::uuid;
  if request_id is null or payload->>'outcome' is null or payload->>'outcome' not in ('pending','approved','declined') then raise exception 'Informe resultado e chave da simulação.'; end if;
  select * into attempt from public.payment_attempts where idempotency_key=request_id;
  if found then
   if attempt.load_id<>l.id or attempt.proposal_version<>l.version or attempt.outcome<>payload->>'outcome' then raise exception 'Chave já usada em outra simulação.'; end if;
   return to_jsonb(attempt);
  end if;
  if l.status<>'awaiting_payment' then raise exception 'Pagamento fora de ordem; consulte o histórico.'; end if;
  if q.id is null or q.expires_at<=clock_timestamp() or q.departure_time<=clock_timestamp() or l.expires_at<=clock_timestamp() then raise exception 'Cotação ou reserva vencida; cancele e remonte a proposta.'; end if;
  if not exists(select 1 from public.load_items where load_id=l.id) or exists(
   select 1 from (select producer_id participant from public.load_items where load_id=l.id union select l.buyer_id union select q.carrier_id) p
   where not exists(select 1 from public.confirmations c where c.load_id=l.id and c.participant_id=p.participant and c.proposal_version=l.version and c.decision='accepted')
  ) then raise exception 'Aceites finais incompletos.'; end if;
  select * into v from public.vehicles where id=q.vehicle_id and carrier_id=q.carrier_id;
  select sum(quantity) into weight from public.load_items where load_id=l.id;
  if v.id is null or exists(select 1 from public.load_items where load_id=l.id and unit<>'kg') or v.capacity_kg<weight or v.conservation_conditions<>q.conservation_required then raise exception 'Peso, capacidade ou conservação incompatível.'; end if;
  if exists(select 1 from public.load_items where load_id=l.id and (gross_cents<minimum_cents or gross_cents<>round(quantity*unit_price_cents) or minimum_cents<>round(quantity*minimum_net_unit_cents))) or
   l.subtotal_cents is distinct from (select sum(gross_cents) from public.load_items where load_id=l.id) or l.freight_cents is distinct from q.total_cents or l.total_cents is distinct from l.subtotal_cents+q.total_cents or l.platform_fee_cents<>0 then raise exception 'Valores ou mínimo individual inválidos.'; end if;
  perform 1 from public.offers where id in(select offer_id from public.load_items where load_id=l.id) order by id for update;
  if exists(select 1 from public.load_items i where i.load_id=l.id and not exists(select 1 from public.reservations r where r.load_item_id=i.id and r.offer_id=i.offer_id and r.quantity=i.quantity and r.status='active' and r.expires_at>clock_timestamp())) or
   exists(select 1 from public.load_items i where i.load_id=l.id and conexa_private.offer_balance(i.offer_id)<0) then raise exception 'Reserva indisponível; cancele e remonte a proposta.'; end if;
  insert into public.payment_attempts(load_id,proposal_version,amount_cents,outcome,status,idempotency_key)
   values(l.id,l.version,l.total_cents,payload->>'outcome',payload->>'outcome',request_id) returning * into attempt;
  if attempt.status='approved' then
   update public.reservations set status='committed' where load_item_id in(select id from public.load_items where load_id=l.id) and status='active';
   update public.loads set status='scheduled' where id=l.id;
  end if;
  insert into public.load_events(load_id,actor_id,event) values(l.id,uid,case attempt.status when 'approved' then 'Pagamento simulado aprovado; reserva convertida em compromisso e agendamento fictício liberado.' when 'declined' then 'Pagamento simulado recusado; transporte não liberado.' else 'Pagamento simulado pendente; transporte não liberado.' end);
  return to_jsonb(attempt);
 elsif action='cancel' then
  if role_name<>'buyer' or l.buyer_id<>uid then raise exception 'Somente comprador cancela a operação.'; end if;
  if l.status='cancelled' then return jsonb_build_object('id',l.id,'status',l.status); end if;
  if l.status in ('in_transit','delivery_review') then
   -- After departure this request reports an occurrence; it never releases stock or refunds.
   action:='report';
  elsif l.status in ('draft','awaiting_producers','awaiting_quotes','awaiting_final_approval','awaiting_payment','scheduled') then
   message:=trim(coalesce(payload->>'reason',''));
   if length(message) not between 1 and 500 then raise exception 'Informe motivo com até 500 caracteres.'; end if;
   update public.payment_attempts set status='refunded',refunded_at=clock_timestamp() where load_id=l.id and status='approved';
   update public.reservations set status='released' where load_item_id in(select id from public.load_items where load_id=l.id) and status in ('active','committed');
   update public.loads set status='cancelled',reason=message where id=l.id;
   insert into public.load_events(load_id,actor_id,event) values(l.id,uid,'Operação cancelada: '||message||'. Estoque liberado; pagamento aprovado estornado uma única vez, em simulação.');
   return jsonb_build_object('id',l.id,'status','cancelled');
  else raise exception 'Cancelamento fora de ordem.';
  end if;
 end if;

 if action='start' then
  if role_name<>'carrier' or q.carrier_id is distinct from uid then raise exception 'Somente transportador selecionado inicia a viagem.'; end if;
  if l.status='in_transit' then return jsonb_build_object('id',l.id,'status',l.status); end if;
  if l.status<>'scheduled' or not exists(select 1 from public.payment_attempts where load_id=l.id and status='approved') then raise exception 'Viagem exige agendamento e pagamento simulado aprovado.'; end if;
  update public.loads set status='in_transit' where id=l.id;
  message:='Transportador iniciou a viagem fictícia.';
 elsif action in ('report','discrepancy') then
  if action='discrepancy' and (role_name<>'buyer' or l.buyer_id<>uid) then raise exception 'Somente comprador informa divergência no recebimento.'; end if;
  request_id:=(payload->>'idempotency_key')::uuid;
  message:=trim(coalesce(payload->>'reason',''));
  if request_id is null or length(message) not between 1 and 500 then raise exception 'Informe descrição de até 500 caracteres e chave da ocorrência.'; end if;
  select * into occurrence from public.delivery_occurrences where request_key=request_id;
  if found then
   if occurrence.load_id<>l.id or occurrence.reported_by<>uid or occurrence.description<>message then raise exception 'Chave já usada em outra ocorrência.'; end if;
   return to_jsonb(occurrence);
  end if;
  if l.status not in ('in_transit','delivery_review') then raise exception 'Ocorrência exige transporte iniciado.'; end if;
  insert into public.delivery_occurrences(load_id,reported_by,request_key,description) values(l.id,uid,request_id,message);
  update public.loads set status='delivery_review' where id=l.id;
  message:='Ocorrência registrada: '||message||'. Estoque em trânsito preservado; repasses em análise.';
 elsif action='resolve' then
  if role_name<>'buyer' or l.buyer_id<>uid then raise exception 'Somente comprador registra a resolução.'; end if;
  message:=trim(coalesce(payload->>'resolution',''));
  if length(message) not between 1 and 500 then raise exception 'Descreva a resolução com até 500 caracteres.'; end if;
  select * into occurrence from public.delivery_occurrences where id=(payload->>'occurrence_id')::uuid and load_id=l.id for update;
  if occurrence.id is null then raise exception 'Ocorrência não encontrada.'; end if;
  if occurrence.status='resolved' then
   if occurrence.resolution<>message then raise exception 'Resolução já registrada; atualize.'; end if;
   return to_jsonb(occurrence);
  end if;
  if l.status<>'delivery_review' then raise exception 'Resolução fora de ordem.'; end if;
  update public.delivery_occurrences set status='resolved',resolution=message,resolved_by=uid,resolved_at=clock_timestamp() where id=occurrence.id;
  message:='Comprador registrou resolução: '||message||'. Recebimento ainda precisa ser confirmado.';
 elsif action='receive' then
  if role_name<>'buyer' or l.buyer_id<>uid then raise exception 'Somente comprador confirma recebimento.'; end if;
  if l.status='delivered' then return jsonb_build_object('id',l.id,'status',l.status); end if;
  if l.status not in ('in_transit','delivery_review') or exists(select 1 from public.delivery_occurrences where load_id=l.id and status='open') then raise exception 'Recebimento exige viagem iniciada e todas as ocorrências resolvidas.'; end if;
  if not exists(select 1 from public.payment_attempts where load_id=l.id and status='approved') or q.id is null then raise exception 'Pagamento aprovado e cotação selecionada são obrigatórios.'; end if;
  insert into public.simulated_payouts(load_id,recipient_id,kind,amount_cents)
   select l.id,producer_id,'producer',sum(gross_cents) from public.load_items where load_id=l.id group by producer_id
   union all select l.id,q.carrier_id,'carrier',q.total_cents;
  update public.loads set status='delivered' where id=l.id;
  message:='Comprador confirmou recebimento; repasses simulados concluídos uma única vez. Nenhum dinheiro transferido.';
 else raise exception 'Ação M5 desconhecida.';
 end if;
 insert into public.load_events(load_id,actor_id,event) values(l.id,uid,message);
 return jsonb_build_object('id',l.id);
end $$;
revoke all on function conexa_private.m5(text,jsonb) from public,anon;
grant execute on function conexa_private.m5(text,jsonb) to authenticated;
create function public.m5(action text,payload jsonb default '{}'::jsonb) returns jsonb language sql security invoker set search_path='' as $$ select conexa_private.m5(action,payload); $$;
revoke all on function public.m5(text,jsonb) from public,anon;
grant execute on function public.m5(text,jsonb) to authenticated;
commit;
