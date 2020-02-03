import Koa from 'koa'
import { ILoginPayload } from '../../types/auth.type'
import { getAccountByEmail } from '../services/auth.service'
import { sign, varify } from '../jwt'
import { IBasicAccountInfo } from '../../types/account.type'
import { ICreateCollectionPayload } from '../../types/collection.type'
import {
  createCollection,
  getCollectionList,
  getCollectionById
} from '../services/collection.service'
import { getAuth } from './helper'
import { handleRxp } from '../../helpers/utils.helper'
import { createCollectionPayloadSchema } from '../validators/collection.validator'
import { validatePayload } from '../validators'

export const createCollectionRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as ICreateCollectionPayload

  /** Validation */
  validatePayload(createCollectionPayloadSchema, payload)

  const collection = await createCollection(auth.api_key, payload)

  ctx.body = {
    result: collection
  }
}

export const getCollectionListRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const collections = await getCollectionList(auth.api_key)
  ctx.body = {
    result: collections
  }
}

export const getCollectionByIdRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const id = ctx.params.id

  /** Validation */
  if (id) {
    const collection = await getCollectionById(auth.api_key, id)
    ctx.body = {
      result: collection
    }
  } else {
    throw new Error('Invalid Collection ID.')
  }
}
