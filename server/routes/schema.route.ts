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
import { getAuth } from './helper'
import { validatePayload } from '../validators'
import {
  createSchemaPayloadSchema,
  updateSchemaPayloadSchema,
  getSchemaListQuerySchema
} from '../validators/schema.validatior'

export const createSchemaRoute = (tier: number) => async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const payload = ctx.request.body as ICreateSchemaPayload

  /** Validation */
  validatePayload(createSchemaPayloadSchema, payload)

  const schema = await createSchema(auth.api_key, payload)

  ctx.body = {
    result: schema
  }
}

export const updateSchemaRoute = (tier: number) => async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const payload = ctx.request.body as IUpdateSchemaPayload

  /** Validation */
  validatePayload(updateSchemaPayloadSchema, payload)

  const schema = await updateSchema(auth.api_key, payload)

  ctx.body = {
    result: schema
  }
}

export const getSchemaListRoute = (tier: number) => async (
  ctx: Koa.Context
) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const query = ctx.query as ISchemaListQuery

  /** Validation */
  validatePayload(getSchemaListQuerySchema, query)

  const schemas = await getSchemaList(auth.api_key, query)
  ctx.body = {
    result: schemas
  }
}

export const getSchemaByIdRoute = (tier: number) => async (
  ctx: Koa.Context
) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const { id } = ctx.params

  if (id) {
    const schema = await getSchemaById(auth.api_key, id)
    ctx.body = {
      result: schema
    }
  } else {
    throw new Error('Invalid Schema ID.')
  }
}

export const getSchemaByHandleRoute = (tier: number) => async (
  ctx: Koa.Context
) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const { handle } = ctx.params

  if (handle) {
    const schema = await getSchemaByHandle(auth.api_key, handle)
    ctx.body = {
      result: schema
    }
  } else {
    throw new Error('Invalid Schema ID.')
  }
}
