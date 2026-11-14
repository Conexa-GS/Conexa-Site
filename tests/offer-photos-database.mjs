import { PGlite } from '@electric-sql/pglite'
import { readFile, readdir } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { storageSchema } from './helpers/storage-schema.mjs'
const db = new PGlite()
const ids = { ana: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', joao: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', buyer: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', carrier: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd' }
await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key,email text);
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`)
for (const [name, id] of Object.entries(ids)) await db.query('insert into auth.users values($1,$2)', [id, `${name === 'buyer' ? 'comprador' : name === 'carrier' ? 'transporte' : name}@conexa.invalid`])
await storageSchema(db)
for (const file of (await readdir('supabase/migrations')).filter(f => f.endsWith('.sql')).sort()) await db.exec(await readFile(`supabase/migrations/${file}`, 'utf8'))
await db.exec(await readFile('supabase/seed.sql', 'utf8'))
async function as(name) { await db.exec(`reset role; select set_config('request.jwt.claim.sub','${ids[name] || ''}',false); set role authenticated;`) }
const path = `${ids.ana}/11111111-1111-4111-8111-111111111111.jpg`
const other = `${ids.joao}/22222222-2222-4222-8222-222222222222.jpg`
const write = async (data, id = null, version = null) => (await db.query('select public.save_offer($1::jsonb,$2::uuid,$3::integer) result', [JSON.stringify(data), id, version])).rows[0].result
await as('joao'); await db.query("insert into storage.objects(bucket_id,name) values('offer-photos',$1)", [other])
await as('ana'); await db.query("insert into storage.objects(bucket_id,name) values('offer-photos',$1)", [path])
await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values('offer-photos',$1)", [`${ids.joao}/33333333-3333-4333-8333-333333333333.jpg`]))
const template = (await db.query('select * from public.offers')).rows[0]
const saved = await write({ ...template, photo_path: path })
assert.equal(saved.photo_path, path)
assert.equal((await db.query('delete from storage.objects where name=$1 returning name', [path])).rows.length, 0, 'foto vinculada protegida')
await assert.rejects(write({ ...template, photo_path: other }), /próprio produtor/)
await assert.rejects(write({ ...template, photo_path: `${ids.ana}/44444444-4444-4444-8444-444444444444.jpg` }), /próprio produtor/)
const noPhotoKey = { ...saved }; delete noPhotoKey.photo_path
const edited = await write(noPhotoKey, saved.id, saved.version)
assert.equal(edited.photo_path, path, 'edição de texto/bot preserva foto')
await assert.rejects(write({ ...saved, photo_path: null }, saved.id, saved.version), /mudou/)
await as('buyer')
assert.equal((await db.query('select name from storage.objects')).rows.length, 1, 'comprador vê somente foto vinculada e visível')
await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values('offer-photos',$1)", [`${ids.buyer}/55555555-5555-4555-8555-555555555555.jpg`]))
assert.equal((await db.query('delete from storage.objects returning name')).rows.length, 0)
await as('joao')
assert.equal((await db.query('select name from storage.objects where name=$1', [path])).rows.length, 0)
await assert.rejects(write({ ...saved, photo_path: other }, saved.id, edited.version), /indisponível/)
await as('carrier'); assert.equal((await db.query('select name from storage.objects')).rows.length, 0)
await as('ana')
const removed = await write({ ...edited, photo_path: null }, saved.id, edited.version)
assert.equal(removed.photo_path, null)
assert.equal((await db.query('delete from storage.objects where name=$1 returning name', [path])).rows.length, 1)
await db.exec('reset role; set role anon')
await assert.rejects(db.query('select * from storage.objects'))
await db.close()
console.log('PASS PGlite fotos: dono, comprador, outro produtor, carrier/anon, vínculo, preservação pelo bot, remoção e concorrência. Storage HTTP não simulado.')
