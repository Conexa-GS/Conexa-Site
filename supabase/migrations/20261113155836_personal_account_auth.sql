-- Personal Auth identities, with the existing academic/simulated operations.
-- is_demo continues to describe the business sandbox; account_kind describes login.
begin;
alter table public.participants add column account_kind text not null default 'demo'
  check (account_kind in ('demo', 'personal'));

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
-- A trigger must insert the participant before an authenticated session exists.
-- Role is validated once here and then stored in a table with no client write grant.
-- Mutable user_metadata is never consulted by authorization policies/RPCs.
create function private.create_personal_participant() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  selected_role text := new.raw_user_meta_data->>'role';
  chosen_name text := btrim(new.raw_user_meta_data->>'display_name');
begin
  if new.raw_user_meta_data->>'conexa_signup' is distinct from 'personal' then return new; end if;
  if selected_role is null or selected_role not in ('producer','buyer','carrier') then
    raise exception 'Escolha um perfil válido.';
  end if;
  if chosen_name is null or length(chosen_name) not between 2 and 120 then
    raise exception 'Informe um nome entre 2 e 120 caracteres.';
  end if;
  insert into public.participants(id, display_name, role, is_demo, account_kind)
    values(new.id, chosen_name, selected_role, true, 'personal');
  if selected_role in ('producer','buyer') then
    insert into public.locations(owner_id, display_address, is_fictional)
      values(new.id, chosen_name || ' · local de teste, sem coleta ou entrega real', true);
  end if;
  return new;
end;
$$;
revoke all on function private.create_personal_participant() from public, anon, authenticated;
create trigger conexa_personal_participant after insert on auth.users
  for each row execute function private.create_personal_participant();
comment on column public.participants.account_kind is 'demo: shared fictional account; personal: individual Auth credentials. All operations remain academic simulations.';
commit;
