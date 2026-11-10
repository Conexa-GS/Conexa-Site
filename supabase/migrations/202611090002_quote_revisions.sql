begin;

alter table public.transport_quotes add column revision integer not null default 1 check(revision>0);
alter table public.transport_quotes add column superseded_at timestamptz;
alter table public.transport_quotes add column previous_quote_id uuid references public.transport_quotes(id);
create index on public.transport_quotes(previous_quote_id);
-- Legacy screens allowed repeated quotes. Keep the selected one, otherwise the latest, visible.
with ranked as (
 select q.id,row_number() over(partition by q.load_id,q.carrier_id,q.load_version order by (q.id is not distinct from l.selected_quote_id) desc,q.created_at desc,q.id desc) position
 from public.transport_quotes q join public.loads l on l.id=q.load_id where q.status='confirmed'
)
update public.transport_quotes set superseded_at=clock_timestamp() where id in(select id from ranked where position>1);

alter table public.offers add column expires_on date;
alter table public.offers add constraint offer_expiry_after_availability check(expires_on is null or expires_on>=available_until);
alter table public.load_items add column product_expires_on date;
create function conexa_private.snapshot_product_expiry() returns trigger language plpgsql security definer set search_path='' as $$
begin select expires_on into new.product_expires_on from public.offers where id=new.offer_id; return new; end $$;
revoke all on function conexa_private.snapshot_product_expiry() from public,anon,authenticated;
create trigger snapshot_product_expiry before insert on public.load_items for each row execute function conexa_private.snapshot_product_expiry();

create table public.freight_negotiations (
 id uuid primary key default gen_random_uuid(), load_id uuid not null references public.loads(id), quote_id uuid not null references public.transport_quotes(id),
 carrier_id uuid not null references public.participants(id), buyer_id uuid not null references public.participants(id),
 proposed_cents bigint not null check(proposed_cents>0 and proposed_cents<=100000000), reason text not null check(length(trim(reason)) between 1 and 500),
 status text not null default 'pending' check(status in ('pending','approved','rejected','kept_original','withdrawn','superseded')),
 created_at timestamptz not null default now(), resolved_at timestamptz
);
create index on public.freight_negotiations(load_id);
create index on public.freight_negotiations(carrier_id);
create index on public.freight_negotiations(buyer_id);
create unique index one_open_negotiation_per_quote on public.freight_negotiations(quote_id) where status in ('pending','rejected');
alter table public.freight_negotiations enable row level security;
revoke all on public.freight_negotiations from public,anon,authenticated;
grant select on public.freight_negotiations to authenticated;
create policy negotiation_read on public.freight_negotiations for select to authenticated using(carrier_id=(select auth.uid()) or buyer_id=(select auth.uid()));

alter table public.loads add column replacement_carrier_id uuid references public.participants(id);
create index on public.loads(replacement_carrier_id);
create table public.carrier_cancellation_fees (
 id uuid primary key default gen_random_uuid(), negotiation_id uuid not null unique references public.freight_negotiations(id),
 load_id uuid not null references public.loads(id), carrier_id uuid not null references public.participants(id),
 base_cents bigint not null check(base_cents>0), rate_percent integer not null check(rate_percent in (5,15,30)), amount_cents bigint not null check(amount_cents>=0),
 deadline timestamptz not null, expiry_missing boolean not null, is_simulated boolean not null default true check(is_simulated), created_at timestamptz not null default now()
);
create index on public.carrier_cancellation_fees(load_id);
create index on public.carrier_cancellation_fees(carrier_id);
create table public.carrier_fee_shares (
 fee_id uuid not null references public.carrier_cancellation_fees(id), recipient_id uuid not null references public.participants(id),
 kind text not null check(kind in ('buyer','producer')), amount_cents bigint not null check(amount_cents>=0), primary key(fee_id,recipient_id)
);
create index on public.carrier_fee_shares(recipient_id);
alter table public.carrier_cancellation_fees enable row level security;
alter table public.carrier_fee_shares enable row level security;
revoke all on public.carrier_cancellation_fees,public.carrier_fee_shares from public,anon,authenticated;
grant select on public.carrier_cancellation_fees,public.carrier_fee_shares to authenticated;
create policy fee_read on public.carrier_cancellation_fees for select to authenticated using(carrier_id=(select auth.uid()) or conexa_private.can_read_load(load_id));
create policy fee_share_read on public.carrier_fee_shares for select to authenticated using(recipient_id=(select auth.uid()) or exists(select 1 from public.carrier_cancellation_fees f where f.id=fee_id and f.carrier_id=(select auth.uid())) or exists(select 1 from public.carrier_cancellation_fees f join public.loads l on l.id=f.load_id where f.id=fee_id and l.buyer_id=(select auth.uid())));

create table public.transport_notifications (
 id uuid primary key default gen_random_uuid(), recipient_id uuid not null references public.participants(id),
 load_id uuid not null references public.loads(id), quote_id uuid not null references public.transport_quotes(id),
 proposal_version integer not null, message text not null, changes jsonb not null,
 created_at timestamptz not null default now(), read_at timestamptz
);
create index on public.transport_notifications(load_id);
create index on public.transport_notifications(quote_id);
create index on public.transport_notifications(recipient_id,created_at desc);
alter table public.transport_notifications enable row level security;
revoke all on public.transport_notifications from public,anon,authenticated;
grant select on public.transport_notifications to authenticated;
create policy notification_read on public.transport_notifications for select to authenticated using(recipient_id=(select auth.uid()));

create function conexa_private.close_obsolete_negotiations() returns trigger language plpgsql security definer set search_path='' as $$
declare n public.freight_negotiations;
begin
 if new.version is distinct from old.version or new.status in ('cancelled','expired','scheduled','in_transit','delivery_review','delivered') then
  for n in update public.freight_negotiations set status='superseded',resolved_at=clock_timestamp() where load_id=new.id and status in ('pending','rejected') returning * loop
   insert into public.transport_notifications(recipient_id,load_id,quote_id,proposal_version,message,changes)
   select recipient,new.id,n.quote_id,new.version,'Negociação encerrada porque a proposta mudou de versão ou estado. Não houve alteração de frete nem taxa por esta negociação.',jsonb_build_object('reason','Confira a versão atual da proposta.')
   from (select n.buyer_id recipient union select n.carrier_id) recipients;
  end loop;
 end if;
 return new;
end $$;
revoke all on function conexa_private.close_obsolete_negotiations() from public,anon,authenticated;
create trigger close_obsolete_negotiations after update on public.loads for each row execute function conexa_private.close_obsolete_negotiations();

create function conexa_private.transport_updates(action text,payload jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
#variable_conflict use_column
declare uid uuid:=auth.uid(); role_name text; l public.loads; q public.transport_quotes; v public.vehicles;
 revised public.transport_quotes; reason text; weight numeric; selected boolean; next_version integer; changes jsonb;
 negotiation public.freight_negotiations; new_price bigint; result_id uuid; deadline timestamptz; missing boolean; rate integer; fee bigint; producer_pool bigint; remaining bigint; share bigint; producer record; next_carrier uuid;
begin
 select role into role_name from public.participants where id=uid and is_demo;
 if uid is null or role_name is null then raise exception 'Escolha um participante demo autorizado.'; end if;
 if action='list' then
  return jsonb_build_object('available',true,'notifications',coalesce((select jsonb_agg(to_jsonb(n) order by n.created_at desc,n.id) from public.transport_notifications n where recipient_id=uid),'[]'::jsonb));
 elsif action='read' then
  update public.transport_notifications set read_at=coalesce(read_at,clock_timestamp()) where id=(payload->>'notification_id')::uuid and recipient_id=uid;
  if not found then raise exception 'Notificação indisponível para este participante.'; end if;
  return jsonb_build_object('read',true);
 elsif action not in ('revise','request_price','approve_price','reject_price','keep_price','withdraw','preview_fee') then raise exception 'Ação de atualização desconhecida.';
 end if;
 perform pg_advisory_xact_lock(726002);
 select * into l from public.loads where id=(payload->>'id')::uuid for update;
 if l.id is null or l.version is distinct from (payload->>'version')::integer then raise exception 'Proposta alterada ou inexistente; atualize a lista.'; end if;
 select * into q from public.transport_quotes where id=(payload->>'quote_id')::uuid and load_id=l.id and load_version=l.version and status='confirmed' and superseded_at is null for update;
 if q.id is null then raise exception 'Cotação alterada ou indisponível; atualize a lista.'; end if;
 if action in ('approve_price','reject_price') then
  select * into negotiation from public.freight_negotiations where id=(payload->>'negotiation_id')::uuid and quote_id=q.id and status='pending' for update;
  if role_name<>'buyer' or l.buyer_id<>uid or negotiation.id is null then raise exception 'Somente o comprador responsável aprova ou recusa uma negociação pendente.'; end if;
 else
  if role_name<>'carrier' or q.carrier_id<>uid then raise exception 'Somente a transportadora responsável pode modificar sua cotação atual.'; end if;
  if action in ('keep_price','withdraw','preview_fee') then
   select * into negotiation from public.freight_negotiations where id=(payload->>'negotiation_id')::uuid and quote_id=q.id and status in ('pending','rejected') for update;
   if negotiation.id is null then raise exception 'Negociação alterada ou indisponível.'; end if;
   if action in ('withdraw','preview_fee') and negotiation.status<>'rejected' then raise exception 'A desistência com taxa exige recusa do novo valor pelo comprador.'; end if;
  end if;
 end if;
 if l.status not in ('awaiting_quotes','awaiting_final_approval','awaiting_payment') or exists(select 1 from public.payment_attempts where load_id=l.id and outcome='approved') then
  raise exception 'A cotação só pode ser modificada antes do pagamento aprovado.';
 end if;
 if l.expires_at<=clock_timestamp() or exists(select 1 from public.load_items i where i.load_id=l.id and not exists(select 1 from public.reservations r where r.load_item_id=i.id and r.status='active' and r.expires_at>clock_timestamp())) then
  raise exception 'Reserva encerrada; peça ao comprador para remontar a proposta.';
 end if;
 if l.selected_quote_id is not null and l.selected_quote_id<>q.id then raise exception 'Outra cotação foi selecionada; esta proposta não pode ser modificada.'; end if;
 if action='request_price' then
  new_price:=(payload->>'proposed_cents')::bigint;
  reason:=trim(coalesce(payload->>'reason',''));
  if new_price is null or new_price<=0 or new_price>100000000 or new_price=q.total_cents or length(reason) not between 1 and 500 or coalesce((payload->>'direct_contact')::boolean,false) is not true then raise exception 'Informe novo valor, motivo e confirme a conversa direta com o comprador.'; end if;
  insert into public.freight_negotiations(load_id,quote_id,carrier_id,buyer_id,proposed_cents,reason) values(l.id,q.id,uid,l.buyer_id,new_price,reason) returning id into result_id;
  insert into public.transport_notifications(recipient_id,load_id,quote_id,proposal_version,message,changes) values(l.buyer_id,l.id,q.id,l.version,'A transportadora propôs um novo frete após contato direto. Aprove ou recuse; o valor atual permanece até sua decisão.',jsonb_build_object('reason',reason,'proposed_cents',new_price));
  return jsonb_build_object('id',result_id);
 elsif action='reject_price' then
  update public.freight_negotiations set status='rejected',resolved_at=clock_timestamp() where id=negotiation.id;
  insert into public.transport_notifications(recipient_id,load_id,quote_id,proposal_version,message,changes) values(q.carrier_id,l.id,q.id,l.version,'O comprador recusou o novo frete. Mantenha o preço original ou confira a taxa simulada antes de desistir.',jsonb_build_object('reason',negotiation.reason));
  return jsonb_build_object('id',negotiation.id);
 elsif action='keep_price' then
  update public.freight_negotiations set status='kept_original',resolved_at=clock_timestamp() where id=negotiation.id;
  insert into public.transport_notifications(recipient_id,load_id,quote_id,proposal_version,message,changes) values(l.buyer_id,l.id,q.id,l.version,'A transportadora manteve o frete original. A negociação foi encerrada sem taxa.',jsonb_build_object('reason',negotiation.reason));
  return jsonb_build_object('id',negotiation.id);
 elsif action in ('preview_fee','withdraw') then
  select least(q.delivery_time,min((product_expires_on+1)::timestamp at time zone 'America/Sao_Paulo')),bool_or(product_expires_on is null) into deadline,missing from public.load_items where load_id=l.id;
  rate:=case when deadline-clock_timestamp()<=interval '24 hours' then 30 when deadline-clock_timestamp()<=interval '72 hours' then 15 else 5 end;
  fee:=round(q.total_cents*rate/100.0);
  if action='preview_fee' then return jsonb_build_object('base_cents',q.total_cents,'rate_percent',rate,'amount_cents',fee,'deadline',deadline,'expiry_missing',coalesce(missing,true),'is_simulated',true); end if;
  if (payload->>'expected_fee_cents')::bigint is distinct from fee or (payload->>'expected_rate_percent')::integer is distinct from rate or coalesce((payload->>'accept_fee')::boolean,false) is not true then raise exception 'A taxa mudou ou não foi aceita. Confira o cálculo atualizado antes de desistir.'; end if;
  insert into public.carrier_cancellation_fees(negotiation_id,load_id,carrier_id,base_cents,rate_percent,amount_cents,deadline,expiry_missing) values(negotiation.id,l.id,uid,q.total_cents,rate,fee,deadline,coalesce(missing,true)) returning id into result_id;
  -- Half to the buyer; the remaining cents go to producers in proportion to food value.
  producer_pool:=fee/2; remaining:=producer_pool;
  insert into public.carrier_fee_shares values(result_id,l.buyer_id,'buyer',fee-producer_pool);
  for producer in select producer_id,sum(gross_cents) gross,row_number() over(order by producer_id) position,count(*) over() total from public.load_items where load_id=l.id group by producer_id order by producer_id loop
   share:=case when producer.position=producer.total then remaining when l.subtotal_cents>0 then floor(producer_pool*producer.gross/l.subtotal_cents) else floor(producer_pool/producer.total) end;
   insert into public.carrier_fee_shares values(result_id,producer.producer_id,'producer',share);
   remaining:=remaining-share;
  end loop;
  update public.freight_negotiations set status='withdrawn',resolved_at=clock_timestamp() where id=negotiation.id;
  update public.transport_quotes set superseded_at=clock_timestamp() where id=q.id;
  select p.id into next_carrier from public.participants p where p.role='carrier' and p.is_demo and p.id<>uid
   and not exists(select 1 from public.carrier_cancellation_fees f where f.load_id=l.id and f.carrier_id=p.id)
   and exists(select 1 from public.vehicles v where v.carrier_id=p.id and v.capacity_kg>=(select sum(quantity) from public.load_items where load_id=l.id) and v.conservation_conditions=q.conservation_required)
   order by p.display_name,p.id limit 1;
  update public.loads set selected_quote_id=null,version=version+1,status='awaiting_quotes',freight_cents=null,total_cents=null,replacement_carrier_id=next_carrier where id=l.id;
  insert into public.confirmations(load_id,participant_id,proposal_version,decision)
   select l.id,producer_id,l.version+1,'accepted' from public.load_items i where load_id=l.id and exists(select 1 from public.confirmations c where c.load_id=l.id and c.participant_id=i.producer_id and c.decision='accepted') group by producer_id;
  insert into public.transport_notifications(recipient_id,load_id,quote_id,proposal_version,message,changes)
   select recipient,l.id,q.id,l.version+1,case when recipient=next_carrier then 'Uma proposta foi encaminhada para sua transportadora. Confira o roteiro e envie sua própria cotação.' else 'A transportadora desistiu após a negociação. Taxa simulada registrada. '||case when next_carrier is null then 'Nenhuma substituta compatível foi encontrada; a proposta aguarda transporte.' else 'A proposta foi encaminhada automaticamente a outra transportadora compatível.' end end,jsonb_build_object('reason','Desistência após recusa do novo frete; nenhum dinheiro foi cobrado.')
   from (select l.buyer_id recipient union select producer_id from public.load_items where load_id=l.id union select next_carrier where next_carrier is not null) recipients;
  insert into public.load_events(load_id,actor_id,event) values(l.id,uid,'Transportadora desistiu após recusa do novo frete. Taxa de cancelamento simulada registrada; nova versão aberta para outra transportadora. Fornecimentos preservados; novos aceites finais serão necessários.');
  return jsonb_build_object('id',l.id,'version',l.version+1,'fee_id',result_id,'replacement_carrier_id',next_carrier);
 end if;
 if action='revise' and exists(select 1 from public.freight_negotiations where quote_id=q.id and status in ('pending','rejected')) then raise exception 'Resolva a negociação do frete antes de modificar as condições.'; end if;
 new_price:=case when action='approve_price' then negotiation.proposed_cents else q.total_cents end;
 if action='approve_price' then
  reason:=negotiation.reason;
  payload:=jsonb_build_object('vehicle_id',q.vehicle_id,'departure_time',q.departure_time,'delivery_time',q.delivery_time,'expires_at',q.expires_at);
 else
  if payload ? 'total_cents' and (payload->>'total_cents')::bigint is distinct from q.total_cents then raise exception 'O frete está bloqueado. Uma alteração de preço exige acordo direto com o comprador.'; end if;
  reason:=trim(coalesce(payload->>'reason',''));
 end if;
 if payload ?| array['departure_address','return_address','conservation_required','services_included','scheduled_date'] then raise exception 'Esta edição permite somente veículo, horários e validade; o roteiro e os serviços permanecem acordados.'; end if;
 if length(reason) not between 1 and 500 then raise exception 'Explique a alteração em até 500 caracteres.'; end if;
 select * into v from public.vehicles where id=(payload->>'vehicle_id')::uuid and carrier_id=q.carrier_id;
 select sum(quantity) into weight from public.load_items where load_id=l.id;
 if v.id is null or weight is null or exists(select 1 from public.load_items where load_id=l.id and unit<>'kg') or v.capacity_kg<weight or v.conservation_conditions<>q.conservation_required then raise exception 'Veículo, peso, capacidade ou conservação incompatível.'; end if;
 if payload->>'departure_time' is null or payload->>'delivery_time' is null or payload->>'expires_at' is null
  or (payload->>'departure_time')::timestamptz<=clock_timestamp()
  or (payload->>'delivery_time')::timestamptz<=(payload->>'departure_time')::timestamptz
  or ((payload->>'delivery_time')::timestamptz at time zone 'America/Sao_Paulo')::date<>l.scheduled_date
  or (payload->>'expires_at')::timestamptz<=clock_timestamp() or (payload->>'expires_at')::timestamptz>l.expires_at then
  raise exception 'Revise saída futura, entrega após a saída na data desejada e validade limitada à reserva.';
 end if;
 if action='revise' and q.vehicle_id=(payload->>'vehicle_id')::uuid and q.departure_time=(payload->>'departure_time')::timestamptz and q.delivery_time=(payload->>'delivery_time')::timestamptz and q.expires_at=(payload->>'expires_at')::timestamptz then raise exception 'Nenhuma alteração encontrada.'; end if;
 selected:=l.selected_quote_id=q.id;
 next_version:=l.version+case when selected then 1 else 0 end;
 insert into public.transport_quotes(load_id,carrier_id,vehicle_id,indicated_by,status,load_version,total_cents,departure_address,departure_time,delivery_time,expires_at,conservation_required,services_included,return_address,revision,previous_quote_id)
 values(l.id,q.carrier_id,v.id,q.indicated_by,'confirmed',next_version,new_price,q.departure_address,(payload->>'departure_time')::timestamptz,(payload->>'delivery_time')::timestamptz,(payload->>'expires_at')::timestamptz,q.conservation_required,q.services_included,q.return_address,q.revision+1,q.id) returning * into revised;
 update public.transport_quotes set superseded_at=clock_timestamp() where id=q.id;
 if action='approve_price' then update public.freight_negotiations set status='approved',resolved_at=clock_timestamp() where id=negotiation.id; end if;
 if selected then
  update public.loads set selected_quote_id=revised.id,version=next_version,status='awaiting_final_approval' where id=l.id;
 end if;
 changes:=jsonb_build_object('reason',reason,'requiresConfirmation',coalesce(selected,false),
  'before',jsonb_build_object('vehicle_id',q.vehicle_id,'vehicle', (select description from public.vehicles where id=q.vehicle_id),'departure_time',q.departure_time,'delivery_time',q.delivery_time,'expires_at',q.expires_at,'total_cents',q.total_cents),
  'after',jsonb_build_object('vehicle_id',v.id,'vehicle',v.description,'departure_time',revised.departure_time,'delivery_time',revised.delivery_time,'expires_at',revised.expires_at,'total_cents',revised.total_cents));
 insert into public.transport_notifications(recipient_id,load_id,quote_id,proposal_version,message,changes)
 select recipient,l.id,revised.id,next_version,case when action='approve_price' then 'Novo frete aprovado pelo comprador após negociação direta.' else 'A transportadora modificou a cotação. Frete preservado.' end||case when selected then ' Revise e confirme novamente as condições.' else ' Confira as novas condições antes de selecionar e confirmar.' end,changes
 from (select l.buyer_id recipient union select producer_id from public.load_items where load_id=l.id union select q.carrier_id where action='approve_price') recipients;
 insert into public.load_events(load_id,actor_id,event) values(l.id,uid,'Cotação modificada · revisão '||revised.revision||case when action='approve_price' then '. Novo frete aprovado pelo comprador.' else '. Veículo/horários/validade revisados; frete preservado.' end||' Comprador e produtores notificados no site.'||case when selected then ' Nova versão exige todos os aceites finais.' else '' end);
 return jsonb_build_object('id',l.id,'quote_id',revised.id,'version',next_version);
end $$;
revoke all on function conexa_private.transport_updates(text,jsonb) from public,anon;
grant execute on function conexa_private.transport_updates(text,jsonb) to authenticated;
create function public.transport_updates(action text,payload jsonb default '{}'::jsonb) returns jsonb language sql security invoker set search_path='' as $$ select conexa_private.transport_updates(action,payload); $$;
revoke all on function public.transport_updates(text,jsonb) from public,anon;
grant execute on function public.transport_updates(text,jsonb) to authenticated;

-- Extend the existing gateway without rewriting previously applied migrations.
do $migration$
declare definition text; updated text;
begin
 definition:=pg_get_functiondef('conexa_private.m3(text,jsonb)'::regprocedure);
 updated:=replace(definition, 'jsonb_build_object(''vehicles'',', 'jsonb_build_object(''quoteRevisionAvailable'',true,''vehicles'',');
 if updated=definition then raise exception 'Revisar envelope M3 antes de habilitar revisões.'; end if;
 definition:=updated;
 updated:=replace(definition,'select l.*, (select',
  'select l.*,
   (select coalesce(jsonb_agg(to_jsonb(n) order by n.created_at),''[]''::jsonb) from public.freight_negotiations n where n.load_id=l.id and (n.buyer_id=uid or n.carrier_id=uid)) negotiations,
   (select coalesce(jsonb_agg(to_jsonb(f)||jsonb_build_object(''shares'',(select coalesce(jsonb_agg(to_jsonb(s)),''[]''::jsonb) from public.carrier_fee_shares s where s.fee_id=f.id and (s.recipient_id=uid or f.carrier_id=uid or l.buyer_id=uid)))),''[]''::jsonb) from public.carrier_cancellation_fees f where f.load_id=l.id and (f.carrier_id=uid or conexa_private.can_read_load(l.id))) cancellation_fees,
   (select');
 if updated=definition then raise exception 'Revisar leitura M3 antes de incluir negociação e taxas.'; end if;
 definition:=updated;
 updated:=replace(definition, 'q where q.load_id=l.id and (role_name', 'q where q.load_id=l.id and q.superseded_at is null and (role_name');
 if updated=definition then raise exception 'Revisar lista M3 antes de ocultar revisões substituídas.'; end if;
 definition:=updated;
 updated:=replace(definition, 'if role_name<>''carrier'' then raise exception ''Somente transportador confirma sua cotação.''; end if;',
  'if role_name<>''carrier'' then raise exception ''Somente transportador confirma sua cotação.''; end if;
   if exists(select 1 from public.carrier_cancellation_fees where load_id=l.id and carrier_id=uid) then raise exception ''Sua transportadora desistiu desta proposta; aguarde outras solicitações.''; end if;
   if exists(select 1 from public.transport_quotes where load_id=l.id and carrier_id=uid and load_version=l.version and status=''confirmed'' and superseded_at is null) then raise exception ''Cotação já confirmada; use Modificar proposta. O frete permanece bloqueado.''; end if;');
 if updated=definition then raise exception 'Revisar publicação M3 antes de bloquear recotação.'; end if;
 updated:=replace(updated, 'and status=''confirmed'';', 'and status=''confirmed'' and superseded_at is null;');
 updated:=replace(updated,'if q.id is null or q.expires_at<=clock_timestamp() then',
  'if exists(select 1 from public.freight_negotiations where quote_id=q.id and status in (''pending'',''rejected'')) then raise exception ''Resolva a negociação do frete antes de selecionar ou confirmar a cotação.''; end if;
  if q.id is null or q.expires_at<=clock_timestamp() then');
 updated:=regexp_replace(updated,'(insert into public.transport_quotes\([^)]*return_address)\)([[:space:]]+values\(q.load_id)', '\1,revision,previous_quote_id)\2');
 updated:=replace(updated,'q.services_included,q.return_address) returning id into result_id;', 'q.services_included,q.return_address,q.revision,q.id) returning id into result_id;');
 execute updated;
 definition:=pg_get_functiondef('conexa_private.m4(text,jsonb)'::regprocedure);
 updated:=replace(definition,'and load_id=l.id and load_version=l.version and status=''confirmed'';', 'and load_id=l.id and load_version=l.version and status=''confirmed'' and superseded_at is null;');
 if updated=definition then raise exception 'Revisar consulta de roteiro M4 antes de habilitar revisões.'; end if;
 execute updated;
 definition:=pg_get_functiondef('conexa_private.m5(text,jsonb)'::regprocedure);
 updated:=replace(definition,'if action=''pay'' then', 'if action=''pay'' then
  if exists(select 1 from public.freight_negotiations where quote_id=q.id and status in (''pending'',''rejected'')) then raise exception ''Resolva a negociação do frete antes do pagamento.''; end if;');
 if updated=definition then raise exception 'Revisar pagamento M5 antes de habilitar negociações.'; end if;
 execute updated;
end $migration$;
commit;
