import { getAuth } from './helper'
import Koa from 'koa'
import { IObjectServiceMetaWithID } from '../services/object.service'
import { sendEmail } from '../services/send-email.service'

export const sendEmailRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as {
    meta: IObjectServiceMetaWithID
    to_email: string
    data: { [key: string]: string }
  }
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
