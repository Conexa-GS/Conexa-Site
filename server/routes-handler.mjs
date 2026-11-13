const fail = (message, status = 400) => Object.assign(new Error(message), { publicMessage: message, status })

export function validateJourney(input) {
  if (!Array.isArray(input?.addresses) || input.addresses.length < 3 || input.addresses.length > 27
    || input.addresses.some(address => typeof address !== 'string' || !address.trim() || address.length > 200)
    || !Number.isInteger(input.deliveryIndex) || input.deliveryIndex < 2
    || ![input.addresses.length - 1, input.addresses.length - 2].includes(input.deliveryIndex)) {
    throw fail('Informe saída, todas as coletas, destino e somente o retorno acordado (até 25 paradas intermediárias).')
  }
  return { addresses: input.addresses.map(address => address.trim()), deliveryIndex: input.deliveryIndex }
}

export async function googleJourney(journey, apiKey, fetcher = fetch) {
  const waypoint = address => {
    const coordinates = address.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/)
    if (!coordinates) return { address }
    const latitude = Number(coordinates[1]), longitude = Number(coordinates[2])
    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) throw fail('Coordenadas fora dos limites geográficos.')
    return { location: { latLng: { latitude, longitude } } }
  }
  const response = await fetcher('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.legs.duration' },
    body: JSON.stringify({ origin: waypoint(journey.addresses[0]), destination: waypoint(journey.addresses.at(-1)),
      intermediates: journey.addresses.slice(1, -1).map(waypoint), travelMode: 'DRIVE', routingPreference: 'TRAFFIC_UNAWARE',
      computeAlternativeRoutes: false, languageCode: 'pt-BR', regionCode: 'BR', units: 'METRIC' }),
    signal: AbortSignal.timeout(12000),
  })
  if (!response.ok) throw fail('Google Maps indisponível. Confira a chave, a Routes API e a cota no servidor; a cotação manual continua disponível.', 502)
  const route = (await response.json()).routes?.[0]
  const seconds = value => typeof value === 'string' && /^\d+(\.\d{1,9})?s$/.test(value) ? Number(value.slice(0, -1)) : NaN
  const legs = route?.legs?.map(leg => seconds(leg.duration))
  const totalSeconds = seconds(route?.duration)
  if (!Number.isSafeInteger(route?.distanceMeters) || route.distanceMeters < 0 || !Number.isFinite(totalSeconds)
    || !legs || legs.length !== journey.addresses.length - 1 || legs.some(value => !Number.isFinite(value))) {
    throw fail('O Google Maps não retornou um trajeto completo. Revise os endereços com rua, cidade e UF; não use apenas nomes fictícios.', 422)
  }
  const deliverySeconds = legs.slice(0, journey.deliveryIndex).reduce((sum, value) => sum + value, 0)
  if (deliverySeconds > totalSeconds + 1) throw fail('O Google Maps retornou tempos inconsistentes. Use a cotação manual.', 502)
  return { distanceMeters: route.distanceMeters, totalSeconds: Math.max(totalSeconds, deliverySeconds), deliverySeconds, source: 'Google Maps', calculatedAt: new Date().toISOString() }
}

// Single-process demo quotas. No retries, address logging or persistent Google content.
export function createRoutesHandler({ apiKey, origin, authenticate, fetcher = fetch, now = Date.now, userLimit = 20, globalLimit = 100 }) {
  let windowStart = now(), total = 0
  const counts = new Map(), active = new Set()
  return async request => {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', Vary: 'Origin' }
    const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers })
    if (request.headers.get('origin') !== origin) return reply({ error: 'Origem não permitida.' }, 403)
    headers['Access-Control-Allow-Origin'] = origin
    if (new URL(request.url).pathname !== '/api/routes/estimate') return reply({ error: 'Rota indisponível.' }, 404)
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type' } })
    if (request.method !== 'POST') return reply({ error: 'Método não permitido.' }, 405)
    if (!apiKey) return reply({ error: 'Cálculo Google Maps aguarda a chave Routes API no servidor. Continue com a cotação manual.' }, 503)
    const token = request.headers.get('authorization')?.match(/^Bearer (\S+)$/)?.[1]
    if (!token) return reply({ error: 'Entre em uma conta de transportadora conectada.' }, 401)
    let participant, acquired = false
    try {
      participant = await authenticate(token)
      if (!participant?.id || participant.role !== 'carrier') throw fail('Somente transportadoras autenticadas podem calcular.', 403)
      if (!request.headers.get('content-type')?.startsWith('application/json')) throw fail('Formato inválido.', 415)
      const body = await request.text()
      if (body.length > 10000) throw fail('Pedido excede o limite.', 413)
      let input
      try { input = JSON.parse(body) } catch { throw fail('Pedido JSON inválido.') }
      const journey = validateJourney(input)
      if (now() - windowStart >= 3600000) { counts.clear(); total = 0; windowStart = now() }
      if (active.has(participant.id) || (counts.get(participant.id) || 0) >= userLimit || total >= globalLimit) throw fail('Limite de consultas atingido ou cálculo em andamento. Continue com a cotação manual.', 429)
      counts.set(participant.id, (counts.get(participant.id) || 0) + 1); total++
      active.add(participant.id); acquired = true
      return reply(await googleJourney(journey, apiKey, fetcher))
    } catch (error) {
      return reply({ error: error.publicMessage || 'Não foi possível consultar o trajeto. Confira a sessão e os endereços; a cotação manual continua disponível.' }, error.status || 502)
    } finally { if (acquired) active.delete(participant.id) }
  }
}
