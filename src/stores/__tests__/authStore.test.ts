import { useAuthStore } from '../authStore'
import type { User } from '@/types'

const mockUser: User = {
  id: 1,
  email: 'demo@fakestore.com',
  username: 'demo',
  name: 'Carlos Rodríguez',
  phone: '+54 11 4567-8901',
  address: 'Av. Corrientes 1234, CABA, Buenos Aires',
}

function resetStore() {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
}

describe('authStore', () => {
  beforeEach(resetStore)

  it('starts unauthenticated', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('sets auth correctly', () => {
    useAuthStore.getState().setAuth(mockUser, 'fake-jwt-1')
    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe('fake-jwt-1')
    expect(state.isAuthenticated).toBe(true)
  })

  it('logs out correctly', () => {
    useAuthStore.getState().setAuth(mockUser, 'fake-jwt-1')
    useAuthStore.getState().logout()
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })
})
