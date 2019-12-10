import { api } from '.'
import { ILoginPayload } from '../types/auth.type'
import { ICreateSchemaPayload } from '../types/schema.type'

export const createSchemaRequest = (payload: ICreateSchemaPayload) => {
  return api.post('/schema/create', payload)
}

export const getSchemaListRequest = () => {
  return api.get('/schema/list')
}
