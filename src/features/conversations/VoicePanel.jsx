import { useEffect, useRef, useState } from 'react'
import { voiceEnabled, voiceService } from '../../services/voice'

export default function VoicePanel({ conversationId, disabled, onUseText, service = voiceService, enabled = voiceEnabled }) {
  const [state, setState] = useState({ phase: 'idle' })
  const [text, setText] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [reply, setReply] = useState('')
  const [paidText, setPaidText] = useState('')
  const controls = useRef(null), live = useRef(false), starting = useRef(false), feedback = useRef(null), generation = useRef(0), reviewing = useRef(false)
  const ongoing = ['connecting', 'active'].includes(state.phase)
  useEffect(() => {
    live.current = true
    function leave() { void controls.current?.stop() }
    function hidden() { if (document.visibilityState === 'hidden') leave() }
    window.addEventListener('pagehide', leave)
    document.addEventListener('visibilitychange', hidden)
    return () => { live.current = false; leave(); window.removeEventListener('pagehide', leave); document.removeEventListener('visibilitychange', hidden) }
  }, [])
  useEffect(() => { if (state.phase === 'closed' && !reviewing.current) feedback.current?.focus() }, [state.phase])
  useEffect(() => { if (disabled) void controls.current?.stop() }, [disabled])
  async function start(mode) {
    if (!enabled || disabled || starting.current || ongoing) return
    starting.current = true; reviewing.current = false; setText(''); setSuggestion(''); setReply('')
    const request = ++generation.current
    const current = () => live.current && generation.current === request
    try {
      await service.start({ conversationId, mode,
        onState: next => {
          if (current() && next.controls) controls.current = next.controls
          if (current()) setState({ ...next, mode })
          else void next.controls?.stop()
        },
        onTranscript: value => { if (current()) setText(value) },
        onSuggestion: value => { if (current()) setSuggestion(value) },
        onReply: value => { if (current()) setReply(value) },
      })
    } catch { if (live.current) setState({ phase: 'closed', reason: 'IA indisponível. Continue pelo texto simulado.' }) }
    finally { starting.current = false }
  }
  function reviewText(value) {
    if (disabled || !value.trim()) return
    reviewing.current = true
    void controls.current?.stop()
    onUseText(value)
  }
  return <section className="voice-panel" aria-label="IA e voz opcionais">
    <h3>Quer experimentar por voz?</h3>
    <p>Opcional · API paga · validação manual pendente. O texto simulado abaixo continua disponível.</p>
    {!enabled ? <p>Voz desabilitada neste ambiente. A configuração é feita no servidor.</p> : <>
      <p>Ao iniciar, texto ou áudio desta sessão será enviado à OpenAI. Use dados fictícios. Voz pede microfone; a resposta aparece em texto. Nenhuma oferta é salva pela IA.</p>
      {!ongoing ? <div className="voice-actions"><button className="button button-secondary" disabled={disabled} onClick={() => void start('voice')}>Iniciar voz paga</button><button className="text-link" disabled={disabled} onClick={() => void start('text')}>Iniciar IA paga por texto</button></div> : <button className="button button-secondary" onClick={() => void controls.current?.stop()}>Encerrar sessão paga</button>}
      {state.phase === 'active' && <><p className="voice-active" role="status">Sessão paga ativa · {state.mode === 'voice' ? 'microfone ativo' : 'microfone desligado'} · encerra até {new Date(state.expires).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })} · máximo de {state.maxResponses} respostas. Consumo final: consulte o provedor.</p><label htmlFor="voice-paid-text">Texto para a IA paga</label><textarea id="voice-paid-text" rows={2} maxLength={2000} value={paidText} onChange={event => setPaidText(event.target.value)} /><button className="text-link" disabled={!paidText.trim()} onClick={() => { try { controls.current.sendText(paidText); setPaidText('') } catch { setReply('Aguarde a conexão ou encerre e continue pelo texto simulado.') } }}>Enviar à IA paga</button></>}
      {state.phase === 'connecting' && <p role="status">Conectando somente esta sessão…</p>}
      {reply && <p className="voice-reply">IA: {reply}</p>}
      {text && <><label htmlFor="voice-transcript">Transcrição corrigível (última fala)</label><textarea id="voice-transcript" rows={3} maxLength={2000} value={text} onChange={event => setText(event.target.value)} /><button className="text-link" disabled={disabled || !text.trim()} onClick={() => reviewText(text)}>Usar transcrição no texto simulado</button></>}
      {suggestion && <><label htmlFor="voice-suggestion">Sugestão da IA · confira e corrija</label><textarea id="voice-suggestion" rows={3} maxLength={2000} value={suggestion} onChange={event => setSuggestion(event.target.value)} /><button className="text-link" disabled={disabled || !suggestion.trim()} onClick={() => reviewText(suggestion)}>Revisar sugestão no bot</button></>}
      {(text || suggestion) && <p>Usar o texto encerra a sessão. Depois, envie ao bot, confira a prévia e confirme a revisão pelo botão.</p>}
    </>}
    <p ref={feedback} tabIndex={-1} role="status">{state.reason}</p>
  </section>
}
