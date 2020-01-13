import { ICollection } from './collection.type'

interface IKeyValue {
  key: string
  value: any
}
export enum ESchemaFieldType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  image = 'image',
  // array = 'array',
  // object = 'object',
  textarea = 'textarea',
  datepicker = 'datepicker',
  string_array = 'string_array',
  rich_text = 'rich_text',
  string_single_select = 'string_single_select',
  string_multi_select = 'string_multi_select'
}
export interface ISchemaFieldDef {
  type: ESchemaFieldType
  options?: string[]
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
  options: string
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

export interface ISchemaListQuery {
  collection_id?: string
}

/**
 * payload
 * adjusts special form values structure
 * _defKeys: array, schema definition structure, stores the value index
 * _defValues: object, stores the actual value
 */
export interface ICreateSchemaFormValues extends ICreateSchemaPayload {
  _defKeys: ISchemaFieldDefKeys[]
  _defValues: { [key: string]: any }
}

/**
 * payload
 * adjusts special form values structure
 * _defKeys: array, schema definition structure, stores the value index
 * _defValues: object, stores the actual value
 */
export interface IUpdateSchemaFormValues extends IUpdateSchemaPayload {
  _defKeys: ISchemaFieldDefKeys[]
  _defValues: { [key: string]: any }
}
