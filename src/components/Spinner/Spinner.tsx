import styles from './Spinner.module.scss'

interface SpinnerProps {
  small?: boolean
}

export function Spinner({ small }: SpinnerProps) {
  return (
    <div className={`${styles.spinner} ${small ? styles.spinnerSmall : ''}`}>
      <div className={styles.spinner__circle} />
    </div>
  )
}
