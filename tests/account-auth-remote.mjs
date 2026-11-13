// Run only with ephemeral fixtures provisioned for this check. Password arrives on stdin.
import { readFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { createAccountAuth } from '../src/services/account-auth.js'
import assert from 'node:assert/strict'
const env = Object.fromEntries((await readFile('.env', 'utf8')).split(/\r?\n/).filter(line => line.includes('=') && !line.startsWith('#')).map(line => { const i = line.indexOf('='); return [line.slice(0, i), line.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] }))
let input = ''
for await (const chunk of process.stdin) input += chunk
const { suffix, password } = JSON.parse(input)
assert.match(suffix, /^[a-z0-9]+$/)
assert.equal(new URL(env.VITE_SUPABASE_URL).hostname, 'ppbneiusqlitvewwoact.supabase.co', 'Somente o demo Conexa autorizado')
const client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } })
const service = createAccountAuth(client, { subscribe: () => () => {} }, false)
for (const role of ['producer', 'buyer', 'carrier']) {
  const credentials = { email: `login-qa-${suffix}-${role}@conexa.invalid`, password, role }
  try {
    const profile = await service.enter(credentials)
    assert.equal(profile.role, role)
    assert.equal(profile.access, 'personal')
    assert.equal(profile.account_kind, 'personal')
    const { error: metadataError } = await client.auth.updateUser({ data: { role: 'admin' } })
    assert.equal(metadataError, null)
    assert.equal((await service.restore()).role, role)
    const { error: refreshError } = await client.auth.refreshSession()
    assert.equal(refreshError, null)
    const saved = (await client.auth.getSession()).data.session
    const reload = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } })
    assert.equal((await reload.auth.setSession(saved)).error, null)
    assert.equal((await createAccountAuth(reload, {}, false).restore()).id, profile.id)
    const changed = await client.from('participants').update({ role: 'carrier', account_kind: 'demo' }).eq('id', profile.id)
    assert.ok(changed.error, 'client must not update role or account_kind')
    const catalog = await client.rpc(role === 'carrier' ? 'm3' : 'm2', { action: 'list', payload: {} })
    assert.equal(catalog.error, null)
    await assert.rejects(service.enter({ ...credentials, role: role === 'buyer' ? 'producer' : 'buyer' }), /outro tipo/)
    console.log(`PASS remote Auth/RLS: ${role}, refresh, retomada por novo cliente, metadados sem privilégio, troca indevida bloqueada, consulta de operações.`)
  } finally { await service.leave() }
}
const demoClient = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
assert.equal((await demoClient.auth.signInWithPassword({ email: env.VITE_DEMO_ANA_EMAIL, password: env.VITE_DEMO_PASSWORD })).error, null)
const blocked = createAccountAuth(demoClient, {}, false)
await assert.rejects(blocked.restore(), /desativadas/)
console.log('PASS remote: conta compartilhada de teste rejeitada com acesso de desenvolvedor desligado.')
