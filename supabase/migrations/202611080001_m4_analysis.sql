begin;

-- Analysis does not approve or edit proposals. Candidate lookup inherits M2 expiry housekeeping.
-- Identity and source records always come from the database.
create function conexa_private.m4(action text,payload jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
#variable_conflict use_column
declare
 uid uuid:=auth.uid(); role_name text; candidates jsonb; l public.loads;
 q public.transport_quotes; stops jsonb;
begin
 select role into role_name from public.participants where id=uid and is_demo;
 if uid is null or role_name is null then raise exception 'Escolha um participante demo autorizado.'; end if;
 if action='candidates' then
  -- M2 enforces buyer ownership, product, unit, availability and free balance.
  candidates:=conexa_private.m2('candidates',payload);
  return coalesce((select jsonb_agg(c.value||jsonb_build_object(
   'completed_sales',(select count(distinct i.load_id) from public.load_items i
     join public.loads h on h.id=i.load_id
     where i.producer_id=(c.value->>'producer_id')::uuid and h.status='delivered'),
   'waiting_days',greatest(0,floor(extract(epoch from (clock_timestamp()-(c.value->>'created_at')::timestamptz))/86400))
  ) order by c.ordinality) from jsonb_array_elements(candidates) with ordinality c(value,ordinality)),'[]'::jsonb);
 elsif action='route' then
  select * into l from public.loads where id=(payload->>'id')::uuid;
  if l.id is null or l.version is distinct from (payload->>'version')::integer then
   raise exception 'Proposta alterada ou inexistente; atualize a lista.';
  end if;
  select * into q from public.transport_quotes where id=(payload->>'quote_id')::uuid
   and load_id=l.id and load_version=l.version and status='confirmed';
  if q.id is null or not ((role_name='buyer' and l.buyer_id=uid)
    or (role_name='carrier' and q.carrier_id=uid)) then
   raise exception 'Roteiro indisponível para este participante ou versão.';
  end if;
  -- Own itinerary, not external map content. Preserve every pickup and agreed return.
  stops:=jsonb_build_array(jsonb_build_object('kind','departure','address',q.departure_address,'stopSeconds',null))
   ||coalesce((select jsonb_agg(jsonb_build_object('kind','pickup','address',i.pickup_address,
      'itemId',i.id,'producerName',p.display_name,'stopSeconds',null) order by i.id)
     from public.load_items i join public.participants p on p.id=i.producer_id where i.load_id=l.id),'[]'::jsonb)
   ||jsonb_build_array(jsonb_build_object('kind','destination','address',l.destination_address,'stopSeconds',null));
  if q.return_address is not null then
   stops:=stops||jsonb_build_array(jsonb_build_object('kind','return','address',q.return_address,'stopSeconds',null));
  end if;
  return jsonb_build_object('loadId',l.id,'version',l.version,'quoteId',q.id,'stops',stops,
   'status','manual','provider',null,'isSimulated',false,'distanceMeters',null,
   'drivingSeconds',null,'stopSeconds',null,'tollAmountCents',null,'currency','BRL',
   'freightCents',q.total_cents,'servicesIncluded',q.services_included,
   'warnings',jsonb_build_array('API de rotas não habilitada. Roteiro manual da cotação fictícia.',
    'Distância, direção e duração das paradas indisponíveis. Pedágio individual a confirmar; já coberto pelo frete fechado.'));
 end if;
 raise exception 'Ação M4 desconhecida.';
end $$;
revoke all on function conexa_private.m4(text,jsonb) from public,anon;
grant execute on function conexa_private.m4(text,jsonb) to authenticated;
create function public.m4(action text,payload jsonb default '{}'::jsonb) returns jsonb
language sql security invoker set search_path='' as $$ select conexa_private.m4(action,payload); $$;
revoke all on function public.m4(text,jsonb) from public,anon;
grant execute on function public.m4(text,jsonb) to authenticated;
commit;
