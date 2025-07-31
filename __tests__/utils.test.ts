import { hashPassword, comparePassword } from '../src/utils/hash'
import { signJwt, verifyJwt } from '../src/utils/jwt'

describe('Hash Utility', () => {
  const password = 'testpassword'

  it('should hash a password and verify it correctly', async () => {
    const hashed = await hashPassword(password)
    expect(typeof hashed).toBe('string')
    const isMatch = await comparePassword(password, hashed)
    expect(isMatch).toBe(true)
  })

  it('should fail verification for wrong password', async () => {
    const hashed = await hashPassword(password)
    const isMatch = await comparePassword('wrongpassword', hashed)
    expect(isMatch).toBe(false)
  })
})

describe('JWT Utility', () => {
  const payload = { username: 'testuser' }

  it('should sign and verify a JWT token', () => {
    const token = signJwt(payload)
    expect(typeof token).toBe('string')
    const verified = verifyJwt(token)
    expect(verified).toMatchObject(payload)
  })

  it('should return null for invalid token', () => {
    const verified = verifyJwt('invalidtoken')
    expect(verified).toBeNull()
  })
})
