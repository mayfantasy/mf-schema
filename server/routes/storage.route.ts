import Koa from 'koa'
import {
  uploadImage,
  getAccountImages,
  deleteAccountImage
} from '../services/storage.service'
import { format } from 'date-fns'
import { getAuth } from './helper'
import { uploadSchema } from '../validators/storage.validator'
import { validateUpload } from '../validators'
import { IDeleteAccountImagePayload } from '../../types/storage.type'

export const uploadImageRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const accountId = auth.account_id

  const files = ctx.request.files

  /** Validation */
  validateUpload(uploadSchema, files)

  const file = (files as any).mf_image_uploader

  if (file) {
    const { path, name } = file
    const result = await uploadImage(
      `${path}`,
      name,
      `images/_account_${accountId}`,
      format(new Date(), 'yyyy-MM-dd')
    )
    ctx.body = {
      result
    }
  } else {
    return new Error('File not found.')
  }
}
export const getImageListRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const accountId = auth.account_id

  const images = await getAccountImages(`images/_account_${accountId}`)

  ctx.body = {
    result: images
  }
}

export const deleteImageRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const { filename } = ctx.request.body as IDeleteAccountImagePayload

  console.log(filename)

  if (filename) {
    const result = await deleteAccountImage(filename)
    console.log(result)
    ctx.body = {
      result
    }
  } else {
    return new Error('File not specified.')
  }
}
