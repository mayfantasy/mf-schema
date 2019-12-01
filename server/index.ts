require('dotenv').config()

import Koa from 'koa'

// import * as bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import koaBody from 'koa-body'
import { HttpError } from '../types/error.type'
import next from 'next'
import {
  createUserRoute,
  getUserListRoute,
  deleteUserRoute
} from './routes/user.route'
import { createRoleRoute, getRoleListRoute } from './routes/role.route'
import 'reflect-metadata'
import { dbConnection } from './db'
import {
  createProductRoute,
  getProductListRoute,
  deleteProductRoute,
  getProductByIdRoute,
  updateProductRoute,
  parseProductFileRoute,
  exportProductTemplateRoute
} from './routes/product.route'
import {
  uploadImageRoute,
  getImageListRoute,
  deleteImageRoute
} from './routes/storage.route'
import {
  createWorkspaceRoute,
  getWorkspaceListRoute,
  updateWorkspaceRoute,
  getWorkspaceByIdRoute,
  deleteWorkspaceRoute
} from './routes/workspace.route'
import {
  createFeedTemplateRoute,
  getFeedTemplateListRoute,
  updateFeedTemplateRoute,
  getFeedTemplateByIdRoute,
  deleteFeedTemplateRoute,
  parseFeedTemplateFileRoute,
  fillFeedTemplateWithProductRoute
} from './routes/feed-template.route'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()
  dbConnection.sync()

  /** User */
  router.post('/api/user/create', createUserRoute)
  router.get('/api/user/list', getUserListRoute)
  router.delete('/api/user/:id', deleteUserRoute)

  /** Role */
  router.post('/api/role/create', createRoleRoute)
  router.get('/api/role/list', getRoleListRoute)

  /** Workspace */
  router.post('/api/workspace/create', createWorkspaceRoute)
  router.get('/api/workspace/list', getWorkspaceListRoute)
  router.put('/api/workspace/update/:id', updateWorkspaceRoute)
  router.get('/api/workspace/:id', getWorkspaceByIdRoute)
  router.delete('/api/workspace/:id', deleteWorkspaceRoute)

  /** Feed Template */
  router.post('/api/feed-template/create', createFeedTemplateRoute)
  router.get(
    '/api/feed-template/list/:workspaceId/:countryId',
    getFeedTemplateListRoute
  )
  router.put('/api/feed-template/update/:id', updateFeedTemplateRoute)
  router.get('/api/feed-template/:id', getFeedTemplateByIdRoute)
  router.delete('/api/feed-template/:id', deleteFeedTemplateRoute)
  router.post(
    '/api/feed-template/import/:workspaceId/:countryId',
    parseFeedTemplateFileRoute
  )
  router.post('/api/feed-template/fill', fillFeedTemplateWithProductRoute)

  /** Product */
  router.post('/api/product/create', createProductRoute)
  router.put('/api/product/update/:id', updateProductRoute)
  router.get('/api/product/list/:workspaceId/:countryId', getProductListRoute)
  router.get('/api/product/:id', getProductByIdRoute)
  router.delete('/api/product/:id', deleteProductRoute)
  router.post(
    '/api/product/import/:workspaceId/:countryId',
    parseProductFileRoute
  )
  router.post('/api/product/export/template', exportProductTemplateRoute)

  /**Storage */
  router.post('/api/storage/image/upload', uploadImageRoute)
  router.post('/api/storage/image/list', getImageListRoute)
  router.post('/api/storage/image/delete', deleteImageRoute)

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
