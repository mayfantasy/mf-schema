import Joi from 'joi'
import * as J from './utils'

export const createObjectParamsSchema = Joi.object({
  collection_handle: J.j_handle.required(),
  schema_handle: J.j_handle.required()
})

export const updateObjectParamsSchema = Joi.object({
  collection_handle: J.j_handle.required(),
  schema_handle: J.j_handle.required(),
  id: J.j_str.required()
})

export const getObjectListParamsSchema = Joi.object({
  collection_handle: J.j_handle.required(),
  schema_handle: J.j_handle.required()
})

export const getObjectByIdParamsSchema = Joi.object({
  collection_handle: J.j_handle.required(),
  schema_handle: J.j_handle.required(),
  id: J.j_str.required()
})

export const deleteObjectByIdParamsSchema = Joi.object({
  collection_handle: J.j_handle.required(),
  schema_handle: J.j_handle.required(),
  id: J.j_str.required()
})
