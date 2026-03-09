import { login, getProfile } from '../api/auth'

describe('auth service', () => {
  describe('login', () => {
    it('returns user and token for valid credentials', async () => {
      const result = await login({ email: 'demo@fakestore.com', password: 'demo1234' })
      expect(result.user).toBeDefined()
      expect(result.user.email).toBe('demo@fakestore.com')
      expect(result.token).toContain('fake-jwt-')
    })

    it('throws for invalid credentials', async () => {
      await expect(login({ email: 'wrong@email.com', password: 'wrong' })).rejects.toThrow(
        'Email o contraseña incorrectos',
      )
    })
  })

  describe('getProfile', () => {
    it('returns user for valid token', async () => {
      const user = await getProfile('fake-jwt-1-123456')
      expect(user.id).toBe(1)
      expect(user.email).toBe('demo@fakestore.com')
    })

    it('throws for invalid token', async () => {
      await expect(getProfile('fake-jwt-999-123')).rejects.toThrow('Token inválido')
    })
  })
})
