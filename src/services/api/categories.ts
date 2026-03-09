/**
 * Servicio de categorías — consume FakeStore API.
 * Cachea las categorías en memoria tras la primera consulta.
 * Las traduce al español y les asigna imágenes representativas.
 */
import type { Category } from '@/types'
import { translateCategory } from './translations'

/** Imágenes representativas para cada categoría de FakeStore API */
const categoryImages: Record<string, string> = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
  jewelery: 'https://images.unsplash.com/photo-1515562141589-67f0d569b610?w=400&h=300&fit=crop',
  "men's clothing":
    'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=300&fit=crop',
  "women's clothing":
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
}

let categoriesCache: Category[] | null = null

export async function getCategories(): Promise<Category[]> {
  if (categoriesCache) return categoriesCache

  const res = await fetch('https://fakestoreapi.com/products/categories')
  if (!res.ok) throw new Error('Error al obtener categorías')

  const names: string[] = await res.json()
  categoriesCache = names.map((name) => ({
    id: name.replace(/[^a-z]/g, '-'),
    name: translateCategory(name),
    image:
      categoryImages[name] ||
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop',
  }))

  return categoriesCache
}

export async function getCategoryByName(name: string): Promise<Category | null> {
  const categories = await getCategories()
  return categories.find((c) => c.name === name) ?? null
}
