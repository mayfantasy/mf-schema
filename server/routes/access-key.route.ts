import Koa from 'koa'
import { getAuth } from './helper'
import { ICreateAccessKeyPayload } from '../../types/access-key.type'
import {
  createAccessKey,
  getAccessKeyList,
  deleteAccessKeyById
} from '../services/access-key.service'
import { createAccessKeyPayloadSchema } from '../validators/access-key.validator'
import { validatePayload } from '../validators'

export const createAccessKeyRoute = (tier: number) => async (
  ctx: Koa.Context
) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const payload = ctx.request.body as ICreateAccessKeyPayload

  /** Validation */
  validatePayload(createAccessKeyPayloadSchema, payload)

  const accessKey = await createAccessKey(
    auth.api_key,
    auth.account_id,
    payload
  )

  ctx.body = {
    result: accessKey
  }
}

export const getAccessKeyListRoute = (tier: number) => async (
  ctx: Koa.Context
) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const accessKeys = await getAccessKeyList(auth.api_key)
  ctx.body = {
    result: accessKeys
  }
}

export const deleteAccessKeyRoute = (tier: number) => async (
  ctx: Koa.Context
) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const id = ctx.params.id
  const accessKey = await deleteAccessKeyById(auth.api_key, auth.account_id, id)

  ctx.body = {
    result: accessKey
  }
}
