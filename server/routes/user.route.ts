import Koa from 'koa'
import { getAuth } from './helper'
import {
  ICreateUserPayload,
  IUpdateUserInfoPayload
} from '../../types/user.type'
import {
  getUserList,
  updateUser,
  deleteUserById,
  createUser,
  getUserById
} from '../services/user.service'
import { ILoginPayload } from '../../types/auth.type'

export const createUserRoute = async (ctx: Koa.Context) => {
  console.log('1')
  const auth = (await getAuth(ctx)) || ({} as any)
  console.log(auth)
  const payload = ctx.request.body as ICreateUserPayload

  const user = await createUser(auth.api_key, payload)

  ctx.body = {
    result: user
  }
}

export const getUserListRoute = async (ctx: Koa.Context) => {
  console.log('2')
  const auth = (await getAuth(ctx)) || ({} as any)
  const user = await getUserList(auth.api_key)

  ctx.body = {
    result: user
  }
}

export const getUserByIdRoute = async (ctx: Koa.Context) => {
  console.log('3')
  const auth = (await getAuth(ctx)) || ({} as any)
  const id = ctx.params.id
  const user = await getUserById(auth.api_key, id)
  ctx.body = {
    result: user
  }
}

export const updateUserRoute = async (ctx: Koa.Context) => {
  console.log('4')
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as IUpdateUserInfoPayload
  const user = await updateUser(auth.api_key, payload)
  ctx.body = {
    result: user
  }
}

export const deleteUserRoute = async (ctx: Koa.Context) => {
  console.log('5')
  const auth = (await getAuth(ctx)) || ({} as any)
  const id = ctx.params.id
  const user = await deleteUserById(auth.api_key, id)

  ctx.body = {
    result: user
  }
}
