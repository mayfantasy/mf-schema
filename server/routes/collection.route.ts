import Koa from 'koa'
import { ILoginPayload } from '../../types/auth.type'
import { getAccountByEmail } from '../services/auth.service'
import { sign, varify } from '../jwt'
import { IBasicAccountInfo } from '../../types/account.type'
import { ICreateCollectionPayload } from '../../types/collection.type'
import {
  createCollection,
  getCollectionList
} from '../services/collection.service'
import { getApiKey, testHandle } from './helper'
import { handleRxp } from '../../helpers/utils.helper'

export const createCollectionRoute = async (ctx: Koa.Context) => {
  const api_key = await getApiKey(ctx)
  const payload = ctx.request.body as ICreateCollectionPayload

  await testHandle(ctx, payload.handle)

  const collection = await createCollection(api_key, payload)

  ctx.body = {
    result: collection
  }
}

export const getCollectionListRoute = async (ctx: Koa.Context) => {
  const api_key = await getApiKey(ctx)
  const collections = await getCollectionList(api_key)
  ctx.body = {
    result: collections
  }
}
