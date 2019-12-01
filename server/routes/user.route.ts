import Koa from 'koa'
import { createUser, getUserList, deleteUser } from '../services/user.service'

export const getUserListRoute = async (ctx: Koa.Context) => {
  const userList = await getUserList()
  ctx.body = {
    result: userList
  }
}

export const createUserRoute = async (ctx: Koa.Context) => {
  const createUserPayload = ctx.request.body
  const newUser = await createUser(createUserPayload)
  ctx.body = {
    result: newUser
  }
}

export const deleteUserRoute = async (ctx: Koa.Context) => {
  const { id } = ctx.params
  const result = await deleteUser(id)
  ctx.body = {
    result
  }
}
