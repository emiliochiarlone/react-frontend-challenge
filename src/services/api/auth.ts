/**
 * Servicio de autenticación mock.
 * Simula login/perfil con un usuario demo hardcodeado.
 * Credenciales: demo@fakestore.com / demo1234
 */
import type { AuthResponse, LoginCredentials, User } from '@/types'

const demoUser: User = {
  id: 1,
  email: 'demo@fakestore.com',
  username: 'demo_user',
  name: 'Usuario Demo',
  phone: '+54 11 1234-5678',
  address: 'Av. Corrientes 1234, CABA, Argentina',
}

/** Simula login — acepta demo@fakestore.com / demo1234 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (credentials.email === 'demo@fakestore.com' && credentials.password === 'demo1234') {
    return {
      user: demoUser,
      token: `fake-jwt-${demoUser.id}-${Date.now()}`,
    }
  }

  throw new Error('Email o contraseña incorrectos')
}

export async function getProfile(token: string): Promise<User> {
  const parts = token.split('-')
  const userId = Number(parts[2])

  if (userId !== demoUser.id) {
    throw new Error('Token inválido')
  }

  return demoUser
}
