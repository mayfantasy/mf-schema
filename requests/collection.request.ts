import { api } from '.'
import { ILoginPayload } from '../types/auth.type'
import {
  ICreateCollectionPayload,
  IUpdateCollectionPayload
} from '../types/collection.type'

export const createCollectionRequest = (payload: ICreateCollectionPayload) => {
  return api.post('/collection/create', payload)
}

export const getCollectionListRequest = () => {
  return api.get('/collection/list')
}

export const getCollectionByIdRequest = (id: string) => {
  return api.get(`/collection/get/${id}`)
}

export const updateCollectionRequest = (payload: IUpdateCollectionPayload) => {
  return api.put(`/collection/update`, payload)
}

export const deleteCollectionByIdRequest = (id: string) => {
  return api.delete(`/collection/delete/${id}`)
}
