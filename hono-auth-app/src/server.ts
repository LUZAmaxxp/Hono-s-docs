import http from 'http'
import { Request as UndiciRequest, Response as UndiciResponse, Headers as UndiciHeaders } from 'undici'
import app from './app'

const port = 3000

const server = http.createServer(async (req, res) => {
  try {
    const url = `http://${req.headers.host}${req.url}`
    const headers = new UndiciHeaders()
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          for (const v of value) {
            headers.append(key, v)
          }
        } else {
          headers.append(key, value)
        }
      }
    }
    const request = new UndiciRequest(url, {
      method: req.method,
      headers,
      body: req.method === 'GET' || req.method === 'HEAD' ? null : req,
      duplex: 'half',
    })

    const response: UndiciResponse = await app.fetch(request)

    res.writeHead(response.status, Object.fromEntries(response.headers))
    if (response.body) {
      const reader = response.body.getReader()
      async function pump() {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            res.end()
            break
          }
          res.write(Buffer.from(value))
        }
      }
      pump()
    } else {
      res.end()
    }
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    res.end('Internal Server Error')
  }
})

server.listen(port, () => {
  console.log(`Hono app listening on http://localhost:${port}`)
})
