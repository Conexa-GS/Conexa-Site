import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Question, Check } from '@phosphor-icons/react'
import { Modal } from '../../components/ui'
import { stepsForRole } from './tutorial-steps'
import { tutorialFixtures } from './tutorial-fixtures'
import TutorialScreen from './TutorialScreen'
import './tutorial.css'
const roles = { producer: 'Produtor', buyer: 'Comprador', carrier: 'Transportadora' }
function Tour({ role, onClose }) {
  const [index, setIndex] = useState(0), [data] = useState(tutorialFixtures)
  const steps = stepsForRole(role), step = steps[index], last = index === steps.length - 1
  const scene = useRef(null), viewport = useRef(null), spot = useRef(null), card = useRef(null), heading = useRef(null)
  const lastPointerClick = useRef(-Infinity)
  function move(event, direction) {
    // The second click of a double-click belongs to the same navigation gesture.
    if (event.detail > 1) return
    // The card moves between steps: a second click can hit a different control.
    if (event.detail > 0) {
      if (event.timeStamp - lastPointerClick.current < 350) return
      lastPointerClick.current = event.timeStamp
    }
    if (direction > 0 && last) onClose()
    else setIndex(Math.max(0, Math.min(steps.length - 1, index + direction)))
  }
  function next(event) { move(event, 1) }
  useEffect(() => { heading.current?.focus({ preventScroll: true }) }, [index])
  useLayoutEffect(() => {
    const root = scene.current, scroller = viewport.current
    const target = root.querySelector(step.target || step.viewTarget)
    function position() {
      if (!target) return
      const rect = target.getBoundingClientRect(), view = scroller.getBoundingClientRect()
      scroller.scrollTop += rect.top - view.top - (scroller.clientHeight - rect.height) / 2
      const bounds = target.getBoundingClientRect()
      Object.assign(spot.current.style, { left: `${Math.max(4, bounds.left - 6)}px`, top: `${bounds.top - 6}px`, width: `${bounds.width + 12}px`, height: `${bounds.height + 12}px` })
      if (window.innerWidth > 600) {
        const width = card.current.offsetWidth, height = card.current.offsetHeight
        const left = Math.min(window.innerWidth - width - 20, Math.max(20, bounds.right + width + 36 < window.innerWidth ? bounds.right + 20 : bounds.left - width - 20 > 0 ? bounds.left - width - 20 : bounds.left))
        const top = bounds.bottom + height + 28 < window.innerHeight ? bounds.bottom + 18 : Math.max(18, bounds.top - height - 18)
        Object.assign(card.current.style, { left: `${left}px`, top: `${top}px` })
      } else { card.current.style.left = ''; card.current.style.top = '' }
    }
    position()
    const observer = new ResizeObserver(position)
    observer.observe(root)
    window.addEventListener('resize', position)
    return () => { observer.disconnect(); window.removeEventListener('resize', position) }
  }, [step])
  return <Modal title={`Tutorial de ${roles[role]}`} className="tutorial-tour" onClose={onClose}>
    <div ref={viewport} className="tour-page"><div ref={scene}><TutorialScreen key={step.id} step={step} data={data} /></div></div>
    <button ref={spot} type="button" className="tour-spotlight" onKeyDown={event => { if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault() }} onClick={next} aria-label={`Praticar no tutorial: ${step.action || 'Concluir'}`} />
    <section ref={card} className="tour-card" aria-live="polite" aria-atomic="true"><div className="tour-kicker">{roles[role]}<span>{index + 1} de {steps.length}</span></div><p className="tour-path">{step.page}</p><h3 ref={heading} tabIndex={-1}>{step.title}</h3><p>{step.text}</p><small>Simulação guiada · nenhum dado é salvo</small><div className="tour-actions" onKeyDown={event => { if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault() }}><button type="button" disabled={index === 0} onClick={event => move(event, -1)}><ArrowLeft size={16} />Anterior</button><button type="button" className="tour-next" onClick={next}>{last ? 'Concluir' : 'Próximo'}{last ? <Check size={16} /> : <ArrowRight size={16} />}</button></div></section>
  </Modal>
}
export default function Tutorial({ role }) {
  const [open, setOpen] = useState(false)
  if (!roles[role]) return null
  return <><button type="button" className="tutorial-trigger" onClick={() => setOpen(true)} aria-haspopup="dialog"><Question size={21} aria-hidden="true" />Como usar</button>{open && <Tour key={role} role={role} onClose={() => setOpen(false)} />}</>
}
