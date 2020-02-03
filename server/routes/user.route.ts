import Koa from 'koa'
import { getAuth } from './helper'
import {
  ICreateUserPayload,
  IUpdateUserInfoPayload,
  IUpdateUserMetaPayload,
  IDeleteUserMetaItemPayload
} from '../../types/user.type'
import {
  getUserList,
  updateUser,
  deleteUserById,
  createUser,
  getUserById,
  updateUserMeta,
  deleteUserMeta
} from '../services/user.service'

import {
  createUserPayloadSchema,
  updateUserPayloadSchema,
  updateUserMetaPayloadSchema,
  deleteUserMetaPayloadSchema
} from '../validators/user.validator'
import { validatePayload } from '../validators'

export const createUserRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as ICreateUserPayload

  /** Validation */
  validatePayload(createUserPayloadSchema, payload)

  const user = await createUser(auth.api_key, payload)
  console.log(user)

  ctx.body = {
    result: user
  }
}

export const getUserListRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const user = await getUserList(auth.api_key)

  ctx.body = {
    result: user
  }
}

export const getUserByIdRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const id = ctx.params.id

  if (id) {
    const user = await getUserById(auth.api_key, id)
    ctx.body = {
      result: user
    }
  } else {
    throw new Error('Invalid user id.')
  }
}

export const updateUserRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as IUpdateUserInfoPayload

  /** Validation */
  validatePayload(updateUserPayloadSchema, payload)

  const user = await updateUser(auth.api_key, payload)
  ctx.body = {
    result: user
  }
}

export const deleteUserRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const id = ctx.params.id

  /** Validation */
  if (id) {
    const user = await deleteUserById(auth.api_key, id)

    ctx.body = {
      result: user
    }
  } else {
    throw new Error('Invalid user id.')
  }
}

export const updateUserMetaRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const id = ctx.params.id
  const payload = ctx.request.body as IUpdateUserMetaPayload

  /** Validation */
  validatePayload(updateUserMetaPayloadSchema, payload)

  if (id) {
    const user = await updateUserMeta(auth.api_key, id, payload)

    ctx.body = {
      result: user
    }
  } else {
    throw new Error('Invalid user id.')
  }
}

export const deleteUserMetaItemRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const id = ctx.params.id
  const payload = ctx.request.body as IDeleteUserMetaItemPayload

  /** Validation */
  validatePayload(deleteUserMetaPayloadSchema, payload)

  if (id) {
    const user = await deleteUserMeta(auth.api_key, id, payload)

    ctx.body = {
      result: user
    }
  } else {
    throw new Error('Invalid user id.')
  }
}
