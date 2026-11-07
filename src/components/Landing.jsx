import { useLayoutEffect } from 'react'
import markup from '../pilot/home.html?raw'
import { mountArtwork } from '../pilot/artwork'
import { mountMotion } from '../pilot/motion'
import { navigate } from '../hooks/useRouter'

export default function Landing() {
  useLayoutEffect(() => {
    mountArtwork()
    const dispose = mountMotion()
    return () => { dispose(); document.querySelector('.art-library')?.remove() }
  }, [])
  return <div onClick={event => { const button = event.target.closest('[data-connect]'); if (button) navigate(`/demo${button.dataset.profile ? `?perfil=${button.dataset.profile}` : ''}`) }} dangerouslySetInnerHTML={{ __html: markup }} />
}
