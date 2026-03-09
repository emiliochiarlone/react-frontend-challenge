/**
 * Modal de vista rápida de producto.
 * Se abre sobre cualquier página (overlay), muestra imagen, precio,
 * selector de cantidad y botones de "agregar al carrito" y "ver detalle".
 * Cierra con Escape, click en overlay o botón X.
 */
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProductById } from '@/services/api'
import { useUIStore, useCartStore } from '@/stores'
import { StarRating } from '@/components/StarRating'
import { ShimmerImage } from '@/components/ShimmerImage'
import { Spinner } from '@/components/Spinner'
import { formatPrice } from '@/utils/format'
import styles from './QuickViewModal.module.scss'

export function QuickViewModal() {
  const { isQuickViewOpen, quickViewProductId, closeQuickView } = useUIStore()
  const addItem = useCartStore((s) => s.addItem)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', quickViewProductId],
    queryFn: () => getProductById(quickViewProductId!),
    enabled: isQuickViewOpen && quickViewProductId !== null,
  })

  useEffect(() => {
    if (isQuickViewOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isQuickViewOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeQuickView()
    }
    if (isQuickViewOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isQuickViewOpen, closeQuickView])

  if (!isQuickViewOpen) return null

  const hasDiscount = product?.discount && product.discount > 0
  const finalPrice = hasDiscount
    ? product!.price * (1 - product!.discount! / 100)
    : (product?.price ?? 0)

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeQuickView()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.modal__close} onClick={closeQuickView}>
          ✕
        </button>

        {isLoading || !product ? (
          <Spinner />
        ) : (
          <div className={styles.modal__content}>
            <div className={styles.modal__image}>
              <ShimmerImage src={product.image} alt={product.title} />
            </div>

            <div className={styles.modal__info}>
              <span className={styles.modal__category}>{product.category}</span>
              <h2 className={styles.modal__title}>{product.title}</h2>
              <StarRating rate={product.rating.rate} count={product.rating.count} />
              <p className={styles.modal__description}>{product.description}</p>

              <div className={styles.modal__price}>
                <span className={styles.modal__priceCurrent}>{formatPrice(finalPrice)}</span>
                {hasDiscount && (
                  <span className={styles.modal__priceOriginal}>{formatPrice(product.price)}</span>
                )}
              </div>

              <div className={styles.modal__actions}>
                <button
                  className={styles.modal__addBtn}
                  onClick={() => {
                    addItem(product)
                    closeQuickView()
                  }}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Sin stock' : '🛒 Agregar'}
                </button>
                <Link
                  to={`/product/${product.id}`}
                  className={styles.modal__detailBtn}
                  onClick={closeQuickView}
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
