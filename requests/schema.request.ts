import { api } from '.'
import { ILoginPayload } from '../types/auth.type'
import {
  ICreateSchemaPayload,
  IUpdateSchemaPayload
} from '../types/schema.type'

export const createSchemaRequest = (payload: ICreateSchemaPayload) => {
  return api.post('/schema/create', payload)
}

export const updateSchemaRequest = (payload: IUpdateSchemaPayload) => {
  return api.put('/schema/update', payload)
}

export const getSchemaListRequest = () => {
  return api.get('/schema/list')
}

export const getSchemaByIdRequest = (id: string) => {
  return api.get(`/schema/get/${id}`)
}
