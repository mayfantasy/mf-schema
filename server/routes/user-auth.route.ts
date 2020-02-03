import Koa from 'koa'
import { getAuth } from './helper'
import { ILoginPayload } from '../../types/auth.type'
import Joi from 'joi'
import {
  loginUser,
  loginUserWithToken,
  resetUserPasswordByCurrentPassword,
  resetUserEmail,
  sendRecoverEmail,
  resetUserPassword
} from '../services/user-auth.service'
import {
  IUserLoginWithTokenPayload,
  IResetUserPasswordByCurrentPasswordPayload,
  IResetUserEmailPayload,
  IUserSendRecoverEmailPayload,
  IUserResetPasswordPayload
} from '../../types/user.type'
import {
  userLoginPayloadSchema,
  loginUserWithTokenPayloadSchema,
  resetUserPasswordByCurrentPasswordPayloadSchema,
  userSendRecoverEmailPayloadSchema,
  userResetPasswordPayloadSchema,
  resetUseremailPayloadSchema
} from '../validators/user-auth.validator'
import { validatePayload } from '../validators'

export const loginUserRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as ILoginPayload

  /** Validation */
  validatePayload(userLoginPayloadSchema, payload)

  const user = await loginUser(auth.api_key, payload)

  ctx.body = {
    result: user
  }
}

export const loginUserWithTokenRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as IUserLoginWithTokenPayload

  /** Validation */
  validatePayload(loginUserWithTokenPayloadSchema, payload)

  const user = await loginUserWithToken(auth.api_key, payload)

  ctx.body = {
    result: user
  }
}

export const resetUserPasswordByCurrentPasswordRoute = async (
  ctx: Koa.Context
) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as IResetUserPasswordByCurrentPasswordPayload

  /** Validation */
  validatePayload(resetUserPasswordByCurrentPasswordPayloadSchema, payload)

  const user = await resetUserPasswordByCurrentPassword(auth.api_key, payload)

  ctx.body = {
    result: user
  }
}

export const resetUserEmailRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as IResetUserEmailPayload

  validatePayload(resetUseremailPayloadSchema, payload)
  const user = await resetUserEmail(auth.api_key, payload)

  ctx.body = {
    result: user
  }
}

export const sendRecoverEmailRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as IUserSendRecoverEmailPayload

  /** Validation */
  validatePayload(userSendRecoverEmailPayloadSchema, payload)

  const user = await sendRecoverEmail(auth.api_key, payload)

  ctx.body = {
    result: user
  }
}

export const resetPasswordRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as IUserResetPasswordPayload
  const { signature, password } = payload

  /** Validation */
  validatePayload(userResetPasswordPayloadSchema, payload)

  const user = await resetUserPassword(auth.api_key, signature, password)

  ctx.body = {
    result: user
  }
}
