// No localStorage fallback: different tabs must not silently share a participant.
// When browser storage is blocked, keep working in memory until the next reload.
export function createTabSessionStorage(getStorage = () => window.sessionStorage, clientKey = '', savedKey = '') {
  const memory = new Map()
  let available = true
  const storedKey = key => clientKey && key.startsWith(clientKey) ? savedKey + key.slice(clientKey.length) : key
  return {
    getItem(key) {
      try { if (available) return getStorage().getItem(storedKey(key)) }
      catch { available = false }
      return memory.get(key) ?? null
    },
    setItem(key, value) {
      memory.set(key, value)
      try { if (available) getStorage().setItem(storedKey(key), value) } catch { available = false }
    },
    removeItem(key) {
      memory.delete(key)
      try { if (available) getStorage().removeItem(storedKey(key)) } catch { available = false }
    },
  }
}

export function createTabAuthOptions(url, getStorage) {
  // Auth broadcasts use storageKey even with a custom storage adapter. Give each
  // document its own channel, while mapping stored tokens to a stable per-tab key.
  const clientKey = `conexa-auth-${crypto.randomUUID()}`
  const savedKey = `conexa-${new URL(url).hostname}-auth`
  return { persistSession: true, storageKey: clientKey, storage: createTabSessionStorage(getStorage, clientKey, savedKey), detectSessionInUrl: false }
}
