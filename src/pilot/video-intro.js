import { isMotionReduced, setMotionReduced } from './provided-animations'

export function mountVideoIntro() {
  const intro = document.querySelector('.video-intro')
  const video = intro.querySelector('video')
  const toggle = intro.querySelector('button')
  const preference = matchMedia('(prefers-reduced-motion: reduce)')
  const lifetime = new AbortController()
  let visible = false, disposed = false

  // Set the property as well as the attribute before requesting playback.
  video.defaultMuted = true
  video.muted = true

  function update() {
    const reduced = isMotionReduced()
    toggle.disabled = preference.matches
    toggle.setAttribute('aria-pressed', String(reduced))
    toggle.textContent = preference.matches ? 'Movimento reduzido pelo sistema'
      : reduced ? 'Ativar vídeo e efeitos' : 'Pausar vídeo e efeitos'
    if (reduced || !visible || document.hidden) video.pause()
    else video.play().then(() => {
      // A play request can settle after navigation or a preference change.
      if (disposed || isMotionReduced() || !visible || document.hidden) video.pause()
    }).catch(() => { /* Keep the poster/background if autoplay is blocked. */ })
  }

  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting)
    update()
  })
  observer.observe(intro)
  toggle.addEventListener('click', () => setMotionReduced(!isMotionReduced()), { signal: lifetime.signal })
  preference.addEventListener('change', update, { signal: lifetime.signal })
  document.addEventListener('conexa-motion-preference', update, { signal: lifetime.signal })
  document.addEventListener('visibilitychange', update, { signal: lifetime.signal })
  update()
  return () => { disposed = true; lifetime.abort(); observer.disconnect(); video.pause() }
}
