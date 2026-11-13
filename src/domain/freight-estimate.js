import { centsFromInput } from './offers.js'

// The delivery stop precedes the optional return. Keep the quoted pickup order.
export function freightJourney(load, departure, returnAddress) {
  return {
    addresses: [departure.trim(), ...load.items.map(item => item.pickup_address?.trim() || ''), load.destination_address?.trim() || '', ...(returnAddress.trim() ? [returnAddress.trim()] : [])],
    deliveryIndex: load.items.length + 1,
  }
}

export function calculateFreight(route, values, departureTime) {
  const money = ['base', 'perKm', 'minimum', 'extras'].map(key => centsFromInput(values[key]))
  const stops = String(values.stopMinutes).trim()
  if (money.some(value => !Number.isSafeInteger(value) || value < 0 || value > 100000000)
    || money[1] <= 0 || !/^\d+$/.test(stops) || Number(stops) > 1440) {
    throw new Error('Preencha as tarifas (até R$ 1.000.000), o valor por km positivo e as paradas em minutos (0 a 1440). Use 0 explicitamente quando não houver custo.')
  }
  if (!Number.isSafeInteger(route.distanceMeters) || route.distanceMeters < 0
    || !Number.isFinite(route.deliverySeconds) || route.deliverySeconds < 0
    || !Number.isFinite(route.totalSeconds) || route.totalSeconds < route.deliverySeconds) throw new Error('Dados de rota inválidos.')
  const departure = Date.parse(departureTime)
  if (!Number.isFinite(departure)) throw new Error('Informe a data e o horário de saída.')
  const [base, perKm, minimum, extras] = money
  const distanceCents = Number((BigInt(route.distanceMeters) * BigInt(perKm) + 500n) / 1000n)
  const totalCents = Math.max(minimum, base + distanceCents) + extras
  if (!Number.isSafeInteger(totalCents) || totalCents <= 0 || totalCents > 100000000) throw new Error('O frete estimado deve ser positivo e de até R$ 1.000.000.')
  const arrival = departure + (route.deliverySeconds + Number(stops) * 60) * 1000
  if (!Number.isFinite(arrival) || Math.abs(arrival) > 8640000000000000) throw new Error('Previsão de entrega inválida.')
  return { totalCents, distanceCents, arrival: new Date(arrival).toISOString(), stopMinutes: Number(stops) }
}
