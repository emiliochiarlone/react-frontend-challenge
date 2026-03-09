/** Formatea un número como precio en USD con formato argentino (ej: US$ 1.299,99) */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price)
}
