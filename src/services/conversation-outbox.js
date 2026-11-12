// Only uncertain sends are retained, per tab and participant. This is a retry
// journal, never authority to write: every replay still passes through the RPC.
export function createConversationOutbox(owner, getStorage = () => window.sessionStorage) {
  const key = `conexa-outbox-v1:${owner}`
  let entries = {}
  let warning = ''
  try {
    const saved = JSON.parse(getStorage().getItem(key) || '{}')
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) throw new Error('Invalid journal')
    for (const [id, value] of Object.entries(saved)) {
      if (!value || value.locked !== true || typeof value.body !== 'string' || value.body.length > 2000) throw new Error('Invalid composer')
      if (value.pending) {
        const { action, payload } = value.pending
        if (!['turn', 'confirm'].includes(action) || payload?.conversation_id !== id || typeof payload.request_id !== 'string' || !Number.isInteger(payload.revision)) throw new Error('Invalid bot request')
      } else if (typeof value.key !== 'string') throw new Error('Invalid message key')
    }
    entries = saved
  } catch { warning = 'Não foi possível retomar os envios desta aba.' }
  return {
    load: () => entries,
    warning: () => warning,
    save(id, composer, expectedKey) {
      if (expectedKey) {
        // A previous page can finish after navigation created a new outbox.
        // Compare against the durable journal, not that old instance's cache.
        try { entries = JSON.parse(getStorage().getItem(key) || '{}') }
        catch { throw new Error('Não foi possível conferir a chave persistida. Verifique o envio novamente quando o armazenamento estiver disponível.') }
      }
      const current = entries[id]
      if (expectedKey && (current?.pending?.payload?.request_id || current?.key) !== expectedKey) return false
      if (!composer.locked && !Object.hasOwn(entries, id)) return true
      const next = { ...entries }
      if (composer.locked) next[id] = composer
      else delete next[id]
      // Persist before starting the request. If storage fails, do not send a
      // command whose idempotency key would disappear on reload.
      try {
        if (Object.keys(next).length) getStorage().setItem(key, JSON.stringify(next))
        else getStorage().removeItem(key)
      } catch { throw new Error('Não foi possível guardar ou atualizar a chave do envio nesta aba. Libere o armazenamento do navegador e verifique o histórico antes de tentar novamente.') }
      entries = next
      return true
    },
  }
}
