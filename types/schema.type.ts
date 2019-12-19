import { ICollection } from './collection.type'

export enum ESchemaFieldType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  image = 'image',
  // array = 'array',
  // object = 'object',
  textarea = 'textarea',
  datepicker = 'datepicker'
}
export interface ISchemaFieldDef {
  type: ESchemaFieldType
  child_type?: ESchemaFieldType
  key: string
  name: string
  helper: string
  order: number
  grid: number
  new_line: boolean
  show: boolean
}

/**
 * for antd form usage
 */
export interface ISchemaFieldDefKeys {
  type: string
  child_type?: string
  key: string
  name: string
  helper: string
  order: string
  grid: string
  new_line: string
  show: string
}

export interface ICreateSchemaPayload {
  name: string
  handle: string
  description: string
  def: ISchemaFieldDef[]
  collection_id: string
}

export interface ISchema {
  id: string
  name: string
  handle: string
  description: string
  def: ISchemaFieldDef[]
  collection_id: string
  collection: ICollection
}

export interface IUpdateSchemaPayload {
  id: string
  name?: string
  handle?: string
  description?: string
  def?: ISchemaFieldDef[]
}
