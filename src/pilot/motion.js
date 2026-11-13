/* Scroll only positions the supplied truck GIF. Its wheels, suspension and
   character motion are encoded in the user's files, not redrawn in code. */
import { journeyRoute } from './journey-route'
import { isMotionReduced, setMotionReduced } from './provided-animations'

export function mountMotion() {
  const $ = id => document.getElementById(id)
  const world = document.querySelector('.story-world')
  const stations = [...document.querySelectorAll('.station')]
  const route = $('road-base'), rig = $('truck-rig'), facing = $('truck-facing')
  const emptyTruck = rig.querySelector('.truck-empty'), loadedTruck = rig.querySelector('.truck-loaded')
  const collection = document.querySelector('.collection'), delivery = document.querySelector('.delivery')
  const preference = matchMedia('(prefers-reduced-motion: reduce)'), lifetime = new AbortController()
  const toggle = $('motion-toggle'), indicator = document.querySelector('.journey-indicator')
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
  const lerp = (a, b, t) => a + (b - a) * t
  const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t) }
  const damp = (a, b, dt) => lerp(a, b, 1 - Math.exp(-dt / .16))
  let reduced = isMotionReduced(), metrics, samples = [], total = 1, heading = -1
  let target = { distance: 0, load: 0, unload: 0 }, state = { ...target }
  let frame = 0, resizeFrame = 0, previousTime = 0, previousStage = -1

  function distanceAtY(y) {
    let lo = 0, hi = samples.length - 1
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (samples[mid].y < y) lo = mid; else hi = mid }
    const a = samples[lo], b = samples[hi]
    return lerp(a.length, b.length, clamp((y - a.y) / Math.max(.001, b.y - a.y)))
  }

  function measure() {
    resizeFrame = 0
    const rect = world.getBoundingClientRect()
    const pin = el => { const r = el.getBoundingClientRect(); return { x: r.left - rect.left, y: r.top - rect.top } }
    const [depot, farm, market] = stations.map(el => pin(el.querySelector('.dock')))
    const mobile = innerWidth <= 760
    const scale = mobile ? clamp(innerWidth / 660, .48, .72) : clamp(innerWidth / 1550, .66, .9)
    metrics = { top: rect.top + scrollY, width: rect.width, height: rect.height, depot, farm, market, mobile, scale,
      focus: innerHeight * (mobile ? .72 : .69), hold: mobile ? 170 : 200 }
    const bounds = el => { const r = el.getBoundingClientRect(); return { left: r.left - rect.left, right: r.right - rect.left, top: r.top - rect.top } }
    const { d } = journeyRoute({ depot, farm, market, width: rect.width, mobile, scale,
      collection: bounds(collection.querySelector('.section-copy')), delivery: bounds(delivery.querySelector('.section-copy')) })
    $('route-svg').setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`)
    for (const id of ['road-soft', 'road-base', 'road-dashes', 'road-travelled']) $(id).setAttribute('d', d)
    total = route.getTotalLength()
    samples = Array.from({ length: 601 }, (_, i) => { const length = total * i / 600; return { y: route.getPointAtLength(length).y, length } })
    metrics.farmDistance = distanceAtY(farm.y)
    rig.style.width = `${320 * scale}px`; rig.style.height = `${200 * scale}px`
    $('road-travelled').style.strokeDasharray = `${total} ${total}`
    updateTarget(); state = { ...target }; render(); start()
  }

  function updateTarget() {
    if (!metrics) return
    const local = scrollY - metrics.top, farmAt = metrics.farm.y - metrics.focus
    const marketAt = metrics.market.y - metrics.focus + metrics.hold
    const load = smooth((local - farmAt) / metrics.hold), unload = smooth((local - marketAt) / metrics.hold)
    const departAt = Math.max(0, metrics.depot.y - metrics.focus)
    const distance = local < farmAt
      ? smooth((local - departAt) / Math.max(1, farmAt - departAt)) * metrics.farmDistance
      : local < farmAt + metrics.hold ? metrics.farmDistance
        : lerp(metrics.farmDistance, total, smooth((local - farmAt - metrics.hold) / Math.max(1, marketAt - farmAt - metrics.hold)))
    target = { distance, load, unload }
    const inStory = scrollY > metrics.top + 150 && scrollY < metrics.top + metrics.height - innerHeight * .3
    indicator.classList.toggle('is-visible', inStory && !reduced)
    $('trip-label').textContent = unload > .98 ? 'Entrega concluída.' : unload > .01 ? 'Chegando ao mercado.' : load > .98 ? 'A colheita segue viagem.' : load > .01 ? 'Coletando os alimentos.' : 'A caminho de quem produz.'
    const stage = unload > .98 ? 3 : load > .98 ? 2 : load > .01 ? 1 : 0
    if (stage !== previousStage) {
      previousStage = stage
      $('trip-announcement').textContent = 'Na história ilustrada: ' + ['O caminhão segue para o produtor.', 'Coleta dos alimentos com a produtora.', 'Alimentos coletados. Próxima parada: mercado.', 'Alimentos entregues ao mercado.'][stage]
    }
  }

  function render() {
    if (!metrics) return
    const p = route.getPointAtLength(state.distance)
    const proximity = Math.max(...[metrics.depot, metrics.farm, metrics.market].map(stop => 1 - smooth((Math.abs(p.y - stop.y) - 12) / 70)))
    const scale = metrics.mobile ? lerp(.06, metrics.scale, proximity) : metrics.scale
    const ahead = route.getPointAtLength(Math.min(total, state.distance + 8)), behind = route.getPointAtLength(Math.max(0, state.distance - 8))
    if (state.load > .7 && Math.abs(state.distance - metrics.farmDistance) < 2) {
      const departure = route.getPointAtLength(Math.min(total, metrics.farmDistance + 60))
      if (Math.abs(departure.x - p.x) > .5) heading = departure.x > p.x ? 1 : -1
    } else if (Math.abs(ahead.x - behind.x) > 1.2) heading = ahead.x > behind.x ? 1 : -1
    const x = metrics.mobile ? clamp(p.x, 160 * scale + 4, metrics.width - 160 * scale - 4) : p.x
    rig.style.transform = `translate3d(${x - 160 * scale}px,${p.y - 170 * scale}px,0) scale(${scale / metrics.scale})`
    rig.style.opacity = String(smooth(state.distance / 65))
    facing.style.transform = `scaleX(${heading})`
    const loaded = state.load > .98 && state.unload < .02
    emptyTruck.hidden = loaded; loadedTruck.hidden = !loaded
    collection.classList.toggle('is-loaded', state.load > .98); delivery.classList.toggle('is-delivered', state.unload > .98)
    $('road-travelled').style.strokeDashoffset = String(total - state.distance)
    $('mini-progress').style.transform = `scaleX(${state.distance / total})`
  }

  function tick(time) {
    frame = 0
    if (document.hidden || reduced || !metrics) return
    const dt = Math.min(.045, previousTime ? (time - previousTime) / 1000 : .016); previousTime = time
    state.distance = damp(state.distance, target.distance, dt); state.load = damp(state.load, target.load, dt); state.unload = damp(state.unload, target.unload, dt)
    render()
    if (Math.abs(state.distance - target.distance) > .02 || Math.abs(state.load - target.load) > .001 || Math.abs(state.unload - target.unload) > .001) frame = requestAnimationFrame(tick)
    else previousTime = 0
  }
  function start() { if (!frame && !reduced && !document.hidden) frame = requestAnimationFrame(tick) }
  function applyMotion() {
    reduced = isMotionReduced()
    document.body.classList.toggle('art-paused', reduced)
    toggle.setAttribute('aria-pressed', String(reduced)); toggle.disabled = preference.matches
    toggle.textContent = preference.matches ? 'Movimento reduzido pelo sistema' : reduced ? 'Ativar movimento' : 'Reduzir movimento'
    if (frame) cancelAnimationFrame(frame)
    frame = 0; previousTime = 0
    indicator.classList.remove('is-visible')
    if (metrics) measure()
  }
  toggle.addEventListener('click', () => setMotionReduced(!reduced), { signal: lifetime.signal })
  document.addEventListener('conexa-motion-preference', applyMotion, { signal: lifetime.signal })
  preference.addEventListener('change', applyMotion, { signal: lifetime.signal })
  addEventListener('scroll', () => { updateTarget(); start() }, { passive: true, signal: lifetime.signal })
  addEventListener('resize', () => { if (!resizeFrame) resizeFrame = requestAnimationFrame(measure) }, { passive: true, signal: lifetime.signal })
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; previousTime = 0 } else { updateTarget(); start() } }, { signal: lifetime.signal })
  applyMotion(); measure()
  return () => { lifetime.abort(); cancelAnimationFrame(frame); cancelAnimationFrame(resizeFrame); document.body.classList.remove('art-paused') }
}
