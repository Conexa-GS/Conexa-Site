/* All illustration motion comes from the user's original GIF files. */
import { animationMarkup, mountProvidedAnimations } from './provided-animations'

const scene = (background, character, label, caption) => `<div class="reference-scene" role="img" aria-label="${label}"><img class="scene-image" src="/assets/home-scenes/${background}-background.png" alt="" aria-hidden="true"/><div class="scene-character">${animationMarkup(character)}</div><span class="scene-marker" aria-hidden="true"><i></i>${caption}</span></div>`

export function mountArtwork() {
  const library = document.createElement('div')
  library.className = 'art-library'
  library.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><defs><g id="leaf-mark"><path d="M-13 8Q-25-16-1-24Q17-7 3 10Q19-17 35-9Q36 16 7 20L-4 29Z" fill="currentColor"/></g></defs></svg>'
  document.body.append(library)
  document.querySelector('[data-art="depot"]').innerHTML = `${scene('carrier', 'home-carrier', 'Entregador sorridente diante do cenário de entrega rural.', 'A rede começa com pessoas.')}<span class="dock"></span>`
  document.querySelector('[data-art="farm"]').innerHTML = `${scene('farm', 'home-farmer', 'Agricultora com hortaliças diante da paisagem rural.', 'Cultivar. Reunir. Compartilhar.')}<span class="dock"></span>`
  document.querySelector('[data-art="market"]').innerHTML = `${scene('market', 'home-buyer', 'Vendedor gesticulando junto à barraca de frutas e legumes.', 'Do campo para novos encontros.')}<span class="dock"></span>`
  document.querySelector('[data-art="flower"]').innerHTML = animationMarkup('flower')
  document.querySelector('#truck-rig').innerHTML = `<div id="truck-facing" class="truck-facing"><div class="truck-state truck-empty">${animationMarkup('truck-empty', { align: 'xMidYMax meet' })}</div><div class="truck-state truck-loaded" hidden>${animationMarkup('truck-loaded', { align: 'xMidYMax meet' })}</div></div>`
  const portraits = { farmer: 'farmer-icon', buyer: 'buyer-icon', driver: 'carrier-icon' }
  document.querySelectorAll('[data-portrait]').forEach(el => { el.innerHTML = animationMarkup(portraits[el.dataset.portrait]) })
  const stopAnimations = mountProvidedAnimations(document.querySelector('#conteudo'))
  return () => { stopAnimations(); library.remove() }
}
