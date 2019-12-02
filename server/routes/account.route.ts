import Koa from 'koa'
import { createAccount } from '../services/account.service'
import {
  IServerCreateAccountPayload,
  IClientCreateAccountPayload
} from '../../types/account.type'

export const createAccountRoute = async (ctx: Koa.Context) => {
  const payload = ctx.request.body as IClientCreateAccountPayload
  const account = await createAccount(payload)
  ctx.body = {
    result: account
  }
}
