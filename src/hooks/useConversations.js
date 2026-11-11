import { useCallback, useEffect, useRef, useState } from 'react'
import { conversationService } from '../services/conversations'

export function useConversations(session, service = conversationService) {
  const [state, setState] = useState({ conversations: [], contacts: [], loading: true, error: '', revision: 0 })
  const generation = useRef({ value: 0 })
  const reload = useCallback(async () => {
    const request = ++generation.current.value
    try {
      const data = await service.inbox()
      if (request === generation.current.value) setState(previous => ({ ...data, loading: false, error: '', revision: previous.revision + 1 }))
    } catch (error) {
      if (request === generation.current.value) setState(previous => ({ ...previous, loading: false, error: error.message }))
    }
  }, [service])
  useEffect(() => {
    void reload()
    const lifecycle = generation.current
    const unsubscribe = service.subscribe(session.id, reload)
    return () => { lifecycle.value++; unsubscribe() }
  }, [reload, service, session.id])
  return { ...state, reload }
}
