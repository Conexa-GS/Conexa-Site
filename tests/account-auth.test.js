import test from 'node:test'
import assert from 'node:assert/strict'
import { createAccountAuth } from '../src/services/account-auth.js'

function fixture(enabled = true) {
  const state = { profile: { id: 'real-id', role: 'producer', account_kind: 'personal', is_demo: true }, session: {}, calls: [] }
  const client = {
    auth: {
      getSession: async () => ({ data: { session: state.session } }),
      getUser: async () => ({ data: { user: { id: 'real-id', user_metadata: { role: 'carrier' } } } }),
      signOut: async () => { state.calls.push('out'); return {} },
      signInWithPassword: async input => { state.calls.push(input); return { error: state.error } },
      signUp: async input => { state.signup = input; return { data: { session: state.signupSession }, error: state.error } },
      resetPasswordForEmail: async (email, options) => { state.recovery = { email, options }; return { error: state.error } },
      updateUser: async input => { state.password = input; return { error: state.error } },
    },
    from: () => ({ select: () => ({ eq: (key, id) => { assert.equal(key, 'id'); assert.equal(id, 'real-id'); return { single: async () => ({ data: state.profile }) } } }) }),
  }
  const demo = { restore: async () => ({ id: 'demo', role: 'producer' }), enter: async () => { state.demoEntered = true; return { id: 'demo' } }, subscribe: () => () => {} }
  return { state, service: createAccountAuth(client, demo, enabled) }
}
test('login pessoal valida papel na tabela e ignora metadados mutáveis', async () => {
  const { service, state } = fixture()
  const result = await service.enter({ email: ' person@example.com ', password: 'password', role: 'producer' })
  assert.equal(result.access, 'personal')
  assert.equal(result.role, 'producer')
  assert.deepEqual(state.calls, ['out', { email: 'person@example.com', password: 'password' }])
  await assert.rejects(service.enter({ email: 'person@example.com', password: 'password', role: 'carrier' }), /outro tipo/)
  assert.equal(state.calls.at(-1), 'out')
  await assert.rejects(service.enter({ email: 'person@example.com', password: '', role: 'producer' }), /senha/)
  assert.equal(state.demoEntered, undefined)
})
test('restauração distingue credenciais pessoais e contas de teste, bloqueando demo desabilitado', async () => {
  const { service, state } = fixture(false)
  assert.equal((await service.restore()).access, 'personal')
  state.profile.account_kind = 'demo'
  await assert.rejects(service.restore(), /desativadas/)
  await assert.rejects(service.enter({ id: 'ana' }), /desativado/)
  assert.equal(state.demoEntered, undefined)
  state.session = null
  assert.equal(await service.restore(), null)
})
test('cadastro envia somente perfil público permitido e respeita confirmação de e-mail', async () => {
  const { service, state } = fixture()
  const fields = { email: ' person@example.com ', password: 'password', name: ' Pessoa ', role: 'buyer' }
  assert.equal((await service.register(fields, 'https://app.example/login')).confirmationRequired, true)
  assert.deepEqual(state.signup.options, { data: { display_name: 'Pessoa', role: 'buyer', conexa_signup: 'personal' }, emailRedirectTo: 'https://app.example/login' })
  state.signupSession = {}
  assert.equal((await service.register(fields)).confirmationRequired, false)
  await assert.rejects(service.register({ ...fields, role: 'admin' }), /perfil/)
  state.error = { message: 'internal secret' }
  await assert.rejects(service.register(fields), error => !error.message.includes('secret'))
})
test('recuperação, atualização de senha e ambiente sem servidor não inventam sucesso', async () => {
  const { service, state } = fixture()
  await service.recover(' person@example.com ', 'https://app.example/redefinir-senha')
  assert.equal(state.recovery.email, 'person@example.com')
  await assert.rejects(service.updatePassword('short'), /8 caracteres/)
  await service.updatePassword('new-password')
  assert.deepEqual(state.password, { password: 'new-password' })
  const local = createAccountAuth(null, { enter: async account => account, subscribe: () => () => {} }, true)
  assert.equal(await local.restore(), null)
  await assert.rejects(local.enter({ email: 'a@example.com', password: 'password' }), /servidor/)
  assert.equal((await local.enter({ id: 'ana' })).access, 'developer')
})
