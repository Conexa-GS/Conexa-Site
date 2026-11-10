import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'

// Component contract tests only: jsdom has no layout, native modal focus trap or browser keyboard navigation.
export async function createChatEnvironment(env = {}) {
  const dom = new JSDOM('<!doctype html><html lang="pt-BR"><body><button id="opener">Abrir conversa</button><div id="root"></div></body></html>', { url: 'http://localhost/' })
  const originals = new Map()
  for (const [name, value] of Object.entries({ window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true })) {
    originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name))
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value })
  }
  dom.window.HTMLElement.prototype.scrollIntoView = function () {}
  dom.window.HTMLDialogElement.prototype.showModal = function () {
    this.open = true
    this.querySelector('button')?.focus()
  }
  dom.window.HTMLDialogElement.prototype.close = function () { this.open = false }
  const server = await createServer({ configFile: false, envDir: false, plugins: [react()], optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, ws: false, watch: null }, define: Object.fromEntries(Object.entries(env).map(([name, value]) => [`import.meta.env.${name}`, JSON.stringify(value)])) })
  const { createElement, act } = await import('react')
  const { createRoot } = await import('react-dom/client')
  const { default: OfferChat } = await server.ssrLoadModule('/src/features/offers/OfferChat.jsx')
  const root = createRoot(dom.window.document.getElementById('root'))
  const document = dom.window.document
  const findButton = text => {
    const button = [...document.querySelectorAll('button')].find(item => item.textContent.trim() === text || item.getAttribute('aria-label') === text)
    assert.ok(button, `Botão disponível: ${text}`)
    return button
  }
  const click = async text => { await act(async () => { findButton(text).click() }) }
  const respond = async value => {
    const input = document.getElementById('chat-answer')
    assert.ok(input, 'Campo da pergunta disponível')
    await act(async () => {
      const prototype = input.tagName === 'SELECT' ? dom.window.HTMLSelectElement.prototype : dom.window.HTMLInputElement.prototype
      Object.getOwnPropertyDescriptor(prototype, 'value').set.call(input, value)
      input.dispatchEvent(new dom.window.Event(input.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }))
    })
    await act(async () => { document.querySelector('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })) })
  }
  return {
    document, act, click, respond, findButton,
    load: path => server.ssrLoadModule(path),
    async mount(props) {
      document.getElementById('opener').focus()
      await act(async () => { root.render(createElement(OfferChat, props)) })
    },
    async unmount() { await act(async () => { root.render(null) }) },
    async cancel() { await act(async () => { document.querySelector('dialog').dispatchEvent(new dom.window.Event('cancel', { cancelable: true })) }) },
    async dispose() {
      await act(async () => { root.unmount() })
      await server.close()
      dom.window.close()
      for (const [name, descriptor] of originals) {
        if (descriptor) Object.defineProperty(globalThis, name, descriptor)
        else delete globalThis[name]
      }
    },
  }
}
