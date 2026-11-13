import { useLayoutEffect } from 'react'
import markup from '../pilot/home.html?raw'
import { mountArtwork } from '../pilot/artwork'
import { mountMotion } from '../pilot/motion'
import { mountProfileCarousel } from '../pilot/profile-carousel'
import { mountVideoIntro } from '../pilot/video-intro'
import '../pilot/profile-carousel.css'
import '../pilot/video-intro.css'
import { navigate } from '../hooks/useRouter'

export default function Landing() {
  useLayoutEffect(() => {
    document.getElementById('conteudo')?.focus({ preventScroll: true })
    const removeArtwork = mountArtwork()
    const dispose = mountMotion()
    const removeCarousel = mountProfileCarousel()
    const removeVideoIntro = mountVideoIntro()
    return () => { removeVideoIntro(); removeCarousel(); dispose(); removeArtwork() }
  }, [])
  return <div onClick={event => {
    const link = event.target.closest('[data-login]')
    if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
      event.preventDefault()
      navigate(link.getAttribute('href'))
    }
  }} dangerouslySetInnerHTML={{ __html: markup }} />
}
