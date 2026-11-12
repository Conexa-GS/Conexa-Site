import { futureDate, today, validateOffer } from '../../src/domain/offers.js'
const copy = value => structuredClone(value)

// Somente bancada/testes de componente. Não substitui SQL, Auth, RLS ou concorrência reais.
export function createBotFixture() {
  const catalog = { products: [{ id: 'alface', name: 'Alface', unit: 'kg' }, { id: 'tomate', name: 'Tomate', unit: 'kg' }], locations: [{ id: 'coleta', display_address: 'Sítio Boa Semente · coleta fictícia' }] }
  let draft = null, failure = false, lost = false, hold = null
  const offers = [{ id: 'oferta-ana', product_id: 'alface', pickup_location_id: 'coleta', products: { name: 'Alface' }, quantity_total: 30, quantity_free: 25, unit_price_cents: 500, minimum_net_unit_cents: 400, available_from: today(), available_until: futureDate(14), expires_on: null, version: 1 }]
  const messages = [], requests = [], writes = [], results = new Map()
  async function run(action, payload) {
    requests.push({ action, ...copy(payload) })
    if (hold) await hold
    if (failure) throw new Error('Falha de rede controlada da bancada.')
    if (results.has(payload.request_id)) return copy(results.get(payload.request_id))
    if (payload.revision !== (draft?.revision || 0)) throw Object.assign(new Error('Rascunho mudou.'), { definitive: true })
    let offer = null, reply
    if (action === 'turn') {
      const before = offers.find(o => o.id === payload.target_id)
      draft = { ...copy(payload), revision: (draft?.revision || 0) + 1, before_offer: before ? copy(before) : null, expected_balance: before?.quantity_free ?? null, status: payload.intent === 'cancel' ? 'cancelled' : 'draft' }
      reply = payload.intent === 'cancel' ? 'Rascunho descartado.' : `Rascunho revisão ${draft.revision}. Confira a prévia.`
    } else {
      const before = offers.find(o => o.id === draft.target_id)
      if (draft.status !== 'draft' || (before && (before.version !== draft.before_offer.version || before.quantity_free !== draft.expected_balance))) {
        draft.status = 'conflict'; reply = 'Oferta ou saldo mudou. Prepare nova prévia.'
      } else {
        const validation = validateOffer(draft.fields)
        if (draft.intent !== 'archive' && Object.keys(validation.errors).length) throw new Error('Rascunho inválido na bancada.')
        offer = draft.intent === 'archive' ? { ...before, status: 'archived', version: before.version + 1 } : { ...before, ...validation.data, id: before?.id || `nova-${writes.length}`, version: (before?.version || 0) + 1, quantity_free: validation.data.quantity_total, products: catalog.products.find(p => p.id === draft.fields.product_id) }
        const index = offers.findIndex(o => o.id === offer.id)
        if (index < 0) offers.push(offer); else offers[index] = offer
        writes.push(copy(offer)); draft.status = 'applied'; reply = `Oferta persistida: ${offer.id}, versão ${offer.version}.`
      }
    }
    const result = { draft: copy(draft), offer: copy(offer), reply }
    for (const [speaker, body] of [['human', payload.body || `Confirmar revisão ${payload.revision}`], ['bot', reply]]) messages.push({ id: `bot-${messages.length}`, seq: String(messages.length + 1), speaker, body, created_at: '2026-11-11T14:05:00Z' })
    results.set(payload.request_id, result)
    if (lost) { lost = false; throw new Error('Resposta perdida após gravação simulada.') }
    return copy(result)
  }
  return {
    offers, writes, requests, messages,
    setFailure(value) { failure = value }, loseResponse() { lost = true },
    hold() { let release; hold = new Promise(resolve => { release = resolve }); return () => { hold = null; release() } },
    service: {
      async state() { return copy({ catalog, draft, offers: offers.filter(o => o.status !== 'archived') }) },
      async messages(id, before, after) { const page = messages.filter(m => (!before || BigInt(m.seq) < BigInt(before)) && (!after || BigInt(m.seq) > BigInt(after))); return { messages: copy(after ? page.slice(0, 40) : page.slice(-40)), has_more: page.length > 40 } },
      turn: payload => run('turn', payload), confirm: payload => run('confirm', payload),
    },
  }
}
