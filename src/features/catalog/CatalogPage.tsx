import { useState, useCallback, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getProducts, getCategories } from '@/services/api'
import type { GetProductsParams } from '@/services/api'
import { ProductCardContainer } from '@/components/ProductCard'
import { Spinner } from '@/components/Spinner'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { formatPrice } from '@/utils/format'
import styles from './CatalogPage.module.scss'

const PRICE_MIN = 0
const PRICE_MAX = 1100

type SortOption = GetProductsParams['sortBy']

/**
 * Sincroniza un parámetro con la URL.
 * Si el valor es vacío/falsy, lo elimina del query string.
 */
function setParam(params: URLSearchParams, key: string, value: string | boolean) {
  const str = String(value)
  if (!value || str === '' || str === 'false') {
    params.delete(key)
  } else {
    params.set(key, str)
  }
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // ── Leer estado inicial desde la URL ──
  const categoryParam = searchParams.get('category') || ''
  const searchParam = searchParams.get('search') || ''
  const sortParam = (searchParams.get('sortBy') as SortOption) || undefined
  const dealsParam = searchParams.get('deals') === 'true'
  const minPriceParam = Number(searchParams.get('minPrice') || PRICE_MIN)
  const maxPriceParam = Number(searchParams.get('maxPrice') || PRICE_MAX)

  const [activeCategory, setActiveCategory] = useState(categoryParam)
  const [sortBy, setSortBy] = useState<SortOption>(sortParam)
  const [dealsOnly, setDealsOnly] = useState(dealsParam)
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Math.max(PRICE_MIN, minPriceParam),
    Math.min(PRICE_MAX, maxPriceParam),
  ])
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const [debouncedMin, setDebouncedMin] = useState(priceRange[0])
  const [debouncedMax, setDebouncedMax] = useState(priceRange[1])

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const next: [number, number] = [...priceRange]
    next[index] = value
    if (index === 0 && value > priceRange[1]) next[1] = value
    if (index === 1 && value < priceRange[0]) next[0] = value
    setPriceRange(next)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedMin(next[0])
      setDebouncedMax(next[1])
      // Sincronizar precio en URL
      const params = new URLSearchParams(searchParams)
      setParam(params, 'minPrice', next[0] > PRICE_MIN ? String(next[0]) : '')
      setParam(params, 'maxPrice', next[1] < PRICE_MAX ? String(next[1]) : '')
      setSearchParams(params, { replace: true })
    }, 300)
  }

  const leftPercent = ((priceRange[0] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  const rightPercent = ((priceRange[1] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const minPrice = debouncedMin > PRICE_MIN ? String(debouncedMin) : ''
  const maxPrice = debouncedMax < PRICE_MAX ? String(debouncedMax) : ''

  const queryKey = useMemo(
    () => [
      'products',
      'catalog',
      activeCategory,
      searchParam,
      sortBy,
      minPrice,
      maxPrice,
      dealsOnly,
    ],
    [activeCategory, searchParam, sortBy, minPrice, maxPrice, dealsOnly],
  )

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      getProducts({
        category: activeCategory || undefined,
        search: searchParam || undefined,
        sortBy,
        page: pageParam,
        limit: 12,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        dealsOnly: dealsOnly || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  })

  const allProducts = data?.pages.flatMap((page) => page.products) ?? []
  const total = data?.pages[0]?.total ?? 0

  const handleCategoryChange = useCallback(
    (cat: string) => {
      setActiveCategory(cat)
      const params = new URLSearchParams(searchParams)
      setParam(params, 'category', cat)
      setSearchParams(params)
    },
    [searchParams, setSearchParams],
  )

  const handleSortChange = useCallback(
    (value: string) => {
      const sort = (value || undefined) as SortOption
      setSortBy(sort)
      const params = new URLSearchParams(searchParams)
      setParam(params, 'sortBy', value)
      setSearchParams(params)
    },
    [searchParams, setSearchParams],
  )

  const handleDealsToggle = useCallback(() => {
    const next = !dealsOnly
    setDealsOnly(next)
    const params = new URLSearchParams(searchParams)
    setParam(params, 'deals', next)
    setSearchParams(params)
  }, [dealsOnly, searchParams, setSearchParams])

  /** Compartir búsqueda actual usando Web Share API (con fallback a portapapeles) */
  const handleShare = useCallback(async () => {
    const url = window.location.href
    const title = 'Catálogo — FakeStore'
    const text = 'Mirá estos productos en FakeStore'

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // El usuario canceló el diálogo
      }
    } else {
      await navigator.clipboard.writeText(url)
      alert('¡Enlace copiado al portapapeles!')
    }
  }, [])

  const sentinelRef = useInfiniteScroll(
    () => fetchNextPage(),
    Boolean(hasNextPage && !isFetchingNextPage),
  )

  return (
    <div className={styles.catalog}>
      <div className={styles.catalog__header}>
        <div className={styles.catalog__headerTop}>
          <div>
            <h1>
              {searchParam
                ? `Resultados para "${searchParam}"`
                : activeCategory
                  ? `Categoría: ${activeCategory}`
                  : dealsOnly
                    ? '🔥 Ofertas'
                    : 'Catálogo'}
            </h1>
            <p>
              {total} producto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            className={styles.catalog__shareBtn}
            onClick={handleShare}
            aria-label="Compartir búsqueda"
            title="Compartir búsqueda"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Compartir
          </button>
        </div>
      </div>

      {/* Filtros de categoría */}
      <div className={styles.catalog__filters}>
        <button
          className={`${styles.catalog__filterBtn} ${!activeCategory ? styles['catalog__filterBtn--active'] : ''}`}
          onClick={() => handleCategoryChange('')}
        >
          Todos
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.catalog__filterBtn} ${activeCategory === cat.name ? styles['catalog__filterBtn--active'] : ''}`}
            onClick={() => handleCategoryChange(cat.name)}
          >
            {cat.name}
          </button>
        ))}
        <button
          className={`${styles.catalog__filterBtn} ${styles.catalog__dealsBtn} ${dealsOnly ? styles['catalog__filterBtn--active'] : ''}`}
          onClick={handleDealsToggle}
        >
          🔥 Ofertas
        </button>
      </div>

      {/* Controles: precio + ordenamiento */}
      <div className={styles.catalog__controls}>
        <div className={styles.catalog__priceFilter}>
          <span className={styles.catalog__priceLabel}>Precio</span>
          <span className={styles.catalog__priceValues}>
            {formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}
          </span>
          <div className={styles.catalog__rangeWrap}>
            <div
              className={styles.catalog__rangeTrackFill}
              style={{ left: `${leftPercent}%`, width: `${rightPercent - leftPercent}%` }}
            />
            <input
              type="range"
              className={styles.catalog__rangeInput}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={5}
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, Number(e.target.value))}
              aria-label="Precio mínimo"
            />
            <input
              type="range"
              className={styles.catalog__rangeInput}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={5}
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, Number(e.target.value))}
              aria-label="Precio máximo"
            />
          </div>
        </div>

        <div className={styles.catalog__sort}>
          <label htmlFor="sort">Ordenar por:</label>
          <select id="sort" value={sortBy ?? ''} onChange={(e) => handleSortChange(e.target.value)}>
            <option value="">Relevancia</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="rating">Mejor puntuación</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <Spinner />
      ) : allProducts.length === 0 ? (
        <div className={styles.catalog__empty}>
          <h3>😕 No encontramos productos</h3>
          <p>Probá con otra categoría o término de búsqueda.</p>
        </div>
      ) : (
        <div className={styles.catalog__grid}>
          {allProducts.map((product) => (
            <ProductCardContainer key={product.id} product={product} />
          ))}

          {/* Sentinel para infinite scroll */}
          <div ref={sentinelRef} className={styles.catalog__sentinel}>
            {isFetchingNextPage && <Spinner small />}
          </div>

          {!hasNextPage && allProducts.length > 0 && (
            <div className={styles.catalog__end}>Has visto todos los productos 🎉</div>
          )}
        </div>
      )}
    </div>
  )
}
