import test from 'node:test'
import assert from 'node:assert/strict'
import { demoConfig, demoProject } from './helpers/conversations-demo-config.mjs'

const base = { VITE_SUPABASE_URL: `https://${demoProject}.supabase.co`, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_ficticia', VITE_DEMO_PASSWORD: 'senha-ficticia' }
test('roteiro demo rejeita destino alternativo, credenciais na URL e configuração incompleta', () => {
  for (const url of ['http://localhost:54321', `http://${demoProject}.supabase.co`, `https://${demoProject}.supabase.co.evil.invalid`, `https://user:pass@${demoProject}.supabase.co`, `${base.VITE_SUPABASE_URL}/rest/v1`, `${base.VITE_SUPABASE_URL}?outro=1`]) assert.throws(() => demoConfig({ ...base, VITE_SUPABASE_URL: url }))
  assert.throws(() => demoConfig({ ...base, VITE_DEMO_PASSWORD: '' }))
  assert.throws(() => demoConfig({ ...base, VITE_SUPABASE_PUBLISHABLE_KEY: '' }))
  assert.equal(demoConfig(base).emails.buyer, 'comprador@conexa.invalid')
})
test('roteiro demo aceita anon do projeto e rejeita chaves administrativas ou de outro projeto', () => {
  const key = payload => `header.${btoa(JSON.stringify(payload))}.assinatura-ficticia`
  assert.equal(demoConfig({ ...base, VITE_SUPABASE_PUBLISHABLE_KEY: key({ role: 'anon', ref: demoProject }) }).url, base.VITE_SUPABASE_URL)
  for (const value of ['sb_secret_ficticia', 'invalida', key({ role: 'service_role', ref: demoProject }), key({ role: 'anon', ref: 'outro' })]) assert.throws(() => demoConfig({ ...base, VITE_SUPABASE_PUBLISHABLE_KEY: value }))
})
