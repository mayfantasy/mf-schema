import Koa from 'koa'
import { ILoginPayload } from '../../types/auth.type'
import { getAccountByEmail } from '../services/auth.service'
import { sign, varify } from '../jwt'
import { IBasicAccountInfo } from '../../types/account.type'
import {
  ICreateCollectionPayload,
  IUpdateCollectionPayload
} from '../../types/collection.type'
import {
  createCollection,
  getCollectionList,
  getCollectionById,
  deleteCollectionById,
  updateCollection
} from '../services/collection.service'
import { getAuth } from './helper'
import { handleRxp } from '../../helpers/utils.helper'
import {
  createCollectionPayloadSchema,
  updateCollectionPayloadSchema
} from '../validators/collection.validator'
import { validatePayload } from '../validators'

export const createCollectionRoute = (tier: number) => async (
  ctx: Koa.Context
) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const payload = ctx.request.body as ICreateCollectionPayload

  /** Validation */
  validatePayload(createCollectionPayloadSchema, payload)

  const collection = await createCollection(auth.api_key, payload)

  ctx.body = {
    result: collection
  }
}

export const getCollectionListRoute = (tier: number) => async (
  ctx: Koa.Context
) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const collections = await getCollectionList(auth.api_key)
  ctx.body = {
    result: collections
  }
}

export const updateCollectionRoute = (tier: number) => async (
  ctx: Koa.Context
) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const payload = ctx.request.body as IUpdateCollectionPayload

  /** Validation */
  validatePayload(updateCollectionPayloadSchema, payload)

  const collection = await updateCollection(auth.api_key, payload)
  ctx.body = {
    result: collection
  }
}

export const getCollectionByIdRoute = (tier: number) => async (
  ctx: Koa.Context
) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
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

export const deleteCollectionByIdRoute = (tier: number) => async (
  ctx: Koa.Context
) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const id = ctx.params.id

  /** Validation */
  if (id) {
    const collection = await deleteCollectionById(auth.api_key, id)
    ctx.body = {
      result: collection
    }
  } else {
    throw new Error('Invalid Collection ID.')
  }
}
