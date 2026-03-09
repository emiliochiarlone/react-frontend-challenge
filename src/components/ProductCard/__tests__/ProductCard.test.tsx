import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProductCard } from '../ProductCard'
import type { Product } from '@/types'

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 100,
  description: 'A test product',
  category: 'Gaming',
  image: 'https://example.com/img.jpg',
  rating: { rate: 4.5, count: 10 },
  stock: 20,
  discount: null,
}

const defaultProps = {
  product: mockProduct,
  finalPrice: 100,
  hasDiscount: false,
  isLowStock: false,
  isOutOfStock: false,
  onAddToCart: vi.fn(),
  onQuickView: vi.fn(),
}

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <ProductCard {...defaultProps} {...props} />
    </MemoryRouter>,
  )
}

describe('ProductCard', () => {
  it('renders product title', () => {
    renderCard()
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('renders product category', () => {
    renderCard()
    expect(screen.getByText('Gaming')).toBeInTheDocument()
  })

  it('renders add to cart button', () => {
    renderCard()
    expect(screen.getByText('🛒 Agregar')).toBeInTheDocument()
  })

  it('calls onAddToCart when button clicked', () => {
    const onAddToCart = vi.fn()
    renderCard({ onAddToCart })
    fireEvent.click(screen.getByText('🛒 Agregar'))
    expect(onAddToCart).toHaveBeenCalledTimes(1)
  })

  it('calls onQuickView when quick view button clicked', () => {
    const onQuickView = vi.fn()
    renderCard({ onQuickView })
    fireEvent.click(screen.getByText('👁 Vista rápida'))
    expect(onQuickView).toHaveBeenCalledTimes(1)
  })

  it('shows discount badge when hasDiscount is true', () => {
    renderCard({
      hasDiscount: true,
      product: { ...mockProduct, discount: 15 },
      finalPrice: 85,
    })
    expect(screen.getByText('-15%')).toBeInTheDocument()
  })

  it('shows out of stock state', () => {
    renderCard({ isOutOfStock: true, product: { ...mockProduct, stock: 0 } })
    const btns = screen.getAllByText('Sin stock')
    expect(btns.length).toBeGreaterThanOrEqual(1)
    const addBtn = btns.find((el) => el.closest('button'))
    expect(addBtn?.closest('button')).toBeDisabled()
  })

  it('shows low stock badge when isLowStock is true', () => {
    renderCard({ isLowStock: true })
    expect(screen.getByText('Últimas unidades')).toBeInTheDocument()
  })

  it('links to product detail page', () => {
    renderCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/product/1')
  })
})
