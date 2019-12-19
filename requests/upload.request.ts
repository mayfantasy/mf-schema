import { IUploadImagePayload } from '../types/upload.type'
import { api } from '.'

export const uploadImageRequest = (payload: IUploadImagePayload) => {
  const { file } = payload
  const form = new FormData()
  form.append('file', file, file.name)
  return api.post(`/api/upload/image`, form)
}
