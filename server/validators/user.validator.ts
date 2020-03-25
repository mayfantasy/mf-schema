import Joi from 'joi'
import * as J from './utils'

export const createUserPayloadSchema = Joi.object({
  first_name: J.j_handle.required(),
  last_name: J.j_handle.required(),
  email: J.j_email.required(),
  username: J.j_handle.required(),
  date_of_birth: J.j_date_str.required(),
  password: J.j_pwd.required(),
  phone: J.j_phone_str,
  profile_img: J.j_uri
})

export const updateUserPayloadSchema = Joi.object({
  id: J.j_str.required(),
  first_name: J.j_handle,
  last_name: J.j_handle,
  email: J.j_email,
  username: J.j_handle,
  date_of_birth: J.j_date_str,
  password: J.j_pwd,
  phone: J.j_phone_str.optional(),
  profile_img: J.j_uri
})

export const updateUserMetaPayloadSchema = Joi.object({
  key: J.j_str.required(),
  value: J.j_any.required()
})

export const deleteUserMetaPayloadSchema = Joi.object({
  key: J.j_str.required()
})
