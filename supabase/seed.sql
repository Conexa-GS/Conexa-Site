-- Pré-requisito: criar e confirmar as quatro contas fictícias no Supabase Auth.
-- Se alterar os emails em .env, atualizar o mapeamento abaixo também.
begin;
insert into public.participants(id, display_name, role)
select u.id, p.name, p.role from auth.users u join (values
  ('ana@conexa.invalid','Ana Oliveira','producer'),
  ('joao@conexa.invalid','João Pereira','producer'),
  ('comprador@conexa.invalid','Restaurante Raiz','buyer'),
  ('transporte@conexa.invalid','Transporte Caminho','carrier')
) as p(email,name,role) on u.email=p.email
on conflict (id) do nothing;
do $$ begin
  if (select count(*) from public.participants where is_demo) < 4 then
    raise exception 'Crie primeiro as quatro contas fictícias no Supabase Auth e confirme os emails.';
  end if;
end $$;
insert into public.products(id,name) values
  ('10000000-0000-4000-8000-000000000001','Alface'),
  ('10000000-0000-4000-8000-000000000002','Tomate'),
  ('10000000-0000-4000-8000-000000000003','Cenoura') on conflict do nothing;
insert into public.locations(id,owner_id,display_address)
select '20000000-0000-4000-8000-000000000001'::uuid,id,'Sítio Boa Semente · ponto de coleta fictício' from public.participants where id=(select id from auth.users where email='ana@conexa.invalid')
union all select '20000000-0000-4000-8000-000000000002',id,'Horta do João · ponto de coleta fictício' from public.participants where id=(select id from auth.users where email='joao@conexa.invalid')
on conflict do nothing;
insert into public.offers(id,producer_id,product_id,pickup_location_id,quantity_total,unit_price_cents,minimum_net_unit_cents,available_from,available_until)
select '30000000-0000-4000-8000-000000000001'::uuid, owner_id, '10000000-0000-4000-8000-000000000001'::uuid, id, 30,500,400,(now() at time zone 'America/Sao_Paulo')::date,(now() at time zone 'America/Sao_Paulo')::date+14
from public.locations where id='20000000-0000-4000-8000-000000000001'
union all select '30000000-0000-4000-8000-000000000002', owner_id, '10000000-0000-4000-8000-000000000001', id,25,500,450,(now() at time zone 'America/Sao_Paulo')::date,(now() at time zone 'America/Sao_Paulo')::date+14
from public.locations where id='20000000-0000-4000-8000-000000000002'
on conflict do nothing;
commit;
