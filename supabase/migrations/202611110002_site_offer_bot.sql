-- T35–T37: rascunhos privados e comandos atômicos. Somente local até autorização.
begin;
alter table public.site_messages add column speaker text not null default 'human' check(speaker in ('human','bot'));
create table public.site_bot_drafts (
 conversation_id uuid primary key references public.site_conversations(id),
 owner_id uuid not null references public.participants(id),
 revision integer not null check(revision>0), intent text not null check(intent in ('create','edit','archive','consult','cancel')),
 target_id uuid references public.offers(id), fields jsonb not null,
 before_offer jsonb, expected_balance numeric,
 status text not null check(status in ('draft','applied','cancelled','conflict')),
 updated_at timestamptz not null default now()
);
create table public.site_bot_requests (
 owner_id uuid not null references public.participants(id), request_id uuid not null,
 conversation_id uuid not null references public.site_conversations(id),
 payload jsonb not null, result jsonb not null, created_at timestamptz not null default now(),
 primary key(owner_id,request_id)
);
alter table public.site_bot_drafts enable row level security;
alter table public.site_bot_requests enable row level security;
revoke all on public.site_bot_drafts,public.site_bot_requests from public,anon,authenticated;
grant select on public.site_bot_drafts,public.site_bot_requests to authenticated;
create policy bot_draft_owner on public.site_bot_drafts for select to authenticated using(owner_id=(select auth.uid()) and public.site_is_member(conversation_id));
create policy bot_request_owner on public.site_bot_requests for select to authenticated using(owner_id=(select auth.uid()) and public.site_is_member(conversation_id));

-- Contrato canônico compartilhado pelo formulário e pelo bot. Triggers existentes
-- continuam validando dono/coleta/datas, saldo e campos vinculados ao histórico.
create function conexa_private.write_offer(p_data jsonb,p_id uuid,p_version integer,p_archive boolean default false) returns jsonb
language plpgsql security definer set search_path='' as $$
declare o public.offers; actor uuid:=auth.uid();
begin
 if public.demo_role() is distinct from 'producer' then raise exception 'Somente produtores podem alterar ofertas.'; end if;
 if p_id is not null then
  select * into o from public.offers where id=p_id and producer_id=actor for update;
  if not found then raise exception 'Oferta indisponível para este produtor.'; end if;
  if p_version is null or o.version<>p_version then raise exception 'Esta oferta mudou. Refaça a prévia.'; end if;
 end if;
 if p_archive then
  if p_id is null then raise exception 'Escolha uma oferta para arquivar.'; end if;
  update public.offers set status='archived' where id=o.id returning * into o;
 else
  if coalesce(p_data->>'quantity_total','') !~ '^\d+(\.\d{1,3})?$' or
     coalesce(p_data->>'unit_price_cents','') !~ '^\d+$' or coalesce(p_data->>'minimum_net_unit_cents','') !~ '^\d+$' then
   raise exception 'Quantidade e valores devem respeitar milésimos e centavos inteiros.';
  end if;
  if not exists(select 1 from public.products where id=(p_data->>'product_id')::uuid and unit='kg') then raise exception 'Escolha um alimento em kg do catálogo.'; end if;
  if p_id is null then
   insert into public.offers(producer_id,product_id,pickup_location_id,quantity_total,unit_price_cents,minimum_net_unit_cents,available_from,available_until,expires_on)
   values(actor,(p_data->>'product_id')::uuid,(p_data->>'pickup_location_id')::uuid,(p_data->>'quantity_total')::numeric,(p_data->>'unit_price_cents')::integer,(p_data->>'minimum_net_unit_cents')::integer,(p_data->>'available_from')::date,(p_data->>'available_until')::date,nullif(p_data->>'expires_on','')::date) returning * into o;
  else
   update public.offers set product_id=(p_data->>'product_id')::uuid,pickup_location_id=(p_data->>'pickup_location_id')::uuid,
    quantity_total=(p_data->>'quantity_total')::numeric,unit_price_cents=(p_data->>'unit_price_cents')::integer,minimum_net_unit_cents=(p_data->>'minimum_net_unit_cents')::integer,
    available_from=(p_data->>'available_from')::date,available_until=(p_data->>'available_until')::date,expires_on=nullif(p_data->>'expires_on','')::date
    where id=o.id returning * into o;
  end if;
 end if;
 return to_jsonb(o);
end; $$;
revoke all on function conexa_private.write_offer(jsonb,uuid,integer,boolean) from public,anon,authenticated;
create function public.save_offer(p_data jsonb,p_id uuid default null,p_version integer default null,p_archive boolean default false) returns jsonb
language sql security definer set search_path='' as $$ select conexa_private.write_offer(p_data,p_id,p_version,p_archive); $$;
revoke all on function public.save_offer(jsonb,uuid,integer,boolean) from public,anon;
grant execute on function public.save_offer(jsonb,uuid,integer,boolean) to authenticated;

create function public.site_bot(p_action text,p_payload jsonb default '{}') returns jsonb
language plpgsql security definer set search_path='' as $$
declare
 actor uuid:=auth.uid(); actor_role text; cid uuid:=(p_payload->>'conversation_id')::uuid;
 d public.site_bot_drafts; o public.offers; saved jsonb; result jsonb; previous public.site_bot_requests;
 key uuid; intent_name text; body_text text; reply text; canonical jsonb; balance numeric;
begin
 select role into actor_role from public.participants where id=actor and is_demo;
 if actor_role is null or actor_role not in ('producer','buyer') then raise exception 'Participante não autorizado.'; end if;
 if not exists(select 1 from public.site_conversations where id=cid and kind='bot' and created_by=actor) or not public.site_is_member(cid) then raise exception 'Bot indisponível para este participante.'; end if;
 if p_action='messages' then
  if p_payload->>'after_seq' is not null then
   if (p_payload->>'after_seq')::bigint<0 or p_payload->>'before_seq' is not null then raise exception 'Cursor de histórico inválido.'; end if;
   return jsonb_build_object('messages',coalesce((select jsonb_agg(to_jsonb(x)||jsonb_build_object('seq',x.seq::text) order by x.seq)
    from (select * from public.site_messages where conversation_id=cid and seq>(p_payload->>'after_seq')::bigint order by seq limit 40) x),'[]'::jsonb),
    'has_more',(select count(*)>40 from (select 1 from public.site_messages where conversation_id=cid and seq>(p_payload->>'after_seq')::bigint limit 41) x));
  end if;
  return jsonb_build_object('messages',coalesce((select jsonb_agg(to_jsonb(x)||jsonb_build_object('seq',x.seq::text) order by x.seq)
   from (select * from public.site_messages where conversation_id=cid and seq<coalesce((p_payload->>'before_seq')::bigint,9223372036854775807) order by seq desc limit 40) x),'[]'::jsonb),
   'has_more',(select count(*)>40 from (select 1 from public.site_messages where conversation_id=cid and seq<coalesce((p_payload->>'before_seq')::bigint,9223372036854775807) limit 41) x));
 end if;
 if p_action='state' then
  return jsonb_build_object('draft',(select to_jsonb(x) from public.site_bot_drafts x where conversation_id=cid),
   'offers',coalesce((select jsonb_agg(to_jsonb(x)||jsonb_build_object('quantity_free',conexa_private.offer_balance(x.id),'products',jsonb_build_object('name',p.name)))
    from public.offers x join public.products p on p.id=x.product_id where x.status='published' and
     ((actor_role='producer' and x.producer_id=actor) or (actor_role='buyer' and x.available_until>=(now() at time zone 'America/Sao_Paulo')::date))),'[]'::jsonb),
   'catalog',jsonb_build_object('products',coalesce((select jsonb_agg(to_jsonb(p) order by p.name) from public.products p),'[]'::jsonb),
    'locations',coalesce((select jsonb_agg(to_jsonb(l) order by l.display_address) from public.locations l where owner_id=actor),'[]'::jsonb)));
 end if;
 if p_action not in ('turn','confirm') then raise exception 'Ação do bot desconhecida.'; end if;
 key:=(p_payload->>'request_id')::uuid;
 if key is null or octet_length(p_payload::text)>16000 then raise exception 'Pedido inválido ou muito grande.'; end if;
 perform pg_advisory_xact_lock(hashtextextended(actor::text||key::text,1));
 select * into previous from public.site_bot_requests where owner_id=actor and request_id=key;
 if found then
  if previous.payload<>jsonb_build_object('action',p_action,'payload',p_payload) then raise exception 'Chave já usada com outro conteúdo.'; end if;
  return previous.result;
 end if;
 -- Todas as revisões e mensagens do bot são serializadas pela conversa.
 perform 1 from public.site_conversations where id=cid for update;
 select * into d from public.site_bot_drafts where conversation_id=cid for update;
 if coalesce(d.revision,0) is distinct from (p_payload->>'revision')::integer then raise exception 'Rascunho mudou em outra sessão. Recarregue antes de continuar.'; end if;
 if p_action='turn' then
  intent_name:=p_payload->>'intent'; body_text:=btrim(p_payload->>'body');
  if intent_name not in ('create','edit','archive','consult','cancel') or intent_name is null or body_text is null or length(body_text) not between 1 and 2000 then raise exception 'Intenção ou texto inválido.'; end if;
  if actor_role<>'producer' and intent_name not in ('consult','cancel') then raise exception 'Comprador pode apenas consultar ofertas.'; end if;
  if jsonb_typeof(p_payload->'fields') is distinct from 'object' then raise exception 'Campos inválidos.'; end if;
  if exists(select 1 from jsonb_each(p_payload->'fields') e where e.key not in ('product_id','quantity_total','price','minimum','available_from','available_until','expires_on','pickup_location_id') or jsonb_typeof(e.value)<>'string' or length(e.value#>>'{}')>2000) then raise exception 'Campos devem conter somente respostas de oferta em texto.'; end if;
  if intent_name in ('edit','archive') and p_payload->>'target_id' is not null then
   select * into o from public.offers where id=(p_payload->>'target_id')::uuid and producer_id=actor and status='published' for update;
   if not found then raise exception 'Oferta indisponível para este produtor.'; end if;
   if o.version is distinct from (p_payload->>'offer_version')::integer then raise exception 'Oferta mudou. Recarregue os dados antes de preparar a prévia.'; end if;
   balance:=conexa_private.offer_balance(o.id);
  end if;
  insert into public.site_bot_drafts(conversation_id,owner_id,revision,intent,target_id,fields,before_offer,expected_balance,status)
   values(cid,actor,coalesce(d.revision,0)+1,intent_name,o.id,p_payload->'fields',case when o.id is not null then to_jsonb(o) end,balance,case when intent_name='cancel' then 'cancelled' else 'draft' end)
   on conflict(conversation_id) do update set revision=excluded.revision,intent=excluded.intent,target_id=excluded.target_id,fields=excluded.fields,before_offer=excluded.before_offer,expected_balance=excluded.expected_balance,status=excluded.status,updated_at=now()
   returning * into d;
  reply:=case when intent_name='cancel' then 'Rascunho descartado. Nenhuma oferta alterada.' when intent_name='consult' then 'Consulta de ofertas. Nenhuma alteração realizada.' else 'Rascunho revisão '||d.revision||'. Confira as perguntas e a prévia antes de confirmar.' end;
 else
  if actor_role<>'producer' or d.status is distinct from 'draft' or d.intent not in ('create','edit','archive') then raise exception 'Nenhuma revisão disponível para confirmação.'; end if;
  if d.intent in ('edit','archive') then
   select * into o from public.offers where id=d.target_id and producer_id=actor and status='published' for update;
   if not found then balance:=null; else balance:=conexa_private.offer_balance(o.id); end if;
  end if;
  if d.intent in ('edit','archive') and (o.id is null or o.version is distinct from (d.before_offer->>'version')::integer or balance is distinct from d.expected_balance) then
   update public.site_bot_drafts set status='conflict',updated_at=now() where conversation_id=cid returning * into d;
   reply:='Oferta ou saldo mudou. Rascunho preservado. Prepare nova prévia antes de confirmar.';
  else
   -- Subtransação: erro conserva rascunho e registra resultado definitivo desta chave.
   begin
    if d.intent<>'archive' then
     if coalesce(d.fields->>'price','') !~ '^\d+([.,]\d{1,2})?$' or coalesce(d.fields->>'minimum','') !~ '^\d+([.,]\d{1,2})?$' then raise exception 'Informe preço e mínimo em reais com até duas casas.'; end if;
     canonical:=d.fields||jsonb_build_object('unit_price_cents',replace(d.fields->>'price',',','.')::numeric*100,'minimum_net_unit_cents',replace(d.fields->>'minimum',',','.')::numeric*100,
      'quantity_total',replace(d.fields->>'quantity_total',',','.'));
     -- Multiplicação numeric preserva escala; converter explicitamente depois de validar precisão.
     canonical:=canonical||jsonb_build_object('unit_price_cents',(canonical->>'unit_price_cents')::numeric::integer,'minimum_net_unit_cents',(canonical->>'minimum_net_unit_cents')::numeric::integer);
    end if;
    saved:=conexa_private.write_offer(canonical,d.target_id,(d.before_offer->>'version')::integer,d.intent='archive');
    update public.site_bot_drafts set status='applied',updated_at=now() where conversation_id=cid returning * into d;
    reply:='Oferta persistida: '||(saved->>'id')||', versão '||(saved->>'version')||'.';
   exception when others then
    update public.site_bot_drafts set status='conflict',updated_at=now() where conversation_id=cid returning * into d;
    reply:='Não foi possível aplicar: '||sqlerrm||' Rascunho preservado; prepare nova prévia.';
   end;
  end if;
  body_text:='Confirmar revisão '||d.revision;
 end if;
 insert into public.site_messages(conversation_id,sender_id,client_send_id,body,speaker) values(cid,actor,key,body_text,'human');
 insert into public.site_messages(conversation_id,sender_id,client_send_id,body,speaker) values(cid,actor,gen_random_uuid(),reply,'bot');
 result:=jsonb_build_object('draft',to_jsonb(d),'offer',saved,'reply',reply);
 insert into public.site_bot_requests(owner_id,request_id,conversation_id,payload,result) values(actor,key,cid,jsonb_build_object('action',p_action,'payload',p_payload),result);
 return result;
end; $$;
revoke all on function public.site_bot(text,jsonb) from public,anon;
grant execute on function public.site_bot(text,jsonb) to authenticated;
commit;
