import { useCartStore } from '../cartStore'
import type { Product } from '@/types'

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 100,
  description: 'A test product',
  category: 'Electronics',
  image: 'https://example.com/img.jpg',
  rating: { rate: 4.5, count: 10 },
  stock: 20,
  discount: null,
}

const discountedProduct: Product = {
  ...mockProduct,
  id: 2,
  title: 'Discounted Product',
  price: 200,
  discount: 10,
}

function resetStore() {
  useCartStore.setState({ items: [] })
}

describe('cartStore', () => {
  beforeEach(resetStore)

  it('starts with empty cart', () => {
    expect(useCartStore.getState().items).toEqual([])
  })

  it('adds an item', () => {
    useCartStore.getState().addItem(mockProduct)
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].product.id).toBe(1)
    expect(items[0].quantity).toBe(1)
  })

  it('adds an item with custom quantity', () => {
    useCartStore.getState().addItem(mockProduct, 3)
    expect(useCartStore.getState().items[0].quantity).toBe(3)
  })

  it('increments quantity when adding existing item', () => {
    useCartStore.getState().addItem(mockProduct, 2)
    useCartStore.getState().addItem(mockProduct, 3)
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(5)
  })

  it('removes an item', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().addItem(discountedProduct)
    useCartStore.getState().removeItem(1)
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].product.id).toBe(2)
  })

  it('updates quantity', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().updateQuantity(1, 5)
    expect(useCartStore.getState().items[0].quantity).toBe(5)
  })

  it('removes item when updating quantity to 0', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().updateQuantity(1, 0)
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('clears the cart', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().addItem(discountedProduct)
    useCartStore.getState().clearCart()
    expect(useCartStore.getState().items).toEqual([])
  })

  it('calculates total items', () => {
    useCartStore.getState().addItem(mockProduct, 2)
    useCartStore.getState().addItem(discountedProduct, 3)
    expect(useCartStore.getState().getTotalItems()).toBe(5)
  })

  it('calculates total price without discount', () => {
    useCartStore.getState().addItem(mockProduct, 2) // 100 * 2 = 200
    expect(useCartStore.getState().getTotalPrice()).toBe(200)
  })

  it('calculates total price with discount', () => {
    useCartStore.getState().addItem(discountedProduct, 1) // 200 * 0.9 = 180
    expect(useCartStore.getState().getTotalPrice()).toBe(180)
  })

  it('calculates total price with mixed items', () => {
    useCartStore.getState().addItem(mockProduct, 1) // 100
    useCartStore.getState().addItem(discountedProduct, 2) // 180 * 2 = 360
    expect(useCartStore.getState().getTotalPrice()).toBe(460)
  })
})
