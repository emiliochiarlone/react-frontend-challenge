import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import styles from './ProfilePage.module.scss'

export function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className={styles.profile}>
      <div className={styles.profile__header}>
        <h1>Mi Perfil</h1>
        <p>Información de tu cuenta</p>
      </div>

      <div className={styles.profile__card}>
        <div className={styles.profile__avatar}>{user.name.charAt(0)}</div>

        <div className={styles.profile__fields}>
          <div className={styles.profile__field}>
            <label>Nombre completo</label>
            <span>{user.name}</span>
          </div>
          <div className={styles.profile__field}>
            <label>Email</label>
            <span>{user.email}</span>
          </div>
          <div className={styles.profile__field}>
            <label>Usuario</label>
            <span>{user.username}</span>
          </div>
          <div className={styles.profile__field}>
            <label>Teléfono</label>
            <span>{user.phone}</span>
          </div>
          <div className={styles.profile__field}>
            <label>Dirección</label>
            <span>{user.address}</span>
          </div>
        </div>

        <div className={styles.profile__actions}>
          <button className={styles.profile__logoutBtn} onClick={handleLogout}>
            🚪 Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
