import Joi from 'joi'
import * as J from './utils'

export const loginPayloadSchema = Joi.object({
  email: J.j_email.required(),
  password: J.j_pwd.required()
})

export const loginWithTokenSchema = Joi.object({
  token: J.j_str.required()
})
