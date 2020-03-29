import Joi from 'joi'
import * as J from './utils'

export const createMemberPayloadSchema = Joi.object({
  email: J.j_email.required(),
  username: J.j_handle.required(),
  password: J.j_pwd.required(),
  tier: J.j_num.required(),
  active: J.j_boo.required()
})

export const updateMemberPayloadSchema = Joi.object({
  id: J.j_str.required(),
  email: J.j_email.required(),
  username: J.j_handle.required(),
  password: Joi.allow(J.j_pwd, ''),
  tier: J.j_num.required(),
  active: J.j_boo.required()
})
