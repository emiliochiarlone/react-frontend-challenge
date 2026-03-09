import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/services/api'
import { useCartStore, useAuthStore, useUIStore } from '@/stores'
import { SearchSuggestions } from './SearchSuggestions'
import styles from './Header.module.scss'

export function Header() {
  const totalItems = useCartStore((s) => s.getTotalItems())
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const { searchQuery, setSearchQuery, isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useUIStore()
  const navigate = useNavigate()

  const [catOpen, setCatOpen] = useState(false)
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const catRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  // Cerrar dropdowns al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setSuggestionsOpen(false)
    if (value.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(value.trim())}`)
      closeMobileMenu()
    }
  }

  const handleSuggestionSelect = useCallback(() => {
    setSuggestionsOpen(false)
    setSearchQuery('')
    closeMobileMenu()
  }, [setSearchQuery, closeMobileMenu])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch((e.target as HTMLInputElement).value)
    }
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.header__container}>
          <Link to="/" className={styles.header__logo} onClick={closeMobileMenu}>
            Fake<span>Store</span>
          </Link>

          <div className={styles.header__search} ref={searchRef}>
            <span className={styles.header__searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSuggestionsOpen(true)
              }}
              onFocus={() => setSuggestionsOpen(true)}
              onKeyDown={handleKeyDown}
            />
            <SearchSuggestions
              query={searchQuery}
              onSelect={handleSuggestionSelect}
              onSearch={handleSearch}
              visible={suggestionsOpen}
            />
          </div>

          <nav className={styles.header__nav}>
            {/* Categorías dropdown */}
            <div className={styles.header__dropdown} ref={catRef}>
              <button
                className={`${styles.header__link} ${catOpen ? styles['header__link--active'] : ''}`}
                onClick={() => setCatOpen((v) => !v)}
              >
                📂 <span className={styles.header__linkText}>Categorías</span>
                <span className={styles.header__caret}>{catOpen ? '▲' : '▼'}</span>
              </button>
              {catOpen && (
                <div className={styles.header__dropdownMenu}>
                  <Link
                    to="/catalog"
                    className={styles.header__dropdownItem}
                    onClick={() => setCatOpen(false)}
                  >
                    Ver todas
                  </Link>
                  {categories?.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/catalog?category=${encodeURIComponent(cat.name)}`}
                      className={styles.header__dropdownItem}
                      onClick={() => setCatOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink
              to="/catalog"
              className={({ isActive }) =>
                `${styles.header__link} ${isActive ? styles['header__link--active'] : ''}`
              }
              onClick={closeMobileMenu}
            >
              🏪 <span className={styles.header__linkText}>Catálogo</span>
            </NavLink>

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `${styles.header__link} ${isActive ? styles['header__link--active'] : ''}`
              }
              onClick={closeMobileMenu}
            >
              🛒
              {totalItems > 0 && <span className={styles.header__cartBadge}>{totalItems}</span>}
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `${styles.header__link} ${isActive ? styles['header__link--active'] : ''}`
                  }
                  onClick={closeMobileMenu}
                >
                  👤 <span className={styles.header__linkText}>Perfil</span>
                </NavLink>
                <button
                  className={styles.header__link}
                  onClick={() => {
                    logout()
                    closeMobileMenu()
                    navigate('/')
                  }}
                >
                  🚪 <span className={styles.header__linkText}>Salir</span>
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${styles.header__link} ${isActive ? styles['header__link--active'] : ''}`
                }
                onClick={closeMobileMenu}
              >
                🔑 <span className={styles.header__linkText}>Ingresar</span>
              </NavLink>
            )}

            <button className={styles.header__hamburger} onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </nav>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenu__search}>
            <span className={styles.mobileMenu__searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Categorías en mobile */}
          <div className={styles.mobileMenu__section}>
            <span className={styles.mobileMenu__sectionTitle}>📂 Categorías</span>
            <Link to="/catalog" className={styles.mobileMenu__subLink} onClick={closeMobileMenu}>
              Ver todas
            </Link>
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalog?category=${encodeURIComponent(cat.name)}`}
                className={styles.mobileMenu__subLink}
                onClick={closeMobileMenu}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <NavLink to="/catalog" className={styles.mobileMenu__link} onClick={closeMobileMenu}>
            🏪 Catálogo
          </NavLink>
          <NavLink to="/cart" className={styles.mobileMenu__link} onClick={closeMobileMenu}>
            🛒 Carrito {totalItems > 0 && `(${totalItems})`}
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className={styles.mobileMenu__link} onClick={closeMobileMenu}>
                👤 Mi Perfil
              </NavLink>
              <button
                className={styles.mobileMenu__link}
                onClick={() => {
                  logout()
                  closeMobileMenu()
                  navigate('/')
                }}
              >
                🚪 Cerrar Sesión
              </button>
            </>
          ) : (
            <NavLink to="/login" className={styles.mobileMenu__link} onClick={closeMobileMenu}>
              🔑 Ingresar
            </NavLink>
          )}
        </div>
      )}
    </>
  )
}
