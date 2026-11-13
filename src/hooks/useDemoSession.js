import { useEffect, useRef, useState } from 'react'
import { demoSessionService } from '../services/offers'

export function useDemoSession(service = demoSessionService) {
  const [session, setSession] = useState(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [restoring, setRestoring] = useState(true)
  const lifecycle = useRef({ generation: 0, live: false, busy: false })
  useEffect(() => {
    const state = lifecycle.current
    state.live = true
    const current = ++state.generation
    const unsubscribe = service.subscribe(() => {
      if (state.busy) { setSession(null); return }
      state.generation++; state.busy = false
      setSession(null); setPending(false); setRestoring(false)
    })
    void service.restore().then(participant => {
      if (state.live && current === state.generation) setSession(participant)
    }).catch(failure => {
      if (state.live && current === state.generation) setError(failure.message)
    }).finally(() => {
      if (state.live && current === state.generation) setRestoring(false)
    })
    return () => { state.live = false; state.generation++; unsubscribe() }
  }, [service])
  async function enter(account) {
    const state = lifecycle.current
    if (state.busy) return null
    const current = ++state.generation
    state.busy = true
    setRestoring(false); setPending(true); setError(''); setSession(null)
    try {
      const participant = await service.enter(account)
      if (!state.live || current !== state.generation) return null
      setSession(participant); return participant
    } catch (failure) {
      if (state.live && current === state.generation) setError(failure.message)
      return null
    } finally {
      if (state.live && current === state.generation) { state.busy = false; setPending(false) }
    }
  }
  async function leave() {
    const state = lifecycle.current
    if (state.busy) return false
    state.generation++; state.busy = true
    setPending(true); setError('')
    try { await service.leave(); if (state.live) setSession(null); return true }
    catch (failure) { if (state.live) setError(failure.message); return false }
    finally { if (state.live) { state.busy = false; setPending(false) } }
  }
  return { session, pending, restoring, error, enter, leave, clearError: () => setError('') }
}
