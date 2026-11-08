/* Reference artwork follows a reversible, scroll-driven collection journey.
   Frame work stops when the vehicle settles or the page leaves the viewport. */
import { journeyRoute } from './journey-route'

export function mountMotion() {
  'use strict';
  const $ = id => document.getElementById(id);
  const world = document.querySelector('.story-world');
  const stations = [...document.querySelectorAll('.station')];
  const route = $('road-base');
  const rig = $('truck-rig'), facingNode = $('truck-facing');
  const suspension = $('truck-suspension'), cargo = $('truck-cargo');
  const shadow = $('truck-shadow'), wheels = [...document.querySelectorAll('.truck-wheel')];
  const flight = $('flying-cargo'), preference = matchMedia('(prefers-reduced-motion: reduce)');
  const lifetime = new AbortController();
  const toggle = $('motion-toggle'), collection = document.querySelector('.collection'), delivery = document.querySelector('.delivery');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };
  const damp = (a, b, dt, time = .16) => lerp(a, b, 1 - Math.exp(-dt / time));
  let reduced = preference.matches, metrics, samples = [], total = 1;
  let target = { distance: 0, load: 0, unload: 0 }, state = { distance: 0, load: 0, unload: 0 };
  let frame = 0, resizeFrame = 0, previousTime = 0, speed = 0, face = -1, initialised = false, previousStage = -1;
  let scenePositions = [];
  let heading = -1;

  function pin(el, base) {
    const rect = el.getBoundingClientRect();
    return { x: rect.left - base.left, y: rect.top - base.top };
  }

  function distanceAtY(y) {
    let lo = 0, hi = samples.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (samples[mid].y < y) lo = mid; else hi = mid;
    }
    const a = samples[lo], b = samples[hi];
    return lerp(a.length, b.length, clamp((y - a.y) / Math.max(.001, b.y - a.y)));
  }

  function measure() {
    resizeFrame = 0;
    const rect = world.getBoundingClientRect();
    const [depot, farm, market] = stations.map(el => pin(el.querySelector('.dock'), rect));
    const mobile = innerWidth <= 760;
    const focus = innerHeight * (mobile ? .72 : .69);
    const scale = mobile ? clamp(innerWidth / 660, .48, .72) : clamp(innerWidth / 1550, .66, .9);
    metrics = { top: rect.top + scrollY, width: rect.width, height: rect.height, depot, farm, market, mobile,
      focus, scale, hold: mobile ? 170 : 200,
      source: pin(document.querySelector('.cargo-source'), rect),
      destination: pin(document.querySelector('.cargo-destination'), rect) };
    const bounds = el => {
      const box = el.getBoundingClientRect();
      return { left: box.left - rect.left, right: box.right - rect.left, top: box.top - rect.top };
    };
    const {d} = journeyRoute({ depot, farm, market, width: rect.width, mobile, scale,
      collection: bounds(collection.querySelector('.section-copy')),
      delivery: bounds(delivery.querySelector('.section-copy')) });
    $('route-svg').setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    ['road-soft', 'road-base', 'road-dashes', 'road-travelled'].forEach(id => $(id).setAttribute('d', d));
    total = route.getTotalLength();
    samples = Array.from({length: 601}, (_, i) => {
      const length = total * i / 600, point = route.getPointAtLength(length);
      return { y: point.y, length };
    });
    metrics.farmDistance = distanceAtY(farm.y);
    scenePositions = stations.map(el => {
      const bounds = el.getBoundingClientRect();
      return { el, center: bounds.top + scrollY + bounds.height / 2 };
    });
    rig.style.width = `${320 * scale}px`;
    rig.style.height = `${200 * scale}px`;
    flight.style.width = `${96 * scale}px`; flight.style.height = `${98 * scale}px`;
    $('road-travelled').style.strokeDasharray = `${total} ${total}`;
    updateTarget();
    // No long catch-up after resizing, changing motion preference or first load.
    state = { ...target }; speed = 0;
    const tangent = route.getPointAtLength(Math.min(total, state.distance + 3));
    const point = route.getPointAtLength(Math.max(0, state.distance - 3));
    if (Math.abs(tangent.x - point.x) > .02) heading = tangent.x >= point.x ? 1 : -1;
    face = heading;
    initialised = true;
    render(performance.now(), .016, 0);
    start();
  }

  function updateTarget() {
    if (!metrics) return;
    const localScroll = scrollY - metrics.top, farmAt = metrics.farm.y - metrics.focus;
    const marketAt = metrics.market.y - metrics.focus + metrics.hold;
    const load = smooth((localScroll - farmAt) / metrics.hold);
    const unload = smooth((localScroll - marketAt) / metrics.hold);
    let distance;
    {
      const departAt = Math.max(0, metrics.depot.y - metrics.focus);
      if (localScroll < farmAt) {
        distance = smooth((localScroll - departAt) / Math.max(1, farmAt - departAt)) * metrics.farmDistance;
      } else if (localScroll < farmAt + metrics.hold) {
        distance = metrics.farmDistance;
      } else {
        distance = lerp(metrics.farmDistance, total, smooth((localScroll - farmAt - metrics.hold) / Math.max(1, marketAt - farmAt - metrics.hold)));
      }
    }
    target = { distance, load, unload };
    scenePositions.forEach(({el, center}) => {
      const offset = reduced ? 0 : clamp((scrollY + innerHeight / 2 - center) * .025, -9, 9);
      el.style.setProperty('--scene-offset', `${offset.toFixed(2)}px`);
    });
    const inStory = scrollY > metrics.top + 150 && scrollY < metrics.top + metrics.height - innerHeight * .3;
    $('trip-label').textContent = unload > .98 ? 'Entrega concluída.' : unload > .01 ? 'Chegando ao mercado.' : load > .98 ? 'A colheita segue viagem.' : load > .01 ? 'Coletando os alimentos.' : 'A caminho de quem produz.';
    document.querySelector('.journey-indicator').classList.toggle('is-visible', inStory && !reduced);
    const stage = unload > .98 ? 3 : load > .98 ? 2 : load > .01 ? 1 : 0;
    if (stage !== previousStage) {
      previousStage = stage;
      $('trip-announcement').textContent = 'Na história ilustrada: ' + [
        'O caminhão segue da transportadora para o produtor.', 'Coleta dos alimentos com a produtora.',
        'Alimentos coletados. Próxima parada: mercado.', 'Alimentos entregues ao mercado.'
      ][stage];
    }
  }

  function render(time, dt, velocity) {
    if (!metrics) return;
    const {source, destination} = metrics;
    const point = route.getPointAtLength(state.distance);
    // On narrow screens the truck becomes a small travelling accent in the
    // reading margins, then grows back into the illustration at each stop.
    const proximity = Math.max(...[metrics.depot, metrics.farm, metrics.market].map(p => 1 - smooth((Math.abs(point.y - p.y) - 12) / 70)));
    const scale = metrics.mobile ? lerp(.06, metrics.scale, proximity) : metrics.scale;
    const scaleRatio = scale / metrics.scale;
    const ahead = route.getPointAtLength(Math.min(total, state.distance + 8));
    const behind = route.getPointAtLength(Math.max(0, state.distance - 8));
    const dx = ahead.x - behind.x;
    // Look along the curve, with a dead zone on vertical stretches. The turn
    // at the farm starts while stationary, before the next leg accelerates.
    if (state.load > .7 && Math.abs(state.distance - metrics.farmDistance) < 2) {
      const departure = route.getPointAtLength(Math.min(total, metrics.farmDistance + 60));
      if (Math.abs(departure.x - point.x) > .5) heading = departure.x > point.x ? 1 : -1;
    } else if (Math.abs(dx) > 1.2) heading = dx > 0 ? 1 : -1;
    face = damp(face, heading, dt, .24);
    speed = damp(speed, clamp(Math.abs(velocity) / 800), dt, .16);
    const bounce = reduced ? 0 : Math.sin(time / 85) * speed * 1.1;
    const pitch = reduced ? 0 : clamp(dx / 9, -1, 1) * speed * 1.2 + Math.sin(time / 145) * speed * .35;
    const vehicleX = metrics.mobile ? clamp(point.x, 160 * scale + 4, metrics.width - 160 * scale - 4) : point.x;
    rig.style.transform = `translate3d(${vehicleX - 160 * scale}px,${point.y - 170 * scale}px,0) scale(${scaleRatio})`;
    // The opening illustration already contains a parked vehicle. Introduce
    // the travelling truck only once its journey starts, avoiding duplicates.
    rig.style.opacity = String(smooth(state.distance / 65));
    facingNode.setAttribute('transform', `scale(${face} 1)`);
    suspension.setAttribute('transform', `translate(0 ${bounce}) rotate(${pitch} 0 -15)`);
    wheels.forEach(wheel => wheel.setAttribute('transform', `rotate(${state.distance / (20 * scale) * 180 / Math.PI * (face < 0 ? -1 : 1)})`));
    shadow.setAttribute('rx', String(142 - speed * 5));
    $('speed-strokes').setAttribute('opacity', String(speed * .65));
    cargo.setAttribute('opacity', String(state.load > .98 && state.unload < .015 ? 1 : 0));
    collection.classList.toggle('is-loaded', state.load > .98);
    delivery.classList.toggle('is-delivered', state.unload > .98);
    $('collection-caption').textContent = state.load > .98 ? 'Colheita a bordo. Próxima parada: cidade.' : state.load > .02 ? 'Coletando os alimentos.' : 'A próxima parada é no produtor.';
    $('delivery-caption').textContent = state.unload > .98 ? 'Alimentos entregues ao mercado.' : state.unload > .02 ? 'Descarregando no mercado.' : 'Da colheita até o mercado.';
    const loadFlight = state.load > .01 && state.load < .99;
    const unloadFlight = state.unload > .01 && state.unload < .99;
    flight.style.opacity = loadFlight || unloadFlight ? '1' : '0';
    const bed = { x: vehicleX - 80 * face * scale, y: point.y - 113 * scale };
    let fx = 0, fy = 0, angle = 0;
    if (loadFlight) {
      const t = state.load;
      fx = lerp(source.x, bed.x, t); fy = lerp(source.y, bed.y, t) - Math.sin(t * Math.PI) * 90 * scale;
      angle = Math.sin(t * Math.PI) * -9;
    } else if (unloadFlight) {
      const t = state.unload;
      fx = lerp(bed.x, destination.x, t); fy = lerp(bed.y, destination.y, t) - Math.sin(t * Math.PI) * 95 * scale;
      angle = Math.sin(t * Math.PI) * 8;
    }
    flight.style.transform = `translate3d(${fx - 48 * scale}px,${fy - 49 * scale}px,0) rotate(${angle}deg) scale(${scaleRatio})`;
    $('road-travelled').style.strokeDashoffset = String(total - state.distance);
    $('mini-progress').style.transform = `scaleX(${state.distance / total})`;
  }

  function tick(time) {
    frame = 0;
    if (document.hidden || reduced || !metrics) return;
    const dt = Math.min(.045, previousTime ? (time - previousTime) / 1000 : .016);
    previousTime = time;
    const oldDistance = state.distance;
    state.distance = damp(state.distance, target.distance, dt);
    state.load = damp(state.load, target.load, dt, .10);
    state.unload = damp(state.unload, target.unload, dt, .10);
    const velocity = (state.distance - oldDistance) / dt;
    render(time, dt, velocity);
    if (Math.abs(state.distance - target.distance) > .02 || Math.abs(state.load - target.load) > .001 || Math.abs(state.unload - target.unload) > .001 || Math.abs(face - heading) > .002 || speed > .005) frame = requestAnimationFrame(tick);
    else previousTime = 0;
  }
  function start() { if (!frame && !reduced && !document.hidden) frame = requestAnimationFrame(tick); }
  function onScroll() { updateTarget(); start(); }
  function onResize() { if (!resizeFrame) resizeFrame = requestAnimationFrame(measure); }

  function applyMotion() {
    document.body.classList.toggle('art-paused', reduced);
    toggle.setAttribute('aria-pressed', String(reduced));
    toggle.textContent = reduced ? 'Ativar movimento' : 'Reduzir movimento';
    document.querySelector('.journey-indicator').classList.remove('is-visible');
    if (frame) cancelAnimationFrame(frame); frame = 0; previousTime = 0;
    if (initialised) measure();
  }

  toggle.addEventListener('click', () => {reduced = !reduced; applyMotion();}, {signal: lifetime.signal});
  preference.addEventListener('change', event => {reduced = event.matches; applyMotion();}, {signal: lifetime.signal});
  addEventListener('scroll', onScroll, {passive: true, signal: lifetime.signal});
  addEventListener('resize', onResize, {passive: true, signal: lifetime.signal});
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {cancelAnimationFrame(frame); frame = 0; previousTime = 0;}
    else {updateTarget(); start();}
  }, {signal: lifetime.signal});
  const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('art-offscreen', !entry.isIntersecting)), {rootMargin: '100px'});
  [...stations, document.querySelector('.inclusion-art'), ...document.querySelectorAll('.audience-row,.people-line')].forEach(el => observer.observe(el));
  applyMotion(); measure();
  // Expose cleanup only, for a future component lifecycle. No runtime library.
  return () => {
    lifetime.abort();
    cancelAnimationFrame(frame); cancelAnimationFrame(resizeFrame); observer.disconnect();
    document.body.classList.remove('art-paused');
  };
}
