import Koa from 'koa'
import { createRole, getRoleList } from '../services/role.service'

export const getRoleListRoute = async (ctx: Koa.Context) => {
  const roleList = await getRoleList()
  ctx.body = {
    result: roleList
  }
}

export const createRoleRoute = async (ctx: Koa.Context) => {
  const createRolePayload = ctx.request.body
  const newRole = await createRole(createRolePayload)
  ctx.body = {
    result: newRole
  }
}
