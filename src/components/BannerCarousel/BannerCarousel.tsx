import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ShimmerImage } from '@/components/ShimmerImage'
import styles from './BannerCarousel.module.scss'

interface Banner {
  id: number
  image: string
  title: string
  subtitle: string
  cta: string
  link: string
  gradient: string
}

const banners: Banner[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1400&h=500&fit=crop',
    title: '🔥 Hot Sale',
    subtitle: 'Hasta 30% OFF en tecnología, gaming y más',
    cta: 'Ver ofertas',
    link: '/catalog?sortBy=price-asc',
    gradient: 'linear-gradient(135deg, rgba(26, 35, 126, 0.85), rgba(83, 75, 174, 0.7))',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1400&h=500&fit=crop',
    title: '🎮 Gaming Week',
    subtitle: 'Las mejores consolas, periféricos y accesorios',
    cta: 'Explorar gaming',
    link: '/catalog?category=Gaming',
    gradient: 'linear-gradient(135deg, rgba(0, 0, 81, 0.85), rgba(26, 35, 126, 0.7))',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&h=500&fit=crop',
    title: '🚚 Envío Gratis',
    subtitle: 'En compras superiores a $50.000 a todo el país',
    cta: 'Comprar ahora',
    link: '/catalog',
    gradient: 'linear-gradient(135deg, rgba(46, 125, 50, 0.85), rgba(56, 142, 60, 0.7))',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1400&h=500&fit=crop',
    title: '📱 Nuevos Lanzamientos',
    subtitle: 'Smartphones y tablets de última generación',
    cta: 'Ver novedades',
    link: '/catalog?category=Smartphones+y+Celulares',
    gradient: 'linear-gradient(135deg, rgba(21, 101, 192, 0.85), rgba(25, 118, 210, 0.7))',
  },
]

const AUTOPLAY_INTERVAL = 5000

export function BannerCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, AUTOPLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [paused, next])

  return (
    <section
      className={styles.carousel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Banner de ofertas"
    >
      <div
        className={styles.carousel__track}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className={styles.carousel__slide}>
            <ShimmerImage
              src={banner.image}
              alt={banner.title}
              className={styles.carousel__image}
              loading={banner.id === 1 ? 'eager' : 'lazy'}
            />
            <div className={styles.carousel__overlay} style={{ background: banner.gradient }} />
            <div className={styles.carousel__content}>
              <h2 className={styles.carousel__title}>{banner.title}</h2>
              <p className={styles.carousel__subtitle}>{banner.subtitle}</p>
              <Link to={banner.link} className={styles.carousel__cta}>
                {banner.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        className={`${styles.carousel__arrow} ${styles['carousel__arrow--prev']}`}
        onClick={prev}
        aria-label="Banner anterior"
      >
        ‹
      </button>
      <button
        className={`${styles.carousel__arrow} ${styles['carousel__arrow--next']}`}
        onClick={next}
        aria-label="Banner siguiente"
      >
        ›
      </button>

      {/* Dots */}
      <div className={styles.carousel__dots}>
        {banners.map((banner, i) => (
          <button
            key={banner.id}
            className={`${styles.carousel__dot} ${i === current ? styles['carousel__dot--active'] : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Ir al banner ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
