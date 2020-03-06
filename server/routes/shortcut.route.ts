import Koa from 'koa'
import { getAuth } from './helper'
import { IShortcutForm } from '../../types/shortcut.type'
import { validatePayload } from '../validators'
import { createShortcutPayloadSchema } from '../validators/shortcut.validator'
import {
  createShortcut,
  getShortcutList,
  deleteShortcutById
} from '../services/shortcut.service'

export const createShortcutRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const payload = ctx.request.body as IShortcutForm

  /** Validation */
  validatePayload(createShortcutPayloadSchema, payload)

  const shorcut = await createShortcut(auth.api_key, payload)

  ctx.body = {
    result: shorcut
  }
}

export const getShortcutListRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const shorcuts = await getShortcutList(auth.api_key)
  ctx.body = {
    result: shorcuts
  }
}

export const deleteShortcutByIdRoute = async (ctx: Koa.Context) => {
  const auth = (await getAuth(ctx)) || ({} as any)
  const id = ctx.params.id

  /** Validation */
  if (id) {
    const shorcut = await deleteShortcutById(auth.api_key, id)
    ctx.body = {
      result: shorcut
    }
  } else {
    throw new Error('Invalid Shortcut ID.')
  }
}
