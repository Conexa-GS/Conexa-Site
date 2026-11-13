import { isMotionReduced } from './provided-animations'

export function mountProfileCarousel() {
  const viewport = document.querySelector('.profile-carousel-window')
  const group = viewport.querySelector('.profile-carousel-group:not([data-profile-copy])')
  const lifetime = new AbortController()
  const options = { signal: lifetime.signal }
  const mobile = matchMedia('(max-width: 760px)')
  let frame, previous = 0, remainder = 0, visible = false, touching = false, resumeAt = 0

  function resize() {
    viewport.scrollLeft = isMotionReduced() || !mobile.matches ? 0 : group.offsetWidth
    viewport.setAttribute('aria-roledescription', mobile.matches ? 'carrossel' : 'lista de perfis')
    remainder = 0
  }
  function tick(time) {
    const elapsed = previous ? Math.min(time - previous, 50) : 0
    previous = time
    const focused = viewport.contains(document.activeElement)
    if (mobile.matches && visible && !document.hidden && !isMotionReduced() && !focused && !touching && !viewport.matches(':hover') && time > resumeAt) {
      remainder += elapsed * .04
      const step = Math.floor(remainder)
      remainder -= step
      let next = viewport.scrollLeft + step
      const width = group.offsetWidth
      if (width && next >= width * 2) next -= width
      if (width && next < width) next += width
      viewport.scrollLeft = next
    }
    frame = requestAnimationFrame(tick)
  }
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting })
  observer.observe(viewport)
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(group)
  viewport.addEventListener('pointerdown', () => { touching = true }, options)
  window.addEventListener('pointerup', () => { touching = false; resumeAt = performance.now() + 1800 }, options)
  window.addEventListener('pointercancel', () => { touching = false; resumeAt = performance.now() + 1800 }, options)
  viewport.addEventListener('wheel', () => { resumeAt = performance.now() + 1800 }, { ...options, passive: true })
  document.addEventListener('conexa-motion-preference', resize, options)
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', resize, options)
  mobile.addEventListener('change', resize, options)
  resize()
  frame = requestAnimationFrame(tick)
  return () => { cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect(); lifetime.abort() }
}
