import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateFreight, freightJourney } from '../src/domain/freight-estimate.js'
import { createRoutesHandler, googleJourney, validateJourney } from '../server/routes-handler.mjs'

const journey = { addresses: ['Base, Botucatu, SP', 'Coleta, Botucatu, SP', 'Destino, Botucatu, SP', 'Base, Botucatu, SP'], deliveryIndex: 2 }
const providerResult = () => Response.json({ routes: [{ distanceMeters: 25001, duration: '3600s', legs: [{ duration: '600s' }, { duration: '1200s' }, { duration: '1800s' }] }] })
const tariffs = { base: '10,00', perKm: '2,50', minimum: '50,00', extras: '7,00', stopMinutes: '30' }

test('freight rounds distance once in cents, applies minimum before extras and excludes return from delivery', () => {
  const route = { distanceMeters: 25001, totalSeconds: 3600, deliverySeconds: 1800 }
  const result = calculateFreight(route, tariffs, '2026-11-16T10:00:00-03:00')
  assert.equal(result.totalCents, 7950)
  assert.equal(result.arrival, '2026-11-16T14:00:00.000Z')
  assert.equal(calculateFreight(route, { ...tariffs, minimum: '100' }, '2026-11-16T13:00Z').totalCents, 10700)
  assert.equal(calculateFreight({ ...route, distanceMeters: 1 }, { ...tariffs, base: '0', minimum: '0', perKm: '5' }, '2026-11-16T13:00Z').distanceCents, 1)
  for (const changes of [{ perKm: '0' }, { base: '' }, { extras: '-1' }, { stopMinutes: '' }, { stopMinutes: '1441' }, { perKm: '2.001' }]) {
    assert.throws(() => calculateFreight(route, { ...tariffs, ...changes }, '2026-11-16T13:00Z'))
  }
  assert.throws(() => calculateFreight(route, tariffs, ''))
})

test('journey preserves every pickup in order and adds only agreed return', () => {
  const load = { items: [{ pickup_address: ' A ' }, { pickup_address: ' B ' }], destination_address: 'C' }
  assert.deepEqual(freightJourney(load, ' D ', ' R '), { addresses: ['D', 'A', 'B', 'C', 'R'], deliveryIndex: 3 })
  assert.deepEqual(freightJourney(load, 'D', '').addresses, ['D', 'A', 'B', 'C'])
  for (const input of [{}, { ...journey, addresses: ['A', '', 'B'] }, { ...journey, deliveryIndex: 1 }, { ...journey, addresses: Array(28).fill('A') }]) assert.throws(() => validateJourney(input))
})

test('Google request uses server key, ordered stops and field mask; calculates delivery before return', async () => {
  let request
  const result = await googleJourney({ ...journey, addresses: ['-22.8791,-48.4552', ...journey.addresses.slice(1)] }, 'private-test-key', async (url, options) => { request = { url, ...options }; return providerResult() })
  assert.equal(request.url, 'https://routes.googleapis.com/directions/v2:computeRoutes')
  assert.equal(request.headers['X-Goog-Api-Key'], 'private-test-key')
  const body = JSON.parse(request.body)
  assert.deepEqual(body.origin.location.latLng, { latitude: -22.8791, longitude: -48.4552 })
  assert.deepEqual(body.intermediates.map(stop => stop.address), journey.addresses.slice(1, -1))
  assert.equal(body.optimizeWaypointOrder, undefined)
  assert.equal(result.deliverySeconds, 1800)
  assert.equal(result.totalSeconds, 3600)
  assert.equal(JSON.stringify(result).includes('private-test-key'), false)
  for (const data of [{ routes: [] }, { routes: [{ distanceMeters: 1, duration: '2s', legs: [{ duration: '2s' }] }] }]) {
    await assert.rejects(googleJourney(journey, 'key', async () => Response.json(data)), /trajeto completo/)
  }
})

test('routes endpoint requires origin, authentication and carrier role; limits queries and redacts upstream errors', async () => {
  let calls = 0
  const config = { apiKey: 'secret', origin: 'http://localhost:5173', authenticate: async token => ({ id: 'carrier', role: token === 'carrier' ? 'carrier' : 'buyer' }), fetcher: async () => { calls++; return providerResult() }, userLimit: 1 }
  const request = (token = 'carrier', origin = config.origin, payload = journey) => new Request('http://localhost/api/routes/estimate', { method: 'POST', headers: { Origin: origin, ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  const handle = createRoutesHandler(config)
  assert.equal((await handle(request('carrier', 'https://other.invalid'))).status, 403)
  assert.equal((await handle(request(''))).status, 401)
  assert.equal((await handle(request('buyer'))).status, 403)
  assert.equal((await handle(request('carrier', config.origin, {}))).status, 400)
  assert.equal(calls, 0)
  assert.equal((await handle(request())).status, 200)
  assert.equal((await handle(request())).status, 429)
  assert.equal(calls, 1)
  assert.equal((await createRoutesHandler({ ...config, apiKey: '' })(request())).status, 503)
  const failure = await createRoutesHandler({ ...config, fetcher: async () => new Response('secret provider body', { status: 403 }) })(request())
  assert.equal(failure.status, 502)
  assert.doesNotMatch(await failure.text(), /secret/)
})

test('a concurrent request cannot consume another call or clear the active lock', async () => {
  let release, calls = 0
  const handle = createRoutesHandler({ apiKey: 'key', origin: 'http://localhost', authenticate: async () => ({ id: 'carrier', role: 'carrier' }), fetcher: async () => { calls++; await new Promise(resolve => { release = resolve }); return providerResult() } })
  const request = () => new Request('http://localhost/api/routes/estimate', { method: 'POST', headers: { Origin: 'http://localhost', Authorization: 'Bearer token', 'Content-Type': 'application/json' }, body: JSON.stringify(journey) })
  const first = handle(request())
  // Yield through the body reader without depending on a real provider.
  while (!release) await new Promise(resolve => setTimeout(resolve, 0))
  assert.equal((await handle(request())).status, 429)
  assert.equal((await handle(request())).status, 429)
  release()
  assert.equal((await first).status, 200)
  assert.equal(calls, 1)
})
