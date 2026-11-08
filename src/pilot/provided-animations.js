import { animationAssets } from './animation-assets'

const motionEvent = 'conexa-motion-preference'
const escapeAttribute = value => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

export function animationMarkup(name, { label = '', align = 'xMidYMid meet' } = {}) {
  const asset = animationAssets[name]
  if (!asset) throw new Error(`Unknown supplied animation: ${name}`)
  return `<svg class="provided-animation" data-motion-art="${name}" viewBox="${asset.viewport.join(' ')}" preserveAspectRatio="${align}" ${label ? `role="img" aria-label="${escapeAttribute(label)}"` : 'aria-hidden="true"'}><image href="${asset.still}" data-gif="${asset.gif}" data-still="${asset.still}" width="${asset.width}" height="${asset.height}"/></svg>`
}

export function isMotionReduced() {
  return document.documentElement.dataset.motion === 'reduced' || matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function setMotionReduced(reduced) {
  document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'
  document.dispatchEvent(new Event(motionEvent))
}

/* GIF artwork remains unchanged. Show its first frame when offscreen, hidden
   or reduced; restore the supplied GIF when playback is appropriate. */
export function mountProvidedAnimations(root) {
  const images = [...root.querySelectorAll('image[data-gif]')]
  const visible = new Set(), failed = new Set()
  const preference = matchMedia('(prefers-reduced-motion: reduce)')
  const lifetime = new AbortController()
  function update() {
    const paused = isMotionReduced() || document.hidden
    images.forEach(image => {
      const play = !paused && !failed.has(image) && visible.has(image.closest('[data-motion-art]'))
      const source = play ? image.dataset.gif : image.dataset.still
      if (image.getAttribute('href') !== source) image.setAttribute('href', source)
    })
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target) })
    update()
  }, { rootMargin: '80px' })
  images.forEach(image => {
    observer.observe(image.closest('[data-motion-art]'))
    image.addEventListener('error', () => { failed.add(image); update() }, { signal: lifetime.signal })
  })
  document.addEventListener(motionEvent, update, { signal: lifetime.signal })
  document.addEventListener('visibilitychange', update, { signal: lifetime.signal })
  preference.addEventListener('change', update, { signal: lifetime.signal })
  update()
  return () => { observer.disconnect(); lifetime.abort() }
}
