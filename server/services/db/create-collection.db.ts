import { Client } from 'faunadb'
import { query as q } from 'faunadb'

export const createShortcutCollectionIfNotExist = async (clientDB: Client) => {
  const exist = await clientDB.query(q.IsCollection(q.Collection('shortcut')))
  // const exist = await clientDB.query(q.Collection('shortcut'))
  console.log('Shortcut Collection Exist: ', exist)
  if (!exist) {
    await clientDB.query(
      q.CreateCollection({
        name: 'shortcut'
      })
    )
    await clientDB.query(
      q.CreateIndex({
        name: 'all_shortcuts',
        source: q.Collection('shortcut')
      })
    )
  }
}
