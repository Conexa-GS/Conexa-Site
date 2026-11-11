import test from 'node:test'
import assert from 'node:assert/strict'
import { createDemoAuth } from '../src/services/demo-auth.js'
import { createTabAuthOptions, createTabSessionStorage } from '../src/services/tab-session-storage.js'

const account = { id: 'ana', email: 'ana@conexa.invalid', role: 'producer' }
function fixture() {
  const state = { session: {}, user: { id: 'uuid-ana', email: account.email }, participant: { id: 'uuid-ana', is_demo: true, role: 'producer' }, calls: [], error: null }
  const client = {
    auth: {
      getSession: async () => ({ data: { session: state.session } }),
      getUser: async () => { state.calls.push('validate'); return { data: { user: state.user }, error: state.error } },
      signInWithPassword: async () => { state.calls.push('signIn'); return { error: state.signInError } },
      signOut: async options => { state.calls.push(options); return { error: state.signOutError } },
      onAuthStateChange: callback => { state.emit = callback; return { data: { subscription: { unsubscribe: () => { state.unsubscribed = true } } } } },
    },
    from: () => ({ select: () => ({ eq: (column, id) => { assert.equal(column, 'id'); assert.equal(id, state.user.id); return { single: async () => ({ data: state.participant }) } } }) }),
  }
  return { state, service: createDemoAuth(client, [account], 'demo') }
}

test('retomada consulta Auth e participante remoto, sem confiar no perfil do storage', async () => {
  const { state, service } = fixture()
  state.session = { user: { id: 'forjado', role: 'carrier' } }
  assert.equal((await service.restore()).id, 'uuid-ana')
  assert.deepEqual(state.calls, ['validate'])
  state.session = null
  assert.equal(await service.restore(), null)
  assert.deepEqual(state.calls, ['validate'])
})

test('retomada rejeita conta não permitida, papel incompatível e participante não demo', async () => {
  for (const modify of [s => { s.user.email = 'outra@conexa.invalid' }, s => { s.participant.role = 'buyer' }, s => { s.participant.is_demo = false }]) {
    const { state, service } = fixture()
    modify(state)
    await assert.rejects(service.restore(), /perfil de demonstração/)
    assert.deepEqual(state.calls.at(-1), { scope: 'local' })
  }
})

test('falha de rede na validação não inventa sessão nem apaga o acesso salvo', async () => {
  const { state, service } = fixture()
  state.error = new Error('offline')
  await assert.rejects(service.restore(), /validar a sessão/)
  assert.deepEqual(state.calls, ['validate'])
})

test('troca encerra sessão anterior antes do login e não o executa se a saída falhar', async () => {
  const { state, service } = fixture()
  await service.enter(account)
  assert.deepEqual(state.calls, [{ scope: 'local' }, 'signIn', 'validate'])
  state.calls = []; state.signOutError = new Error('offline')
  await assert.rejects(service.enter(account), /encerrar o participante anterior/)
  assert.deepEqual(state.calls, [{ scope: 'local' }])
})

test('saída é local, erros são expostos e assinatura é removível', async () => {
  const { state, service } = fixture()
  await service.leave()
  assert.deepEqual(state.calls, [{ scope: 'local' }])
  state.signOutError = new Error('offline')
  await assert.rejects(service.leave(), /sair da sessão/)
  let events = 0
  const stop = service.subscribe(() => events++)
  state.emit('TOKEN_REFRESHED'); state.emit('SIGNED_OUT')
  assert.equal(events, 1)
  stop(); assert.equal(state.unsubscribed, true)
})

const browserStorage = () => {
  const data = new Map()
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) }
}
test('storage retoma na mesma aba, isola outra aba e remove credencial ao sair', () => {
  const firstTab = browserStorage(), otherTab = browserStorage()
  createTabSessionStorage(() => firstTab).setItem('session', 'ficticia')
  const reload = createTabSessionStorage(() => firstTab)
  assert.equal(reload.getItem('session'), 'ficticia')
  assert.equal(createTabSessionStorage(() => otherTab).getItem('session'), null)
  reload.removeItem('session')
  assert.equal(createTabSessionStorage(() => firstTab).getItem('session'), null)
})

test('storage bloqueado funciona em memória sem recorrer a localStorage', () => {
  const storage = createTabSessionStorage(() => { throw new Error('blocked') })
  storage.setItem('session', 'ficticia')
  assert.equal(storage.getItem('session'), 'ficticia')
  storage.removeItem('session')
  assert.equal(storage.getItem('session'), null)
})

test('canais Auth são exclusivos por documento; storage estável retoma somente a mesma aba/projeto', () => {
  const tab = browserStorage()
  const first = createTabAuthOptions('https://demo.supabase.co', () => tab)
  const reload = createTabAuthOptions('https://demo.supabase.co', () => tab)
  const otherProject = createTabAuthOptions('https://outro.supabase.co', () => tab)
  assert.notEqual(first.storageKey, reload.storageKey, 'Evita BroadcastChannel compartilhar identidade entre documentos')
  first.storage.setItem(first.storageKey, 'ficticia')
  assert.equal(reload.storage.getItem(reload.storageKey), 'ficticia')
  assert.equal(otherProject.storage.getItem(otherProject.storageKey), null)
  reload.storage.removeItem(reload.storageKey)
  assert.equal(first.storage.getItem(first.storageKey), null)
})
