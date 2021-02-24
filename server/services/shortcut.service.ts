import { query as q } from 'faunadb'

import { client } from './db/client.db'
import { IShortcutForm } from '../../types/shortcut.type'
import { createShortcutCollectionIfNotExist } from './db/create-collection.db'

export const createShortcut = async (
  api_key: string,
  payload: IShortcutForm
) => {
  const clientDB = client(api_key)
  await createShortcutCollectionIfNotExist(clientDB)

  // Create collection
  const shortcut: any = await clientDB.query(
    q.Create(q.Collection('shortcut'), {
      data: payload
    })
  )

  return {
    id: shortcut.ref.id,
    ...shortcut.data
  }
}

export const getShortcutList = async (api_key: string) => {
  const clientDB = client(api_key)

  await createShortcutCollectionIfNotExist(clientDB)
  const shortcuts: any = await clientDB.query(
    q.Map(
      q.Paginate(q.Match(q.Index('all_shortcuts')), { size: 500 }),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  )
  return shortcuts.data.map((c: any) => ({
    id: c.ref.id,
    ...c.data
  }))
}

export const deleteShortcutById = async (api_key: string, id: string) => {
  const clientDB = client(api_key)
  const shortcut: any = await clientDB.query(
    q.Delete(q.Ref(q.Collection('shortcut'), id))
  )
  return {
    id: shortcut.ref.id,
    ...shortcut.data
  }
}
