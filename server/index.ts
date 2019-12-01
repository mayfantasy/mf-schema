require('dotenv').config()

import Koa from 'koa'

// import * as bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import koaBody from 'koa-body'
import { HttpError } from '../types/error.type'
import next from 'next'
import 'reflect-metadata'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  /** Workspace */
  // router.post('/api/workspace/create', createWorkspaceRoute)
  // router.get('/api/workspace/list', getWorkspaceListRoute)
  // router.put('/api/workspace/update/:id', updateWorkspaceRoute)
  // router.get('/api/workspace/:id', getWorkspaceByIdRoute)
  // router.delete('/api/workspace/:id', deleteWorkspaceRoute)

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
