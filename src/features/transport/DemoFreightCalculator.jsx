import { useState } from 'react'
import { demoMapStops } from '../../domain/demo-map'
import FreightCalculator from './FreightCalculator'

export default function DemoFreightCalculator() {
  const [departureTime, setDepartureTime] = useState('')
  const stops = demoMapStops()
  const load = { id: 'botucatu-example', version: 1, items: stops.filter(stop => stop.kind === 'pickup').map(stop => ({ pickup_address: stop.point })), destination_address: stops.at(-1).point }
  return <section aria-label="Cálculo ilustrativo de frete"><p className="inline-note">Cenário de Botucatu. O cálculo exige uma transportadora autenticada e o servidor Routes configurado. Valores ilustrativos não substituem o resumo de exemplo nem criam transporte.</p>
    <label className="field"><span>Saída do exemplo (horário do dispositivo)</span><input type="datetime-local" value={departureTime} onInput={event => setDepartureTime(event.currentTarget.value)} onChange={event => setDepartureTime(event.currentTarget.value)} /></label>
    <FreightCalculator load={load} departureAddress={stops[0].point} departureTime={departureTime} returnAddress="" illustrative />
  </section>
}
