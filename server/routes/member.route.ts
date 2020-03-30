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

export const createMemberRoute = (tier: number) => async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const payload = ctx.request.body as ICreateMemberPayload

  /** Validation */
  validatePayload(createMemberPayloadSchema, payload)

  const member = await createMember(
    auth.db_key,
    auth.api_key,
    auth.account_id,
    payload
  )

  ctx.body = {
    result: member
  }
}

export const getMemberListRoute = (tier: number) => async (
  ctx: Koa.Context
) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)

  if (auth.account_id) {
    const member = await getMemberList(auth.account_id)

    ctx.body = {
      result: member
    }
  } else {
    throw new Error('Unauthorized.')
  }
}

export const getMemberByIdRoute = (tier: number) => async (
  ctx: Koa.Context
) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const id = ctx.params.id

  if (auth.account_id) {
    if (id) {
      const member = await getMemberById(id)

      ctx.body = {
        result: member
      }
    } else {
      throw new Error('Invalid member id.')
    }
  } else {
    throw new Error('Unauthorized.')
  }
}

export const updateMemberRoute = (tier: number) => async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const payload = ctx.request.body as IUpdateMemberPayload

  /** Validation */
  validatePayload(updateMemberPayloadSchema, payload)
  if (auth.account_id) {
    const member = await updateMember(
      auth.db_key,
      auth.api_key,
      auth.account_id,
      payload
    )
    ctx.body = {
      result: member
    }
  } else {
    throw new Error('Unauthorized.')
  }
}

export const deleteMemberRoute = (tier: number) => async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx, tier)) || ({} as any)
  const id = ctx.params.id

  /** Validation */
  if (auth.account_id) {
    if (id) {
      const member = await deleteMemberById(id)

      ctx.body = {
        result: member
      }
    } else {
      throw new Error('Invalid member id.')
    }
  } else {
    throw new Error('Unauthorized.')
  }
}
