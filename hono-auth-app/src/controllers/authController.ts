import { Context } from 'hono'
import { User } from '../models/user'
import { hashPassword, comparePassword } from '../utils/hash'
import { signJwt } from '../utils/jwt'

const users = new Map<string, User>()

export async function register(c: Context) {
  const { username, password } = await c.req.json()
  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400)
  }
  if (users.has(username)) {
    return c.json({ error: 'User already exists' }, 409)
  }
  const passwordHash = await hashPassword(password)
  users.set(username, { username, passwordHash })
  return c.json({ message: 'User registered successfully' })
}

export async function login(c: Context) {
  const { username, password } = await c.req.json()
  const user = users.get(username)
  if (!user) {
    return c.json({ error: 'Invalid username or password' }, 401)
  }
  const validPassword = await comparePassword(password, user.passwordHash)
  if (!validPassword) {
    return c.json({ error: 'Invalid username or password' }, 401)
  }
  const token = signJwt({ username })
  return c.json({ token })
}

export function profile(c: Context) {
  const payload = c.get('jwtPayload') as { username: string }
  return c.json({ message: `Welcome ${payload.username}` })
}

export function logout(c: Context) {
  // No server-side token invalidation in this simple example
  return c.json({ message: 'Logged out successfully' })
}
