import { ISchema } from './schema.type'

export interface IUpdateObjectPayload {
  collection_handle: string
  schema_handle: string
  data: any
}

export interface IParseObjectsPayload {
  file: File
}

export interface IObject {
  schema: ISchema
  id: string
  [key: string]: any
}

export interface IObjectServiceMetaWithID {
  collection_handle: string
  schema_handle: string
  id: string
}

export interface IObjectServiceMetaWithHandle {
  collection_handle: string
  schema_handle: string
  handle: string
}
