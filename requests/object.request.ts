import { api } from '.'

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

export const updateObjectRequest = (
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

export const getObjectById = (
  collection_handle: string,
  schema_handle: string,
  id: string
) => {
  return api.get(`/object/${collection_handle}/${schema_handle}/${id}`)
}

export const deleteObjectById = (
  collection_handle: string,
  schema_handle: string,
  object_id: string
) => {
  return api.delete(
    `/object/${collection_handle}/${schema_handle}/delete/${object_id}`
  )
}
