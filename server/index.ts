require('dotenv').config()

import Koa from 'koa'

// import * as bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import koaBody from 'koa-body'
import { HttpError } from '../types/error.type'
import next from 'next'
import 'reflect-metadata'
import { createAccountRoute } from './routes/account.route'
import { loginRoute, loginWithTokenRoute } from './routes/auth.route'
import {
  createCollectionRoute,
  getCollectionListRoute
} from './routes/collection.route'
import {
  createSchemaRoute,
  getSchemaListRoute,
  getSchemaByIdRoute
} from './routes/schema.route'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  // Auth
  router.post('/api/auth/login', loginRoute)
  router.post('/api/auth/token', loginWithTokenRoute)

  // Create account
  router.post('/api/account/create', createAccountRoute)

  // Collection
  router.post('/api/collection/create', createCollectionRoute)
  router.get('/api/collection/list', getCollectionListRoute)

  // Schema
  router.post('/api/schema/create', createSchemaRoute)
  router.get('/api/schema/list', getSchemaListRoute)
  // router.put('/api/schema/update', updateSchemaRoute)
  router.get('/api/schema/:id', getSchemaByIdRoute)

  // SSR Pages
  router.get('*', async (ctx) => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    try {
      ctx.res.statusCode = 200
      await next()
    } catch (e) {
      ctx.body = {
        message: e.message
      }

      if (e instanceof HttpError) {
        ctx.status = e.status
      } else {
        ctx.status = 500
      }
    }
  })

  server
    .use(
      koaBody({
        multipart: true,
        formLimit: 100 * 1024 * 1024,
        jsonLimit: '10mb',
        formidable: {
          maxFileSize: 100 * 1024 * 1024
        }
      })
    )
    .use(router.routes())
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
