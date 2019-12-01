import Koa from 'koa'
import { createUser, getUserList, deleteUser } from '../services/user.service'
import {
  uploadImage,
  getImageList,
  deleteImage
} from '../services/storage.service'
import {
  IUploadImagePayload,
  IGetImageListPayload,
  IDeleteImagePayload
} from '../../types/storage.type'

export const uploadImageRoute = async (ctx: Koa.Context) => {
  const files = ctx.request.files
  const { folder1, folder2 } = ctx.query
  if (files) {
    const { file } = files
    const { path, name } = file
    const result = await uploadImage(`${path}`, name, folder1, folder2)
    ctx.body = {
      result
    }
  } else {
    return new Error('File not found.')
  }
}

export const getImageListRoute = async (ctx: Koa.Context) => {
  const { folder1, folder2 } = ctx.request.body as IGetImageListPayload
  const result = await getImageList(folder1, folder2)
  ctx.body = {
    result
  }
}

export const deleteImageRoute = async (ctx: Koa.Context) => {
  const { src } = ctx.request.body as IDeleteImagePayload
  const result = await deleteImage(src)
  ctx.body = {
    result
  }
}
