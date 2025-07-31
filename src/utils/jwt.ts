import jwtLib from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function signJwt(payload: object): string {
  return jwtLib.sign(payload, JWT_SECRET, { algorithm: 'HS256' })
}

export function verifyJwt(token: string): object | null {
  try {
    return jwtLib.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as object
  } catch {
    return null
  }
}
