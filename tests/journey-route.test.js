import test from 'node:test'
import assert from 'node:assert/strict'
import { journeyRoute, smoothRoad } from '../src/pilot/journey-route.js'

function point(s, t) {
  const a = (1 - t) ** 3, b = 3 * (1 - t) ** 2 * t, c = 3 * (1 - t) * t ** 2, d = t ** 3
  return { x: a * s.start.x + b * s.c1.x + c * s.c2.x + d * s.end.x, y: a * s.start.y + b * s.c1.y + c * s.c2.y + d * s.end.y }
}
const desktop = { depot: { x: 1040, y: 555 }, farm: { x: 458, y: 1460 }, market: { x: 868, y: 2280 }, width: 1351, mobile: false, scale: .88, collection: { left: 856, top: 935 }, delivery: { right: 495, top: 1745 } }

test('road reaches the original stops without hooks, vertical reversal or sideways overshoot', () => {
  const { segments } = journeyRoute(desktop)
  assert.deepEqual(segments[0].start, desktop.depot)
  assert.ok(segments.some(s => s.end === desktop.farm))
  assert.deepEqual(segments.at(-1).end, desktop.market)
  for (const s of segments) {
    let previous = s.start.y
    for (let n = 1; n <= 100; n++) {
      const p = point(s, n / 100)
      assert.ok(p.y > previous)
      assert.ok(p.x >= Math.min(s.start.x, s.end.x) - 1e-8 && p.x <= Math.max(s.start.x, s.end.x) + 1e-8)
      previous = p.y
    }
  }
})

test('all road joins share a tangent direction, including the collection stop', () => {
  const { segments } = journeyRoute(desktop)
  for (let i = 1; i < segments.length; i++) {
    const a = segments[i - 1], b = segments[i]
    const incoming = { x: a.end.x - a.c2.x, y: a.end.y - a.c2.y }
    const outgoing = { x: b.c1.x - b.start.x, y: b.c1.y - b.start.y }
    assert.ok(Math.abs(incoming.x * outgoing.y - incoming.y * outgoing.x) < 1e-7)
    assert.ok(incoming.x * outgoing.x + incoming.y * outgoing.y > 0)
  }
})

test('mobile road keeps its reading stretches on the two margins', () => {
  const { segments } = journeyRoute({ depot: { x: 210, y: 800 }, farm: { x: 215, y: 1710 }, market: { x: 200, y: 2640 }, width: 345, mobile: true })
  for (let n = 0; n <= 20; n++) {
    assert.ok(Math.abs(point(segments[1], n / 20).x - 333) < 1e-8)
    assert.ok(Math.abs(point(segments[4], n / 20).x - 12) < 1e-8)
  }
})

test('desktop bends leave room for the truck beside both text columns', () => {
  const { segments } = journeyRoute(desktop)
  function xAt(y) {
    const s = segments.find(s => y >= s.start.y && y <= s.end.y)
    return point(s, (y - s.start.y) / (s.end.y - s.start.y)).x
  }
  const halfTruck = 160 * desktop.scale
  for (let y = desktop.collection.top; y <= desktop.collection.top + 500; y += 10) assert.ok(xAt(y) + halfTruck < desktop.collection.left - 12)
  for (let y = desktop.delivery.top; y <= desktop.delivery.top + 500; y += 10) assert.ok(xAt(y) - halfTruck > desktop.delivery.right + 12)
})

test('road rejects anchors that could break monotone scroll sampling', () => {
  assert.throws(() => smoothRoad([{ x: 1, y: 10 }, { x: 2, y: 10 }]))
  assert.throws(() => smoothRoad([{ x: 1, y: 20 }, { x: 2, y: 10 }]))
  assert.throws(() => smoothRoad([{ x: NaN, y: 1 }, { x: 2, y: 10 }]))
})
