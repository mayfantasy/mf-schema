import Koa from 'koa'
import {
  createObject,
  getObjectList,
  getObjectById,
  updateObjectById,
  deleteObjectById
} from '../services/object.service'
import { getAuth } from './helper'
import { validatePayload } from '../validators'
import {
  createObjectParamsSchema,
  updateObjectParamsSchema,
  getObjectListParamsSchema,
  getObjectByIdParamsSchema,
  deleteObjectByIdParamsSchema
} from '../validators/object.validator'

export const createObjectRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const params = ctx.params
  const payload = ctx.request.body as any

  /** Validation */
  validatePayload(createObjectParamsSchema, params)

  const { collection_handle, schema_handle } = params

  const object = await createObject(auth.api_key, payload, {
    collection_handle,
    schema_handle
  })

  ctx.body = {
    result: object
  }
}

export const updateObjectByIdRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const params = ctx.params
  const payload = ctx.request.body

  /** Validation */
  validatePayload(updateObjectParamsSchema, params)

  const { collection_handle, schema_handle, id } = params

  const object = await updateObjectById(auth.api_key, payload, {
    collection_handle,
    schema_handle,
    id
  })
  ctx.body = {
    result: object
  }
}

export const getObjectListRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const params = ctx.params

  /** Validation */
  validatePayload(getObjectListParamsSchema, params)

  const { collection_handle, schema_handle } = params
  const objects = await getObjectList(auth.api_key, {
    collection_handle,
    schema_handle
  })
  ctx.body = {
    result: objects
  }
}

export const getObjectByIdRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)

  const params = ctx.params

  /** Validation */
  validatePayload(getObjectByIdParamsSchema, params)

  const { collection_handle, schema_handle, id } = params
  const object = await getObjectById(auth.api_key, {
    collection_handle,
    schema_handle,
    id
  })
  ctx.body = {
    result: object
  }
}

export const deleteObjectByIdRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const params = ctx.params

  /** Validation */
  validatePayload(deleteObjectByIdParamsSchema, params)

  const { collection_handle, schema_handle, id } = params
  const object = await deleteObjectById(auth.api_key, {
    collection_handle,
    schema_handle,
    id
  })
  ctx.body = {
    result: object
  }
}
