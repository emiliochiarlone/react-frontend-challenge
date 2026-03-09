import { formatPrice } from '../format'

describe('formatPrice', () => {
  it('formats a whole number', () => {
    const result = formatPrice(100)
    expect(result).toContain('100')
    expect(result).toContain('US$') // es-AR locale uses US$ prefix
  })

  it('formats decimal values', () => {
    const result = formatPrice(49.99)
    expect(result).toContain('49')
    expect(result).toContain('99')
  })

  it('formats zero', () => {
    const result = formatPrice(0)
    expect(result).toContain('0')
  })
})
