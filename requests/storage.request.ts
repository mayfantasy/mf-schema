import {
  IUploadImagePayload,
  IDeleteAccountImagePayload
} from '../types/storage.type'
import { api } from '.'

export const uploadImageRequest = (payload: IUploadImagePayload) => {
  const { file } = payload
  const form = new FormData()
  form.append('file', file, file.name)
  return api.post(`/api/upload/image`, form)
}

export const getAccountImagesRequest = () => {
  return api.get(`/list/image`)
}

export const deleteAccountImageRequest = (filename: string) => {
  return api.post('/delete/image', {
    filename
  } as IDeleteAccountImagePayload)
}
