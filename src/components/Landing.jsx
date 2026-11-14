import { useLayoutEffect } from 'react'
import markup from '../pilot/home.html?raw'
import { mountHomeMotion } from '../pilot/home-motion'
import { mountVideoIntro } from '../pilot/video-intro'
import '../pilot/video-intro.css'
import '../pilot/home.css'
import { navigate } from '../hooks/useRouter'

export default function Landing() {
  useLayoutEffect(() => {
    document.getElementById('conteudo')?.focus({ preventScroll: true })
    const removeMotion = mountHomeMotion()
    const removeVideoIntro = mountVideoIntro()
    return () => { removeVideoIntro(); removeMotion() }
  }, [])
  return <div className="photo-landing" onClick={event => {
    const link = event.target.closest('[data-login]')
    if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
      event.preventDefault()
      navigate(link.getAttribute('href'))
    }
  }} dangerouslySetInnerHTML={{ __html: markup }} />
}
