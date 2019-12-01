import { Storage } from '@google-cloud/storage'
import { env } from '../../config/env.config'
import randomstring from 'randomstring'
import { format } from 'date-fns'

const storage = new Storage()
const bucketName = env.GOOGLE_STORAGE_BUCKET_NAME
const prefix = env.GOOGLE_STORAGE_PREFIX
const trashFolder = env.GOOGLE_STORAGE_TRASH_FOLDER

export const uploadImage = async (
  src: string,
  name: string,
  folder1: string,
  folder2: string
) => {
  if (bucketName && folder1 && folder2) {
    return await storage.bucket(bucketName).upload(src, {
      gzip: true,
      destination: `${folder1}/${folder2}/${format(
        new Date(),
        'yyyyMMdd'
      )}_${randomstring.generate(8)}_${name}`,
      metadata: {
        cacheControl: 'public, max-age=31536000'
      }
    })
  }
  return new Error('Missing params. [bucketName or folder1 or folder2]')
}

export const getImageList = async (folder1: string, folder2: string) => {
  if (bucketName && folder1 && folder2) {
    return await storage.bucket(bucketName).getFiles({
      prefix,
      delimiter:
        env.NODE_ENV === 'development'
          ? `/dev/${folder1}/${folder2}`
          : `/production/${folder1}/${folder2}`
    })
  }
  return new Error('Missing params. [bucketName or folder1 or folder2]')
}

export const deleteImage = async (src: string) => {
  if (bucketName && trashFolder) {
    return await storage
      .bucket(bucketName)
      .file(src)
      .move(`/${trashFolder}/${src}`)
  }
  return new Error('Missing params. [bucketName or trashFolder]')
}
