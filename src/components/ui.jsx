import { ArrowUpRight, ArrowLeft, Leaf, X, WarningCircle } from '@phosphor-icons/react'
import { useEffect, useId, useRef } from 'react'
import { navigate } from '../hooks/useRouter'

export function Link({ href, children, ...props }) {
  return <a href={href} {...props} onClick={event => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && href.startsWith('/')) { event.preventDefault(); navigate(href) } }}>{children}</a>
}
export function Logo() { return <Link href="/" className="brand-link" aria-label="Conexa, início"><img src="/assets/marca/conexa-logo.svg" width="168" height="39" alt="Conexa" /></Link> }
export function ActionLink({ href, children, secondary = false }) { return <Link href={href} className={`button ${secondary ? 'button-outline' : ''}`}>{children}<ArrowUpRight size={19} aria-hidden="true" /></Link> }
export function PageHeading({ eyebrow, title, accent, children }) { return <div className="page-heading relative">{eyebrow && <p className="eyebrow"><span className="seed" />{eyebrow}</p>}<h1>{title}{accent && <><br /><span>{accent}</span></>}</h1>{children && <p className="page-intro">{children}</p>}</div> }
export function StatusBadge({ children, tone = '' }) { return <span className={`status-badge ${tone}`}><i aria-hidden="true" />{children}</span> }
export function EmptyState({ title, children, action }) { return <div className="empty-state"><Leaf size={38} weight="duotone" aria-hidden="true" /><h2>{title}</h2><p>{children}</p>{action}</div> }
export function ErrorNotice({ children, retry, autoFocus = false, title = 'Confira o que precisa de atenção' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!autoFocus) return
    const notice = ref.current
    notice.focus({ preventScroll: true })
    notice.scrollIntoView({ block: 'center', behavior: 'instant' })
  }, [autoFocus])
  return <div ref={ref} className="error-notice break-words" role="alert" tabIndex={-1}>
    <div className="error-notice-heading"><WarningCircle size={23} weight="bold" aria-hidden="true" /><strong>{title}</strong></div>
    <div className="error-notice-message">{children}</div>
    {retry && <button type="button" className="text-link" onClick={retry}>Tentar novamente <ArrowUpRight size={18} /></button>}
  </div>
}
export function Modal({ title, children, onClose, closeDisabled = false }) {
  const ref = useRef(null)
  const titleId = useId()
  useEffect(() => {
    const dialog = ref.current
    const opener = document.activeElement
    dialog.showModal()
    return () => { dialog.close(); (opener?.isConnected ? opener : document.getElementById('conteudo'))?.focus({ preventScroll: true }) }
  }, [])
  return <dialog ref={ref} className="app-dialog" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); if (!closeDisabled) onClose() }}><button type="button" className="dialog-close" disabled={closeDisabled} onClick={onClose} aria-label="Fechar"><X size={22} /></button><h2 id={titleId}>{title}</h2>{children}</dialog>
}
export function BackLink({ href, children = 'Voltar' }) { return <Link href={href} className="back-link"><ArrowLeft size={17} aria-hidden="true" />{children}</Link> }
