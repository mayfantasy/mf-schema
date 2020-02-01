import Joi from 'joi'

/**
 *
 * @param schema Joi validation schema
 * @param payload Request payload
 */
export const validatePayload = (schema: Joi.ObjectSchema, payload: any) => {
  const { error } = Joi.validate(payload, schema)
  if (error) {
    throw new Error(error.message)
  }
}

/**
 *
 * @param schema Body validation schema (Joi)
 * @param callback
 */
export const validateUpload = (schema: Joi.ObjectSchema, files: any) => {
  const { error } = Joi.validate(files, schema)
  if (error) {
    throw new Error(error.message)
  }
}
