import { accountDb } from './db/admin.db'
import { query as q } from 'faunadb'
import { IAccount } from '../../types/account.type'
import { ICreateSchemaPayload, ISchema } from '../../types/schema.type'
import { client } from './db/client.db'

export const createSchema = async (
  api_key: string,
  payload: ICreateSchemaPayload
) => {
  const clientDB = client(api_key)

  // Check handle uniqueness
  await clientDB.query(
    q.Paginate(q.Match(q.Index('get_schema_by_handle'), payload.handle))
  )

  // Create schema
  const schema: any = await clientDB.query(
    q.Create(q.Collection('schema'), {
      data: payload
    })
  )

  return {
    id: schema.ref.id,
    ...schema.data
  }
}

export const getSchemaList = async (api_key: string) => {
  const clientDB = client(api_key)
  const schemas: any = await clientDB.query(
    q.Map(
      q.Paginate(q.Match(q.Index('all_schemas'))),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  )
  return schemas.data.map((c: any) => ({
    id: c.ref.id,
    ...c.data
  }))
}
