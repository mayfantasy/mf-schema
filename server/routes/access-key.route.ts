import Koa from 'koa'
import { getAuth } from './helper'
import { ICreateAccessKeyPayload } from '../../types/access-key.type'
import {
  createAccessKey,
  getAccessKeyList,
  deleteAccessKeyById
} from '../services/access-key.service'

export const createAccessKeyRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as ICreateAccessKeyPayload

  const accessKey = await createAccessKey(
    auth.api_key,
    auth.account_id,
    payload
  )

  ctx.body = {
    result: accessKey
  }
}

export const getAccessKeyListRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const accessKeys = await getAccessKeyList(auth.api_key)
  ctx.body = {
    result: accessKeys
  }
}

export const deleteAccessKeyRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const id = ctx.params.id
  const accessKey = await deleteAccessKeyById(auth.api_key, auth.account_id, id)

  ctx.body = {
    result: accessKey
  }
}
