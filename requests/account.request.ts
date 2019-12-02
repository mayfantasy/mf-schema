import { api } from '.'
import { IClientCreateAccountPayload } from '../types/account.type'

export const createAccountRequest = (account: IClientCreateAccountPayload) => {
  return api.post('/account/create', account)
}
