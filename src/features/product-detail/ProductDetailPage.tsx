/**
 * Página de detalle de producto.
 * Muestra imagen ampliada, info, selector de cantidad, tabs de descripción
 * y reviews, y un slider de productos relacionados.
 */
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProductById, getRelatedProducts, getReviewsByProduct } from '@/services/api'
import { useCartStore } from '@/stores'
import { ProductSlider } from '@/components/ProductSlider'
import { StarRating } from '@/components/StarRating'
import { Badge } from '@/components/Badge'
import { ShimmerImage } from '@/components/ShimmerImage'
import { Spinner } from '@/components/Spinner'
import { formatPrice } from '@/utils/format'
import styles from './ProductDetailPage.module.scss'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)

  const productId = Number(id)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
    enabled: !isNaN(productId),
  })

  const { data: reviews } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => getReviewsByProduct(productId),
    enabled: !!product,
  })

  const { data: related } = useQuery({
    queryKey: ['related', productId],
    queryFn: () => getRelatedProducts(productId),
    enabled: !!product,
  })

  if (isLoading) return <Spinner />

  if (!product) {
    return (
      <div className={styles.detail}>
        <div className={styles.detail__notFound}>
          <h2>😕 Producto no encontrado</h2>
          <Link to="/catalog" className={styles.detail__homeBtn}>
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  const hasDiscount = product.discount && product.discount > 0
  const finalPrice = hasDiscount ? product.price * (1 - product.discount! / 100) : product.price
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  const handleAddToCart = () => {
    addItem(product, quantity)
    navigate('/cart')
  }

  return (
    <div className={styles.detail}>
      <button className={styles.detail__back} onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className={styles.detail__main}>
        {/* Imagen */}
        <div className={styles.detail__image}>
          <ShimmerImage src={product.image} alt={product.title} />
        </div>

        {/* Info */}
        <div className={styles.detail__info}>
          <span className={styles.detail__category}>{product.category}</span>
          <h1 className={styles.detail__title}>{product.title}</h1>

          <div className={styles.detail__rating}>
            <StarRating rate={product.rating.rate} count={product.rating.count} />
          </div>

          <div className={styles.detail__price}>
            <span className={styles.detail__priceCurrent}>{formatPrice(finalPrice)}</span>
            {hasDiscount && (
              <>
                <span className={styles.detail__priceOriginal}>{formatPrice(product.price)}</span>
                <span className={styles.detail__priceDiscount}>-{product.discount}% OFF</span>
              </>
            )}
          </div>

          <p className={styles.detail__description}>{product.description}</p>

          <div className={styles.detail__stock}>
            {isOutOfStock ? (
              <Badge variant="out">Sin stock</Badge>
            ) : isLowStock ? (
              <Badge variant="low-stock">¡Solo quedan {product.stock} unidades!</Badge>
            ) : (
              <Badge variant="stock">{product.stock} disponibles</Badge>
            )}
          </div>

          {!isOutOfStock && (
            <div className={styles.detail__actions}>
              <div className={styles.detail__quantity}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <button className={styles.detail__addBtn} onClick={handleAddToCart}>
                🛒 Agregar al carrito
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className={styles.detail__reviews}>
        <h2>Opiniones ({reviews?.length ?? 0})</h2>
        {reviews && reviews.length > 0 ? (
          <div className={styles.detail__reviewList}>
            {reviews.map((review) => (
              <article key={review.id} className={styles.detail__review}>
                <div className={styles.detail__reviewHeader}>
                  <span className={styles.detail__reviewAuthor}>{review.userName}</span>
                  <span className={styles.detail__reviewDate}>{review.date}</span>
                </div>
                <StarRating rate={review.rating} showValue={false} />
                <p className={styles.detail__reviewComment}>{review.comment}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className={styles.detail__noReviews}>Este producto aún no tiene opiniones.</p>
        )}
      </section>

      {/* Related — Slider */}
      {related && related.length > 0 && (
        <section className={styles.detail__related}>
          <ProductSlider products={related} title="Productos relacionados" />
        </section>
      )}
    </div>
  )
}
