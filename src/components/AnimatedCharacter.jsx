import { useId } from 'react'
import { characterBackdrop, characterMarkup } from '../pilot/characters'

export default function AnimatedCharacter({ role }) {
  const instance = useId().replace(/[^a-z0-9-]/gi, '')
  return <><span aria-hidden="true" dangerouslySetInnerHTML={{ __html: characterBackdrop(role) }} /><span className="reference-person" aria-hidden="true" dangerouslySetInnerHTML={{ __html: characterMarkup(role, { id: `profile-${role}-${instance}` }) }} /></>
}
