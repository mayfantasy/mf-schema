import Koa from 'koa'
import { varify } from '../jwt'
import { ILoginPayload } from '../../types/auth.type'
import { getAccountByEmail } from '../services/auth.service'
import { handleRxp } from '../../helpers/utils.helper'
import { getAccountList } from '../services/account.service'
import { IAccount } from '../../types/account.type'

export const getAuth = async (ctx: Koa.Context) => {
  console.log(ctx.url)
  const token = ctx.headers['authentication']
  const accessKey = ctx.headers['x-acc-k']

  try {
    if (token) {
      const user = varify(token)
      const email = ((user as any).data as ILoginPayload).email

      const account = await getAccountByEmail(email)

      const api_key = account.api_key
      return { api_key, account_id: account.id }
    } else if (accessKey) {
      const accounts = await getAccountList()
      const foundAccount = accounts.find((a: IAccount) =>
        a.access_keys.includes(accessKey)
      )

      const api_key = foundAccount.api_key
      return { api_key, account_id: foundAccount.id }
    } else {
      throw new Error('Unauthenticated.')
    }
  } catch (e) {
    ctx.status = 401
    ctx.body = {
      message: 'Unauthenticated.'
    }
  }
}
