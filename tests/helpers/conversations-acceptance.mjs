import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { interpretSiteBot } from '../../src/domain/site-bot.js'
import { today, futureDate } from '../../src/domain/offers.js'

// Same RPC scenario for PGlite and the manually authorized demo. Only the remote
// adapter proves Auth, concurrent connections and websocket delivery.
export async function verifyConversations(adapter, report) {
  const { rpc, select, writeOffer, ids } = adapter
  const passed = message => report.checks.push(message)
  // A network/schema failure is not evidence that authorization was denied.
  const denied = (operation, codes = ['P0001']) => assert.rejects(operation, error => codes.includes(error.code))
  const chat = (who, action, payload = {}) => rpc(who, 'site_chat', action, payload)
  let cid, fixture, pendingCreate
  const bot = (who, action, payload = {}) => rpc(who, 'site_bot', action, { conversation_id: cid, ...payload })
  const state = () => bot('ana', 'state')
  async function turn(text) {
    const context = await state()
    const proposal = interpretSiteBot(text, { ...context, role: 'producer' })
    assert.equal(proposal.error, undefined, 'Intérprete aceita a entrada fictícia')
    const target = context.offers.find(o => o.id === proposal.target_id)
    const payload = { request_id: randomUUID(), revision: context.draft?.revision || 0, body: text, ...proposal, offer_version: target?.version || null }
    delete payload.reply
    return bot('ana', 'turn', payload)
  }
  const confirm = revision => bot('ana', 'confirm', { revision, request_id: randomUUID() })
  const oneWinner = results => {
    assert.equal(results.filter(r => r.status === 'fulfilled').length, 1)
    assert.equal(results.filter(r => r.status === 'rejected').length, 1)
    assert.equal(results.find(r => r.status === 'rejected').reason.code, 'P0001')
  }
  try {
    cid = (await chat('ana', 'inbox')).conversations.find(c => c.kind === 'bot').id
    const initial = await state()
    assert.ok(!initial.draft || ['applied', 'cancelled'].includes(initial.draft.status), 'Há rascunho em andamento no demo; preservar e avaliar antes de executar')
    const product = initial.catalog.products.find(p => p.unit === 'kg')
    assert.ok(product && initial.catalog.locations.length, 'Catálogo/coleta próprios disponíveis')
    const baseline = new Set(initial.offers.map(o => o.id))
    const fields = { product_id: product.id, quantity_total: '20,125', price: '5,07', minimum: '4,00', available_from: today(), available_until: futureDate(7), expires_on: futureDate(8), pickup_location_id: initial.catalog.locations[0].id }
    // Full structured draft uses the public contract; edits below use the real interpreter.
    const preview = await bot('ana', 'turn', { request_id: randomUUID(), revision: initial.draft?.revision || 0, body: 'Teste técnico fictício T41: criar oferta; conferir antes de confirmar.', intent: 'create', fields })
    assert.deepEqual(new Set((await state()).offers.map(o => o.id)), baseline, 'Prévia não publica')
    assert.equal(preview.draft.status, 'draft')
    pendingCreate = { request_id: randomUUID(), revision: preview.draft.revision }
    const created = await Promise.all(['ana', 'ana2'].map(who => bot(who, 'confirm', pendingCreate)))
    assert.deepEqual(created[0], created[1], 'Mesma chave concorrente devolve resultado idêntico')
    fixture = created[0].offer
    assert.ok(fixture?.id)
    report.offers.push(fixture.id)
    assert.equal(Number(fixture.quantity_total), 20.125)
    assert.equal(fixture.unit_price_cents, 507)
    assert.equal(fixture.minimum_net_unit_cents, 400)
    assert.equal((await state()).offers.filter(o => !baseline.has(o.id)).length, 1)
    assert.deepEqual(await bot('ana', 'confirm', pendingCreate), created[0], 'Resposta perdida recuperada pela mesma chave')
    await denied(bot('ana', 'confirm', { ...pendingCreate, revision: 999 }))
    passed('Prévia sem escrita; confirmação/replay da mesma chave cria uma oferta de 20,125 kg a 507 centavos, mínimo 400.')

    const old = await turn(`editar ${fixture.id} total 21 kg`)
    const current = await turn('total 22 kg')
    await denied(confirm(old.draft.revision))
    const competing = await Promise.allSettled(['ana', 'ana2'].map(who => bot(who, 'confirm', { revision: current.draft.revision, request_id: randomUUID() })))
    oneWinner(competing)
    fixture = competing.find(r => r.status === 'fulfilled').value.offer
    assert.equal(Number(fixture.quantity_total), 22)
    passed('Revisão corrigida rejeita confirmação antiga; chaves diferentes para a mesma revisão têm um único vencedor.')

    await turn(`editar ${fixture.id} preço 6,00`)
    const before = (await state()).offers.find(o => o.id === fixture.id)
    fixture = await writeOffer('ana2', { ...before, unit_price_cents: 650 }, before.id, before.version)
    const conflict = await confirm((await state()).draft.revision)
    assert.equal(conflict.draft.status, 'conflict')
    assert.equal(conflict.offer, null)
    assert.equal(conflict.draft.fields.price, '6,00')
    assert.equal((await state()).offers.find(o => o.id === fixture.id).unit_price_cents, 650)
    await turn(`editar ${fixture.id} preço 6,00`)
    fixture = (await confirm((await state()).draft.revision)).offer
    assert.equal(fixture.unit_price_cents, 600)
    passed('Gateway do formulário invalida prévia por versão; conflito conserva campos e nova prévia/confirmar aplica a edição.')

    const buyerCid = (await chat('buyer', 'inbox')).conversations.find(c => c.kind === 'bot').id
    const buyerState = await rpc('buyer', 'site_bot', 'state', { conversation_id: buyerCid })
    assert.ok(buyerState.offers.some(o => o.id === fixture.id && o.unit_price_cents === 600))
    await denied(rpc('buyer', 'site_bot', 'turn', { conversation_id: buyerCid, revision: buyerState.draft?.revision || 0, request_id: randomUUID(), intent: 'edit', target_id: fixture.id, fields: {}, body: 'Teste fictício de permissão.' }))
    await denied(writeOffer('joao', fixture, fixture.id, fixture.version))
    for (const who of ['joao', 'carrier', 'anonymous']) await denied(bot(who, 'state'), who === 'anonymous' ? ['42501'] : ['P0001'])
    for (const table of ['site_bot_drafts', 'site_bot_requests']) {
      assert.equal((await select('joao', table, { conversation_id: cid })).length, 0)
    }
    passed('Comprador consulta a mesma oferta; comprador/outro produtor não editam; bot/rascunhos/pedidos privados ficam isolados.')

    const direct = (await chat('ana', 'open_direct', { peer_id: ids.buyer })).id
    assert.equal((await chat('buyer', 'open_direct', { peer_id: ids.ana })).id, direct)
    report.conversations.push(direct)
    // Do not mark pre-existing messages as read in shared demo accounts.
    for (const who of ['ana', 'buyer']) {
      const inbox = await chat(who, 'inbox')
      assert.equal(Number(inbox.conversations.find(c => c.id === direct).unread), 0, 'Mensagens anteriores não lidas: parar sem modificar cursor')
    }
    const balanceBefore = (await state()).offers.find(o => o.id === fixture.id)
    const key = randomUUID(), body = `Teste técnico fictício T41 ${report.run_id}: editar oferta total 1 kg; isto é uma mensagem humana, sem efeito operacional.`
    const payload = { conversation_id: direct, client_send_id: key, body, sender_id: ids.buyer }
    const watch = await adapter.watch?.(direct)
    try {
      const sent = await Promise.all(['ana', 'ana2'].map(who => chat(who, 'send', payload)))
      assert.equal(sent[0].id, sent[1].id)
      assert.equal(sent[0].sender_id, ids.ana, 'Remetente vem da sessão')
      report.messages.push(sent[0].id)
      await denied(chat('ana', 'send', { ...payload, body: 'Conteúdo diferente' }))
      if (watch) {
        await watch.verify(sent[0].id)
        passed('INSERT recebido via websocket pela sessão membro; terceiro não recebeu esse ID na janela observada (não é prova irrestrita).')
      }
      const unread = Number((await chat('buyer', 'inbox')).conversations.find(c => c.id === direct).unread)
      assert.equal(unread, 1)
      await chat('buyer', 'read', { conversation_id: direct, seq: sent[0].seq })
      assert.equal(Number((await chat('buyer', 'inbox')).conversations.find(c => c.id === direct).unread), 0)
    } finally { await watch?.close() }
    await adapter.reauthenticate?.('buyer')
    assert.ok((await chat('buyer', 'messages', { conversation_id: direct })).messages.some(m => m.id === report.messages[0]))
    assert.equal(Number((await chat('buyer', 'inbox')).conversations.find(c => c.id === direct).unread), 0)
    for (const who of ['joao', 'carrier', 'anonymous']) await denied(chat(who, 'messages', { conversation_id: direct }), who === 'anonymous' ? ['42501'] : ['P0001'])
    for (const table of ['site_conversations', 'site_conversation_members', 'site_messages']) {
      assert.equal((await select('joao', table, { [table === 'site_conversations' ? 'id' : 'conversation_id']: direct })).length, 0)
    }
    assert.deepEqual((await state()).offers.find(o => o.id === fixture.id), balanceBefore, 'Mensagem humana não muda oferta/saldo')
    passed('Par direto único, envio/replay idempotente, remetente autenticado, não lidas/leitura e consulta por nova sessão; mensagem não altera oferta/saldo.')

    // More than two pages missed while disconnected. Compare only this run's IDs.
    let cursor = (await chat('buyer', 'messages', { conversation_id: direct })).messages.at(-1).seq
    const firstCursor = cursor, expected = []
    for (let i = 0; i < 81; i++) {
      const message = await chat('ana', 'send', { conversation_id: direct, client_send_id: randomUUID(), body: `Teste fictício T41 ${report.run_id}: recuperação ${i + 1}/81.` })
      expected.push(message.id); report.messages.push(message.id)
    }
    const recovered = []
    for (let pages = 0; pages < 10; pages++) {
      const page = await chat('buyer', 'messages', { conversation_id: direct, after_seq: cursor })
      for (const m of page.messages) assert.ok(BigInt(m.seq) > BigInt(cursor))
      recovered.push(...page.messages)
      if (!page.has_more) break
      assert.ok(page.messages.length && page.messages.at(-1).seq !== cursor, 'Cursor deve progredir')
      cursor = page.messages.at(-1).seq
      assert.notEqual(pages, 9, 'Limite de páginas excedido')
    }
    assert.deepEqual(recovered.map(m => m.id), expected)
    assert.equal(new Set(recovered.map(m => m.id)).size, 81)
    await denied(chat('buyer', 'messages', { conversation_id: direct, after_seq: firstCursor, before_seq: recovered.at(-1).seq }))
    await chat('buyer', 'read', { conversation_id: direct, seq: recovered.at(-1).seq })
    await chat('buyer', 'read', { conversation_id: direct, seq: recovered[0].seq })
    assert.equal(Number((await chat('buyer', 'inbox')).conversations.find(c => c.id === direct).unread), 0)
    passed('Reconciliação recupera 81 mensagens em três páginas sem duplicar; leitura monotônica não retrocede.')

    await turn(`arquivar ${fixture.id}`)
    await turn('cancelar')
    assert.ok((await state()).offers.some(o => o.id === fixture.id))
    await turn(`arquivar ${fixture.id}`)
    fixture = (await confirm((await state()).draft.revision)).offer
    assert.equal(fixture.status, 'archived')
    passed('Cancelar arquivamento preserva oferta; nova prévia/confirmar arquiva mantendo histórico.')
  } finally {
    // A response may have been lost after commit. Inspect the audit result rather
    // than replaying a possibly unexecuted mutation during cleanup.
    if (!fixture && pendingCreate) {
      const rows = await select('ana', 'site_bot_requests', { request_id: pendingCreate.request_id })
      fixture = rows[0]?.result?.offer
      if (fixture?.id && !report.offers.includes(fixture.id)) report.offers.push(fixture.id)
    }
    if (fixture?.id) {
      const rows = await select('ana', 'offers', { id: fixture.id })
      assert.equal(rows[0]?.producer_id, ids.ana)
      if (rows[0].status !== 'archived') await writeOffer('ana', {}, fixture.id, rows[0].version, true)
      assert.equal((await select('ana', 'offers', { id: fixture.id }))[0].status, 'archived')
      report.archived.push(fixture.id)
    }
    // Never cancel a draft another active session may have prepared in parallel.
    // An interrupted run is explicit in the report; inspect its draft manually.
  }
}
