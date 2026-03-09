/**
 * Dropdown de sugerencias de búsqueda.
 * Muestra hasta 6 resultados con miniatura y precio (debounce 500ms, mín 2 chars).
 * Soporta navegación con teclado (↑/↓/Enter/Escape).
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { searchProducts } from '@/services/api'
import { ShimmerImage } from '@/components/ShimmerImage'
import { formatPrice } from '@/utils/format'
import styles from './Header.module.scss'

function useDebouncedValue(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

interface SearchSuggestionsProps {
  query: string
  onSelect: (productId: number) => void
  onSearch: (value: string) => void
  visible: boolean
}

export function SearchSuggestions({ query, onSelect, onSearch, visible }: SearchSuggestionsProps) {
  const trimmedQuery = query.trim()
  const debouncedQuery = useDebouncedValue(trimmedQuery, 500)
  // Track activeIndex together with the query it belongs to, so it auto-resets
  // when debouncedQuery changes without needing an effect or ref in render.
  const [activeState, setActiveState] = useState({ query: '', index: -1 })
  const activeIndex = activeState.query === debouncedQuery ? activeState.index : -1
  const setActiveIndex = useCallback(
    (updater: number | ((prev: number) => number)) => {
      setActiveState((prev) => {
        const newIndex =
          typeof updater === 'function'
            ? updater(prev.query === debouncedQuery ? prev.index : -1)
            : updater
        return { query: debouncedQuery, index: newIndex }
      })
    },
    [debouncedQuery],
  )
  const navigate = useNavigate()
  const listRef = useRef<HTMLDivElement>(null)

  const { data: suggestions = [] } = useQuery({
    queryKey: ['search-suggestions', debouncedQuery],
    queryFn: () => searchProducts(debouncedQuery, 6),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60_000,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!visible || suggestions.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1))
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault()
        const product = suggestions[activeIndex]
        onSelect(product.id)
        navigate(`/product/${product.id}`)
      } else if (e.key === 'Escape') {
        setActiveIndex(-1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [visible, suggestions, activeIndex, onSelect, navigate, setActiveIndex])

  // Scroll al elemento activo
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement | undefined
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  if (!visible || debouncedQuery.length < 2 || suggestions.length === 0) return null

  return (
    <div className={styles.suggestions} ref={listRef} role="listbox">
      {suggestions.map((product, index) => (
        <button
          key={product.id}
          role="option"
          aria-selected={index === activeIndex}
          className={`${styles.suggestions__item} ${index === activeIndex ? styles['suggestions__item--active'] : ''}`}
          onMouseEnter={() => setActiveIndex(index)}
          onClick={() => {
            onSelect(product.id)
            navigate(`/product/${product.id}`)
          }}
        >
          <ShimmerImage
            src={product.image}
            alt=""
            className={styles.suggestions__img}
            loading="lazy"
          />
          <div className={styles.suggestions__info}>
            <span className={styles.suggestions__title}>{product.title}</span>
            <span className={styles.suggestions__price}>
              {product.discount ? (
                <>
                  <span className={styles.suggestions__priceOld}>{formatPrice(product.price)}</span>
                  {formatPrice(product.price * (1 - product.discount / 100))}
                </>
              ) : (
                formatPrice(product.price)
              )}
            </span>
          </div>
        </button>
      ))}
      <button className={styles.suggestions__viewAll} onClick={() => onSearch(debouncedQuery)}>
        Ver todos los resultados para "{debouncedQuery}"
      </button>
    </div>
  )
}
