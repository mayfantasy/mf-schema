import Joi from 'joi'
import * as J from './utils'

export const createAccessKeyPayloadSchema = Joi.object({
  name: J.j_str.required(),
  description: J.j_str.required()
})
