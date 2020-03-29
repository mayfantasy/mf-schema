import { Client } from 'faunadb'
import { query as q } from 'faunadb'

/**
 * ||==========================
 * || Shortcut
 */
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

/**
 * ||==========================
 * || Member
 */
export const createMemberCollectionIfNotExist = async (clientDB: Client) => {
  const exist = await clientDB.query(q.IsCollection(q.Collection('member')))
  console.log('Member Collection Exist: ', exist)
  if (!exist) {
    await clientDB.query(
      q.CreateCollection({
        name: 'member'
      })
    )
    await clientDB.query(
      q.CreateIndex({
        name: 'all_members',
        source: q.Collection('member')
      })
    )
    await clientDB.query(
      q.CreateIndex({
        name: 'get_member_by_email',
        source: q.Collection('member'),
        terms: [
          {
            field: ['data', 'email']
          }
        ]
      })
    )
    await clientDB.query(
      q.CreateIndex({
        name: 'get_member_by_email_and_password',
        source: q.Collection('member'),
        terms: [
          {
            field: ['data', 'email']
          },
          {
            field: ['data', 'password']
          }
        ],
        unique: true
      })
    )
  }
}
