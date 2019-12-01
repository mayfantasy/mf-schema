import Koa from 'koa'
import {
  createWorkspace,
  getWorkspaceList,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceById
} from '../services/workspace.service'

export const getWorkspaceListRoute = async (ctx: Koa.Context) => {
  const workspaceList = await getWorkspaceList()
  ctx.body = {
    result: workspaceList
  }
}

export const createWorkspaceRoute = async (ctx: Koa.Context) => {
  const createWorkspacePayload = ctx.request.body
  const newWorkspace = await createWorkspace(createWorkspacePayload)
  ctx.body = {
    result: newWorkspace
  }
}

export const getWorkspaceByIdRoute = async (ctx: Koa.Context) => {
  const { id } = ctx.params
  const workspace = await getWorkspaceById(id)
  ctx.body = {
    result: workspace
  }
}

export const updateWorkspaceRoute = async (ctx: Koa.Context) => {
  const updateWorkspacePayload = ctx.request.body
  const { id } = ctx.params
  const workspaceUpdated = await updateWorkspace(id, updateWorkspacePayload)
  ctx.body = {
    result: workspaceUpdated
  }
}

export const deleteWorkspaceRoute = async (ctx: Koa.Context) => {
  const { id } = ctx.params
  const result = await deleteWorkspace(id)
  ctx.body = {
    result
  }
}
