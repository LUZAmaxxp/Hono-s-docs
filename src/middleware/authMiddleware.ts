import { jwt } from 'hono/jwt'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const authMiddleware = jwt({
  secret: JWT_SECRET,
  alg: 'HS256',
})
