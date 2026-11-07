begin;
alter table public.loads add column freight_cents bigint check(freight_cents>0);
alter table public.loads add column platform_fee_cents bigint not null default 0 check(platform_fee_cents=0);
alter table public.loads add column total_cents bigint;
create function conexa_private.final_totals() returns trigger language plpgsql security definer set search_path='' as $$
declare q public.transport_quotes;
begin
 if new.selected_quote_id is not null then
  select * into q from public.transport_quotes where id=new.selected_quote_id and load_id=new.id and load_version=new.version and status='confirmed';
  if q.id is null then raise exception 'Cotação não pertence à carga e versão final.'; end if;
  select sum(gross_cents) into new.subtotal_cents from public.load_items where load_id=new.id;
  new.freight_cents:=q.total_cents;
  new.platform_fee_cents:=0;
  new.total_cents:=new.subtotal_cents+new.freight_cents;
 end if;
 return new;
end $$;
revoke all on function conexa_private.final_totals() from public,anon,authenticated;
create trigger final_totals before update on public.loads for each row execute function conexa_private.final_totals();
-- Backfill previously selected fictitious quotes, including cancelled test history.
update public.loads set selected_quote_id=selected_quote_id where selected_quote_id is not null;
alter table public.loads add constraint load_total_consistent check(
 (selected_quote_id is null and freight_cents is null and total_cents is null) or
 (selected_quote_id is not null and freight_cents is not null and total_cents is not null and total_cents=subtotal_cents+freight_cents+platform_fee_cents));
commit;
