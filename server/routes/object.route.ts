import Koa from 'koa'
import { ILoginPayload } from '../../types/auth.type'
import { getAccountByEmail } from '../services/auth.service'
import { sign, varify } from '../jwt'
import { IBasicAccountInfo } from '../../types/account.type'
import {
  createObject,
  getObjectList,
  getObjectById,
  updateObjectById,
  deleteObjectById
} from '../services/object.service'
import { getApiKey, testHandle } from './helper'

export const createObjectRoute = async (ctx: Koa.Context) => {
  const api_key = await getApiKey(ctx)
  const { collection_handle, schema_handle } = ctx.params
  const payload = ctx.request.body as any

  await testHandle(ctx, payload._handle)

  const object = await createObject(api_key, payload, {
    collection_handle,
    schema_handle
  })

  console.log('object: ', object)

  ctx.body = {
    result: object
  }
}

export const updateObjectByIdRoute = async (ctx: Koa.Context) => {
  const api_key = await getApiKey(ctx)
  const { collection_handle, schema_handle, id } = ctx.params
  const payload = ctx.request.body
  await testHandle(ctx, payload._handle)
  const object = await updateObjectById(api_key, payload, {
    collection_handle,
    schema_handle,
    id
  })
  ctx.body = {
    result: object
  }
}

export const getObjectListRoute = async (ctx: Koa.Context) => {
  const api_key = await getApiKey(ctx)
  const { collection_handle, schema_handle } = ctx.params
  const objects = await getObjectList(api_key, {
    collection_handle,
    schema_handle
  })
  ctx.body = {
    result: objects
  }
}

export const getObjectByIdRoute = async (ctx: Koa.Context) => {
  const api_key = await getApiKey(ctx)
  const { collection_handle, schema_handle, id } = ctx.params
  const object = await getObjectById(api_key, {
    collection_handle,
    schema_handle,
    id
  })
  ctx.body = {
    result: object
  }
}

export const deleteObjectByIdRoute = async (ctx: Koa.Context) => {
  const api_key = await getApiKey(ctx)
  const { collection_handle, schema_handle, id } = ctx.params
  const object = await deleteObjectById(api_key, {
    collection_handle,
    schema_handle,
    id
  })
  ctx.body = {
    result: object
  }
}
