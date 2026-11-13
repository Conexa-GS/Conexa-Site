import { useId, useRef, useState } from 'react'
import { EmptyState } from './ui'

const isHistory = record => ['archived', 'cancelled', 'expired', 'delivered'].includes(record.status)

export default function RecordList({ records, scope, participantId, label, renderRecord, isNew }) {
  const storageKey = `conexa:hidden:${participantId}:${scope}`
  const headingId = useId()
  const filters = useRef(null)
  const [view, setView] = useState('active')
  const [hidden, setHidden] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]')
      return Array.isArray(saved) ? saved.filter(id => typeof id === 'string') : []
    } catch { return [] }
  })
  const [notice, setNotice] = useState('')
  const groups = {
    active: records.filter(r => !hidden.includes(r.id) && !isHistory(r)),
    history: records.filter(r => !hidden.includes(r.id) && isHistory(r)),
    hidden: records.filter(r => hidden.includes(r.id)),
  }
  const labels = { active: 'Ativas', history: 'Histórico', hidden: 'Ocultas' }
  function toggle(record) {
    const restoring = hidden.includes(record.id)
    const next = restoring ? hidden.filter(id => id !== record.id) : [...hidden, record.id]
    setHidden(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) }
    catch { /* The view still works when browser storage is unavailable. */ }
    setNotice(restoring ? 'Registro reexibido na lista correspondente.' : 'Registro oculto. Você pode reexibi-lo em Ocultas. Isso não cancela nem altera a proposta.')
    filters.current?.querySelector('[aria-pressed="true"]')?.focus()
  }
  const visible = groups[view]
  const sections = view === 'active' && isNew
    ? [{ title: 'Novas para responder', records: visible.filter(isNew) }, { title: 'Em andamento', records: visible.filter(r => !isNew(r)) }]
    : [{ records: visible }]
  return <section className="record-list" aria-labelledby={headingId}>
    <h3 id={headingId} className="sr-only">{label}</h3>
    <div ref={filters} className="record-filters" role="group" aria-label={`Exibir ${label.toLowerCase()}`}>
      {Object.entries(labels).map(([key, text]) => <button key={key} type="button" className="record-filter" aria-pressed={view === key} onClick={() => setView(key)}>{text} <span>{groups[key].length}</span></button>)}
    </div>
    <p className="inline-caption">{view === 'active' ? 'Canceladas, expiradas e arquivadas ficam no Histórico.' : view === 'history' ? 'Registros encerrados, preservados para consulta.' : 'Ocultar muda apenas sua visualização neste navegador. Reservas, prazos e respostas continuam valendo.'}</p>
    {notice && <p role="status" className="inline-note">{notice}</p>}
    {!visible.length && <EmptyState title={view === 'active' ? 'Nenhum registro ativo por aqui.' : view === 'history' ? 'Histórico vazio.' : 'Nenhum registro oculto.'}>{view === 'active' ? 'Confira o Histórico ou as Ocultas, ou inicie uma nova conexão.' : 'Os registros aparecerão aqui quando houver itens nesta lista.'}</EmptyState>}
    {sections.filter(section => section.records.length).map((section, index) => <div key={section.title || index}>
      {section.title && <h3 className="record-section-title">{section.title} · {section.records.length}</h3>}
      {section.records.map(record => <div className="record-entry" key={record.id}>
        <div className="record-visibility"><button type="button" className="text-link" onClick={() => toggle(record)} aria-label={`${view === 'hidden' ? 'Reexibir' : 'Ocultar'} ${label.toLowerCase()} ${record.id.slice(0, 8)}`}>{view === 'hidden' ? 'Reexibir na lista' : 'Ocultar da lista'}</button></div>
        {renderRecord(record)}
      </div>)}
    </div>)}
  </section>
}
