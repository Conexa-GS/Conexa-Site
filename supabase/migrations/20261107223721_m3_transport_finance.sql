begin;
alter table public.loads drop constraint loads_status_check;
alter table public.loads add constraint loads_status_check check(status in ('draft','awaiting_producers','awaiting_quotes','awaiting_final_approval','awaiting_payment','cancelled','expired'));
alter table public.loads add column selected_quote_id uuid;
drop index public.one_active_load_per_demand;
create unique index one_active_load_per_demand on public.loads(demand_id) where status in ('draft','awaiting_producers','awaiting_quotes','awaiting_final_approval','awaiting_payment');
-- Preserve M2 validation and extend pre-payment expiry/cancellation to M3 states.
do $$ begin execute replace(pg_get_functiondef('conexa_private.m2(text,jsonb)'::regprocedure),'''awaiting_producers'',''awaiting_quotes'')','''awaiting_producers'',''awaiting_quotes'',''awaiting_final_approval'',''awaiting_payment'')'); end $$;

create table public.vehicles (
 id uuid primary key default gen_random_uuid(), carrier_id uuid not null references public.participants(id),
 description text not null check(length(trim(description)) between 1 and 120),
 capacity_kg numeric not null check(capacity_kg>0 and capacity_kg<=1000000 and capacity_kg=round(capacity_kg,3)),
 vehicle_category text not null check(length(trim(vehicle_category)) between 1 and 80),
 conservation_conditions text not null check(conservation_conditions in ('ambient','refrigerated')),
 created_at timestamptz not null default now()
);
create index on public.vehicles(carrier_id);
create table public.transport_quotes (
 id uuid primary key default gen_random_uuid(), load_id uuid not null references public.loads(id),
 carrier_id uuid not null references public.participants(id), vehicle_id uuid references public.vehicles(id),
 indicated_by uuid references public.participants(id), status text not null check(status in ('indicated','confirmed')),
 load_version integer not null, total_cents bigint not null check(total_cents>0 and total_cents<=100000000),
 departure_address text, departure_time timestamptz, delivery_time timestamptz, expires_at timestamptz,
 conservation_required text check(conservation_required in ('ambient','refrigerated')),
 services_included jsonb, return_address text, created_at timestamptz not null default now(),
 check(status='indicated' or (vehicle_id is not null and length(trim(departure_address))>0 and departure_time is not null and delivery_time>departure_time and expires_at is not null and conservation_required is not null and services_included is not null))
);
create index on public.transport_quotes(load_id);
create index on public.transport_quotes(carrier_id);
create index on public.transport_quotes(vehicle_id);
create index on public.transport_quotes(indicated_by);
alter table public.loads add constraint loads_selected_quote_fk foreign key(selected_quote_id) references public.transport_quotes(id);
create index on public.loads(selected_quote_id);
alter table public.vehicles enable row level security;
alter table public.transport_quotes enable row level security;
revoke all on public.vehicles,public.transport_quotes from public,anon,authenticated;
grant select on public.vehicles,public.transport_quotes to authenticated;
create policy vehicle_read on public.vehicles for select to authenticated using(carrier_id=(select auth.uid()));
create policy quote_read on public.transport_quotes for select to authenticated using(carrier_id=(select auth.uid()) or conexa_private.can_read_load(load_id));

create function conexa_private.m3(action text,payload jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
#variable_conflict use_column
declare uid uuid:=auth.uid(); role_name text; l public.loads; q public.transport_quotes; v public.vehicles; result_id uuid; weight numeric;
begin
 select role into role_name from public.participants where id=uid and is_demo;
 if uid is null or role_name is null then raise exception 'Escolha um participante demo autorizado.'; end if;
 perform pg_advisory_xact_lock(726002);
 -- Same lock as M2; expiry is independent of the caller's profile.
 for l in select * from public.loads where status in ('awaiting_producers','awaiting_quotes','awaiting_final_approval','awaiting_payment') and expires_at<=clock_timestamp() for update loop
  update public.loads set status='expired',reason='Prazo da reserva encerrado.' where id=l.id;
  update public.reservations set status='released' where load_item_id in(select id from public.load_items where load_id=l.id) and status='active';
  insert into public.load_events(load_id,event) values(l.id,'Reserva expirada; saldo liberado.');
 end loop;
 if action='list' then
  return jsonb_build_object('vehicles',coalesce((select jsonb_agg(to_jsonb(v)) from public.vehicles v where carrier_id=uid),'[]'::jsonb),
   'carriers',coalesce((select jsonb_agg(jsonb_build_object('id',id,'display_name',display_name)) from public.participants where role='carrier' and is_demo),'[]'::jsonb),
   'loads',coalesce((select jsonb_agg(to_jsonb(x)) from (
    select l.*, (select coalesce(jsonb_agg(to_jsonb(i)||jsonb_build_object('producer_name',p.display_name)),'[]'::jsonb) from public.load_items i join public.participants p on p.id=i.producer_id where i.load_id=l.id and (role_name in ('buyer','carrier') or i.producer_id=uid)) items,
    (select coalesce(jsonb_agg(to_jsonb(q)),'[]'::jsonb) from public.transport_quotes q where q.load_id=l.id and (role_name<>'carrier' or q.carrier_id=uid)) quotes,
    (select coalesce(jsonb_agg(to_jsonb(c)),'[]'::jsonb) from public.confirmations c where c.load_id=l.id) confirmations,
    (select coalesce(jsonb_agg(to_jsonb(e) order by e.created_at),'[]'::jsonb) from public.load_events e where e.load_id=l.id) events
    from public.loads l where (role_name='carrier' and (l.status='awaiting_quotes' or exists(select 1 from public.transport_quotes q where q.load_id=l.id and q.carrier_id=uid))) or (role_name in ('buyer','producer') and conexa_private.can_read_load(l.id) and l.status<>'draft')
   ) x),'[]'::jsonb));
 end if;
 if action='save_vehicle' then
  if role_name<>'carrier' then raise exception 'Somente transportador cadastra veículo.'; end if;
  insert into public.vehicles(carrier_id,description,capacity_kg,vehicle_category,conservation_conditions) values(uid,payload->>'description',(payload->>'capacity_kg')::numeric,payload->>'vehicle_category',payload->>'conservation_conditions') returning id into result_id;
  return jsonb_build_object('id',result_id);
 end if;
 select * into l from public.loads where id=(payload->>'id')::uuid for update;
 if l.id is null or l.version is distinct from (payload->>'version')::int then raise exception 'Proposta alterada ou inexistente; atualize a lista.'; end if;
 if action in ('indicate','quote') then
  if l.status<>'awaiting_quotes' then raise exception 'Aguarde os fornecimentos ou remonte a proposta para alterar o roteiro.'; end if;
  if action='indicate' then
   if role_name<>'producer' or not exists(select 1 from public.load_items where load_id=l.id and producer_id=uid) then raise exception 'Somente produtor desta proposta pode indicar.'; end if;
   if not exists(select 1 from public.participants where id=(payload->>'carrier_id')::uuid and role='carrier' and is_demo) then raise exception 'Escolha um transportador fictício.'; end if;
   insert into public.transport_quotes(load_id,carrier_id,indicated_by,status,load_version,total_cents) values(l.id,(payload->>'carrier_id')::uuid,uid,'indicated',l.version,(payload->>'total_cents')::bigint) returning id into result_id;
  else
   if role_name<>'carrier' then raise exception 'Somente transportador confirma sua cotação.'; end if;
   select * into v from public.vehicles where id=(payload->>'vehicle_id')::uuid and carrier_id=uid;
   if v.id is null then raise exception 'Escolha seu veículo.'; end if;
   if payload->>'indication_id' is not null then
    select * into q from public.transport_quotes where id=(payload->>'indication_id')::uuid and load_id=l.id and carrier_id=uid and status='indicated' and load_version=l.version;
    if q.id is null then raise exception 'Indicação não pertence ao transportador ou versão.'; end if;
   end if;
   if coalesce(length(trim(payload->>'departure_address')),0)=0 then raise exception 'Informe a saída do transportador.'; end if;
   if jsonb_typeof(payload->'services_included') is distinct from 'object' or not (payload->'services_included' @> '{"fuel":true,"tolls":true,"pickups":true,"unloading":true}'::jsonb) then raise exception 'Valor final deve incluir combustível, pedágios, todas as coletas e descarga.'; end if;
   if (payload->>'expires_at')::timestamptz<=clock_timestamp() or (payload->>'expires_at')::timestamptz>l.expires_at or (payload->>'departure_time')::timestamptz<=clock_timestamp() or ((payload->>'delivery_time')::timestamptz at time zone 'America/Sao_Paulo')::date<>l.scheduled_date then raise exception 'Revise validade, saída e entrega na data desejada; validade limitada à reserva.'; end if;
   insert into public.transport_quotes(load_id,carrier_id,vehicle_id,indicated_by,status,load_version,total_cents,departure_address,departure_time,delivery_time,expires_at,conservation_required,services_included,return_address)
   values(l.id,uid,v.id,q.indicated_by,'confirmed',l.version,(payload->>'total_cents')::bigint,payload->>'departure_address',(payload->>'departure_time')::timestamptz,(payload->>'delivery_time')::timestamptz,(payload->>'expires_at')::timestamptz,payload->>'conservation_required',payload->'services_included',nullif(trim(payload->>'return_address'),'')) returning id into result_id;
  end if;
 elsif action in ('select_quote','confirm') then
  if action='select_quote' then
   if role_name<>'buyer' or l.buyer_id<>uid or l.status<>'awaiting_quotes' then raise exception 'Somente comprador seleciona cotação após fornecimentos.'; end if;
   select * into q from public.transport_quotes where id=(payload->>'quote_id')::uuid and load_id=l.id and load_version=l.version and status='confirmed';
  else
   if l.status<>'awaiting_final_approval' then raise exception 'Confirmação final fora de ordem.'; end if;
   select * into q from public.transport_quotes where id=l.selected_quote_id and load_id=l.id and load_version=l.version and status='confirmed';
   if not (l.buyer_id=uid or q.carrier_id=uid or exists(select 1 from public.load_items where load_id=l.id and producer_id=uid)) then raise exception 'Participante não pertence à proposta.'; end if;
  end if;
  if q.id is null or q.expires_at<=clock_timestamp() then raise exception 'Cotação ausente ou vencida; cancele e remonte a proposta.'; end if;
  select * into v from public.vehicles where id=q.vehicle_id and carrier_id=q.carrier_id;
  select sum(quantity) into weight from public.load_items where load_id=l.id;
  if weight is null or exists(select 1 from public.load_items where load_id=l.id and unit<>'kg') or v.capacity_kg<weight or v.conservation_conditions<>q.conservation_required then raise exception 'Peso, capacidade ou conservação incompatível.'; end if;
  if exists(select 1 from public.load_items where load_id=l.id and (gross_cents<minimum_cents or gross_cents<>round(quantity*unit_price_cents) or minimum_cents<>round(quantity*minimum_net_unit_cents))) then raise exception 'Mínimo individual ou cálculo inválido.'; end if;
  if exists(select 1 from public.load_items i where i.load_id=l.id and not exists(select 1 from public.reservations r where r.load_item_id=i.id and r.status='active' and r.expires_at>clock_timestamp())) then raise exception 'Reserva indisponível.'; end if;
  if action='select_quote' then
   if exists(select 1 from public.load_items i where i.load_id=l.id and not exists(select 1 from public.confirmations c where c.load_id=l.id and c.participant_id=i.producer_id and c.proposal_version=l.version and c.decision='accepted')) then raise exception 'Fornecimentos pendentes.'; end if;
   -- Snapshot immutable quote for the final version; prior confirmations remain in history.
   insert into public.transport_quotes(load_id,carrier_id,vehicle_id,indicated_by,status,load_version,total_cents,departure_address,departure_time,delivery_time,expires_at,conservation_required,services_included,return_address)
   values(q.load_id,q.carrier_id,q.vehicle_id,q.indicated_by,q.status,l.version+1,q.total_cents,q.departure_address,q.departure_time,q.delivery_time,q.expires_at,q.conservation_required,q.services_included,q.return_address) returning id into result_id;
   update public.loads set selected_quote_id=result_id,version=version+1,status='awaiting_final_approval' where id=l.id;
  else
   insert into public.confirmations(load_id,participant_id,proposal_version,decision) values(l.id,uid,l.version,'accepted');
   if not exists(select 1 from (select producer_id participant from public.load_items where load_id=l.id union select l.buyer_id union select q.carrier_id) p where not exists(select 1 from public.confirmations c where c.load_id=l.id and c.participant_id=p.participant and c.proposal_version=l.version and c.decision='accepted')) then
    update public.loads set status='awaiting_payment' where id=l.id;
   end if;
  end if;
 else raise exception 'Ação M3 desconhecida.';
 end if;
 insert into public.load_events(load_id,actor_id,event) values(l.id,uid,case action when 'indicate' then 'Indicação de transporte pendente de confirmação.' when 'quote' then 'Transportador confirmou cotação manual completa.' when 'select_quote' then 'Cotação selecionada; nova versão exige todos os aceites finais.' else 'Aceite final registrado para esta versão.' end);
 return jsonb_build_object('id',coalesce(result_id,l.id));
end $$;
revoke all on function conexa_private.m3(text,jsonb) from public,anon;
grant execute on function conexa_private.m3(text,jsonb) to authenticated;
create function public.m3(action text,payload jsonb default '{}'::jsonb) returns jsonb language sql security invoker set search_path='' as $$ select conexa_private.m3(action,payload); $$;
revoke all on function public.m3(text,jsonb) from public,anon;
grant execute on function public.m3(text,jsonb) to authenticated;
commit;
