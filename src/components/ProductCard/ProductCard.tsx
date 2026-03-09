import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { Badge } from '@/components/Badge'
import { ShimmerImage } from '@/components/ShimmerImage'
import { StarRating } from '@/components/StarRating'
import { formatPrice } from '@/utils/format'
import styles from './ProductCard.module.scss'

/**
 * Presentational (dumb) component — solo UI, cero lógica de negocio.
 * Recibe callbacks via props desde el container.
 */

interface ProductCardProps {
  product: Product
  finalPrice: number
  hasDiscount: boolean
  isLowStock: boolean
  isOutOfStock: boolean
  onAddToCart: (e: React.MouseEvent) => void
  onQuickView: (e: React.MouseEvent) => void
}

export function ProductCard({
  product,
  finalPrice,
  hasDiscount,
  isLowStock,
  isOutOfStock,
  onAddToCart,
  onQuickView,
}: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} className={styles.card}>
      <div className={styles.card__imageWrap}>
        <ShimmerImage src={product.image} alt={product.title} loading="lazy" />
        <div className={styles.card__badges}>
          {hasDiscount && <Badge variant="discount">-{product.discount}%</Badge>}
          {isLowStock && <Badge variant="low-stock">Últimas unidades</Badge>}
          {isOutOfStock && <Badge variant="out">Sin stock</Badge>}
        </div>
        <button className={styles.card__quickView} onClick={onQuickView}>
          👁 Vista rápida
        </button>
      </div>

      <div className={styles.card__body}>
        <span className={styles.card__category}>{product.category}</span>
        <h3 className={styles.card__title}>{product.title}</h3>
        <StarRating rate={product.rating.rate} count={product.rating.count} showValue={false} />
        <div className={styles.card__price}>
          <span className={styles.card__priceCurrent}>{formatPrice(finalPrice)}</span>
          {hasDiscount && (
            <span className={styles.card__priceOriginal}>{formatPrice(product.price)}</span>
          )}
        </div>
      </div>

      <div className={styles.card__footer}>
        <button className={styles.card__addBtn} onClick={onAddToCart} disabled={isOutOfStock}>
          {isOutOfStock ? 'Sin stock' : '🛒 Agregar'}
        </button>
      </div>
    </Link>
  )
}
