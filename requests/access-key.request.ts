import { api } from '.'
import { ICreateAccessKeyPayload } from '../types/access-key.type'

export const createAccessKeyRequest = (accessKey: ICreateAccessKeyPayload) => {
  return api.post('/access-key/create', accessKey)
}

export const getAccessKeyListRequest = () => {
  return api.get('/access-key/list')
}

export const deleteAccessKeyRequest = (id: string) => {
  return api.delete(`/access-key/delete/${id}`)
}
