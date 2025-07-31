import request from 'supertest'
import app from '../src/app'
import { createServer } from 'http'
import { AddressInfo } from 'net'

describe('Auth API Endpoints', () => {
  let server: ReturnType<typeof createServer>
  let baseUrl: string

  beforeAll((done) => {
    server = createServer((req, res) => {
      app.fetch(req).then(response => {
        res.writeHead(response.status, Object.fromEntries(response.headers))
        const reader = response.body?.getReader()
        if (!reader) {
          res.end()
          return
        }
        const stream = new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close()
                  return
                }
                controller.enqueue(value)
                push()
              })
            }
            push()
          }
        })
        const streamReader = stream.getReader()
        const encoder = new TextEncoder()
        function read() {
          streamReader.read().then(({ done, value }) => {
            if (done) {
              res.end()
              return
            }
            res.write(Buffer.from(value))
            read()
          })
        }
        read()
      }).catch(err => {
        res.statusCode = 500
        res.end('Internal Server Error')
      })
    })
    server.listen(0, () => {
      const address = server.address() as AddressInfo
      baseUrl = `http://localhost:${address.port}`
      done()
    })
  })

  afterAll((done) => {
    server.close(done)
  })

  const testUser = {
    username: 'testuser',
    password: 'testpass',
  }

  it('should register a new user', async () => {
    const res = await request(baseUrl)
      .post('/register')
      .send(testUser)
      .set('Accept', 'application/json')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message', 'User registered successfully')
  })

  it('should not register an existing user', async () => {
    const res = await request(baseUrl)
      .post('/register')
      .send(testUser)
      .set('Accept', 'application/json')
    expect(res.statusCode).toEqual(409)
    expect(res.body).toHaveProperty('error', 'User already exists')
  })

  it('should login with valid credentials', async () => {
    const res = await request(baseUrl)
      .post('/login')
      .send(testUser)
      .set('Accept', 'application/json')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('token')
  })

  it('should not login with invalid credentials', async () => {
    const res = await request(baseUrl)
      .post('/login')
      .send({ username: 'testuser', password: 'wrongpass' })
      .set('Accept', 'application/json')
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('error', 'Invalid username or password')
  })

  it('should access protected profile route with valid token', async () => {
    const loginRes = await request(baseUrl)
      .post('/login')
      .send(testUser)
      .set('Accept', 'application/json')
    const token = loginRes.body.token

    const profileRes = await request(baseUrl)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`)
    expect(profileRes.statusCode).toEqual(200)
    expect(profileRes.body).toHaveProperty('message', expect.stringContaining(testUser.username))
  })

  it('should not access protected profile route without token', async () => {
    const res = await request(baseUrl).get('/profile')
    expect(res.statusCode).toEqual(401)
  })

  it('should logout successfully', async () => {
    const res = await request(baseUrl).post('/logout')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message', 'Logged out successfully')
  })
})
