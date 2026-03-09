import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '@/services/api'
import { useAuthStore } from '@/stores'
import styles from './LoginPage.module.scss'

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login({ email, password })
      setAuth(response.user, response.token)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.login}>
      <div className={styles.login__logo}>
        <h1>
          Fake<span>Store</span>
        </h1>
        <p>Iniciá sesión para continuar</p>
      </div>

      <form className={styles.login__form} onSubmit={handleSubmit}>
        <div className={styles.login__field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className={styles.login__field}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && <div className={styles.login__error}>{error}</div>}

        <button type="submit" className={styles.login__submitBtn} disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <div className={styles.login__hint}>
        <strong>Credenciales de prueba</strong>
        Email: <code>demo@fakestore.com</code>
        <br />
        Contraseña: <code>demo1234</code>
      </div>

      <Link to="/" className={styles.login__backLink}>
        ← Volver a la tienda
      </Link>
    </div>
  )
}
