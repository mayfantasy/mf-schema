import {
  IUploadImagePayload,
  IDeleteAccountImagePayload
} from '../types/storage.type'
import { api } from '.'

export const uploadImageRequest = (payload: IUploadImagePayload) => {
  const { file } = payload
  const form = new FormData()
  form.append('file', file, file.name)
  return api.post(`/api/storage/upload-image`, form)
}

export const getAccountImagesRequest = () => {
  return api.get(`/storage/list-image`)
}

export const deleteAccountImageRequest = (filename: string) => {
  return api.post('/storage/delete-image', {
    filename
  } as IDeleteAccountImagePayload)
}
