import Koa from 'koa'
import { getAuth } from './helper'
import {
  ICreateMemberPayload,
  IUpdateMemberPayload
} from '../../types/member.type'
import {
  getMemberList,
  updateMember,
  deleteMemberById,
  createMember,
  getMemberById
} from '../services/member.service'

import {
  createMemberPayloadSchema,
  updateMemberPayloadSchema
} from '../validators/member.validator'
import { validatePayload } from '../validators'

export const createMemberRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as ICreateMemberPayload

  /** Validation */
  validatePayload(createMemberPayloadSchema, payload)

  const member = await createMember(auth.api_key, payload)

  ctx.body = {
    result: member
  }
}

export const getMemberListRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const member = await getMemberList(auth.api_key)

  ctx.body = {
    result: member
  }
}

export const getMemberByIdRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const id = ctx.params.id

  if (id) {
    const member = await getMemberById(auth.api_key, id)
    ctx.body = {
      result: member
    }
  } else {
    throw new Error('Invalid member id.')
  }
}

export const updateMemberRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as IUpdateMemberPayload

  /** Validation */
  validatePayload(updateMemberPayloadSchema, payload)

  const member = await updateMember(auth.api_key, payload)
  ctx.body = {
    result: member
  }
}

export const deleteMemberRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const id = ctx.params.id

  /** Validation */
  if (id) {
    const member = await deleteMemberById(auth.api_key, id)

    ctx.body = {
      result: member
    }
  } else {
    throw new Error('Invalid member id.')
  }
}
