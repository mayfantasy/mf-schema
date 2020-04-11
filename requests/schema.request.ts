import { api } from '.'
import { ILoginPayload } from '../types/auth.type'
import {
  ICreateSchemaPayload,
  IUpdateSchemaPayload,
  ISchemaListQuery
} from '../types/schema.type'

export const createSchemaRequest = (payload: ICreateSchemaPayload) => {
  return api.post('/schema/create', payload)
}

export const updateSchemaRequest = (payload: IUpdateSchemaPayload) => {
  return api.put('/schema/update', payload)
}

export const getSchemaListRequest = (query: ISchemaListQuery) => {
  return api.get('/schema/list', {
    params: query
  })
}

export const getSchemaByIdRequest = (id: string) => {
  return api.get(`/schema/get/${id}`)
}
export const deleteSchemaByIdRequest = (id: string) => {
  return api.delete(`/schema/delete/${id}`)
}

export const getSchemaByHandleRequest = (handle: string) => {
  return api.get(`/schema/get/handle/${handle}`)
}
