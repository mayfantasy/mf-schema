import { api } from '.'
import { IParseObjectsPayload } from '../types/object.type'

export const createObjectRequest = (
  collection_handle: string,
  schema_handle: string,
  payload: any
) => {
  return api.post(
    `/object/${collection_handle}/${schema_handle}/create`,
    payload
  )
}

export const updateObjectByIdRequest = (
  collection_handle: string,
  schema_handle: string,
  object_id: string,
  payload: any
) => {
  return api.put(
    `/object/${collection_handle}/${schema_handle}/update/${object_id}`,
    payload
  )
}

export const getObjectListRequest = (
  collection_handle: string,
  schema_handle: string
) => {
  return api.get(`/object/${collection_handle}/${schema_handle}/list`)
}

export const getObjectByIdRequest = (
  collection_handle: string,
  schema_handle: string,
  id: string
) => {
  return api.get(`/object/${collection_handle}/${schema_handle}/get/${id}`)
}

export const updateOrCreateByHandleRequest = (
  collection_handle: string,
  schema_handle: string,
  handle: string,
  payload: any
) => {
  return api.post(
    `/object/${collection_handle}/${schema_handle}/update_or_create/${handle}`,
    payload
  )
}

export const deleteObjectByIdRequest = (
  collection_handle: string,
  schema_handle: string,
  id: string
) => {
  return api.delete(
    `/object/${collection_handle}/${schema_handle}/delete/${id}`
  )
}

export const parseObjectsFromXlsxRequest = (
  collection_handle: string,
  schema_handle: string,
  payload: IParseObjectsPayload
) => {
  return api.post(
    `/object/${collection_handle}/${schema_handle}/parse`,
    payload
  )
}

export const getObjectXlsxTemplateRequest = (
  collection_handle: string,
  schema_handle: string
) => {
  return api.get(`/object/${collection_handle}/${schema_handle}/get-template`)
}
