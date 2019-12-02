import {
  IServerCreateAccountPayload,
  IClientCreateAccountPayload
} from '../../types/account.type'
import { master, accountDb } from './db/admin.db'
import randomstring from 'randomstring'
import { query as q } from 'faunadb'
import { client } from './db/client.db'

export const createAccount = async (payload: IClientCreateAccountPayload) => {
  const { email, username, password } = payload

  // Create client database
  const db_id = randomstring.generate(15)
  const db_key = `mf-schema-client-${db_id}`

  await master.query(q.CreateDatabase({ name: db_key }))

  const role = await master.query<any>(
    q.CreateKey({
      database: q.Database(db_key),
      role: 'server'
    })
  )

  const api_key = role.secret

  // Connect to Client database
  const clientDB = client(api_key)

  // Create Collection
  await clientDB.query(q.CreateCollection({ name: 'collection' }))

  await clientDB.query(
    q.CreateIndex({
      name: 'all_collections',
      source: q.Collection('collection')
    })
  )

  await clientDB.query(
    q.CreateIndex({
      name: 'get_collection_by_handle',
      source: q.Collection('collection'),
      terms: [
        {
          field: ['data', 'handle']
        }
      ],
      unique: true
    })
  )

  // Create Schema
  await clientDB.query(q.CreateCollection({ name: 'schema' }))

  await clientDB.query(
    q.CreateIndex({
      name: 'all_schemas',
      source: q.Collection('schema')
    })
  )

  await clientDB.query(
    q.CreateIndex({
      name: 'get_schema_by_handle',
      source: q.Collection('schema'),
      terms: [
        {
          field: ['data', 'handle']
        }
      ],
      unique: true
    })
  )

  // Create Acccount
  const account = await accountDb.query(
    q.Create(q.Collection('account'), {
      data: {
        email,
        username,
        password,
        tier: 1,
        db_key,
        api_key
      } as IServerCreateAccountPayload
    })
  )

  return account
}
