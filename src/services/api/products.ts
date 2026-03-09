import type { Product } from '@/types'
import { translateProduct, translateCategory } from './translations'

export interface GetProductsParams {
  category?: string
  search?: string
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'name'
  page?: number
  limit?: number
  minPrice?: number
  maxPrice?: number
  dealsOnly?: boolean
}

export interface PaginatedProducts {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

interface FakeStoreProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: { rate: number; count: number }
}

/** Genera stock y descuento determinísticos por ID para simular datos faltantes */
function enrichProduct(raw: FakeStoreProduct): Product {
  const seed = raw.id
  const stock = ((seed * 17 + 3) % 50) + 1
  const discountChance = (seed * 13) % 5
  const discount = discountChance < 2 ? ((seed * 7) % 20) + 5 : null
  const { title, description } = translateProduct(raw.id, raw)

  return {
    ...raw,
    title,
    description,
    category: translateCategory(raw.category),
    stock,
    discount,
  }
}

let productsCache: Product[] | null = null

async function fetchAllProducts(): Promise<Product[]> {
  if (productsCache) return productsCache

  const res = await fetch('https://fakestoreapi.com/products')
  if (!res.ok) throw new Error('Error al obtener productos')

  const raw: FakeStoreProduct[] = await res.json()
  productsCache = raw.map(enrichProduct)
  return productsCache
}

export async function getProducts(params: GetProductsParams = {}): Promise<PaginatedProducts> {
  const allProducts = await fetchAllProducts()

  const { category, search, sortBy, page = 1, limit = 12, minPrice, maxPrice, dealsOnly } = params
  let filtered = [...allProducts]

  if (category) {
    filtered = filtered.filter((p) => p.category === category)
  }

  if (dealsOnly) {
    filtered = filtered.filter((p) => p.discount && p.discount > 0)
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    )
  }

  if (minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= minPrice)
  }

  if (maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= maxPrice)
  }

  if (sortBy) {
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating.rate - a.rating.rate)
        break
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }
  }

  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const products = filtered.slice(start, start + limit)

  return { products, total, page, totalPages }
}

/** Búsqueda liviana para sugerencias — reutiliza el cache en memoria */
export async function searchProducts(query: string, limit = 5): Promise<Product[]> {
  const allProducts = await fetchAllProducts()
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return allProducts
    .filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    .slice(0, limit)
}

export async function getProductById(id: number): Promise<Product | null> {
  const allProducts = await fetchAllProducts()
  return allProducts.find((p) => p.id === id) ?? null
}

export async function getRelatedProducts(productId: number, maxResults = 6): Promise<Product[]> {
  const allProducts = await fetchAllProducts()
  const product = allProducts.find((p) => p.id === productId)
  if (!product) return []

  const others = allProducts.filter((p) => p.id !== productId)
  const result: Product[] = []
  const usedIds = new Set<number>()

  // Tier 1: misma categoría, ordenados por rating
  const sameCategory = others
    .filter((p) => p.category === product.category)
    .sort((a, b) => b.rating.rate - a.rating.rate)

  for (const p of sameCategory) {
    if (result.length >= maxResults) break
    result.push(p)
    usedIds.add(p.id)
  }

  if (result.length >= maxResults) return result

  // Tier 2: palabras en común en el título
  const stopWords = new Set([
    'de',
    'con',
    'para',
    'y',
    'en',
    'el',
    'la',
    'los',
    'las',
    'un',
    'una',
    'the',
    'a',
    'an',
    'and',
    'of',
    'for',
    'in',
    'to',
    'with',
  ])
  const words = product.title
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))

  const scored = others
    .filter((p) => !usedIds.has(p.id))
    .map((p) => {
      const titleLower = p.title.toLowerCase()
      const matches = words.filter((w) => titleLower.includes(w)).length
      return { product: p, matches }
    })
    .filter((s) => s.matches > 0)
    .sort((a, b) => b.matches - a.matches)

  for (const s of scored) {
    if (result.length >= maxResults) break
    result.push(s.product)
    usedIds.add(s.product.id)
  }

  if (result.length >= maxResults) return result

  // Tier 3: aleatorios
  const remaining = others.filter((p) => !usedIds.has(p.id))
  const shuffled = remaining.sort(
    (a, b) => ((a.id * 7 + productId) % 97) - ((b.id * 7 + productId) % 97),
  )

  for (const p of shuffled) {
    if (result.length >= maxResults) break
    result.push(p)
  }

  return result
}
