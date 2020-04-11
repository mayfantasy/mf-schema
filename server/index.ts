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
  getCollectionByIdRoute,
  deleteCollectionByIdRoute,
  updateCollectionRoute
} from './routes/collection.route'
import {
  createSchemaRoute,
  getSchemaListRoute,
  getSchemaByIdRoute,
  updateSchemaRoute,
  getSchemaByHandleRoute,
  deleteSchemaByIdRoute
} from './routes/schema.route'
import {
  createObjectRoute,
  getObjectListRoute,
  updateObjectByIdRoute,
  getObjectByIdRoute,
  deleteObjectByIdRoute,
  parseObjectsFromXlsxRoute,
  updateOrCreateByHandleRoute
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
import {
  createShortcutRoute,
  getShortcutListRoute,
  deleteShortcutByIdRoute
} from './routes/shortcut.route'
import {
  createMemberRoute,
  getMemberListRoute,
  getMemberByIdRoute,
  updateMemberRoute,
  deleteMemberRoute
} from './routes/member.route'
import { allTiers as t, tierMap } from '../helpers/tier.helper'

const port = parseInt(process.env.PORT || '3001', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  server.use(cors())

  // Auth
  router.post('/api/auth/login', loginRoute(tierMap.LOGIN.tier))
  router.post(
    '/api/auth/token',
    loginWithTokenRoute(tierMap.LOGIN_WITH_TOKEN.tier)
  )

  // Access Key
  router.post(
    '/api/access-key/create',
    createAccessKeyRoute(tierMap.CREATE_ACCESS_KEY.tier)
  )

  router.get(
    '/api/access-key/list',
    getAccessKeyListRoute(tierMap.GET_ACCESS_KEY_LIST.tier)
  )
  router.delete(
    '/api/access-key/delete/:id',
    deleteAccessKeyRoute(tierMap.DELETE_ACCESS_KEY.tier)
  )

  // Create account
  router.post(
    '/api/account/create',
    createAccountRoute(tierMap.CREATE_ACCOUNT.tier)
  )

  // Collection
  router.post(
    '/api/collection/create',
    createCollectionRoute(tierMap.CREATE_COLLECTION.tier)
  )
  router.get(
    '/api/collection/list',
    getCollectionListRoute(tierMap.GET_COLLECTION_LIST.tier)
  )
  router.get(
    '/api/collection/get/:id',
    getCollectionByIdRoute(tierMap.GET_COLLECTION_BY_ID.tier)
  )
  router.put(
    '/api/collection/update',
    updateCollectionRoute(tierMap.UPDATE_COLLECTION_BY_ID.tier)
  )
  router.delete(
    '/api/collection/delete/:id',
    deleteCollectionByIdRoute(tierMap.DELETE_COLLECTION_BY_ID.tier)
  )

  // Schema
  router.post(
    '/api/schema/create',
    createSchemaRoute(tierMap.CREATE_SCHEMA.tier)
  )
  router.get(
    '/api/schema/list',
    getSchemaListRoute(tierMap.GET_SCHEMA_LIST.tier)
  )
  router.put(
    '/api/schema/update',
    updateSchemaRoute(tierMap.UPDATE_SCHEMA.tier)
  )
  router.get(
    '/api/schema/get/:id',
    getSchemaByIdRoute(tierMap.GET_SCHEMA_BY_ID.tier)
  )
  router.delete(
    '/api/schema/delete/:id',
    deleteSchemaByIdRoute(tierMap.DELETE_SCHEMA_BY_ID.tier)
  )
  router.get(
    '/api/schema/get/handle/:handle',
    getSchemaByHandleRoute(tierMap.GET_SCHEMA_BY_HANDLE.tier)
  )

  // Storage
  router.post(
    '/api/storage/upload-image',
    uploadImageRoute(tierMap.UPLOAD_IMAGE.tier)
  )
  router.get(
    '/api/storage/list-image',
    getImageListRoute(tierMap.GET_IMAGE_LIST.tier)
  )
  router.post(
    '/api/storage/delete-image',
    deleteImageRoute(tierMap.DELETE_IMAGE.tier)
  )

  // Object
  router.post(
    '/api/object/:collection_handle/:schema_handle/create',
    createObjectRoute(tierMap.CREATE_OBJECT.tier)
  )
  router.post(
    '/api/object/:collection_handle/:schema_handle/parse',
    parseObjectsFromXlsxRoute(tierMap.PARSE_OBJECTS.tier)
  )
  router.get(
    '/api/object/:collection_handle/:schema_handle/list',
    getObjectListRoute(tierMap.GET_OBJECT_LIST.tier)
  )
  router.put(
    '/api/object/:collection_handle/:schema_handle/update/:id',
    updateObjectByIdRoute(tierMap.UPDATE_OBJECT_BY_ID.tier)
  )
  router.get(
    '/api/object/:collection_handle/:schema_handle/get/:id',
    getObjectByIdRoute(tierMap.GET_OBJECT_BY_ID.tier)
  )
  router.delete(
    '/api/object/:collection_handle/:schema_handle/delete/:id',
    deleteObjectByIdRoute(tierMap.DELETE_OBJECT_BY_ID.tier)
  )
  router.post(
    '/api/object/:collection_handle/:schema_handle/update_or_create/:handle',
    updateOrCreateByHandleRoute(tierMap.UPDATE_OR_CREATE_OBJECT_BY_HANDLE.tier)
  )
  // router.get(
  //   '/api/object/:collection_handle/:schema_handle/get-template/:id',
  //   getObjectByIdRoute
  // )

  // User
  router.post('/api/user/create', createUserRoute(tierMap.CREATE_USER.tier))
  router.get('/api/user/list', getUserListRoute(tierMap.GET_USER_LIST.tier))
  router.get('/api/user/get/:id', getUserByIdRoute(tierMap.GET_USER_BY_ID.tier))
  router.put('/api/user/update', updateUserRoute(tierMap.UPDATE_USER.tier))
  router.delete(
    '/api/user/delete/:id',
    deleteUserRoute(tierMap.DELETE_USER.tier)
  )

  // User Meta
  router.post(
    '/api/user/meta/update/:id',
    updateUserMetaRoute(tierMap.UPDATE_USER_META.tier)
  )
  router.post(
    '/api/user/meta/delete/:id',
    deleteUserMetaItemRoute(tierMap.DELETE_USER_META_ITEM.tier)
  )
  // User Auth
  router.post('/api/user/login', loginUserRoute(tierMap.USER_LOGIN.tier))
  router.post(
    '/api/user/token',
    loginUserWithTokenRoute(tierMap.USER_LOGIN_WITH_TOKEN.tier)
  )
  router.post(
    '/api/user/reset-password-by-current-password',
    resetUserPasswordByCurrentPasswordRoute(
      tierMap.USER_RESET_PASSWORD_BY_CURRENT_PASSWORD.tier
    )
  )
  router.post(
    '/api/user/reset-email',
    resetUserEmailRoute(tierMap.USER_RESET_EMAIL.tier)
  )
  router.post(
    '/api/user/send-recover-email',
    sendRecoverEmailRoute(tierMap.USER_SEND_RECOVER_EMAIL.tier)
  )
  router.post(
    '/api/user/reset-password',
    resetPasswordRoute(tierMap.USER_RESET_PASSWORD.tier)
  )

  // Member
  router.post(
    '/api/member/create',
    createMemberRoute(tierMap.CREATE_MEMBER.tier)
  )
  router.get(
    '/api/member/list',
    getMemberListRoute(tierMap.GET_MEMBER_LIST.tier)
  )
  router.get(
    '/api/member/get/:id',
    getMemberByIdRoute(tierMap.GET_MEMBER_BY_ID.tier)
  )
  router.put(
    '/api/member/update',
    updateMemberRoute(tierMap.UPDATE_MEMBER_BY_ID.tier)
  )
  router.delete(
    '/api/member/delete/:id',
    deleteMemberRoute(tierMap.DELETE_MEMBER.tier)
  )

  // Shortcut
  router.post(
    '/api/shortcut/create',
    createShortcutRoute(tierMap.CREATE_SHORTCUT.tier)
  )
  router.get(
    '/api/shortcut/list',
    getShortcutListRoute(tierMap.GET_SHORTCUT_LIST.tier)
  )
  router.delete(
    '/api/shortcut/delete/:id',
    deleteShortcutByIdRoute(tierMap.DELETE_SHORTCUT.tier)
  )

  // Email
  router.post('/api/email/send', sendEmailRoute(tierMap.SEND_EMAIL.tier))

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
