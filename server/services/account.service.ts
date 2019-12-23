import {
  IServerCreateAccountPayload,
  IClientCreateAccountPayload
} from '../../types/account.type'
import { accountDb } from './db/admin.db'
import randomstring from 'randomstring'
import { query as q } from 'faunadb'
import { client } from './db/client.db'

export const createAccount = async (payload: IClientCreateAccountPayload) => {
  const { email, username, password } = payload

  // Create client database
  const db_id = randomstring.generate(15)
  const db_key = `mf-schema-client-${db_id}`

  await accountDb.query(q.CreateDatabase({ name: db_key }))

  const role = await accountDb.query<any>(
    q.CreateKey({
      database: q.Database(db_key),
      role: 'server'
    })
  )

  const api_key = role.secret

  // Connect to Client database
  const clientDB = client(api_key)

  // Create Access Key Collection
  await clientDB.query(q.CreateCollection({ name: 'access_key' }))

  await clientDB.query(
    q.CreateIndex({
      name: 'all_access_keys',
      source: q.Collection('access_key')
    })
  )

  await clientDB.query(
    q.CreateIndex({
      name: 'get_access_key_by_key',
      source: q.Collection('access_key'),
      terms: [
        {
          field: ['data', 'key']
        }
      ],
      unique: true
    })
  )

  // Create Collection Collection
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

  // Create Schema Collection
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

  // Create User Collection
  await clientDB.query(q.CreateCollection({ name: 'user' }))

  await clientDB.query(
    q.CreateIndex({
      name: 'all_users',
      source: q.Collection('user')
    })
  )

  await clientDB.query(
    q.CreateIndex({
      name: 'get_user_by_email',
      source: q.Collection('user'),
      terms: [
        {
          field: ['data', 'email']
        }
      ],
      unique: true
    })
  )

  await clientDB.query(
    q.CreateIndex({
      name: 'get_user_by_email_and_password',
      source: q.Collection('user'),
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

  // Create object collection
  await clientDB.query(q.CreateCollection({ name: 'object' }))
  await clientDB.query(
    q.CreateIndex({
      name: 'all_objects',
      source: q.Collection('object')
    })
  )
  await clientDB.query(
    q.CreateIndex({
      name: 'get_object_by_handle',
      source: q.Collection('object'),
      terms: [
        {
          field: ['data', '_handle']
        }
      ],
      uniqueness: true
    })
  )
  await clientDB.query(
    q.CreateIndex({
      name: 'get_objects_by_schema_handle',
      source: q.Collection('object'),
      terms: [
        {
          field: ['data', '_schema_handle']
        }
      ]
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

export const getAccountList = async () => {
  const accounts: any = await accountDb.query(
    q.Map(
      q.Paginate(q.Match(q.Index('all_accounts'))),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  )
  return accounts.data.map((c: any) => ({
    id: c.ref.id,
    ...c.data
  }))
}
