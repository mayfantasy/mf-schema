import { api } from '.'
import { ILoginPayload } from '../types/auth.type'

export const loginRequest = (account: ILoginPayload) => {
  return api.post('/auth/login', account)
}

export const loginWithTokenRequest = (payload: { token: string }) => {
  return api.post('/auth/token', payload)
}
