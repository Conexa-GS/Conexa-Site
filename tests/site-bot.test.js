import { test } from 'node:test'
import assert from 'node:assert/strict'
import { interpretSiteBot, botQuestion, canConfirmBot, offerFields } from '../src/domain/site-bot.js'
import { futureDate, today } from '../src/domain/offers.js'

const catalog = { products: [{ id: 'p', name: 'Alface', unit: 'kg' }], locations: [{ id: 'l', display_address: 'Coleta fictícia' }] }
const offer = { id: 'o', product_id: 'p', products: { name: 'Alface' }, quantity_total: 30, unit_price_cents: 500, minimum_net_unit_cents: 400, pickup_location_id: 'l', available_from: today(), available_until: futureDate(10), version: 2 }
const context = { role: 'producer', offers: [offer], catalog, draft: null }
const parse = (text, draft) => interpretSiteBot(text, { ...context, draft: draft ? { ...draft, status: 'draft' } : null })

test('Bot: edição explícita, seleção ambígua e quantidade total versus saldo', () => {
  const edit = parse('editar alface total 20 kg e preço 7,00')
  assert.equal(edit.target_id, 'o'); assert.equal(edit.fields.quantity_total, '20'); assert.equal(edit.fields.price, '7,00')
  assert.equal(edit.fields.minimum, '4.00')
  assert.match(parse('agora tenho 20 kg', edit).error, /total.*saldo/)
  assert.match(parse('Minha oferta de alface agora tem 20 kg').error, /total.*saldo/)
  assert.match(parse('saldo 20 kg', edit).error, /total.*saldo/)
  const ambiguous = interpretSiteBot('editar alface', { ...context, offers: [offer, { ...offer, id: 'o2' }] })
  assert.equal(ambiguous.target_id, null); assert.match(ambiguous.reply, /Escolha uma oferta/)
  assert.equal(parse('arquivar alface').intent, 'archive')
})

test('Bot: criação guiada, datas explícitas, catálogo e validação T29', () => {
  let draft = parse('criar oferta')
  for (const answer of ['Alface', '20,125', '5,07', '4,00', today(), futureDate(10), 'não sei', 'Coleta fictícia']) {
    draft = parse(answer, draft); assert.equal(draft.error, undefined)
  }
  assert.equal(draft.fields.quantity_total, '20,125'); assert.equal(draft.fields.expires_on, '')
  assert.equal(canConfirmBot({ ...draft, status: 'draft' }, catalog), true)
  assert.equal(canConfirmBot({ ...draft, status: 'conflict' }, catalog), false)
  assert.match(parse('preço: 3,00', draft).error, /mínimo/)
  assert.match(parse('fim: amanhã', draft).error, /data exata/)
  assert.match(parse('fim: 31/02/2027', draft).error, /data existente/)
  assert.match(parse('coleta: outro lugar', draft).error, /catálogo/)
  const correction = parse(`fim: ${futureDate(12)}`, { ...draft, fields: { ...draft.fields, expires_on: futureDate(10) } })
  assert.equal(canConfirmBot({ ...correction, status: 'draft' }, catalog), false)
  assert.match(botQuestion(correction, catalog), /vencimento/)
})

test('Bot: sem autorização incidental, comprador só consulta e cancelamento descarta', () => {
  const draft = parse('editar alface')
  assert.match(parse('sim', draft).error, /Confirmar revisão/)
  assert.equal(parse('cancelar', draft).intent, 'cancel')
  assert.equal(interpretSiteBot('consultar', { ...context, role: 'buyer' }).intent, 'consult')
  assert.match(interpretSiteBot('editar alface', { ...context, role: 'buyer' }).error, /somente o produtor/)
  assert.match(parse('pagar transporte', draft).error, /Não entendi/)
  assert.deepEqual(offerFields(offer).expires_on, '')
})
