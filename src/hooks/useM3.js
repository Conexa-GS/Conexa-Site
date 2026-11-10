import { useCallback, useEffect, useState } from 'react'
import { listOperations } from '../services/m5'

export function useM3(session) {
  const [state, setState] = useState({ vehicles: [], carriers: [], loads: [], loading: true, error: '' })
  const [revision, setRevision] = useState(0)
  const reload = useCallback(() => setRevision(n => n + 1), [])
  useEffect(() => {
    let active = true
    listOperations().then(data => { if (active) setState({ ...data, loading: false, error: '' }) })
      .catch(error => { if (active) setState(previous => ({ ...previous, loading: false, error: error.message })) })
    const timer = setInterval(reload, 30000)
    window.addEventListener('focus', reload)
    return () => { active = false; clearInterval(timer); window.removeEventListener('focus', reload) }
  }, [session.id, revision, reload])
  return { ...state, reload }
}
