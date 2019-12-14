import Koa from 'koa'
import { ILoginPayload } from '../../types/auth.type'
import { getAccountByEmail } from '../services/auth.service'
import { sign, varify } from '../jwt'
import { IBasicAccountInfo } from '../../types/account.type'
import {
  ICreateSchemaPayload,
  IUpdateSchemaPayload
} from '../../types/schema.type'
import {
  createSchema,
  getSchemaList,
  getSchemaById,
  updateSchema
} from '../services/schema.service'
import { getApiKey, testHandle } from './helper'

export const createSchemaRoute = async (ctx: Koa.Context) => {
  const api_key = await getApiKey(ctx)
  const payload = ctx.request.body as ICreateSchemaPayload

  testHandle(ctx, payload.handle)

  const schema = await createSchema(api_key, payload)

  console.log('schema: ', schema)

  ctx.body = {
    result: schema
  }
}

export const updateSchemaRoute = async (ctx: Koa.Context) => {
  const api_key = await getApiKey(ctx)
  const payload = ctx.request.body as IUpdateSchemaPayload

  if (payload.handle) {
    testHandle(ctx, payload.handle)
  }

  const schema = await updateSchema(api_key, payload)

  ctx.body = {
    result: schema
  }
}

export const getSchemaListRoute = async (ctx: Koa.Context) => {
  const api_key = await getApiKey(ctx)
  const schemas = await getSchemaList(api_key)
  ctx.body = {
    result: schemas
  }
}

export const getSchemaByIdRoute = async (ctx: Koa.Context) => {
  const api_key = await getApiKey(ctx)
  const { id } = ctx.params
  const schema = await getSchemaById(api_key, id)
  ctx.body = {
    result: schema
  }
}
