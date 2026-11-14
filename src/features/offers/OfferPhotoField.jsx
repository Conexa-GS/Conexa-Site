import { useEffect, useId, useRef, useState } from 'react'
import { Camera, Image as ImageIcon, Trash } from '@phosphor-icons/react'
import { prepareOfferPhoto } from '../../services/offer-photos'
import { defaultProductPhoto } from '../../domain/product-photos'
import OfferPhoto from './OfferPhoto'

export default function OfferPhotoField({ previous, product, onChange, onBusy }) {
  const id = useId()
  const gallery = useRef(null)
  const camera = useRef(null)
  const [photo, setPhoto] = useState(undefined)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])
  async function select(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setError(''); setBusy(true); onBusy(true)
    try {
      const prepared = await prepareOfferPhoto(file)
      setPreview(URL.createObjectURL(prepared)); setPhoto(prepared); onChange(prepared)
    } catch (failure) { setError(failure.message) }
    finally { setBusy(false); onBusy(false) }
  }
  const url = photo === null ? null : photo ? preview : previous?.photo_url
  const hasPhoto = Boolean(photo || (photo === undefined && (previous?.photo_path || previous?.photo_url)))
  const hasDefault = Boolean(defaultProductPhoto(product))
  return <section className="offer-photo-field wide" aria-labelledby={`${id}-label`} aria-busy={busy}>
    <h3 id={`${id}-label`}>Foto da oferta <span>(opcional)</span></h3>
    <p id={`${id}-help`}>{hasDefault && !hasPhoto ? 'A imagem padrão do produto já está selecionada. Você pode trocar por uma foto do seu lote agora ou editar depois.' : 'Mostre o lote que está oferecendo. A foto aparecerá para os compradores.'}</p>
    <OfferPhoto url={url} hasPhoto={hasPhoto} product={product} preview />
    <div className="offer-photo-actions">
      <button type="button" className="button button-outline" disabled={busy} onClick={() => camera.current.click()} aria-describedby={`${id}-help`}><Camera size={18} aria-hidden="true" />Tirar foto</button>
      <button type="button" className="button button-outline" disabled={busy} onClick={() => gallery.current.click()}><ImageIcon size={18} aria-hidden="true" />{hasPhoto || hasDefault ? 'Trocar foto' : 'Escolher foto'}</button>
      {hasPhoto && <button type="button" className="photo-remove" disabled={busy} onClick={() => { setPhoto(null); setPreview(null); onChange(null); setError('') }}><Trash size={17} aria-hidden="true" />{hasDefault ? 'Usar imagem padrão' : 'Remover foto'}</button>}
    </div>
    <input ref={camera} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" tabIndex={-1} aria-label="Tirar foto do lote" onChange={select} disabled={busy} />
    <input ref={gallery} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" tabIndex={-1} aria-label="Escolher foto do lote" onChange={select} disabled={busy} />
    <small className="field-help">JPG, PNG ou WebP de até 10 MB. No celular, a câmera depende do navegador; no computador, escolha um arquivo.</small>
    <p className="photo-status" role="status">{busy ? 'Preparando foto…' : photo === null ? hasDefault ? 'Imagem padrão selecionada. Salve a oferta para confirmar.' : 'Foto removida. Salve a oferta para confirmar.' : photo ? 'Foto pronta. Salve a oferta para confirmar.' : ''}</p>
    {error && <p className="field-error" role="alert">{error} A seleção anterior foi mantida.</p>}
  </section>
}
