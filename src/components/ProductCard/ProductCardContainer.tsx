import type { Product } from '@/types'
import { useCartStore, useUIStore } from '@/stores'
import { ProductCard } from './ProductCard'

/**
 * Container (smart) component — lógica de negocio.
 * Consume stores y pasa datos computados al presentational.
 */

interface ProductCardContainerProps {
  product: Product
}

export function ProductCardContainer({ product }: ProductCardContainerProps) {
  const addItem = useCartStore((s) => s.addItem)
  const openQuickView = useUIStore((s) => s.openQuickView)

  const hasDiscount = Boolean(product.discount && product.discount > 0)
  const finalPrice = hasDiscount ? product.price * (1 - product.discount! / 100) : product.price
  const isLowStock = product.stock > 0 && product.stock <= 5
  const isOutOfStock = product.stock === 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isOutOfStock) addItem(product)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openQuickView(product.id)
  }

  return (
    <ProductCard
      product={product}
      finalPrice={finalPrice}
      hasDiscount={hasDiscount}
      isLowStock={isLowStock}
      isOutOfStock={isOutOfStock}
      onAddToCart={handleAddToCart}
      onQuickView={handleQuickView}
    />
  )
}
