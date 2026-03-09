import styles from './StarRating.module.scss'

interface StarRatingProps {
  rate: number
  count?: number
  showValue?: boolean
}

export function StarRating({ rate, count, showValue = true }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = rate >= i + 1
    const half = !filled && rate >= i + 0.5
    return (
      <span
        key={i}
        className={`${styles.stars__star} ${filled ? styles['stars__star--filled'] : ''} ${half ? styles['stars__star--half'] : ''}`}
      >
        {filled ? '★' : half ? '★' : '☆'}
      </span>
    )
  })

  return (
    <span className={styles.stars}>
      {stars}
      {showValue && <span className={styles.stars__value}>{rate.toFixed(1)}</span>}
      {count !== undefined && <span className={styles.stars__count}>({count})</span>}
    </span>
  )
}
