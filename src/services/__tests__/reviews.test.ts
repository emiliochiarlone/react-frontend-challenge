import { getReviewsByProduct } from '../api/reviews'

describe('reviews service', () => {
  it('returns reviews for a product', async () => {
    const reviews = await getReviewsByProduct(1)
    reviews.forEach((r) => {
      expect(r.productId).toBe(1)
      expect(r).toHaveProperty('id')
      expect(r).toHaveProperty('userName')
      expect(r).toHaveProperty('rating')
      expect(r).toHaveProperty('comment')
    })
  })

  it('returns empty array for product with no reviews', async () => {
    const reviews = await getReviewsByProduct(99999)
    expect(reviews).toEqual([])
  })
})
