import Joi from 'joi'
import * as J from './utils'

export const clientCreateAccountPayloadSchema = Joi.object({
  email: J.j_email.required(),
  username: J.j_handle.required(),
  password: J.j_pwd.required()
})
