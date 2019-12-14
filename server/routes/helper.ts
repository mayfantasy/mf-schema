import Koa from 'koa'
import { varify } from '../jwt'
import { ILoginPayload } from '../../types/auth.type'
import { getAccountByEmail } from '../services/auth.service'
import { handleRxp } from '../../helpers/utils.helper'

export const getApiKey = async (ctx: Koa.Context) => {
  const token = ctx.headers['authentication']

  try {
    const user = varify(token)
    const email = ((user as any).data as ILoginPayload).email

    const account = await getAccountByEmail(email)

    const api_key = account.data.api_key
    return api_key
  } catch (e) {
    ctx.status = 401
    ctx.body = {
      message: 'Unauthenticated.'
    }
  }
}

export const testHandle = async (ctx: Koa.Context, value: string) => {
  if (!handleRxp.test(value)) {
    ctx.status = 400
    ctx.body = {
      message: `Invalid handle or key [${value}]`
    }
  }
}
