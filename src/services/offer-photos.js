export const PHOTO_BUCKET = 'offer-photos'
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024
export const MAX_SOURCE_BYTES = 10 * 1024 * 1024
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function validatePhotoFile(file) {
  if (!file || !PHOTO_TYPES.includes(file.type)) throw new Error('Escolha uma foto JPG, PNG ou WebP.')
  if (!file.size || file.size > MAX_SOURCE_BYTES) throw new Error('Escolha uma foto de até 10 MB.')
}

// Redesenhar remove metadados da câmera e reduz o arquivo antes do envio.
export async function prepareOfferPhoto(file) {
  validatePhotoFile(file)
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
    const context = canvas.getContext('2d')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.82))
    if (!blob || blob.size > MAX_PHOTO_BYTES) throw new Error('A foto ficou muito grande. Escolha uma imagem menor.')
    return new File([blob], 'foto-oferta.jpg', { type: 'image/jpeg' })
  } catch (error) {
    if (error.message.includes('muito grande')) throw error
    throw new Error('Não foi possível abrir esta foto. Tente outra imagem JPG, PNG ou WebP.', { cause: error })
  } finally { URL.revokeObjectURL(url) }
}

export const photoDataUrl = file => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(new Error('Não foi possível ler a foto. Escolha novamente.'))
  reader.readAsDataURL(file)
})

export function createOfferPhotoService(client) {
  const bucket = () => client.storage.from(PHOTO_BUCKET)
  return {
    async upload(producerId, file) {
      if (file.type !== 'image/jpeg' || !file.size || file.size > MAX_PHOTO_BYTES) throw new Error('Prepare uma foto JPG de até 2 MB antes de enviar.')
      const path = `${producerId}/${crypto.randomUUID()}.jpg`
      const { error } = await bucket().upload(path, file, { contentType: 'image/jpeg', upsert: false })
      if (error && /bucket.*not found/i.test(error.message || '')) throw new Error('O envio de fotos aguarda a atualização do Supabase demo. Seus dados foram preservados.')
      if (error) throw new Error('Não foi possível enviar a foto. Verifique a conexão e tente novamente; a oferta ainda não foi salva.')
      return path
    },
    async removeUnused(path) {
      if (!path) return
      // RLS impede apagar um objeto que ainda está vinculado a qualquer oferta.
      try { await bucket().remove([path]) } catch { /* Limpeza pode ser repetida; nunca desfaz a oferta. */ }
    },
    async urls(offers) {
      const paths = [...new Set(offers.map(o => o.photo_path).filter(Boolean))]
      if (!paths.length) return offers
      try {
        const { data, error } = await bucket().createSignedUrls(paths, 3600)
        if (error) return offers
        return offers.map(o => ({ ...o, photo_url: data?.find(item => item.path === o.photo_path)?.signedUrl || null }))
      } catch { return offers }
    },
    async save(session, input, previous, photo, write) {
      let uploaded
      try {
        uploaded = photo ? await this.upload(session.id, photo) : null
        const data = photo === undefined ? input : { ...input, photo_path: uploaded }
        const result = await write(data)
        if (photo !== undefined && previous?.photo_path !== uploaded) await this.removeUnused(previous?.photo_path)
        return result
      } catch (error) {
        // Em timeout após commit, a policy preserva a foto vinculada.
        await this.removeUnused(uploaded)
        throw error
      }
    },
  }
}
