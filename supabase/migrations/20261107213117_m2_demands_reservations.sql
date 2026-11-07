-- M2. Arquivo fonte; migration gerada pela CLI antes da entrega.
begin;
create schema if not exists conexa_private;
revoke all on schema conexa_private from public, anon;
grant usage on schema conexa_private to authenticated;

create table public.demands (
 id uuid primary key default gen_random_uuid(), buyer_id uuid not null default auth.uid() references public.participants(id),
 product_id uuid not null references public.products(id), destination_id uuid not null references public.locations(id),
 quantity numeric not null check(quantity > 0 and quantity <= 1000000 and quantity = round(quantity,3)),
 desired_date date not null, status text not null default 'open' check(status in ('open','archived')),
 version integer not null default 1, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index on public.demands(buyer_id);
create index on public.demands(product_id);
create index on public.demands(destination_id);
create table public.loads (
 id uuid primary key default gen_random_uuid(), buyer_id uuid not null references public.participants(id),
 demand_id uuid not null references public.demands(id) on delete restrict,
 status text not null default 'draft' check(status in ('draft','awaiting_producers','awaiting_quotes','cancelled','expired')),
 version integer not null default 1, scheduled_date date not null, destination_address text not null,
 reservation_hours integer not null default 24 check(reservation_hours between 1 and 168),
 expires_at timestamptz, subtotal_cents bigint not null default 0, reason text,
 created_at timestamptz not null default now()
);
create index on public.loads(buyer_id);
create index on public.loads(demand_id);
create unique index one_active_load_per_demand on public.loads(demand_id) where status in ('draft','awaiting_producers','awaiting_quotes');
create table public.load_items (
 id uuid primary key default gen_random_uuid(), load_id uuid not null references public.loads(id) on delete restrict,
 offer_id uuid not null references public.offers(id) on delete restrict, producer_id uuid not null references public.participants(id),
 quantity numeric not null check(quantity > 0 and quantity = round(quantity,3)), offer_version integer not null,
 product_name text not null, unit text not null, unit_price_cents integer not null, minimum_net_unit_cents integer not null,
 pickup_address text not null, gross_cents bigint not null, minimum_cents bigint not null,
 unique(load_id, offer_id)
);
create index on public.load_items(offer_id);
create index on public.load_items(producer_id);
create table public.reservations (
 id uuid primary key default gen_random_uuid(), load_item_id uuid not null unique references public.load_items(id),
 offer_id uuid not null references public.offers(id), quantity numeric not null check(quantity>0), expires_at timestamptz not null,
 status text not null default 'active' check(status in ('active','committed','released'))
);
create index on public.reservations(offer_id, status, expires_at);
create table public.confirmations (
 id uuid primary key default gen_random_uuid(), load_id uuid not null references public.loads(id),
 participant_id uuid not null references public.participants(id), proposal_version integer not null,
 decision text not null check(decision in ('accepted','rejected')), decided_at timestamptz not null default now(),
 unique(load_id, participant_id, proposal_version)
);
create index on public.confirmations(participant_id);
create table public.load_events (
 id uuid primary key default gen_random_uuid(), load_id uuid not null references public.loads(id),
 actor_id uuid references public.participants(id), event text not null, created_at timestamptz not null default now()
);
create index on public.load_events(load_id);

-- Privilegiadas somente no schema privado: escrita composta não pode ser contornada por REST.
create function conexa_private.can_read_load(target uuid) returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from public.loads l where l.id=target and
 (l.buyer_id=auth.uid() or (l.status<>'draft' and exists(select 1 from public.load_items i where i.load_id=l.id and i.producer_id=auth.uid()))));
$$;
revoke all on function conexa_private.can_read_load(uuid) from public, anon;
grant execute on function conexa_private.can_read_load(uuid) to authenticated;

alter table public.demands enable row level security;
alter table public.loads enable row level security;
alter table public.load_items enable row level security;
alter table public.reservations enable row level security;
alter table public.confirmations enable row level security;
alter table public.load_events enable row level security;
revoke all on public.demands,public.loads,public.load_items,public.reservations,public.confirmations,public.load_events from anon,authenticated;
grant select on public.demands,public.loads,public.load_items,public.reservations,public.confirmations,public.load_events to authenticated;
create policy demands_read on public.demands for select to authenticated using(buyer_id=(select auth.uid()));
create policy loads_read on public.loads for select to authenticated using(conexa_private.can_read_load(id));
create policy items_read on public.load_items for select to authenticated using(exists(select 1 from public.loads l where l.id=load_id and (l.buyer_id=(select auth.uid()) or (l.status<>'draft' and producer_id=(select auth.uid())))));
create policy reservations_read on public.reservations for select to authenticated using(exists(select 1 from public.load_items i where i.id=load_item_id));
create policy confirmations_read on public.confirmations for select to authenticated using(conexa_private.can_read_load(load_id));
create policy events_read on public.load_events for select to authenticated using(conexa_private.can_read_load(load_id));

create function conexa_private.offer_balance(target uuid) returns numeric language sql stable security definer set search_path='' as $$
 select o.quantity_total-coalesce((select sum(r.quantity) from public.reservations r where r.offer_id=o.id and
 (r.status='committed' or (r.status='active' and r.expires_at>clock_timestamp()))),0) from public.offers o where o.id=target;
$$;
revoke all on function conexa_private.offer_balance(uuid) from public,anon,authenticated;

create function conexa_private.protect_linked_offer() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.quantity_total < old.quantity_total-conexa_private.offer_balance(old.id) then
   raise exception 'Quantidade não pode ficar abaixo do saldo reservado ou comprometido.';
 end if;
 if exists(select 1 from public.load_items where offer_id=old.id) and
 (new.product_id<>old.product_id or new.producer_id<>old.producer_id or new.pickup_location_id<>old.pickup_location_id) then
   raise exception 'Oferta vinculada: preserve alimento e coleta; arquive e crie outra oferta.';
 end if;
 return new;
end;
$$;
revoke all on function conexa_private.protect_linked_offer() from public,anon,authenticated;
create trigger protect_linked_offer before update on public.offers for each row execute function conexa_private.protect_linked_offer();

create function conexa_private.m2(action text, payload jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
#variable_conflict use_column
declare
 uid uuid:=auth.uid(); role_name text; d public.demands; l public.loads; o public.offers;
 entry jsonb; item public.load_items; target uuid; new_id uuid; total numeric:=0; expiration timestamptz;
begin
 select role into role_name from public.participants where id=uid and is_demo;
 if uid is null or role_name is null or role_name not in ('buyer','producer') then raise exception 'Perfil sem permissão para M2.'; end if;
 -- Serializa operações compostas da demonstração. Ofertas são bloqueadas em ordem de UUID abaixo.
 perform pg_advisory_xact_lock(726002);
 -- Expiração sob demanda: saldo ignora reservas vencidas mesmo antes desta limpeza.
 for l in select * from public.loads where status in ('awaiting_producers','awaiting_quotes') and expires_at<=clock_timestamp() order by id for update loop
   update public.reservations set status='released' where load_item_id in(select id from public.load_items where load_id=l.id) and status='active';
   update public.loads set status='expired',reason='Prazo da reserva encerrado.' where id=l.id;
   insert into public.load_events(load_id,event) values(l.id,'Reserva expirada; saldo liberado.');
 end loop;

 if action='balances' then
   return coalesce((select jsonb_agg(jsonb_build_object('id',o.id,'quantity_free',conexa_private.offer_balance(o.id))) from public.offers o where
   (role_name='producer' and o.producer_id=uid) or (role_name='buyer' and o.status='published' and o.available_until>=(now() at time zone 'America/Sao_Paulo')::date)),'[]'::jsonb);
 end if;
 if action='list' then
   return jsonb_build_object('demands',coalesce((select jsonb_agg(to_jsonb(x)) from
    (select d.*,p.name product_name,p.unit,loc.display_address destination_address from public.demands d join public.products p on p.id=d.product_id join public.locations loc on loc.id=d.destination_id where d.buyer_id=uid order by d.created_at desc) x),'[]'::jsonb),
    'loads',coalesce((select jsonb_agg(to_jsonb(x)) from
    (select l.*, (select coalesce(jsonb_agg(to_jsonb(i)||jsonb_build_object('producer_name',p.display_name)),'[]'::jsonb) from public.load_items i join public.participants p on p.id=i.producer_id where i.load_id=l.id and (l.buyer_id=uid or i.producer_id=uid)) items,
    (select coalesce(jsonb_agg(to_jsonb(c)),'[]'::jsonb) from public.confirmations c where c.load_id=l.id) confirmations,
    (select coalesce(jsonb_agg(to_jsonb(e) order by e.created_at),'[]'::jsonb) from public.load_events e where e.load_id=l.id) events
    from public.loads l where conexa_private.can_read_load(l.id) and (l.status<>'draft' or l.buyer_id=uid) order by l.created_at desc) x),'[]'::jsonb));
 end if;

 if action in ('save_demand','remove_demand','archive_demand','candidates','draft') then
   if role_name<>'buyer' then raise exception 'Somente comprador pode gerenciar demandas.'; end if;
   if payload->>'id' is not null then
     select * into d from public.demands where id=(payload->>'id')::uuid and buyer_id=uid for update;
     if not found then raise exception 'Demanda não encontrada para este comprador.'; end if;
   end if;
 end if;
 if action='save_demand' then
   if d.id is not null and (d.version<>(payload->>'version')::int or payload->>'version' is null) then raise exception 'Demanda alterada; atualize a lista.'; end if;
   if d.id is not null and exists(select 1 from public.loads where demand_id=d.id) then raise exception 'Demanda vinculada: arquive e crie outra para preservar a proposta.'; end if;
   if not exists(select 1 from public.locations where id=(payload->>'destination_id')::uuid and owner_id=uid) then raise exception 'Escolha um destino do comprador.'; end if;
   if (payload->>'desired_date')::date < (now() at time zone 'America/Sao_Paulo')::date or payload->>'desired_date' is null then raise exception 'Escolha hoje ou uma data futura.'; end if;
   if d.id is null then
    insert into public.demands(buyer_id,product_id,destination_id,quantity,desired_date) values(uid,(payload->>'product_id')::uuid,(payload->>'destination_id')::uuid,(payload->>'quantity')::numeric,(payload->>'desired_date')::date) returning id into new_id;
   else
    update public.demands set product_id=(payload->>'product_id')::uuid,destination_id=(payload->>'destination_id')::uuid,quantity=(payload->>'quantity')::numeric,desired_date=(payload->>'desired_date')::date,version=version+1,updated_at=now() where id=d.id returning id into new_id;
   end if;
   return jsonb_build_object('id',new_id);
 elsif action in ('remove_demand','archive_demand') then
   if d.id is null then raise exception 'Informe a demanda.'; end if;
   if d.version is distinct from (payload->>'version')::int then raise exception 'Demanda alterada; atualize a lista.'; end if;
   if action='remove_demand' then
     if exists(select 1 from public.loads where demand_id=d.id) then raise exception 'Demanda vinculada ao histórico; use Arquivar.'; end if;
     delete from public.demands where id=d.id;
   else
     if exists(select 1 from public.loads where demand_id=d.id and status in ('draft','awaiting_producers','awaiting_quotes')) then raise exception 'Cancele a proposta ativa antes de arquivar a demanda.'; end if;
     update public.demands set status='archived',version=version+1,updated_at=now() where id=d.id;
   end if;
   return '{}'::jsonb;
 elsif action='candidates' then
   if d.id is null or d.status<>'open' then raise exception 'Demanda indisponível.'; end if;
   return coalesce((select jsonb_agg(to_jsonb(x)) from (select o.*,p.name product_name,p.unit,pa.display_name producer_name,loc.display_address pickup_address,conexa_private.offer_balance(o.id) quantity_free
    from public.offers o join public.products p on p.id=o.product_id join public.participants pa on pa.id=o.producer_id join public.locations loc on loc.id=o.pickup_location_id
    where o.status='published' and o.product_id=d.product_id and d.desired_date between o.available_from and o.available_until and conexa_private.offer_balance(o.id)>0 order by o.created_at,o.id) x),'[]'::jsonb);
 elsif action='draft' then
   if d.id is null or d.status<>'open' or d.desired_date<(now() at time zone 'America/Sao_Paulo')::date then raise exception 'Demanda indisponível ou vencida.'; end if;
   if jsonb_typeof(payload->'items') is distinct from 'array' or jsonb_array_length(payload->'items')=0 then raise exception 'Selecione ofertas.'; end if;
   insert into public.loads(buyer_id,demand_id,scheduled_date,destination_address,reservation_hours)
   select uid,d.id,d.desired_date,display_address,coalesce((payload->>'hours')::int,24) from public.locations where id=d.destination_id returning id into new_id;
   for entry in select value from jsonb_array_elements(payload->'items') loop
    select * into o from public.offers where id=(entry->>'offer_id')::uuid and status='published' and product_id=d.product_id and d.desired_date between available_from and available_until;
    if not found then raise exception 'Oferta incompatível; atualize as candidatas.'; end if;
    insert into public.load_items(load_id,offer_id,producer_id,quantity,offer_version,product_name,unit,unit_price_cents,minimum_net_unit_cents,pickup_address,gross_cents,minimum_cents)
    select new_id,o.id,o.producer_id,(entry->>'quantity')::numeric,o.version,p.name,p.unit,o.unit_price_cents,o.minimum_net_unit_cents,loc.display_address,
    round((entry->>'quantity')::numeric*o.unit_price_cents),round((entry->>'quantity')::numeric*o.minimum_net_unit_cents) from public.products p,public.locations loc where p.id=o.product_id and loc.id=o.pickup_location_id;
    total:=total+(entry->>'quantity')::numeric;
   end loop;
   if total is distinct from d.quantity then raise exception 'A composição deve atender exatamente a demanda; altere a demanda explicitamente para reduzir.'; end if;
   update public.loads set subtotal_cents=(select sum(gross_cents) from public.load_items where load_id=new_id) where id=new_id;
   insert into public.load_events(load_id,actor_id,event) values(new_id,uid,'Composição candidata salva sem reserva. Frete e viabilidade pendentes.');
   return jsonb_build_object('id',new_id);
 elsif action in ('submit','respond','cancel') then
   select * into l from public.loads where id=(payload->>'id')::uuid for update;
   if not found or not conexa_private.can_read_load(l.id) then raise exception 'Proposta não encontrada para este participante.'; end if;
   if l.version is distinct from (payload->>'version')::int then raise exception 'Versão da proposta mudou; atualize.'; end if;
   if action='submit' then
    if role_name<>'buyer' or l.buyer_id<>uid or l.status<>'draft' then raise exception 'Somente comprador envia rascunho.'; end if;
    select * into d from public.demands where id=l.demand_id;
    if d.status<>'open' or d.desired_date<(now() at time zone 'America/Sao_Paulo')::date then raise exception 'Demanda indisponível ou vencida.'; end if;
    perform 1 from public.offers where id in(select offer_id from public.load_items where load_id=l.id) order by id for update;
    expiration:=clock_timestamp()+make_interval(hours=>l.reservation_hours);
    for item in select * from public.load_items where load_id=l.id order by offer_id loop
     select * into o from public.offers where id=item.offer_id;
     if o.status<>'published' or o.version<>item.offer_version or not(l.scheduled_date between o.available_from and o.available_until) then raise exception 'Oferta alterada ou indisponível; cancele e remonte a composição.'; end if;
     if conexa_private.offer_balance(o.id)<item.quantity then raise exception 'Saldo insuficiente; nenhuma reserva foi criada. Atualize a composição.'; end if;
     expiration:=least(expiration,((o.available_until+1)::timestamp at time zone 'America/Sao_Paulo'),((l.scheduled_date+1)::timestamp at time zone 'America/Sao_Paulo'));
    end loop;
    if expiration<=clock_timestamp() then raise exception 'Prazo de disponibilidade encerrado.'; end if;
    insert into public.reservations(load_item_id,offer_id,quantity,expires_at) select id,offer_id,quantity,expiration from public.load_items where load_id=l.id;
    update public.loads set status='awaiting_producers',expires_at=expiration where id=l.id;
    insert into public.load_events(load_id,actor_id,event) values(l.id,uid,'Composição enviada; reservas criadas atomicamente.');
   elsif action='respond' then
    if role_name<>'producer' or l.status<>'awaiting_producers' or not exists(select 1 from public.load_items where load_id=l.id and producer_id=uid) then raise exception 'Resposta não permitida para este perfil ou etapa.'; end if;
    if payload->>'decision' is null or payload->>'decision' not in ('accepted','rejected') then raise exception 'Decisão inválida.'; end if;
    insert into public.confirmations(load_id,participant_id,proposal_version,decision) values(l.id,uid,l.version,payload->>'decision');
    if payload->>'decision'='rejected' then
     update public.loads set status='cancelled',reason='Fornecimento recusado por um produtor.' where id=l.id;
     update public.reservations set status='released' where load_item_id in(select id from public.load_items where load_id=l.id) and status='active';
    elsif not exists(select 1 from public.load_items i where i.load_id=l.id and not exists(select 1 from public.confirmations c where c.load_id=l.id and c.participant_id=i.producer_id and c.proposal_version=l.version and c.decision='accepted')) then
     update public.loads set status='awaiting_quotes' where id=l.id;
    end if;
    insert into public.load_events(load_id,actor_id,event) values(l.id,uid,case when payload->>'decision'='accepted' then 'Produtor aceitou o fornecimento desta versão.' else 'Produtor recusou; proposta cancelada e todas as reservas liberadas.' end);
   else
    if role_name<>'buyer' or l.buyer_id<>uid or l.status not in ('draft','awaiting_producers','awaiting_quotes') then raise exception 'Cancelamento não permitido.'; end if;
    if length(trim(coalesce(payload->>'reason','')))=0 then raise exception 'Informe o motivo do cancelamento.'; end if;
    update public.loads set status='cancelled',reason=left(payload->>'reason',500) where id=l.id;
    update public.reservations set status='released' where load_item_id in(select id from public.load_items where load_id=l.id) and status='active';
    insert into public.load_events(load_id,actor_id,event) values(l.id,uid,'Comprador cancelou; reservas liberadas.');
   end if;
   return jsonb_build_object('id',l.id);
 end if;
 raise exception 'Ação M2 desconhecida.';
end;
$$;
revoke all on function conexa_private.m2(text,jsonb) from public,anon;
grant execute on function conexa_private.m2(text,jsonb) to authenticated;
create function public.m2(action text,payload jsonb default '{}'::jsonb) returns jsonb language sql security invoker set search_path='' as $$ select conexa_private.m2(action,payload); $$;
revoke all on function public.m2(text,jsonb) from public,anon;
grant execute on function public.m2(text,jsonb) to authenticated;

-- Destino fictício sem IDs derivados de usuários hardcoded; seed repetível.
insert into public.locations(owner_id,display_address)
select id,'Restaurante Raiz · destino fictício' from public.participants p where role='buyer' and is_demo and not exists(select 1 from public.locations l where l.owner_id=p.id);
commit;
