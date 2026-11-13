import test from 'node:test'
import assert from 'node:assert/strict'
import { demoMapStops, googleEmbedUrl } from '../src/domain/demo-map.js'

test('map request uses only invented coordinates, preserves pickup order and includes agreed return', () => {
  for (const withReturn of [false, true]) {
    const stops = demoMapStops(3, withReturn)
    const url = new URL(googleEmbedUrl('public-demo-key', stops))
    assert.equal(url.origin, 'https://www.google.com')
    assert.equal(url.pathname, '/maps/embed/v1/directions')
    assert.equal(url.searchParams.get('origin'), stops[0].point)
    assert.equal(url.searchParams.get('destination'), stops.at(-1).point)
    assert.deepEqual(url.searchParams.get('waypoints').split('|'), stops.slice(1, -1).map(stop => stop.point))
    assert.equal(stops.at(-1).kind, withReturn ? 'return' : 'destination')
    assert.equal(stops.filter(stop => stop.kind === 'pickup').length, 3)
    assert.equal(url.searchParams.get('mode'), 'driving')
    assert.equal(url.searchParams.get('language'), 'pt-BR')
    for (const stop of stops) {
      assert.match(stop.point, /^-22\.\d+,-48\.\d+$/)
      assert.ok(!url.href.includes(encodeURIComponent(stop.label)))
    }
  }
})

test('no credential or unsupported collection count produces no external request', () => {
  assert.equal(googleEmbedUrl('', demoMapStops()), null)
  assert.equal(googleEmbedUrl('   ', demoMapStops()), null)
  for (const count of [-1, 7, 1.5, NaN]) {
    assert.deepEqual(demoMapStops(count), [])
    assert.equal(googleEmbedUrl('demo', demoMapStops(count)), null)
  }
  assert.equal(demoMapStops(0).length, 2)
  const copy = demoMapStops()
  copy[0].point = 'altered'
  assert.notEqual(demoMapStops()[0].point, 'altered')
})
