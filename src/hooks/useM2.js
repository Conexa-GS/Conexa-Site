import { useCallback, useEffect, useState } from 'react'
import { m2 } from '../services/m2'

export function useM2(session) {
  const [state, setState] = useState({ demands: [], loads: [], loading: true, error: '' })
  const [revision, setRevision] = useState(0)
  const reload = useCallback(() => setRevision(n => n + 1), [])
  useEffect(() => {
    let active = true
    m2('list').then(data => { if (active) setState({ ...data, loading: false, error: '' }) })
      .catch(error => { if (active) setState(previous => ({ ...previous, loading: false, error: error.message })) })
    const timer = setInterval(reload, 30000)
    const refresh = () => reload()
    window.addEventListener('focus', refresh)
    return () => { active = false; clearInterval(timer); window.removeEventListener('focus', refresh) }
  }, [session.id, revision, reload])
  return { ...state, reload }
}
