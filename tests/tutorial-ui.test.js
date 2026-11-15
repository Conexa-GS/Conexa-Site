import test from 'node:test'
import assert from 'node:assert/strict'
import { createChatEnvironment } from './helpers/offer-chat-dom.mjs'

test('visita guiada personalizada isola ações e completa cada perfil sem mudar rota ou salvar', async () => {
 const ui = await createChatEnvironment(), old = globalThis.ResizeObserver
 globalThis.ResizeObserver = class { observe() {} disconnect() {} }
 try {
  const { default: Tutorial } = await ui.load('/src/features/tutorial/Tutorial.jsx')
  const { stepsForRole } = await ui.load('/src/features/tutorial/tutorial-steps.js')
  await ui.mountComponent(Tutorial, {})
  assert.equal(ui.document.querySelector('.tutorial-trigger'), null)
  for (const role of ['producer', 'buyer', 'carrier']) {
   await ui.mountComponent(Tutorial, { role }, role)
   const opener=ui.findButton('Como usar'); opener.focus()
   await ui.click('Como usar')
   const steps=stepsForRole(role)
   for(const [i,step] of steps.entries()) {
    assert.equal(ui.document.querySelectorAll('dialog').length,1)
    assert.equal(ui.document.querySelector('.tour-card h3').textContent,step.title)
    assert.match(ui.document.querySelector('.tour-kicker').textContent,new RegExp(`${i+1} de ${steps.length}`))
    assert.ok(ui.document.querySelector('.tutorial-reference[inert][aria-hidden=true]'))
    assert.ok(ui.document.querySelector('.tutorial-reference').querySelector(step.target||step.viewTarget),`Alvo ${role}/${step.id}`)
    const form=ui.document.querySelector('.tutorial-reference form')
    if(form){let reached=false;form.addEventListener('submit',()=>{reached=true});await ui.act(async()=>form.dispatchEvent(new ui.document.defaultView.Event('submit',{bubbles:true,cancelable:true})));assert.equal(reached,false)}
    await ui.click(`Praticar no tutorial: ${step.action||'Concluir'}`)
    assert.equal(ui.document.defaultView.location.pathname,'/')
   }
   assert.equal(ui.document.querySelector('dialog'),null)
   assert.equal(ui.document.activeElement,opener)
   await ui.click('Como usar');assert.ok(ui.findButton('Anterior').disabled)
   await ui.click('Próximo');await ui.click('Anterior')
   assert.equal(ui.document.querySelector('.tour-card h3').textContent,steps[0].title)
   await ui.cancel();assert.equal(ui.document.querySelector('dialog'),null)
  }
 } finally {if(old===undefined)delete globalThis.ResizeObserver;else globalThis.ResizeObserver=old;await ui.dispose()}
})

test('clique duplo não pula etapas no comprador ou transportadora', async () => {
 const ui=await createChatEnvironment(), old=globalThis.ResizeObserver
 globalThis.ResizeObserver=class {observe(){} disconnect(){}}
 try {
  const {default:Tutorial}=await ui.load('/src/features/tutorial/Tutorial.jsx')
  for(const role of ['buyer','carrier']) {
   await ui.mountComponent(Tutorial,{role},role)
   await ui.click('Como usar')
   let time=1000
   const pointer=(button,detail,stamp)=>{const event=new ui.document.defaultView.MouseEvent('click',{bubbles:true,detail});Object.defineProperty(event,'timeStamp',{value:stamp});button.dispatchEvent(event)}
   const click=async detail=>ui.act(async()=>pointer(ui.findButton('Próximo'),detail,time+detail*30))
   await click(1)
   await click(2)
   assert.match(ui.document.querySelector('.tour-kicker span').textContent,/^2 de /,'duplo clique avança somente uma etapa')
   await ui.act(async()=>{ui.findButton('Próximo').click();ui.findButton('Próximo').click()})
   assert.match(ui.document.querySelector('.tour-kicker span').textContent,/^3 de /,'eventos no mesmo ciclo não acumulam avanços')
   time+=1000
   for(const detail of [1,2]) await ui.act(async()=>pointer(ui.findButton('Anterior'),detail,time+detail*30))
   assert.match(ui.document.querySelector('.tour-kicker span').textContent,/^2 de /,'voltar também ignora o segundo clique')
   time+=1000
   for(const detail of [1,2]) await ui.act(async()=>pointer(ui.document.querySelector('.tour-spotlight'),detail,time+detail*30))
   assert.match(ui.document.querySelector('.tour-kicker span').textContent,/^3 de /,'destaque também avança somente uma vez')
   await ui.act(async()=>pointer(ui.findButton('Próximo'),1,time+100))
   assert.match(ui.document.querySelector('.tour-kicker span').textContent,/^3 de /,'segundo clique em controle diferente também é ignorado')
   const repeated=new ui.document.defaultView.KeyboardEvent('keydown',{bubbles:true,cancelable:true,key:'Enter',repeat:true})
   await ui.act(async()=>ui.findButton('Próximo').dispatchEvent(repeated))
   assert.equal(repeated.defaultPrevented,true,'segurar Enter não repete a navegação')
   await ui.cancel()
  }
 } finally {if(old===undefined)delete globalThis.ResizeObserver;else globalThis.ResizeObserver=old;await ui.dispose()}
})
