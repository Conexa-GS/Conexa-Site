// In-memory UI fixture only; no network, Auth, SQL/RLS or durable persistence.
export function createConversationsFixture(viewer = 'ana', count = 2) {
  const peers = [{ id: 'ana', display_name: 'Ana · Sítio Boa Semente', role: 'producer' }, { id: 'joao', display_name: 'João · Horta da Família', role: 'producer' }, { id: 'buyer', display_name: 'Restaurante Raízes', role: 'buyer' }]
  const messages = Array.from({ length: count }, (_, i) => ({ id: `message-${i}`, seq: String(i + 1), conversation_id: 'direct', sender_id: i % 2 ? 'ana' : 'buyer', body: i === 0 ? 'Podemos conversar sobre uma parceria fictícia?' : `Mensagem fictícia ${i + 1}`, created_at: '2026-11-11T14:00:00Z' }))
  const read = new Map()
  const conversations = [{ id: 'direct', peerId: viewer === 'buyer' ? 'ana' : 'buyer' }]
  const listeners = new Set()
  const sends = []
  let fail = false
  const service = {
    async inbox() {
      return { conversations: [{ id: `bot-${viewer}`, kind: 'bot', title: 'Bot Conexa', last_read_seq: '0', unread: 0 }, ...conversations.map(conversation => {
        const rows = messages.filter(message => message.conversation_id === conversation.id)
        return { id: conversation.id, kind: 'direct', title: peers.find(peer => peer.id === conversation.peerId).display_name, last_read_seq: read.get(conversation.id) || '0', last_body: rows.at(-1)?.body, last_at: rows.at(-1)?.created_at, unread: rows.filter(message => message.sender_id !== viewer && BigInt(message.seq) > BigInt(read.get(conversation.id) || 0)).length }
      })], contacts: peers.filter(peer => peer.id !== viewer) }
    },
    async openDirect(peerId) {
      let conversation = conversations.find(item => item.peerId === peerId)
      if (!conversation) { conversation = { id: `direct-${peerId}`, peerId }; conversations.push(conversation) }
      return { id: conversation.id }
    },
    async messages(id, before, after) {
      const page = messages.filter(message => message.conversation_id === id && (!before || BigInt(message.seq) < BigInt(before)) && (!after || BigInt(message.seq) > BigInt(after)))
      return { messages: after ? page.slice(0, 40) : page.slice(-40), has_more: page.length > 40 }
    },
    async send(id, key, body) {
      sends.push({ id, key, body })
      if (fail) throw new Error('Falha controlada da bancada. Sem escrita remota.')
      const existing = messages.find(message => message.client_send_id === key)
      if (existing) return existing
      const message = { id: `message-${messages.length}`, seq: String(messages.length + 1), conversation_id: id, sender_id: viewer, body, client_send_id: key, created_at: '2026-11-11T14:05:00Z' }
      messages.push(message)
      return message
    },
    async read(id, seq) { read.set(id, seq) },
    subscribe(id, callback) { listeners.add(callback); return () => listeners.delete(callback) },
  }
  return { service, sends, messages, listeners, setFailure: value => { fail = value }, emit: () => { for (const listener of listeners) listener() } }
}
