import { getProducts, getProductById, getRelatedProducts } from '../api/products'

describe('products service', () => {
  describe('getProducts', () => {
    it('returns paginated products', async () => {
      const result = await getProducts({ limit: 5 })
      expect(result.products).toHaveLength(5)
      expect(result.page).toBe(1)
      expect(result.total).toBeGreaterThan(0)
      expect(result.totalPages).toBeGreaterThan(0)
    })

    it('filters by category', async () => {
      const result = await getProducts({ category: 'Gaming', limit: 100 })
      expect(result.products.length).toBeGreaterThan(0)
      result.products.forEach((p) => {
        expect(p.category).toBe('Gaming')
      })
    })

    it('filters by search term', async () => {
      const result = await getProducts({ search: 'wireless', limit: 100 })
      result.products.forEach((p) => {
        const combined = `${p.title} ${p.description}`.toLowerCase()
        expect(combined).toContain('wireless')
      })
    })

    it('sorts by price ascending', async () => {
      const result = await getProducts({ sortBy: 'price-asc', limit: 10 })
      for (let i = 1; i < result.products.length; i++) {
        expect(result.products[i].price).toBeGreaterThanOrEqual(result.products[i - 1].price)
      }
    })

    it('sorts by price descending', async () => {
      const result = await getProducts({ sortBy: 'price-desc', limit: 10 })
      for (let i = 1; i < result.products.length; i++) {
        expect(result.products[i].price).toBeLessThanOrEqual(result.products[i - 1].price)
      }
    })

    it('sorts by rating', async () => {
      const result = await getProducts({ sortBy: 'rating', limit: 10 })
      for (let i = 1; i < result.products.length; i++) {
        expect(result.products[i].rating.rate).toBeLessThanOrEqual(
          result.products[i - 1].rating.rate,
        )
      }
    })

    it('paginates correctly', async () => {
      const page1 = await getProducts({ page: 1, limit: 3 })
      const page2 = await getProducts({ page: 2, limit: 3 })
      expect(page1.products[0].id).not.toBe(page2.products[0].id)
      expect(page1.page).toBe(1)
      expect(page2.page).toBe(2)
    })
  })

  describe('getProductById', () => {
    it('returns a product by id', async () => {
      const product = await getProductById(1)
      expect(product).not.toBeNull()
      expect(product!.id).toBe(1)
    })

    it('returns null for non-existent id', async () => {
      const product = await getProductById(99999)
      expect(product).toBeNull()
    })
  })

  describe('getRelatedProducts', () => {
    it('returns up to 6 related products', async () => {
      const related = await getRelatedProducts(1)
      expect(related.length).toBeGreaterThan(0)
      expect(related.length).toBeLessThanOrEqual(6)
    })

    it('does not include the original product', async () => {
      const related = await getRelatedProducts(1)
      expect(related.find((p) => p.id === 1)).toBeUndefined()
    })

    it('prioritizes same category', async () => {
      const original = await getProductById(1)
      const related = await getRelatedProducts(1)
      // First results should be same category
      if (related.length > 0 && original) {
        expect(related[0].category).toBe(original.category)
      }
    })

    it('returns empty array for non-existent product', async () => {
      const related = await getRelatedProducts(99999)
      expect(related).toEqual([])
    })
  })
})
