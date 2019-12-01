import Role from '../db/models/role.model'
import { ICreateRolePayload } from '../../types/role.type'

export const createRole = async (role: ICreateRolePayload) => {
  const newRole = new Role(role)
  const result = await newRole.save()
  return result
}

export const getRoleList = async () => {
  const result = await Role.findAll()
  return result
}
