import { useSyncExternalStore } from 'react'
const subscribe = callback => { window.addEventListener('popstate', callback); return () => window.removeEventListener('popstate', callback) }
export function navigate(path) {
  history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'instant' })
}
export function useRouter() { return useSyncExternalStore(subscribe, () => window.location.pathname, () => '/') }
