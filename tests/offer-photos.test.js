import test from 'node:test'
import assert from 'node:assert/strict'
import { createOfferPhotoService, MAX_SOURCE_BYTES, validatePhotoFile } from '../src/services/offer-photos.js'

test('foto rejeita formato ativo, arquivo vazio e tamanho excessivo', () => {
  for (const file of [{ type: 'image/svg+xml', size: 1 }, { type: 'image/jpeg', size: 0 }, { type: 'image/png', size: MAX_SOURCE_BYTES + 1 }]) assert.throws(() => validatePhotoFile(file))
  for (const type of ['image/jpeg', 'image/png', 'image/webp']) assert.doesNotThrow(() => validatePhotoFile({ type, size: 1024 }))
})

function fixture({ uploadError, signedError, removeError } = {}) {
  const calls = []
  const service = createOfferPhotoService({ storage: { from: bucket => ({
    upload: async (path, file, options) => { calls.push({ action: 'upload', bucket, path, options }); return { error: uploadError } },
    remove: async paths => { calls.push({ action: 'remove', paths }); if (removeError) throw new Error('offline'); return {} },
    createSignedUrls: async (paths, seconds) => { calls.push({ action: 'urls', paths, seconds }); return { error: signedError, data: paths.map(path => ({ path, signedUrl: `signed:${path}` })) } },
  }) } })
  return { service, calls }
}
const photo = new File(['jpeg-fixture'], 'foto.jpg', { type: 'image/jpeg' })
test('salva foto no namespace do dono, sem sobrescrever, e associa só depois do upload', async () => {
  const { service, calls } = fixture()
  await service.save({ id: 'ana' }, { quantity_total: 50 }, null, photo, async data => {
    calls.push({ action: 'save' })
    assert.equal(data.quantity_total, 50)
    assert.match(data.photo_path, /^ana\/[a-f0-9-]+\.jpg$/)
  })
  assert.deepEqual(calls.map(c => c.action), ['upload', 'save'])
  assert.equal(calls[0].options.upsert, false)
})
test('upload falho não publica oferta; falha ao salvar tenta limpar só o upload novo', async () => {
  let writes = 0
  const failed = fixture({ uploadError: { message: 'offline' } })
  await assert.rejects(failed.service.save({ id: 'ana' }, {}, null, photo, async () => writes++), /enviar a foto/)
  assert.equal(writes, 0)
  const { service, calls } = fixture({ removeError: true })
  await assert.rejects(service.save({ id: 'ana' }, {}, { photo_path: 'old' }, photo, async () => { throw new Error('conflito') }), /conflito/)
  assert.deepEqual(calls[1].paths, [calls[0].path])
})
test('edição sem seleção preserva foto; remoção explícita e troca limpam antiga após salvar', async () => {
  const { service, calls } = fixture()
  const previous = { photo_path: 'old' }
  await service.save({ id: 'ana' }, { quantity_total: 50 }, previous, undefined, async data => assert.equal(Object.hasOwn(data, 'photo_path'), false))
  assert.equal(calls.length, 0)
  await service.save({ id: 'ana' }, {}, previous, null, async data => { assert.equal(data.photo_path, null); calls.push({ action: 'save' }) })
  assert.deepEqual(calls.map(c => c.action), ['save', 'remove'])
  assert.deepEqual(calls[1].paths, ['old'])
})
test('falha de leitura da foto preserva ofertas e URLs são temporárias', async () => {
  const offers = [{ id: 1, photo_path: 'ana/photo.jpg' }, { id: 2 }]
  const { service, calls } = fixture()
  assert.equal((await service.urls(offers))[0].photo_url, 'signed:ana/photo.jpg')
  assert.equal(calls[0].seconds, 3600)
  assert.equal(await fixture({ signedError: true }).service.urls(offers), offers)
})
