import Joi from 'joi'
import * as J from './utils'

export const userLoginPayloadSchema = Joi.object({
  email: J.j_email.required(),
  password: J.j_pwd.required()
})

export const loginUserWithTokenPayloadSchema = Joi.object({
  token: J.j_str.required()
})

export const resetUserPasswordByCurrentPasswordPayloadSchema = Joi.object({
  email: J.j_email.required(),
  current_password: J.j_pwd.required(),
  new_password: J.j_pwd.required()
})

export const userSendRecoverEmailPayloadSchema = Joi.object({
  email: J.j_email.required(),
  entry_name: J.j_str.required(),
  entry_url: J.j_uri.required()
})

export const resetUseremailPayloadSchema = Joi.object({
  current_email: J.j_email.required(),
  new_email: J.j_email.required()
})

export const userResetPasswordPayloadSchema = Joi.object({
  signature: J.j_str.required(),
  password: J.j_pwd.required()
})
