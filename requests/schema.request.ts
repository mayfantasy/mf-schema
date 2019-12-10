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
  return api.post('/schema/update', payload)
}

export const getSchemaListRequest = () => {
  return api.get('/schema/list')
}

export const getSchemaById = (id: string) => {
  return api.get(`/schema/${id}`)
}
