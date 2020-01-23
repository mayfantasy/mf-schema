import { Storage } from '@google-cloud/storage'
import { env } from '../../config/env.config'
import randomstring from 'randomstring'
import { format } from 'date-fns'

const storage = new Storage()
const bucketName = env.GOOGLE_STORAGE_BUCKET_NAME

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

export const getAccountImages = async (path: string) => {
  if (bucketName && path) {
    const [objects] = await storage.bucket(bucketName).getFiles({
      prefix: path
    })
    return objects.map((o: any) => ({
      id: o.metadata.id,
      name: o.metadata.name,
      link: o.metadata.mediaLink
    }))
  }
  return new Error('Missing params. [bucketName or path]')
}

export const deleteAccountImage = async (filename: string) => {
  if (bucketName && filename) {
    const result = await storage
      .bucket(bucketName)
      .file(filename)
      .delete()
    return result
  }
  return new Error('Missing params. [bucketName or filename]')
}
