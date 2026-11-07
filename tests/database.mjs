import { PGlite } from '@electric-sql/pglite'
import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const db = new PGlite()
await db.exec(`create role anon; create role authenticated; create schema auth;
create table auth.users(id uuid primary key, email text);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;
insert into auth.users values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','ana@conexa.invalid'),('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','joao@conexa.invalid'),('cccccccc-cccc-4ccc-8ccc-cccccccccccc','comprador@conexa.invalid'),('dddddddd-dddd-4ddd-8ddd-dddddddddddd','transporte@conexa.invalid');`)
await db.exec(await readFile(new URL('../supabase/migrations/202611070001_offers.sql', import.meta.url), 'utf8'))
const seed = await readFile(new URL('../supabase/seed.sql', import.meta.url), 'utf8')
await db.exec(seed)
await db.exec(seed)
assert.equal((await db.query('select count(*)::int n from public.offers')).rows[0].n, 2)
async function asUser(id) { await db.exec(`reset role; select set_config('request.jwt.claim.sub','${id}',false); set role authenticated;`) }
await asUser('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')
assert.equal((await db.query('select * from public.offers')).rows.length,1)
assert.equal((await db.query("update public.offers set quantity_total=5 where id='30000000-0000-4000-8000-000000000002' returning id")).rows.length,0)
const inserted = await db.query("insert into public.offers(product_id,pickup_location_id,quantity_total,unit_price_cents,minimum_net_unit_cents,available_from,available_until) values ('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001',5,500,400,current_date,current_date+7) returning *")
assert.equal(inserted.rows[0].producer_id, 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')
const id = inserted.rows[0].id
assert.equal((await db.query(`update public.offers set quantity_total=7 where id='${id}' and version=1 returning version`)).rows[0].version,2)
assert.equal((await db.query(`update public.offers set quantity_total=9 where id='${id}' and version=1 returning id`)).rows.length,0)
for (const change of ['quantity_total=0', 'quantity_total=1.0001', 'unit_price_cents=300', "available_until=current_date-1", "pickup_location_id='20000000-0000-4000-8000-000000000002'"]) {
  await assert.rejects(db.query(`update public.offers set ${change} where id='${id}'`))
}
await asUser('cccccccc-cccc-4ccc-8ccc-cccccccccccc')
assert.equal((await db.query('select * from public.offers')).rows.length,3)
assert.equal((await db.query(`delete from public.offers where id='${id}' returning id`)).rows.length,0)
await asUser('dddddddd-dddd-4ddd-8ddd-dddddddddddd')
assert.equal((await db.query('select * from public.offers')).rows.length,0)
await asUser('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')
assert.equal((await db.query(`delete from public.offers where id='${id}' returning id`)).rows.length,1)
await db.exec('reset role; set role anon;')
await assert.rejects(db.query('select * from public.offers'))
console.log('PASS: migration e seed idempotente; CRUD do dono; bloqueio de outro produtor/comprador/transportador/anon; checks de quantidade/preço/data/local; versão concorrente. PostgreSQL local PGlite, auth.uid simulado; Supabase remoto NÃO testado.')
await db.close()

