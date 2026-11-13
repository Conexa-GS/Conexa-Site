// Invented demonstration points near Botucatu, SP. Never geocode participant data.
export const demoCity = 'Botucatu (SP)'
const departure = { label: 'Base Caminho', point: '-22.8791,-48.4552', kind: 'departure' }
const destination = { label: 'Restaurante Raiz', point: '-22.8858,-48.4435', kind: 'destination' }
const pickups = [
  { label: 'Sítio Boa Semente', point: '-22.8615,-48.4690', kind: 'pickup' },
  { label: 'Horta Sol Nascente', point: '-22.8519,-48.4501', kind: 'pickup' },
  { label: 'Sítio Ipê', point: '-22.8592,-48.4334', kind: 'pickup' },
  { label: 'Horta das Águas', point: '-22.8712,-48.4248', kind: 'pickup' },
  { label: 'Sítio Terra Clara', point: '-22.8992,-48.4305', kind: 'pickup' },
  { label: 'Horta Primavera', point: '-22.9027,-48.4514', kind: 'pickup' },
]

export function demoMapStops(pickupCount = 2, withReturn = false) {
  // Refuse unsupported circuits instead of silently omitting collections.
  if (!Number.isInteger(pickupCount) || pickupCount < 0 || pickupCount > pickups.length) return []
  return [departure, ...pickups.slice(0, pickupCount), destination,
    ...(withReturn ? [{ ...departure, label: 'Retorno à Base Caminho', kind: 'return' }] : [])]
    .map(stop => ({ ...stop }))
}

export function googleEmbedUrl(apiKey, stops) {
  if (!apiKey?.trim() || stops.length < 2 || stops.length > 22) return null
  const params = new URLSearchParams({ key: apiKey.trim(), origin: stops[0].point,
    destination: stops.at(-1).point, mode: 'driving', language: 'pt-BR', region: 'BR', units: 'metric' })
  if (stops.length > 2) params.set('waypoints', stops.slice(1, -1).map(stop => stop.point).join('|'))
  return `https://www.google.com/maps/embed/v1/directions?${params}`
}
