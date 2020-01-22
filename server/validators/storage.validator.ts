import Joi from 'joi'
import * as J from './utils'

export const uploadSchema = Joi.object({
  mf_image_uploader: J.j_any.required()
})
