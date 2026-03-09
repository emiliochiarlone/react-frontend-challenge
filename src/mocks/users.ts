import type { User } from '@/types'

export const mockUsers: User[] = [
  {
    id: 1,
    email: 'demo@fakestore.com',
    username: 'demo',
    name: 'Carlos Rodríguez',
    phone: '+54 11 4567-8901',
    address: 'Av. Corrientes 1234, CABA, Buenos Aires',
  },
  {
    id: 2,
    email: 'admin@fakestore.com',
    username: 'admin',
    name: 'María López',
    phone: '+54 11 9876-5432',
    address: 'Av. Santa Fe 5678, CABA, Buenos Aires',
  },
]

/** Credenciales válidas para login mock */
export const validCredentials = [
  { email: 'demo@fakestore.com', password: 'demo1234' },
  { email: 'admin@fakestore.com', password: 'admin1234' },
]
