import test from 'node:test'
import assert from 'node:assert/strict'
import { sendComposition } from '../src/services/composition.js'

const input = { demandId: 'demand', items: [{ offer_id: 'offer', quantity: 50 }], hours: 24 }

test('send composition submits immediately after saving and keeps the draft for retry', async () => {
  const calls = [], remembered = []
  const api = async (action, payload) => { calls.push([action, payload]); return { id: 'load' } }
  await sendComposition(api, { ...input, onDraft: draft => remembered.push(draft) })
  assert.deepEqual(calls.map(([action]) => action), ['draft', 'submit'])
  assert.deepEqual(calls[1][1], { id: 'load', version: 1 })
  assert.equal(remembered[0].id, 'load')
})

test('failed submission preserves the saved draft and retries without another draft', async () => {
  let remembered
  const draft = { id: 'load', demand_id: 'demand', version: 1, status: 'draft', items: input.items }
  const api = async action => {
    if (action === 'draft') return draft
    if (action === 'list') return { loads: [draft] }
    throw new Error('Saldo insuficiente')
  }
  await assert.rejects(sendComposition(api, { ...input, onDraft: value => { remembered = value } }), /Saldo insuficiente/)
  assert.equal(remembered, draft)
  const calls = []
  await sendComposition(async action => { calls.push(action) }, { ...input, draft: remembered, onDraft: () => {} })
  assert.deepEqual(calls, ['submit'])
})

test('network failure after committed submission is recovered by reading the same proposal', async () => {
  const api = async action => {
    if (action === 'draft') return { id: 'load' }
    if (action === 'submit') throw new Error('Resposta de rede perdida')
    return { loads: [{ id: 'load', status: 'awaiting_producers' }] }
  }
  assert.equal((await sendComposition(api, { ...input, onDraft: () => {} })).id, 'load')
})

test('uncertain draft creation is preserved for review without automatically submitting it', async () => {
  let remembered
  const api = async action => {
    if (action === 'draft') throw new Error('Resposta de gravação perdida')
    assert.equal(action, 'list')
    return { loads: [{ id: 'load', demand_id: 'demand', status: 'draft' }] }
  }
  await assert.rejects(sendComposition(api, { ...input, onDraft: value => { remembered = value } }), /gravação perdida/)
  assert.equal(remembered.id, 'load')
})
