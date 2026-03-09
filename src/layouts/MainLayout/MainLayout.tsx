/**
 * Layout principal de la aplicación.
 * Envuelve las páginas con Header, Footer y el QuickViewModal.
 */
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { QuickViewModal } from '@/features/quick-view'
import styles from './MainLayout.module.scss'

export function MainLayout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.layout__main}>
        <Outlet />
      </main>
      <Footer />
      <QuickViewModal />
    </div>
  )
}
