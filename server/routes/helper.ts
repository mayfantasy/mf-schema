import Koa from 'koa'
import { varify } from '../jwt'
import { ILoginPayload } from '../../types/auth.type'
import { getAccountByEmail } from '../services/auth.service'
export const getApiKey = async (ctx: Koa.Context) => {
  const token = ctx.headers['authentication']

  const user = varify(token)
  const email = ((user as any).data as ILoginPayload).email

  const account = await getAccountByEmail(email)

  const api_key = account.data.api_key
  return api_key
}
