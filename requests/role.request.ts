import { api } from '.'
import { ICreateRolePayload } from '../types/role.type'

export const createRoleRequest = (user: ICreateRolePayload) => {
  return api.post('/role/create', user)
}

export const getRoleListRequest = () => {
  return api.get('/role/list')
}
