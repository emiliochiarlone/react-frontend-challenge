import { render } from '@testing-library/react'
import { Spinner } from '../Spinner'

describe('Spinner', () => {
  it('renders the spinner', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies small class when small prop is true', () => {
    const { container } = render(<Spinner small />)
    expect(container.innerHTML).toContain('spinnerSmall')
  })

  it('does not apply small class by default', () => {
    const { container } = render(<Spinner />)
    expect(container.innerHTML).not.toContain('spinnerSmall')
  })
})
