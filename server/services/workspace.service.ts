import Workspace from '../db/models/workspace.model'
import {
  ICreateWorkspacePayload,
  IUpdateWorkspacePayload
} from '../../types/workspace.type'

export const createWorkspace = async (workspace: ICreateWorkspacePayload) => {
  const newRole = new Workspace(workspace)
  const result = await newRole.save()
  return result
}

export const getWorkspaceList = async () => {
  const result = await Workspace.findAll()
  return result
}

export const getWorkspaceById = async (id: number) => {
  const result = await Workspace.findByPk(id)
  return result
}

export const updateWorkspace = async (
  id: number,
  product: IUpdateWorkspacePayload
) => {
  const result = await Workspace.update(product, {
    returning: true,
    where: { id }
  })
  return result[1][0]
}

export const deleteWorkspace = async (id: number) => {
  const result = await Workspace.destroy({
    where: {
      id
    }
  })
  return { id }
}
