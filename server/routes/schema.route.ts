import Koa from 'koa'
import { ILoginPayload } from '../../types/auth.type'
import { getAccountByEmail } from '../services/auth.service'
import { sign, varify } from '../jwt'
import { IBasicAccountInfo } from '../../types/account.type'
import {
  ICreateSchemaPayload,
  IUpdateSchemaPayload,
  ISchemaListQuery
} from '../../types/schema.type'
import {
  createSchema,
  getSchemaList,
  getSchemaById,
  updateSchema,
  getSchemaByHandle
} from '../services/schema.service'
import { getAuth, testHandle } from './helper'

export const createSchemaRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as ICreateSchemaPayload

  await testHandle(ctx, payload.handle)

  for (let i = 0; i < payload.def.length; i++) {
    await testHandle(ctx, payload.def[i].key)
  }

  const schema = await createSchema(auth.api_key, payload)

  ctx.body = {
    result: schema
  }
}

export const updateSchemaRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as IUpdateSchemaPayload

  if (payload.handle) {
    await testHandle(ctx, payload.handle)
  }

  if (payload.def) {
    for (let i = 0; i < payload.def.length; i++) {
      await testHandle(ctx, payload.def[i].key)
    }
  }

  const schema = await updateSchema(auth.api_key, payload)

  ctx.body = {
    result: schema
  }
}

export const getSchemaListRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const query = ctx.query as ISchemaListQuery

  const schemas = await getSchemaList(auth.api_key, query)
  ctx.body = {
    result: schemas
  }
}

export const getSchemaByIdRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const { id } = ctx.params
  const schema = await getSchemaById(auth.api_key, id)
  ctx.body = {
    result: schema
  }
}

export const getSchemaByHandleRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const { handle } = ctx.params
  const schema = await getSchemaByHandle(auth.api_key, handle)
  ctx.body = {
    result: schema
  }
}
