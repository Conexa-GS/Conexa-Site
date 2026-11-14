import { useState } from 'react'
import { Image as ImageIcon } from '@phosphor-icons/react'
import { defaultProductPhoto } from '../../domain/product-photos'

export default function OfferPhoto({ url, hasPhoto, product, preview = false }) {
  const [failedUrl, setFailedUrl] = useState(null)
  const defaultUrl = !hasPhoto && !url ? defaultProductPhoto(product) : null
  const source = url || defaultUrl
  return <div className={`offer-photo${preview ? ' offer-photo-preview' : ''}`}>
    {source && failedUrl !== source ? <><img src={source} alt={defaultUrl ? `Imagem padrão de ${product}` : `Foto do lote de ${product || 'alimentos'}`} loading={preview ? 'eager' : 'lazy'} onError={() => setFailedUrl(source)} />{defaultUrl && <span className="offer-photo-label">Imagem padrão</span>}</> : <div className="offer-photo-empty"><ImageIcon size={32} aria-hidden="true" /><span>{hasPhoto || source ? 'Foto indisponível. Atualize para tentar novamente.' : 'Sem foto do lote'}</span></div>}
  </div>
}
