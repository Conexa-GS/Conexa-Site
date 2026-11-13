import test from 'node:test'
import assert from 'node:assert/strict'
import { createChatEnvironment } from './helpers/offer-chat-dom.mjs'

test('login usa três opções de perfil, envia credenciais, bloqueia edição pendente e preserva campos', async () => {
  const ui = await createChatEnvironment()
  const original = globalThis.FormData
  globalThis.FormData = window.FormData
  try {
    const { default: Login } = await ui.load('/src/pages/Login.jsx')
    let resolve, sent
    const auth = { enter: input => { sent = input; return new Promise(done => { resolve = done }) } }
    await ui.mountComponent(Login, { auth })
    assert.equal(ui.document.querySelectorAll('input[type=radio]').length, 3)
    await ui.act(async () => { ui.document.querySelector('input[value=buyer]').click() })
    ui.document.querySelector('input[name=email]').value = 'person@example.com'
    ui.document.querySelector('input[name=password]').value = 'private-password'
    await ui.click('Mostrar senha')
    assert.equal(ui.document.querySelector('input[name=password]').type, 'text')
    await ui.act(async () => { ui.document.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })) })
    assert.deepEqual(sent, { email: 'person@example.com', password: 'private-password', role: 'buyer' })
    assert.equal(ui.document.querySelector('.login-fields').disabled, true)
    await ui.act(async () => { resolve(null) })
    assert.equal(ui.document.querySelector('.login-fields').disabled, false)
    assert.equal(ui.document.querySelector('input[name=password]').value, 'private-password')
  } finally { globalThis.FormData = original; await ui.dispose() }
})
test('cadastro aguarda confirmação e recuperação não expõe existência de conta', async () => {
  const ui = await createChatEnvironment()
  const original = globalThis.FormData
  globalThis.FormData = window.FormData
  try {
    const { default: Login } = await ui.load('/src/pages/Login.jsx')
    let registered, loggedIn = 0, recovery
    const service = { register: async input => { registered = input; return { confirmationRequired: true } }, recover: async (email, redirect) => { recovery = { email, redirect } } }
    await ui.mountComponent(Login, { auth: { enter: () => { loggedIn++ } }, service })
    await ui.click('Criar conta')
    ui.document.querySelector('input[name=name]').value = 'Pessoa'
    ui.document.querySelector('input[name=email]').value = 'person@example.com'
    ui.document.querySelector('input[name=password]').value = 'password'
    await ui.act(async () => { ui.document.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })) })
    assert.equal(registered.role, 'producer')
    assert.equal(loggedIn, 0)
    assert.match(ui.document.querySelector('[role=status]').textContent, /confirmar/)
    await ui.click('Entrar')
    await ui.click('Esqueci minha senha')
    ui.document.querySelector('input[name=email]').value = 'person@example.com'
    await ui.act(async () => { ui.document.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })) })
    assert.equal(recovery.redirect, 'http://localhost/redefinir-senha')
    assert.match(ui.document.querySelector('[role=status]').textContent, /Se houver uma conta/)
  } finally { globalThis.FormData = original; await ui.dispose() }
})
