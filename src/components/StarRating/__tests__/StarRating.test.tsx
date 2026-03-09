import { render, screen } from '@testing-library/react'
import { StarRating } from '../StarRating'

describe('StarRating', () => {
  it('renders 5 stars', () => {
    const { container } = render(<StarRating rate={3} />)
    const stars = container.querySelectorAll('[class*="stars__star"]')
    expect(stars).toHaveLength(5)
  })

  it('shows rating value by default', () => {
    render(<StarRating rate={4.5} />)
    expect(screen.getByText('4.5')).toBeInTheDocument()
  })

  it('hides rating value when showValue is false', () => {
    render(<StarRating rate={4.5} showValue={false} />)
    expect(screen.queryByText('4.5')).not.toBeInTheDocument()
  })

  it('shows count when provided', () => {
    render(<StarRating rate={3} count={42} />)
    expect(screen.getByText('(42)')).toBeInTheDocument()
  })
})
