import Koa from 'koa'
import { uploadImage } from '../services/upload.service'
import { format } from 'date-fns'
import { getAuth } from './helper'
import { uploadSchema } from '../validators/upload.validator'
import { validateUpload } from '../validators'

export const uploadImageRoute = async (ctx: Koa.Context) => {
  const files = ctx.request.files

  /** Validation */
  validateUpload(uploadSchema, files)

  const file = (files as any).avatar

  if (file) {
    const { path, name } = file
    const result = await uploadImage(
      `${path}`,
      name,
      'images',
      format(new Date(), 'yyyy-MM-dd')
    )
    ctx.body = {
      result
    }
  } else {
    return new Error('File not found.')
  }
}
