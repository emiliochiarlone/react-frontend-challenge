import styles from './Badge.module.scss'

type BadgeVariant = 'discount' | 'stock' | 'low-stock' | 'out'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
}

export function Badge({ variant, children }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[`badge--${variant}`]}`}>{children}</span>
}
