import { getAuth } from './helper'
import Koa from 'koa'
import { IObjectServiceMetaWithID } from '../services/object.service'
import { sendEmail } from '../services/send-email.service'
import { sendEmailPayloadSchema } from '../validators/email.validator'
import { validatePayload } from '../validators'

export const sendEmailRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as {
    meta: IObjectServiceMetaWithID
    to_email: string
    data: { [key: string]: string }
  }

  /** Validation */
  validatePayload(sendEmailPayloadSchema, payload)

  const user = await sendEmail(
    auth.api_key,
    payload.meta,
    payload.to_email,
    payload.data
  )

  ctx.body = {
    result: user
  }
}
