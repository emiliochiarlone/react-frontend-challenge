import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { HomePage } from '@/features/home'
import { CatalogPage } from '@/features/catalog'
import { ProductDetailPage } from '@/features/product-detail'
import { CartPage } from '@/features/cart'
import { LoginPage } from '@/features/auth'
import { ProfilePage } from '@/features/auth'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [{ path: 'login', element: <LoginPage /> }],
  },
])
