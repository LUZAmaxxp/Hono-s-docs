import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { Context } from 'hono'
import jwtLib from 'jsonwebtoken'

interface User {
  username: string
  password: string // In production, passwords should be hashed
}

const app = new Hono()

// In-memory user store
const users = new Map<string, User>()

// Secret key for JWT signing
const JWT_SECRET = 'your-secret-key'

// Middleware to protect routes
const authMiddleware = jwt({
  secret: JWT_SECRET,
  alg: 'HS256',
})

// Register route
app.post('/register', async (c) => {
  const { username, password } = await c.req.json()
  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400)
  }
  if (users.has(username)) {
    return c.json({ error: 'User already exists' }, 409)
  }
  users.set(username, { username, password })
  return c.json({ message: 'User registered successfully' })
})

// Login route
app.post('/login', async (c) => {
  const { username, password } = await c.req.json()
  const user = users.get(username)
  if (!user || user.password !== password) {
    return c.json({ error: 'Invalid username or password' }, 401)
  }
  const token = jwtLib.sign({ username }, JWT_SECRET, { algorithm: 'HS256' })
  return c.json({ token })
})

// Protected route example
app.get('/profile', authMiddleware, (c) => {
  const payload = c.get('jwtPayload') as { username: string }
  return c.json({ message: `Welcome ${payload.username}` })
})

// Logout route (for demonstration, client should discard token)
app.post('/logout', (c) => {
  // No server-side token invalidation in this simple example
  return c.json({ message: 'Logged out successfully' })
})

export default app
