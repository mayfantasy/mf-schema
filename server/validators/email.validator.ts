import Joi from 'joi'
import * as J from './utils'

export const sendEmailPayloadSchema = Joi.object({
  meta: Joi.object({
    collection_handle: J.j_str.required(),
    schema_handle: J.j_str.required(),
    id: J.j_str.required()
  }),
  to_email: J.j_email.required(),
  data: J.j_any.required()
})
