import { query as q } from 'faunadb'
import { client } from './db/client.db'
import { ICreateAccessKeyPayload } from '../../types/access-key.type'
import randomstring from 'randomstring'
import { accountDb } from './db/admin.db'

export const createAccessKey = async (
  api_key: string,
  account_id: string,
  payload: ICreateAccessKeyPayload
) => {
  const clientDB = client(api_key)
  const key = randomstring.generate(25)

  const account: any = await accountDb.query(
    q.Get(q.Ref(q.Collection('account'), account_id))
  )

  const newAccessKeys = [...(account.data.access_keys || []), key]

  // Set account access key field
  await accountDb.query(
    q.Update(q.Ref(q.Collection('account'), account_id), {
      data: { access_keys: newAccessKeys }
    })
  )

  // Create access key
  const accessKey: any = await clientDB.query(
    q.Create(q.Collection('access_key'), {
      data: { key, ...payload }
    })
  )

  return {
    id: accessKey.ref.id,
    ...accessKey.data
  }
}

export const getAccessKeyList = async (api_key: string) => {
  const clientDB = client(api_key)
  const accessKeys: any = await clientDB.query(
    q.Map(
      q.Paginate(q.Match(q.Index('all_access_keys')), { size: 500 }),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  )
  return accessKeys.data.map((c: any) => ({
    id: c.ref.id,
    ...c.data
  }))
}

export const deleteAccessKeyById = async (
  api_key: string,
  account_id: string,
  id: string
) => {
  const clientDB = client(api_key)

  const account: any = await accountDb.query(
    q.Get(q.Ref(q.Collection('account'), account_id))
  )

  const accessKey: any = await clientDB.query(
    q.Get(q.Ref(q.Collection('access_key'), id))
  )

  const accessKeys = account.data.access_keys
  const index = accessKeys.indexOf(accessKey.data.key)

  const newAccessKeys = [
    ...accessKeys.slice(0, index),
    ...accessKeys.slice(index + 1, accessKeys.length)
  ]

  // Set account access key field
  await accountDb.query(
    q.Update(q.Ref(q.Collection('account'), account_id), {
      data: { access_keys: newAccessKeys }
    })
  )

  // Delete access key
  const deletedAccessKey: any = await clientDB.query(
    q.Delete(q.Ref(q.Collection('access_key'), id))
  )

  return {
    id: deletedAccessKey.ref.id,
    ...deletedAccessKey.data
  }
}
