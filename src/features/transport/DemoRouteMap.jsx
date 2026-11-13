import { useState } from 'react'
import { MapPin, Truck } from '@phosphor-icons/react'
import { demoCity, demoMapStops, googleEmbedUrl } from '../../domain/demo-map'
import './demo-route-map.css'

const stopLabels = { departure: 'Saída', pickup: 'Coleta', destination: 'Entrega', return: 'Retorno' }

export default function DemoRouteMap({ pickupCount = 2, withReturn = false, apiKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY || '' }) {
  const stops = demoMapStops(pickupCount, withReturn)
  // Changing the circuit resets the selected segment and any pending frame.
  return <MapCircuit key={`${pickupCount}-${withReturn}-${apiKey}`} stops={stops} apiKey={apiKey} />
}

function MapCircuit({ stops, apiKey }) {
  const [segment, setSegment] = useState(-1)
  const [visible, setVisible] = useState(false)
  const [frameState, setFrameState] = useState('idle')
  const [attempt, setAttempt] = useState(0)
  const selectedStops = segment < 0 ? stops : stops.slice(segment, segment + 2)
  const url = googleEmbedUrl(apiKey, selectedStops)
  function selectSegment(index) {
    if (index === segment) return
    setSegment(index)
    setFrameState(visible ? 'loading' : 'idle')
  }
  function openMap() {
    setVisible(true); setFrameState('loading'); setAttempt(value => value + 1)
  }
  return <section className="demo-route-map" aria-label="Mapa do percurso simulado">
    <header className="demo-map-heading"><div><p className="eyebrow">PERCURSO SIMULADO</p><h3>O caminho em {demoCity}.</h3></div><Truck size={30} aria-hidden="true" /></header>
    <p className="demo-map-description">Saída, propriedades e comércio fictícios sobre o mapa da cidade. Os pontos representam um cenário de demonstração independente dos endereços cadastrados.</p>
    {!stops.length ? <p role="status">O mapa demonstrativo comporta até seis coletas. Consulte todas as paradas no roteiro manual desta proposta.</p> : <>
      <ol className="demo-map-stops">{stops.map((stop, index) => <li key={`${stop.kind}-${index}`}><span className="demo-stop-dot" aria-hidden="true" /><div><small>{stopLabels[stop.kind]}</small><strong>{stop.label}</strong></div></li>)}</ol>
      <div className="demo-map-controls" role="group" aria-label="Selecionar percurso no mapa">
        <button type="button" aria-pressed={segment === -1} onClick={() => selectSegment(-1)}>Percurso completo</button>
        {stops.slice(1).map((stop, index) => <button type="button" key={index} aria-pressed={segment === index} onClick={() => selectSegment(index)}>{stopLabels[stop.kind]}{stop.kind === 'pickup' ? ` ${index + 1}` : ''}</button>)}
      </div>
      <p className="demo-map-selection" role="status">{segment < 0 ? 'Visualização de todo o percurso.' : `${stops[segment].label} → ${stops[segment + 1].label}`}</p>
      {url && visible ? <div className="demo-map-frame">
        {frameState === 'loading' && <p role="status">Abrindo Google Maps…</p>}
        <iframe key={`${url}-${attempt}`} title={`Google Maps: percurso fictício em ${demoCity}`} src={url} width="800" height="440" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen onLoad={() => setFrameState('opened')} />
        <p className="inline-caption">Se o Google exibir erro de acesso ou ficar em branco, o roteiro acima continua disponível.</p>
        <div className="demo-map-actions"><button type="button" className="text-link" onClick={openMap}>Tentar carregar novamente</button><button type="button" className="text-link" onClick={() => { setVisible(false); setFrameState('idle') }}>Fechar mapa</button></div>
      </div> : <div className="demo-map-placeholder"><MapPin size={30} aria-hidden="true" /><p>{url ? 'Explore o caminho entre as paradas no Google Maps.' : 'A visualização no Google Maps aguarda configuração. Explore as paradas do cenário acima.'}</p>{url && <button type="button" className="button" onClick={openMap}>Abrir mapa simulado</button>}</div>}
      <p className="inline-caption demo-map-disclaimer">Simulação, sem rastreamento ao vivo. Distância e duração exibidas pelo Google são estimativas para automóveis, sem validação para caminhões ou tempo de coleta. O mapa não altera frete, pedágio, aceites ou status da viagem.</p>
    </>}
  </section>
}
