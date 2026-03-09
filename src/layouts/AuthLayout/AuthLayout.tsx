import { Outlet } from 'react-router-dom'
import styles from './AuthLayout.module.scss'

export function AuthLayout() {
  return (
    <div className={styles.authLayout}>
      <Outlet />
    </div>
  )
}
