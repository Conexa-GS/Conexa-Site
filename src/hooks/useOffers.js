import { useCallback, useEffect, useState } from 'react'
import { listCatalog, listOffers, saveOffer, deleteOffer, archiveOffer } from '../services/offers'

export function useOffers(session) {
  const [state, setState] = useState({ offers: [], products: [], locations: [], loading: true, error: '' })
  const [revision, setRevision] = useState(0)
  const reload = useCallback(() => setRevision(value => value + 1), [])
  useEffect(() => { window.addEventListener('conexa:offers-changed', reload); return () => window.removeEventListener('conexa:offers-changed', reload) }, [reload])
  useEffect(() => {
    let active = true
    Promise.all([listOffers(session), listCatalog(session)]).then(([offers, catalog]) => {
      if (active) setState({ offers, ...catalog, loading: false, error: '' })
    }).catch(error => { if (active) setState(previous => ({ ...previous, loading: false, error: error.message })) })
    return () => { active = false }
  }, [session, revision])
  async function save(input, previous) { await saveOffer(session, input, previous); reload() }
  async function remove(offer) { await deleteOffer(session, offer); reload() }
  async function archive(offer) { await archiveOffer(session, offer); reload() }
  return { ...state, reload, save, remove, archive }
}
