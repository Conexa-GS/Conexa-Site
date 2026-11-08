import { useLayoutEffect, useRef } from 'react'
import { animationMarkup, mountProvidedAnimations } from '../pilot/provided-animations'

export default function MotionArtwork({ asset, label = '' }) {
  const ref = useRef(null)
  useLayoutEffect(() => mountProvidedAnimations(ref.current), [asset, label])
  return <span className="provided-art" ref={ref} dangerouslySetInnerHTML={{ __html: animationMarkup(asset, { label }) }} />
}
