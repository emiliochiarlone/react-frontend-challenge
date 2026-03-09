import { useRef, useState, useEffect, useCallback } from 'react'
import { ProductCardContainer } from '@/components/ProductCard'
import type { Product } from '@/types'
import styles from './ProductSlider.module.scss'

interface ProductSliderProps {
  products: Product[]
  title?: string
  headerRight?: React.ReactNode
}

export function ProductSlider({ products, title, headerRight }: ProductSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 1)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState, products])

  const scroll = (dir: 'left' | 'right') => {
    if (!trackRef.current) return
    const amount = trackRef.current.clientWidth * 0.8
    trackRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div className={styles.slider}>
      {(title || headerRight) && (
        <div className={styles.slider__header}>
          {title && <h2>{title}</h2>}
          <div className={styles.slider__controls}>
            {headerRight}
            <div className={styles.slider__nav}>
              <button
                onClick={() => scroll('left')}
                aria-label="Anterior"
                disabled={!canScrollLeft}
              >
                ‹
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Siguiente"
                disabled={!canScrollRight}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.slider__track} ref={trackRef}>
        {products.map((p) => (
          <div key={p.id} className={styles.slider__slide}>
            <ProductCardContainer product={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
