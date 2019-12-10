export enum ESchemaFieldType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  array = 'array',
  object = 'object'
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
}

export interface IUpdateSchemaPayload {
  id: string
  name?: string
  handle?: string
  description?: string
  def?: ISchemaFieldDef[]
}
