import { render, screen } from '@testing-library/react'
import { Badge } from '../Badge'

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge variant="discount">-20%</Badge>)
    expect(screen.getByText('-20%')).toBeInTheDocument()
  })

  it('applies discount variant class', () => {
    const { container } = render(<Badge variant="discount">Sale</Badge>)
    expect(container.innerHTML).toContain('badge--discount')
  })

  it('applies out variant class', () => {
    const { container } = render(<Badge variant="out">Sin stock</Badge>)
    expect(container.innerHTML).toContain('badge--out')
  })
})
