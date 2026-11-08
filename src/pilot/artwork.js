/* All illustration motion comes from the user's original GIF files. */
import { animationMarkup, mountProvidedAnimations } from './provided-animations'

const scene = (asset, label, caption) => `<div class="reference-scene">${animationMarkup(asset, { label })}<span class="scene-marker" aria-hidden="true"><i></i>${caption}</span></div>`

export function mountArtwork() {
  const library = document.createElement('div')
  library.className = 'art-library'
  library.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><defs><g id="leaf-mark"><path d="M-13 8Q-25-16-1-24Q17-7 3 10Q19-17 35-9Q36 16 7 20L-4 29Z" fill="currentColor"/></g></defs></svg>'
  document.body.append(library)
  document.querySelector('[data-art="depot"]').innerHTML = `${scene('carrier-scene', 'Entregador rural com hortaliças e o novo caminhão da Conexa.', 'A rede começa com pessoas.')}<span class="dock"></span>`
  document.querySelector('[data-art="farm"]').innerHTML = `${scene('farm-scene', 'Agricultora com hortaliças na fazenda, na animação fornecida.', 'Cultivar. Reunir. Compartilhar.')}<span class="dock"></span>`
  document.querySelector('[data-art="market"]').innerHTML = `${scene('market-scene', 'Feirante junto à banca de alimentos, na animação fornecida.', 'Do campo para novos encontros.')}<span class="dock"></span>`
  document.querySelector('[data-art="flower"]').innerHTML = animationMarkup('flower')
  document.querySelector('#truck-rig').innerHTML = `<div id="truck-facing" class="truck-facing"><div class="truck-state truck-empty">${animationMarkup('truck-empty', { align: 'xMidYMax meet' })}</div><div class="truck-state truck-loaded" hidden>${animationMarkup('truck-loaded', { align: 'xMidYMax meet' })}</div></div>`
  const portraits = { farmer: 'farmer-icon', buyer: 'buyer-icon', driver: 'carrier-icon' }
  document.querySelectorAll('[data-portrait]').forEach(el => { el.innerHTML = animationMarkup(portraits[el.dataset.portrait]) })
  const stopAnimations = mountProvidedAnimations(document.querySelector('#conteudo'))
  return () => { stopAnimations(); library.remove() }
}
