import { useEffect, useRef, useState } from 'react'
import { Modal, ErrorNotice } from '../../components/ui'
import { dateLabel } from '../../domain/offers'
import { answerOfferChat, nextOfferChatStep, offerChatSteps, validateChatDraft } from '../../domain/offer-chat'

function answerLabel(step, draft, catalog) {
  const value = draft[step.name]
  if (step.kind === 'product') return catalog.products.find(p => p.id === value)?.name || value
  if (step.kind === 'location') return catalog.locations.find(l => l.id === value)?.display_address || value
  if (step.kind === 'date') return value ? `${dateLabel(value)} de ${value.slice(0, 4)}` : 'Não informado — não deduzido da disponibilidade'
  return value
}

export default function OfferChat({ products, locations, save, close, onSaved }) {
  const catalog = { products, locations }
  const [draft, setDraft] = useState({})
  const [stepIndex, setStepIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [remoteError, setRemoteError] = useState('')
  const [pending, setPending] = useState(false)
  const [saved, setSaved] = useState(false)
  const inputRef = useRef(null)
  const headingRef = useRef(null)
  const chatRef = useRef(null)
  const saving = useRef(false)
  const step = offerChatSteps[stepIndex]
  const review = !step
  const available = products.some(p => p.unit === 'kg') && locations.length > 0
  const validation = review ? validateChatDraft(draft, catalog) : null
  const reviewErrors = validation ? Object.entries(validation.errors) : []

  useEffect(() => {
    if (!available) chatRef.current?.querySelector('[role="alert"]')?.focus()
    else if (saved || stepIndex === -1) headingRef.current?.focus()
    else inputRef.current?.focus()
  }, [stepIndex, saved, available])

  function respond(value) {
    const result = answerOfferChat(draft, step.name, value, catalog)
    setError(result.error)
    if (result.error) { inputRef.current?.focus(); return }
    setDraft(result.draft)
    const next = nextOfferChatStep(result.draft)
    setStepIndex(next)
    setAnswer(next < 0 ? '' : result.draft[offerChatSteps[next].name] || '')
    setRemoteError('')
  }

  function edit(index) {
    setStepIndex(index)
    setAnswer(draft[offerChatSteps[index].name] || '')
    setError('')
    setRemoteError('')
  }

  async function confirm() {
    if (!review || saved || saving.current) return
    const result = validateChatDraft(draft, catalog)
    if (Object.keys(result.errors).length) { setRemoteError('A prévia precisa ser atualizada. Corrija os campos indicados antes de confirmar.'); return }
    saving.current = true
    setPending(true); setRemoteError('')
    try {
      // The same hook/service as OfferForm; only normalized offer fields are sent.
      await save(result.data, null)
      setSaved(true)
      onSaved()
    } catch (failure) {
      setRemoteError(failure.message)
    } finally {
      saving.current = false
      setPending(false)
    }
  }

  return <Modal title="Vamos conversar sobre sua oferta?" closeDisabled={pending} onClose={() => { if (!saving.current) close() }}>
    <div ref={chatRef} className="offer-chat" aria-busy={pending}>
      <p className="preview-notice">M6 · Prévia em avaliação. Conversa guiada de demonstração, uma pergunta por vez. Use somente dados fictícios.</p>
      <p className="form-intro">Suas respostas ficam neste rascunho até você confirmar a publicação. Ao fechar, o rascunho é descartado. O formulário continua disponível em Nova oferta.</p>
      {!available ? <ErrorNotice>O chat precisa de um alimento em kg e um local de coleta do seu perfil. Feche e atualize a lista de ofertas para tentar novamente.</ErrorNotice> : <>
        <h3 ref={headingRef} tabIndex={-1}>{saved ? 'Oferta publicada.' : review ? 'Prévia da oferta — confira antes de publicar' : `Pergunta ${stepIndex + 1} de ${offerChatSteps.length}`}</h3>
        {saved && <p className="success-notice" role="status">Confira a oferta na sua lista. Publicação não confirma venda, reserva ou transporte.</p>}
        {Object.keys(draft).length > 0 && <details open={review} className="offer-chat-answers">
          <summary>{review ? 'Respostas que compõem a oferta' : 'Consultar ou corrigir suas respostas'}</summary>
          <dl>{offerChatSteps.map((item, index) => Object.hasOwn(draft, item.name) && <div key={item.name}>
            <dt>{item.label}</dt><dd><span>{answerLabel(item, draft, catalog)}</span>
              {!saved && <button type="button" className="text-link" disabled={pending} onClick={() => edit(index)} aria-label={`Corrigir ${item.label.toLocaleLowerCase('pt-BR')}`}>Corrigir</button>}
            </dd>
          </div>)}</dl>
        </details>}
        {!review && <form noValidate onSubmit={event => { event.preventDefault(); respond(answer) }}>
          <p className="offer-chat-question" role="status" key={step.name}>{step.question}</p>
          <label className="field" htmlFor="chat-answer"><span>{step.label}</span>
            {['product', 'location'].includes(step.kind) ? <select ref={inputRef} id="chat-answer" value={answer} onChange={event => setAnswer(event.target.value)} aria-invalid={Boolean(error)} aria-describedby="chat-help chat-error">
              <option value="">Selecione uma opção</option>
              {(step.kind === 'product' ? products.filter(p => p.unit === 'kg') : locations).map(option => <option key={option.id} value={option.id}>{option.name || option.display_address}</option>)}
            </select> : <input ref={inputRef} id="chat-answer" value={answer} onChange={event => setAnswer(event.target.value)} inputMode={step.kind === 'decimal' ? 'decimal' : 'text'} autoComplete="off" aria-invalid={Boolean(error)} aria-describedby="chat-help chat-error" />}
          </label>
          <p id="chat-help" className="field-help">{step.help || 'Escolha uma das opções cadastradas. Não é preciso informar endereço ou contato real.'}</p>
          <p id="chat-error" className="field-error" role="alert">{error}</p>
          <div className="form-actions">
            {step.optional && <button type="button" className="button button-outline" onClick={() => respond('')}>Não sei informar</button>}
            <button type="submit" className="button">{nextOfferChatStep({ ...draft, [step.name]: answer }) === -1 ? 'Rever oferta' : 'Responder e continuar'}</button>
          </div>
        </form>}
        {review && !saved && <>
          <p>Quantidade em kg, preço e mínimo por kg. Frete pago pelo comprador; taxa da plataforma zero. O vencimento ausente permanece desconhecido.</p>
          {reviewErrors.length > 0 && <ErrorNotice title="Corrija a prévia antes de publicar"><ul>{reviewErrors.map(([name, message]) => <li key={name}><button type="button" className="text-link" onClick={() => edit(offerChatSteps.findIndex(item => item.name === name))}>{message} Corrigir</button></li>)}</ul></ErrorNotice>}
          {remoteError && <ErrorNotice autoFocus title="Não foi possível confirmar a publicação">{remoteError} O rascunho foi preservado. Confira a lista antes de tentar novamente se a conexão caiu durante o envio.</ErrorNotice>}
          {pending && <p role="status">Publicando sua oferta… Aguarde a confirmação.</p>}
          <div className="form-actions"><button type="button" className="button" disabled={pending || reviewErrors.length > 0} onClick={confirm}>{pending ? 'Publicando…' : 'Confirmar e publicar oferta'}</button></div>
        </>}
      </>}
      <div className="form-actions"><button type="button" className="button button-outline" disabled={pending} onClick={close}>{saved ? 'Concluir' : 'Descartar rascunho e fechar'}</button></div>
    </div>
  </Modal>
}
