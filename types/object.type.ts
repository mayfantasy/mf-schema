import { ISchema } from './schema.type'

export interface IUpdateObjectPayload {
  collection_handle: string
  schema_handle: string
  data: any
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
