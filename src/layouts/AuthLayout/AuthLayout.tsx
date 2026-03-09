/**
 * Layout minimalista para las páginas de autenticación (login).
 * Fondo con gradiente y card centrada con logo.
 */
import { Outlet } from 'react-router-dom'
import styles from './AuthLayout.module.scss'

export function AuthLayout() {
  return (
    <div className={styles.authLayout}>
      <Outlet />
    </div>
  )
}
