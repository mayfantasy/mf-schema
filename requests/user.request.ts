import { api } from '.'
import { ICreateUserPayload, IUpdateUserInfoPayload } from '../types/user.type'

export const createUserRequest = (user: ICreateUserPayload) => {
  return api.post('/user/create', user)
}

export const getUserListRequest = () => {
  return api.get('/user/list')
}

export const getUserByIdRequest = (id: string) => {
  return api.get(`/user/get/${id}`)
}

export const updateUserByIdRequest = (payload: IUpdateUserInfoPayload) => {
  return api.put(`/user/update`, payload)
}

export const deleteUserRequest = (id: string) => {
  return api.delete(`/user/delete/${id}`)
}
