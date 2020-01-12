import Joi from 'joi'
import * as J from './utils'

export const createCollectionPayloadSchema = Joi.object({
  name: J.j_handle.required(),
  handle: J.j_handle.required(),
  description: J.j_str
})

export const updateCollectionPayloadSchema = Joi.object({
  id: J.j_str.required(),
  name: J.j_handle,
  handle: J.j_handle,
  description: J.j_str
})
