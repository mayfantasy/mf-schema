import Joi from 'joi'
import * as J from './utils'

export const createShortcutPayloadSchema = Joi.object({
  title: J.j_str.required(),
  url: J.j_str.required()
})
