import test from 'node:test'
import assert from 'node:assert/strict'
import { createChatEnvironment } from './helpers/offer-chat-dom.mjs'

const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done }); return { promise, resolve } }
async function setup(service) {
  const ui = await createChatEnvironment()
  const { useDemoSession } = await ui.load('/src/hooks/useDemoSession.js')
  let auth
  function Harness() { auth = useDemoSession(service); return null }
  await ui.mountComponent(Harness, {})
  return { ui, current: () => auth }
}
function fixture(restore = async () => null) {
  let callback
  return { restore, enter: async account => account, leave: async () => {}, subscribe: fn => { callback = fn; return () => { callback = null } }, emit: () => callback?.() }
}

test('retomada tardia não substitui participante escolhido enquanto carrega', async () => {
  const pending = deferred(), service = fixture(() => pending.promise)
  const { ui, current } = await setup(service)
  try {
    assert.equal(current().restoring, true)
    await ui.act(async () => { await current().enter({ id: 'buyer' }) })
    await ui.act(async () => { pending.resolve({ id: 'ana' }) })
    assert.equal(current().session.id, 'buyer')
    assert.equal(current().restoring, false)
  } finally { await ui.dispose() }
})

test('SIGNED_OUT invalida retomada em andamento e limpa o participante', async () => {
  const pending = deferred(), service = fixture(() => pending.promise)
  const { ui, current } = await setup(service)
  try {
    await ui.act(async () => { service.emit(); pending.resolve({ id: 'ana' }) })
    assert.equal(current().session, null)
    assert.equal(current().restoring, false)
    assert.equal(current().pending, false)
  } finally { await ui.dispose() }
})

test('falha de saída mantém sessão e permite tentar novamente; saída limpa o estado', async () => {
  const service = fixture(async () => ({ id: 'ana' }))
  service.leave = async () => { throw new Error('Saída indisponível') }
  const { ui, current } = await setup(service)
  try {
    await ui.act(async () => { assert.equal(await current().leave(), false) })
    assert.equal(current().session.id, 'ana')
    assert.equal(current().error, 'Saída indisponível')
    service.leave = async () => { service.emit() }
    await ui.act(async () => { assert.equal(await current().leave(), true) })
    assert.equal(current().session, null)
    assert.equal(current().error, '')
    assert.equal(current().pending, false)
  } finally { await ui.dispose() }
})

test('retomada falha mostra erro e seleção explícita recupera sem sessão fictícia', async () => {
  const service = fixture(async () => { throw new Error('Sem conexão') })
  const { ui, current } = await setup(service)
  try {
    assert.equal(current().session, null)
    assert.equal(current().error, 'Sem conexão')
    assert.equal(current().restoring, false)
    await ui.act(async () => { await current().enter({ id: 'buyer' }) })
    assert.equal(current().session.id, 'buyer')
    assert.equal(current().error, '')
  } finally { await ui.dispose() }
})

test('SIGNED_OUT durante troca explícita não oculta erro nem invalida novo login', async () => {
  const service = fixture(async () => ({ id: 'ana' }))
  service.enter = async () => { service.emit(); throw new Error('Perfil inválido') }
  const { ui, current } = await setup(service)
  try {
    await ui.act(async () => { assert.equal(await current().enter({ id: 'buyer' }), null) })
    assert.equal(current().session, null)
    assert.equal(current().error, 'Perfil inválido')
    assert.equal(current().pending, false)
    service.enter = async account => { service.emit(); return account }
    await ui.act(async () => { await current().enter({ id: 'buyer' }) })
    assert.equal(current().session.id, 'buyer')
    assert.equal(current().pending, false)
  } finally { await ui.dispose() }
})
