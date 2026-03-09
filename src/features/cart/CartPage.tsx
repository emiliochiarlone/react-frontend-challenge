import { Link } from 'react-router-dom'
import { useCartStore } from '@/stores'
import { ShimmerImage } from '@/components/ShimmerImage'
import { formatPrice } from '@/utils/format'
import styles from './CartPage.module.scss'

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className={styles.cart}>
        <div className={styles.cart__empty}>
          <h2>🛒 Tu carrito está vacío</h2>
          <p>Agregá productos desde el catálogo para empezar a comprar.</p>
          <Link to="/catalog" className={styles.cart__emptyBtn}>
            Explorar catálogo
          </Link>
        </div>
      </div>
    )
  }

  const totalPrice = getTotalPrice()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className={styles.cart}>
      <div className={styles.cart__header}>
        <h1>Carrito ({totalItems})</h1>
        <button className={styles.cart__clearBtn} onClick={clearCart}>
          🗑 Vaciar carrito
        </button>
      </div>

      <div className={styles.cart__layout}>
        {/* Items */}
        <div className={styles.cart__items}>
          {items.map(({ product, quantity }) => {
            const hasDiscount = product.discount && product.discount > 0
            const unitPrice = hasDiscount
              ? product.price * (1 - product.discount! / 100)
              : product.price
            const subtotal = unitPrice * quantity

            return (
              <div key={product.id} className={styles.cart__item}>
                <Link to={`/product/${product.id}`} className={styles.cart__itemImage}>
                  <ShimmerImage src={product.image} alt={product.title} />
                </Link>

                <div className={styles.cart__itemInfo}>
                  <span className={styles.cart__itemInfoCategory}>{product.category}</span>
                  <h3>
                    <Link to={`/product/${product.id}`}>{product.title}</Link>
                  </h3>
                  <div className={styles.cart__itemPrice}>
                    <span className={styles.cart__itemPriceCurrent}>{formatPrice(unitPrice)}</span>
                    {hasDiscount && (
                      <span className={styles.cart__itemPriceOriginal}>
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.cart__itemActions}>
                  <div className={styles.cart__itemQuantity}>
                    <button onClick={() => updateQuantity(product.id, quantity - 1)}>−</button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={styles.cart__itemRemove}
                    onClick={() => removeItem(product.id)}
                  >
                    Eliminar
                  </button>
                  <span className={styles.cart__itemSubtotal}>{formatPrice(subtotal)}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Resumen */}
        <aside className={styles.cart__summary}>
          <h2 className={styles.cart__summaryTitle}>Resumen de compra</h2>

          <div className={styles.cart__summaryRow}>
            <span>Productos ({totalItems})</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className={styles.cart__summaryRow}>
            <span>Envío</span>
            <span style={{ color: '#2e7d32', fontWeight: 600 }}>Gratis</span>
          </div>
          <div className={`${styles.cart__summaryRow} ${styles['cart__summaryRow--total']}`}>
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          <button className={styles.cart__checkoutBtn}>Finalizar compra</button>

          <Link to="/catalog" className={styles.cart__continueShopping}>
            ← Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  )
}
