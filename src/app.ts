import { Hono } from 'hono'
import { authMiddleware } from './middleware/authMiddleware'
import { register, login, profile, logout } from './controllers/authController'

const app = new Hono()

app.post('/register', register)
app.post('/login', login)
app.get('/profile', authMiddleware, profile)
app.post('/logout', logout)

export default app
