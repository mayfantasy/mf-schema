import Joi from 'joi'
import * as J from './utils'

export const uploadSchema = Joi.object({
  avatar: J.j_any.required()
})
