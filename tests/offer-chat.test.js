import { test } from 'node:test'
import assert from 'node:assert/strict'
import { answerOfferChat, nextOfferChatStep, offerChatSteps, validateChatDraft } from '../src/domain/offer-chat.js'
import { today, futureDate, validateOffer } from '../src/domain/offers.js'

const catalog = { products: [{ id: 'alface', name: 'Alface', unit: 'kg' }, { id: 'caixa', name: 'Caixa', unit: 'cx' }], locations: [{ id: 'sitio', display_address: 'Coleta fictícia do perfil' }] }
const valid = () => ({ product_id: 'alface', quantity_total: '30,125', price: '5,00', minimum: '4,00', available_from: today(), available_until: futureDate(7), expires_on: '', pickup_location_id: 'sitio' })
const brDate = iso => iso.split('-').reverse().join('/')

test('conversa exige respostas explícitas, incluindo vencimento desconhecido, e produz o mesmo payload do formulário', () => {
  let draft = {}
  assert.equal(nextOfferChatStep(draft), 0)
  for (const step of offerChatSteps) {
    const answer = valid()[step.name]
    const result = answerOfferChat(draft, step.name, step.kind === 'date' && answer ? brDate(answer) : answer, catalog)
    assert.equal(result.error, '')
    draft = result.draft
  }
  assert.equal(nextOfferChatStep(draft), -1)
  assert.deepEqual(validateChatDraft(draft, catalog), validateOffer(valid()))
  assert.equal(validateChatDraft(draft, catalog).data.expires_on, null)
  const incomplete = valid(); delete incomplete.expires_on
  assert.equal(nextOfferChatStep(incomplete), 6)
})

test('rejeita números ambíguos, precisão excessiva e mínimo acima do preço, preservando o rascunho', () => {
  for (const [name, answer] of [['quantity_total', '30 kg'], ['quantity_total', '1,0001'], ['quantity_total', '0'], ['price', 'R$ 5,00'], ['price', '1.234,50'], ['price', '4,001'], ['minimum', '5,01']]) {
    const draft = valid()
    const result = answerOfferChat(draft, name, answer, catalog)
    assert.ok(result.error, `${name}=${answer}`)
    assert.equal(result.draft, draft)
  }
})

test('não inventa datas nem vencimento e rejeita datas impossíveis ou fora da disponibilidade', () => {
  for (const [name, answer] of [['available_from', 'amanhã'], ['available_from', '31/02/2030'], ['available_until', '2030-02-30'], ['available_from', '01/01/2020'], ['expires_on', today()]]) {
    assert.ok(answerOfferChat(valid(), name, answer, catalog).error, `${name}=${answer}`)
  }
  assert.ok(validateChatDraft({ ...valid(), available_from: '2030-02-30' }, catalog).errors.available_from)
  assert.equal(answerOfferChat(valid(), 'expires_on', '', catalog).draft.expires_on, '')
})

test('restringe alimento e coleta ao catálogo do perfil, sem conversão implícita de unidade', () => {
  for (const [name, answer] of [['product_id', 'inexistente'], ['product_id', 'caixa'], ['pickup_location_id', 'coleta-outro-perfil']]) {
    assert.ok(answerOfferChat(valid(), name, answer, catalog).error)
  }
})

test('corrigir uma resposta exige revalidar todas as dependências na prévia', () => {
  const revised = answerOfferChat(valid(), 'available_until', futureDate(10), catalog)
  assert.equal(revised.error, '')
  const expired = { ...valid(), expires_on: futureDate(8) }
  const edited = answerOfferChat(expired, 'available_until', futureDate(10), catalog)
  assert.ok(validateChatDraft(edited.draft, catalog).errors.expires_on)
  const price = answerOfferChat(valid(), 'price', '3,00', catalog)
  assert.ok(price.error)
  assert.equal(price.draft.price, '5,00')
})
