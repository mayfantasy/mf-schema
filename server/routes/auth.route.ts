import Koa from 'koa'
import { ILoginPayload } from '../../types/auth.type'
import { getAccountByEmail } from '../services/auth.service'
import { sign, varify } from '../jwt'
import { IBasicAccountInfo } from '../../types/account.type'

export const loginRoute = async (ctx: Koa.Context) => {
  const payload = ctx.request.body as ILoginPayload

  const email = payload.email
  const account = await getAccountByEmail(email)

  const token = sign(payload)

  ctx.body = {
    result: {
      token,
      account: {
        email: account.data.email,
        username: account.data.username
      } as IBasicAccountInfo
    }
  }
}

export const loginWithTokenRoute = async (ctx: Koa.Context) => {
  const payload = ctx.request.body as { token: string }

  const token = payload.token
  const user = varify(token)

  const email = ((user as any).data as ILoginPayload).email
  const account = await getAccountByEmail(email)

  ctx.body = {
    result: {
      account: {
        email: account.data.email,
        username: account.data.username
      } as IBasicAccountInfo
    }
  }
}
