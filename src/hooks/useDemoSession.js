import { useState } from 'react'
import { signInDemo, signOutDemo } from '../services/offers'

export function useDemoSession() {
  const [session, setSession] = useState(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  async function enter(account) {
    setPending(true); setError(''); setSession(null)
    try { const participant = await signInDemo(account); setSession(participant); return participant }
    catch (failure) { setError(failure.message); return null }
    finally { setPending(false) }
  }
  async function leave() { await signOutDemo(); setSession(null); setError('') }
  return { session, pending, error, enter, leave }
}
