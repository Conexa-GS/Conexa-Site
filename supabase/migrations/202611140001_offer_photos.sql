-- Foto opcional do lote; arquivos privados e escritos somente pelo produtor.
begin;
alter table public.offers add column photo_path text;
create index offers_photo_path_idx on public.offers(photo_path) where photo_path is not null;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('offer-photos','offer-photos',false,2097152,array['image/jpeg']);

create function conexa_private.validate_offer_photo() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if tg_op='UPDATE' and new.photo_path is not distinct from old.photo_path then return new; end if;
 if new.photo_path is not null then
  if new.photo_path !~ ('^'||new.producer_id::text||'/[0-9a-f-]{36}[.]jpg$') or
     not exists(select 1 from storage.objects where bucket_id='offer-photos' and name=new.photo_path) then
   raise exception 'Escolha uma foto enviada pelo próprio produtor para esta oferta.';
  end if;
 end if;
 return new;
end; $$;
revoke all on function conexa_private.validate_offer_photo() from public,anon,authenticated;
create trigger validate_offer_photo before insert or update on public.offers for each row execute function conexa_private.validate_offer_photo();

create policy offer_photos_insert on storage.objects for insert to authenticated with check (
 bucket_id='offer-photos' and public.demo_role()='producer' and
 name ~ ('^'||(select auth.uid())::text||'/[0-9a-f-]{36}[.]jpg$')
);
create policy offer_photos_read on storage.objects for select to authenticated using (
 bucket_id='offer-photos' and (
  (public.demo_role()='producer' and split_part(name,'/',1)=(select auth.uid())::text) or
  exists(select 1 from public.offers where photo_path=storage.objects.name)
 )
);
create policy offer_photos_delete_unused on storage.objects for delete to authenticated using (
 bucket_id='offer-photos' and public.demo_role()='producer' and split_part(name,'/',1)=(select auth.uid())::text and
 not exists(select 1 from public.offers where photo_path=storage.objects.name)
);

create or replace function conexa_private.write_offer(p_data jsonb,p_id uuid,p_version integer,p_archive boolean default false) returns jsonb
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
   insert into public.offers(producer_id,product_id,pickup_location_id,quantity_total,unit_price_cents,minimum_net_unit_cents,available_from,available_until,expires_on,photo_path)
   values(actor,(p_data->>'product_id')::uuid,(p_data->>'pickup_location_id')::uuid,(p_data->>'quantity_total')::numeric,(p_data->>'unit_price_cents')::integer,(p_data->>'minimum_net_unit_cents')::integer,(p_data->>'available_from')::date,(p_data->>'available_until')::date,nullif(p_data->>'expires_on','')::date,nullif(p_data->>'photo_path','')) returning * into o;
  else
   update public.offers set product_id=(p_data->>'product_id')::uuid,pickup_location_id=(p_data->>'pickup_location_id')::uuid,
    quantity_total=(p_data->>'quantity_total')::numeric,unit_price_cents=(p_data->>'unit_price_cents')::integer,minimum_net_unit_cents=(p_data->>'minimum_net_unit_cents')::integer,
    available_from=(p_data->>'available_from')::date,available_until=(p_data->>'available_until')::date,expires_on=nullif(p_data->>'expires_on','')::date,
    photo_path=case when p_data ? 'photo_path' then nullif(p_data->>'photo_path','') else o.photo_path end
    where id=o.id returning * into o;
  end if;
 end if;
 return to_jsonb(o);
end; $$;

notify pgrst, 'reload schema';
commit;
