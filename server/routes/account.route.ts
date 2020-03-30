import Koa from 'koa'
import { createAccount } from '../services/account.service'
import {
  IServerCreateAccountPayload,
  IClientCreateAccountPayload
} from '../../types/account.type'
import { clientCreateAccountPayloadSchema } from '../validators/account.validator'
import { validatePayload } from '../validators'

export const createAccountRoute = (tier: number) => async (
  ctx: Koa.Context
) => {
  const payload = ctx.request.body as IClientCreateAccountPayload

  /** Validation */
  validatePayload(clientCreateAccountPayloadSchema, payload)

  const account = await createAccount(payload)
  ctx.body = {
    result: account
  }
}
