import { isMotionReduced, setMotionReduced } from './provided-animations'

// Reveal each block once. Without an observer, all content stays visible.
export function mountHomeMotion() {
  const root = document.querySelector('.photo-landing')
  const items = [...root.querySelectorAll('[data-reveal]')]
  const toggle = root.querySelector('#motion-toggle')
  const preference = matchMedia('(prefers-reduced-motion: reduce)')
  const lifetime = new AbortController()
  const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.classList.remove('reveal-pending')
      observer.unobserve(entry.target)
    })
  }, { threshold: .12 })

  function update() {
    const reduced = isMotionReduced()
    toggle.disabled = preference.matches
    toggle.setAttribute('aria-pressed', String(reduced))
    toggle.textContent = preference.matches ? 'Movimento reduzido pelo sistema'
      : reduced ? 'Ativar movimento' : 'Reduzir movimento'
    if (reduced) items.forEach(item => {
      item.classList.remove('reveal-pending')
      observer?.unobserve(item)
    })
  }

  if (!isMotionReduced() && observer) items.forEach(item => {
    item.classList.add('reveal-pending')
    observer.observe(item)
  })
  toggle.addEventListener('click', () => setMotionReduced(!isMotionReduced()), { signal: lifetime.signal })
  preference.addEventListener('change', update, { signal: lifetime.signal })
  document.addEventListener('conexa-motion-preference', update, { signal: lifetime.signal })
  update()
  return () => { lifetime.abort(); observer?.disconnect() }
}
