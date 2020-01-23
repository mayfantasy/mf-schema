require('dotenv').config()

import Koa from 'koa'
const cors = require('@koa/cors')

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
  getCollectionListRoute,
  getCollectionByIdRoute
} from './routes/collection.route'
import {
  createSchemaRoute,
  getSchemaListRoute,
  getSchemaByIdRoute,
  updateSchemaRoute,
  getSchemaByHandleRoute
} from './routes/schema.route'
import {
  createObjectRoute,
  getObjectListRoute,
  updateObjectByIdRoute,
  getObjectByIdRoute,
  deleteObjectByIdRoute
} from './routes/object.route'
import {
  uploadImageRoute,
  getImageListRoute,
  deleteImageRoute
} from './routes/storage.route'
import {
  getAccessKeyListRoute,
  deleteAccessKeyRoute,
  createAccessKeyRoute
} from './routes/access-key.route'
import {
  createUserRoute,
  getUserListRoute,
  updateUserRoute,
  deleteUserRoute,
  getUserByIdRoute,
  updateUserMetaRoute,
  deleteUserMetaItemRoute
} from './routes/user.route'
import {
  loginUserRoute,
  loginUserWithTokenRoute,
  resetUserPasswordByCurrentPasswordRoute,
  resetUserEmailRoute,
  sendRecoverEmailRoute,
  resetPasswordRoute
} from './routes/user-auth.route'
import { sendEmailRoute } from './routes/email.route'

const port = parseInt(process.env.PORT || '3001', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  server.use(cors())

  // Auth
  router.post('/api/auth/login', loginRoute)
  router.post('/api/auth/token', loginWithTokenRoute)

  // Access Key
  router.post('/api/access-key/create', createAccessKeyRoute)
  router.get('/api/access-key/list', getAccessKeyListRoute)
  router.delete('/api/access-key/delete/:id', deleteAccessKeyRoute)

  // Create account
  router.post('/api/account/create', createAccountRoute)

  // Collection
  router.post('/api/collection/create', createCollectionRoute)
  router.get('/api/collection/list', getCollectionListRoute)
  router.get('/api/collection/get/:id', getCollectionByIdRoute)

  // Schema
  router.post('/api/schema/create', createSchemaRoute)
  router.get('/api/schema/list', getSchemaListRoute)
  router.put('/api/schema/update', updateSchemaRoute)
  router.get('/api/schema/get/:id', getSchemaByIdRoute)
  router.get('/api/schema/get/handle/:handle', getSchemaByHandleRoute)

  // Storage
  router.post('/api/upload/image', uploadImageRoute)
  router.get('/api/list/image', getImageListRoute)
  router.post('/api/delete/image', deleteImageRoute)

  // Object
  router.post(
    '/api/object/:collection_handle/:schema_handle/create',
    createObjectRoute
  )
  router.get(
    '/api/object/:collection_handle/:schema_handle/list',
    getObjectListRoute
  )
  router.put(
    '/api/object/:collection_handle/:schema_handle/update/:id',
    updateObjectByIdRoute
  )
  router.get(
    '/api/object/:collection_handle/:schema_handle/get/:id',
    getObjectByIdRoute
  )
  router.delete(
    '/api/object/:collection_handle/:schema_handle/delete/:id',
    deleteObjectByIdRoute
  )

  // User
  router.post('/api/user/create', createUserRoute)
  router.get('/api/user/list', getUserListRoute)
  router.get('/api/user/get/:id', getUserByIdRoute)
  router.put('/api/user/update', updateUserRoute)
  router.delete('/api/user/:id', deleteUserRoute)
  // User Meta
  router.post('/api/user/meta/update/:id', updateUserMetaRoute)
  router.post('/api/user/meta/delete/:id', deleteUserMetaItemRoute)
  // User Auth
  router.post('/api/user/login', loginUserRoute)
  router.post('/api/user/token', loginUserWithTokenRoute)
  router.post(
    '/api/user/reset-password-by-current-password',
    resetUserPasswordByCurrentPasswordRoute
  )
  router.post('/api/user/reset-email', resetUserEmailRoute)
  router.post('/api/user/send-recover-email', sendRecoverEmailRoute)
  router.post('/api/user/reset-password', resetPasswordRoute)

  // Email
  router.post('/api/email/send', sendEmailRoute)

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
