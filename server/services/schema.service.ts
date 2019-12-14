import { accountDb } from './db/admin.db'
import { query as q } from 'faunadb'
import { IAccount } from '../../types/account.type'
import {
  ICreateSchemaPayload,
  ISchema,
  IUpdateSchemaPayload
} from '../../types/schema.type'
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

  return {
    id: schema.ref.id,
    ...schema.data
  }
}

export const updateSchema = async (
  api_key: string,
  payload: IUpdateSchemaPayload
) => {
  const clientDB = client(api_key)

  // Update schema
  const schema: any = await clientDB.query(
    q.Update(q.Ref(q.Collection('schema'), payload.id), {
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
  const collections: any = await clientDB.query(
    q.Map(
      q.Paginate(q.Match(q.Index('all_collections'))),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  )

  const schemaListData = schemas.data.map((c: any) => ({
    id: c.ref.id,
    ...c.data
  }))
  const collectionListData = collections.data.map((c: any) => ({
    id: c.ref.id,
    ...c.data
  }))
  return schemaListData.map((s: any) => ({
    collection:
      collectionListData.find((c: any) => c.id === s.collection_id) || null,
    ...s
  }))
}

export const getSchemaById = async (api_key: string, id: string) => {
  const clientDB = client(api_key)
  const schema: any = await clientDB.query(
    q.Get(q.Ref(q.Collection('schema'), id))
  )

  const collectionId = schema.data.collection_id

  const collection: any = await clientDB.query(
    q.Get(q.Ref(q.Collection('collection'), schema.data.collection_id))
  )

  return {
    id: schema.ref.id,
    collection: {
      id: collectionId,
      ...collection.data
    },
    ...schema.data
  }
}
