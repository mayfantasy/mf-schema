import Joi from 'joi'
import * as J from './utils'

const schemaDef = Joi.array()
  .items(
    Joi.object({
      type: J.j_handle.required(),
      key: J.j_handle.required(),
      name: J.j_str.required(),
      child_type: J.j_str,
      helper: J.j_str,
      order: J.j_num,
      grid: J.j_num,
      new_line: J.j_boo,
      show: J.j_boo
    })
  )
  .unique('key')

export const createSchemaPayloadSchema = Joi.object({
  name: J.j_str.required(),
  handle: J.j_handle.required(),
  description: J.j_str,
  def: schemaDef,
  collection_id: J.j_handle.required()
})

export const updateSchemaPayloadSchema = Joi.object({
  id: J.j_handle.required(),
  name: J.j_str.required(),
  handle: J.j_handle.required(),
  description: J.j_str,
  def: schemaDef
})

export const getSchemaListQuerySchema = Joi.object({
  collection_id: Joi.allow(J.j_handle, '')
})
