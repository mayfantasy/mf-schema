import Koa from 'koa'
import {
  createObject,
  getObjectList,
  getObjectById,
  updateObjectById,
  deleteObjectById
} from '../services/object.service'
import { getAuth, testHandle } from './helper'

export const createObjectRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const { collection_handle, schema_handle } = ctx.params
  const payload = ctx.request.body as any

  await testHandle(ctx, payload._handle)

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
  const { collection_handle, schema_handle, id } = ctx.params
  const payload = ctx.request.body
  await testHandle(ctx, payload._handle)
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
  const { collection_handle, schema_handle } = ctx.params
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
  const { collection_handle, schema_handle, id } = ctx.params
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
  const { collection_handle, schema_handle, id } = ctx.params
  const object = await deleteObjectById(auth.api_key, {
    collection_handle,
    schema_handle,
    id
  })
  ctx.body = {
    result: object
  }
}
