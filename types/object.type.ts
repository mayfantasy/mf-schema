import { ISchema } from './schema.type'

export interface IUpdateObjectPayload {
  collection_handle: string
  schema_handle: string
  data: any
}

export interface IObject {
  schema: ISchema
  [key: string]: any
}
