/**
 * Servicio de traducción para datos de FakeStore API.
 * Las traducciones viven en archivos JSON separados (src/i18n/es/),
 * similar al enfoque de ngx-translate en Angular.
 */
import categoriesDict from '@/i18n/es/categories.json'
import productsDict from '@/i18n/es/products.json'

const categories = categoriesDict as Record<string, string>
const products = productsDict as Record<string, { title: string; description: string }>

export function translateCategory(key: string): string {
  return categories[key] ?? key
}

export function translateProduct(
  id: number,
  fallback: { title: string; description: string },
): { title: string; description: string } {
  return products[String(id)] ?? fallback
}
