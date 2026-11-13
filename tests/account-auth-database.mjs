import { PGlite } from '@electric-sql/pglite'
import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const db = new PGlite()
await db.exec(`create role anon; create role authenticated; create schema auth;
create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb default '{}'::jsonb);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`)
for (const name of ['202611070001_offers.sql', '20261113155836_personal_account_auth.sql']) await db.exec(await readFile(new URL(`../supabase/migrations/${name}`, import.meta.url), 'utf8'))
const ids = ['aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc']
for (const [i, role] of ['producer', 'buyer', 'carrier'].entries()) {
  await db.query('insert into auth.users(id, raw_user_meta_data) values ($1,$2)', [ids[i], JSON.stringify({ conexa_signup: 'personal', role, display_name: `Pessoa ${role}` })])
}
assert.equal((await db.query("select * from public.participants where account_kind='personal'")).rows.length, 3)
assert.equal((await db.query('select * from public.locations')).rows.length, 2)
await assert.rejects(db.query("insert into auth.users(id,raw_user_meta_data) values (gen_random_uuid(),'{\"conexa_signup\":\"personal\",\"role\":\"admin\",\"display_name\":\"Invalid\"}')"))
await db.exec(`update auth.users set raw_user_meta_data='{"role":"carrier"}' where id='${ids[0]}';
select set_config('request.jwt.claim.sub','${ids[0]}',false); set role authenticated;`)
assert.equal((await db.query('select public.demo_role() as role')).rows[0].role, 'producer')
await assert.rejects(db.query("update public.participants set role='carrier'"))
await assert.rejects(db.query("update public.participants set account_kind='demo'"))
await assert.rejects(db.query('select private.create_personal_participant()'))
await db.exec(`reset role; insert into public.products(name) values ('Alface');`)
const catalog = (await db.query('select id from public.products')).rows[0].id
const location = (await db.query('select id from public.locations where owner_id=$1', [ids[0]])).rows[0].id
await db.exec('set role authenticated')
const offer = (await db.query('insert into public.offers(product_id,pickup_location_id,quantity_total,unit_price_cents,minimum_net_unit_cents,available_from,available_until) values ($1,$2,10,500,400,current_date,current_date+7) returning id', [catalog, location])).rows[0].id
await db.exec(`reset role; select set_config('request.jwt.claim.sub','${ids[1]}',false); set role authenticated;`)
assert.equal((await db.query('select id from public.offers')).rows.length, 1)
assert.equal((await db.query('delete from public.offers where id=$1 returning id', [offer])).rows.length, 0)
await db.exec('reset role; set role anon')
await assert.rejects(db.query('select * from public.participants'))
await db.close()
console.log('PASS PGlite: três perfis pessoais, locais fictícios, papel imutável, metadados sem privilégio, CRUD/RLS produtor/comprador/anon e função privada.')
