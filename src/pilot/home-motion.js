import { isMotionReduced, setMotionReduced } from './provided-animations'

export function mountHomeMotion() {
  const root = document.querySelector('.photo-landing')
  const unseen = new Set(root.querySelectorAll('[data-reveal], .home-profile-image'))
  const toggle = root.querySelector('#motion-toggle')
  const preference = matchMedia('(prefers-reduced-motion: reduce)')
  const lifetime = new AbortController()
  const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
    if (isMotionReduced()) return
    entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target) })
  }, { rootMargin: '0px 0px -36px 0px' })

  function reveal(item) {
    item.classList.remove('reveal-pending')
    observer?.unobserve(item)
    unseen.delete(item)
  }

  function clearReveals() {
    delete root.dataset.homeMotion
    observer?.disconnect()
    unseen.forEach(item => item.classList.remove('reveal-pending'))
  }

  function update() {
    const reduced = isMotionReduced()
    toggle.disabled = preference.matches
    toggle.setAttribute('aria-pressed', String(reduced))
    toggle.textContent = preference.matches ? 'Movimento reduzido pelo sistema'
      : reduced ? 'Ativar movimento' : 'Reduzir movimento'
    if (reduced) clearReveals()
    else if (observer && !root.hasAttribute('data-home-motion')) {
      // Arm only content below the viewport, including when motion is re-enabled mid-page.
      const upcoming = [...unseen].filter(item => {
        if (item.getBoundingClientRect().top >= window.innerHeight) return true
        unseen.delete(item)
        return false
      })
      upcoming.forEach(item => {
        item.classList.add('reveal-pending')
        observer.observe(item)
      })
      root.dataset.homeMotion = ''
    }
  }

  function revealTarget(target) {
    if (!target || target.id === 'conteudo' || target.id === 'para-quem') return
    unseen.forEach(item => {
      if (target.contains(item) || item.contains(target)) reveal(item)
    })
  }

  toggle.addEventListener('click', () => setMotionReduced(!isMotionReduced()), { signal: lifetime.signal })
  root.addEventListener('focusin', event => revealTarget(event.target), { signal: lifetime.signal })
  window.addEventListener('hashchange', () => revealTarget(document.getElementById(location.hash.slice(1))), { signal: lifetime.signal })
  preference.addEventListener('change', update, { signal: lifetime.signal })
  document.addEventListener('conexa-motion-preference', update, { signal: lifetime.signal })
  const initialTarget = document.getElementById(location.hash.slice(1))
  if (initialTarget && root.contains(initialTarget)) {
    // Landing is lazy-loaded, so the browser can look for the fragment before it exists.
    if (window.scrollY === 0) initialTarget.scrollIntoView({ behavior: 'instant' })
    revealTarget(initialTarget)
  }
  update()
  return () => { lifetime.abort(); clearReveals() }
}
