import { getCategories, getCategoryByName } from '../api/categories'

describe('categories service', () => {
  it('returns all categories', async () => {
    const categories = await getCategories()
    expect(categories.length).toBeGreaterThan(0)
    categories.forEach((cat) => {
      expect(cat).toHaveProperty('id')
      expect(cat).toHaveProperty('name')
      expect(cat).toHaveProperty('image')
    })
  })

  it('returns a category by name', async () => {
    const cat = await getCategoryByName('Gaming')
    expect(cat).not.toBeNull()
    expect(cat!.name).toBe('Gaming')
  })

  it('returns null for non-existent category', async () => {
    const cat = await getCategoryByName('Nonexistent Category')
    expect(cat).toBeNull()
  })
})
