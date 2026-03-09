/**
 * Página de inicio — muestra banner carousel, categorías destacadas,
 * productos mejor puntuados y mejores descuentos.
 * Usa TanStack Query para paralelizar las 3 consultas.
 */
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProducts, getCategories } from '@/services/api'
import type { PaginatedProducts } from '@/services/api'
import { ProductSlider } from '@/components/ProductSlider'
import { BannerCarousel } from '@/components/BannerCarousel'
import { ShimmerImage } from '@/components/ShimmerImage'
import { Spinner } from '@/components/Spinner'
import type { Category } from '@/types'
import styles from './HomePage.module.scss'

export function HomePage() {
  const { data: categoriesData, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const { data: featuredData, isLoading: featLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => getProducts({ sortBy: 'rating', limit: 8 }),
  })

  const { data: dealsData, isLoading: dealsLoading } = useQuery({
    queryKey: ['products', 'deals'],
    queryFn: () => getProducts({ limit: 20 }),
    select: (data: PaginatedProducts) => ({
      ...data,
      products: data.products
        .filter((p) => p.discount && p.discount > 0)
        .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
        .slice(0, 4),
    }),
  })

  return (
    <div className={styles.home}>
      {/* Banner Carousel */}
      <section className={styles.home__carouselWrapper}>
        <BannerCarousel />
      </section>

      {/* Categorías */}
      <section className={styles.home__section}>
        <div className={styles.home__sectionHeader}>
          <h2>Categorías</h2>
          <Link to="/catalog">Ver todas →</Link>
        </div>
        {catLoading ? (
          <Spinner />
        ) : (
          <div className={styles.home__categories}>
            {categoriesData?.slice(0, 8).map((cat: Category) => (
              <Link
                key={cat.id}
                to={`/catalog?category=${cat.name}`}
                className={styles.home__categoryCard}
              >
                <ShimmerImage src={cat.image} alt={cat.name} loading="lazy" />
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className={styles.home__section}>
        <div className={styles.home__banner}>
          <h2>🔥 Ofertas de temporada</h2>
          <p>Hasta 20% de descuento en productos seleccionados</p>
          <Link to="/catalog?deals=true" className={styles.home__bannerBtn}>
            Ver ofertas
          </Link>
        </div>
      </section>

      {/* Destacados */}
      <section className={styles.home__section}>
        {featLoading ? (
          <Spinner />
        ) : featuredData ? (
          <ProductSlider
            products={featuredData.products}
            title="Productos destacados"
            headerRight={<Link to="/catalog?sortBy=rating">Ver más →</Link>}
          />
        ) : null}
      </section>

      {/* Ofertas */}
      {!dealsLoading && dealsData && dealsData.products.length > 0 && (
        <section className={styles.home__section}>
          <ProductSlider
            products={dealsData.products}
            title="Mejores descuentos"
            headerRight={<Link to="/catalog">Ver todos →</Link>}
          />
        </section>
      )}
    </div>
  )
}
