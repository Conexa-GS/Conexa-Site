/* Supplied artwork stays intact; viewports animate its original cargo and wheels. */
const asset = name => `/assets/illustrations/${name}.webp`

function driverIllustration(label) {
  // Split the head at its neckline. The small sky patch sits behind the joint,
  // so the original face can look around without leaving a duplicate behind.
  const head = 'M673 88C666 59 685 26 734 21C758 13 779 23 801 36C823 32 845 45 838 61Q830 80 810 87Q820 118 817 146Q819 188 784 208L788 242H720V205Q690 199 683 171Q674 160 683 140Q677 126 684 122Z'
  return `<svg class="scene-image" viewBox="0 0 1536 1024" role="img" aria-label="${label}"><defs><clipPath id="reference-driver-head"><path d="${head}"/></clipPath><mask id="reference-driver-body"><rect width="1536" height="1024" fill="white"/><path d="${head}" fill="black"/></mask></defs><svg y="120" width="1536" height="904" viewBox="0 120 1536 904" overflow="hidden"><path d="${head}" fill="#bce4f0"/></svg><image href="${asset('driver-farm')}" width="1536" height="1024" mask="url(#reference-driver-body)"/><g class="reference-driver-head"><image href="${asset('driver-farm')}" width="1536" height="1024" clip-path="url(#reference-driver-head)"/></g></svg>`
}

function scene(name, label, eager = false) {
  const illustration = eager ? driverIllustration(label) : `<img class="scene-image" src="${asset(name)}" alt="${label}" width="1100" height="740" loading="lazy" decoding="async">`
  return `<div class="reference-scene scene-${name}"><div class="scene-depth">${illustration}</div><span class="scene-marker" aria-hidden="true"><i></i>${name === 'driver-farm' ? 'A rede começa com pessoas.' : name === 'farm' ? 'Cultivar. Reunir. Compartilhar.' : 'Do campo para novos encontros.'}</span></div>`
}
function truckWheel(x, y, radius) {
  return `<g transform="translate(${x} ${y})"><defs><clipPath id="reference-wheel-${x}"><circle r="${radius}"/></clipPath></defs><g clip-path="url(#reference-wheel-${x})"><g class="truck-wheel"><image href="${asset('truck-empty')}" x="${-x}" y="${-y}" width="1774" height="887"/><circle r="38" fill="none" stroke="#b3a8b7" stroke-width="5" stroke-dasharray="3 36"/></g></g></g>`
}
export function mountArtwork() {
  const library = document.createElement('div')
  library.className = 'art-library'
  library.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"><defs><g id="leaf-mark"><path d="M-13 8Q-25-16-1-24Q17-7 3 10Q19-17 35-9Q36 16 7 20L-4 29Z" fill="currentColor"/></g></defs></svg>`
  document.body.append(library)
  document.querySelector('[data-art="depot"]').innerHTML = `${scene('driver-farm', 'Motorista de boné azul e colete laranja, com um caminhão creme e verde na paisagem rural.', true)}<span class="dock"></span>`
  document.querySelector('[data-art="farm"]').innerHTML = `${scene('farm', 'Agricultora de chapéu amarelo e macacão azul com uma caixa de hortaliças na fazenda.')}<svg class="reference-windmill" viewBox="-70 -70 140 140" aria-hidden="true"><g class="windmill-rotor"><image href="${asset('farm')}" x="-1050" y="-340" width="1525" height="1031"/></g></svg><span class="dock"></span><span class="cargo-source"></span>`
  document.querySelector('[data-art="market"]').innerHTML = `${scene('market', 'Vendedor de avental verde junto à banca de alimentos e toldo laranja da feira.')}<span class="dock"></span><span class="cargo-destination"></span><span class="delivery-check" aria-hidden="true"><svg viewBox="0 0 28 28"><path d="m7 14 5 5 9-10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`
  document.querySelector('#truck-rig').innerHTML = `<svg class="truck-svg" viewBox="0 0 320 200" aria-hidden="true"><g transform="translate(160 170)"><ellipse id="truck-shadow" cx="0" cy="-7" rx="125" ry="7" fill="#6d6353" opacity=".15"/><g id="truck-facing"><g id="truck-suspension"><svg x="-160" y="-160" width="320" height="160" viewBox="0 0 1774 887" overflow="visible"><g id="truck-cargo" opacity="0" transform="translate(-80 -54)"><image href="${asset('truck-loaded')}" width="1774" height="887" style="clip-path:polygon(13% 54%,13% 35%,19% 30%,19% 10%,58% 5%,58% 54%)"/></g><image href="${asset('truck-empty')}" width="1774" height="887" style="clip-path:polygon(10% 46%,55% 46%,55% 7%,92% 7%,93% 84%,79% 84%,79% 95%,60% 95%,60% 84%,35% 84%,35% 95%,19% 95%,19% 80%,12% 80%,12% 68%,10% 68%)"/>${truckWheel(457, 716, 109)}${truckWheel(1218, 716, 111)}</svg><g id="speed-strokes" fill="none" stroke="#a8b581" stroke-width="2" stroke-linecap="round" opacity="0"><path d="M-159-60h-19M-165-43h-29M-157-27h-12"/></g></g></g></g></svg>`
  document.querySelector('#flying-cargo').innerHTML = `<svg viewBox="0 0 290 330" aria-hidden="true"><image href="${asset('truck-loaded')}" x="-335" y="-115" width="1774" height="887" style="clip-path:polygon(19% 50%,19% 32%,20% 26%,20% 18%,32% 18%,34% 32%,34% 50%)"/></svg>`
  const portraits = { farmer: 'farmer', buyer: 'buyer', driver: 'carrier' }
  document.querySelectorAll('[data-portrait]').forEach(el => {
    const name = portraits[el.dataset.portrait]
    el.innerHTML = `<img src="${asset(`${name}-rest`)}" alt="" loading="lazy" decoding="async"><img class="portrait-greeting" src="${asset(`${name}-talk`)}" alt="" loading="lazy" decoding="async">`
  })
  return () => library.remove()
}
