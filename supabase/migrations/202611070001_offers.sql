-- M1: executar em projeto Supabase de demonstração escolhido pelo grupo.
begin;
create table public.participants (
  id uuid primary key references auth.users(id) on delete restrict,
  display_name text not null check (length(display_name) between 2 and 120),
  role text not null check (role in ('producer','buyer','carrier')),
  is_demo boolean not null default true check (is_demo),
  created_at timestamptz not null default now()
);
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  unit text not null default 'kg' check (unit = 'kg')
);
create table public.locations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.participants(id) on delete restrict,
  display_address text not null,
  is_fictional boolean not null default true check (is_fictional)
);
create table public.offers (
  id uuid primary key default gen_random_uuid(),
  producer_id uuid not null default auth.uid() references public.participants(id) on delete restrict,
  product_id uuid not null references public.products(id) on delete restrict,
  pickup_location_id uuid not null references public.locations(id) on delete restrict,
  quantity_total numeric not null check (quantity_total > 0 and quantity_total <= 1000000 and quantity_total = round(quantity_total,3)),
  unit_price_cents integer not null check (unit_price_cents > 0 and unit_price_cents <= 100000000),
  minimum_net_unit_cents integer not null check (minimum_net_unit_cents >= 0 and minimum_net_unit_cents <= unit_price_cents),
  available_from date not null,
  available_until date not null check (available_until >= available_from),
  status text not null default 'published' check (status in ('published','archived')),
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.locations(owner_id);
create index on public.offers(producer_id);
create index on public.offers(product_id, status, available_until);
create index on public.offers(pickup_location_id);
-- A função evita recursão na policy de participants. Sem escrita e sem argumentos.
create function public.demo_role() returns text language sql stable security definer set search_path = '' as $$
  select role from public.participants where id = (select auth.uid()) and is_demo;
$$;
revoke all on function public.demo_role() from public, anon;
grant execute on function public.demo_role() to authenticated;
create function public.validate_offer() returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE' then
    if new.producer_id <> old.producer_id or new.id <> old.id then raise exception 'O responsável e o identificador da oferta não podem mudar.'; end if;
    new.version := old.version + 1;
    new.created_at := old.created_at;
  else new.version := 1;
  end if;
  if new.status = 'published' and new.available_from < (now() at time zone 'America/Sao_Paulo')::date then
    raise exception 'Disponibilidade deve começar hoje ou em data futura.';
  end if;
  if not exists (select 1 from public.locations where id = new.pickup_location_id and owner_id = new.producer_id) then
    raise exception 'O local deve pertencer ao produtor da oferta.';
  end if;
  new.updated_at := now();
  return new;
end;
$$;
create trigger validate_offer before insert or update on public.offers for each row execute function public.validate_offer();
alter table public.participants enable row level security;
alter table public.products enable row level security;
alter table public.locations enable row level security;
alter table public.offers enable row level security;
revoke all on public.participants, public.products, public.locations, public.offers from anon, authenticated;
grant select on public.participants, public.products, public.locations, public.offers to authenticated;
grant insert, update, delete on public.offers to authenticated;
create policy participants_read on public.participants for select to authenticated using (public.demo_role() is not null and is_demo);
create policy products_read on public.products for select to authenticated using (public.demo_role() is not null);
create policy locations_read on public.locations for select to authenticated using (public.demo_role() is not null and is_fictional);
create policy offers_read on public.offers for select to authenticated using (
  producer_id = (select auth.uid()) or (public.demo_role() = 'buyer' and status = 'published' and available_until >= (now() at time zone 'America/Sao_Paulo')::date)
);
create policy offers_insert on public.offers for insert to authenticated with check (public.demo_role() = 'producer' and producer_id = (select auth.uid()));
create policy offers_update on public.offers for update to authenticated using (public.demo_role() = 'producer' and producer_id = (select auth.uid())) with check (producer_id = (select auth.uid()));
create policy offers_delete on public.offers for delete to authenticated using (public.demo_role() = 'producer' and producer_id = (select auth.uid()));
-- Antes de M2: FKs RESTRICT para itens/histórico e proteção de saldo reservado.
commit;
