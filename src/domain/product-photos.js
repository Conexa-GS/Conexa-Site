const productPhotos = {
  alface: '/assets/products/alface.jpg',
  cenoura: '/assets/products/cenoura.jpg',
  tomate: '/assets/products/tomate.jpg',
}

export function defaultProductPhoto(product) {
  return productPhotos[String(product || '').trim().toLocaleLowerCase('pt-BR')] || null
}
