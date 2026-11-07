import { ArrowUpRight, ArrowLeft, Leaf, X } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { navigate } from '../hooks/useRouter'

export function Link({ href, children, ...props }) {
  return <a href={href} {...props} onClick={event => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && href.startsWith('/')) { event.preventDefault(); navigate(href) } }}>{children}</a>
}
export function Logo() { return <Link href="/" className="brand-link" aria-label="Conexa, início"><img src="/assets/marca/conexa-logo.svg" width="168" height="39" alt="Conexa" /></Link> }
export function ActionLink({ href, children, secondary = false }) { return <Link href={href} className={`button ${secondary ? 'button-outline' : ''}`}>{children}<ArrowUpRight size={19} aria-hidden="true" /></Link> }
export function PageHeading({ eyebrow, title, accent, children }) { return <div className="page-heading relative"><p className="eyebrow"><span className="seed" />{eyebrow}</p><h1>{title}<br /><span>{accent}</span></h1>{children && <p className="page-intro">{children}</p>}</div> }
export function StatusBadge({ children, tone = '' }) { return <span className={`status-badge ${tone}`}><i aria-hidden="true" />{children}</span> }
export function EmptyState({ title, children, action }) { return <div className="empty-state"><Leaf size={38} weight="duotone" aria-hidden="true" /><h2>{title}</h2><p>{children}</p>{action}</div> }
export function ErrorNotice({ children, retry }) { return <div className="error-notice break-words" role="alert"><p>{children}</p>{retry && <button className="text-link" onClick={retry}>Tentar novamente <ArrowUpRight size={18} /></button>}</div> }
export function Modal({ title, children, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    const opener = document.activeElement
    dialog.showModal()
    return () => { dialog.close(); opener?.focus() }
  }, [])
  return <dialog ref={ref} className="app-dialog" aria-labelledby="modal-title" onCancel={event => { event.preventDefault(); onClose() }}><button className="dialog-close" onClick={onClose} aria-label="Fechar"><X size={22} /></button><h2 id="modal-title">{title}</h2>{children}</dialog>
}
export function BackLink({ href, children = 'Voltar' }) { return <Link href={href} className="back-link"><ArrowLeft size={17} aria-hidden="true" />{children}</Link> }
