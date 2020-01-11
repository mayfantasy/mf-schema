import Joi from 'joi'

export const j_pwd = Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
export const j_date_str = Joi.string().isoDate()
export const j_phone_str = Joi.string().regex(/^[0-9]{3,30}$/)
export const j_img_uri = Joi.string().uri()
export const j_name = Joi.string()
  .alphanum()
  .min(1)
  .max(20)
export const j_email = Joi.string().email()
export const j_str = Joi.string()
export const j_any = Joi.any()
