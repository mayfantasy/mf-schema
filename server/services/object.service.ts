import { accountDb } from './db/admin.db'
import faunadb, { query as q } from 'faunadb'
import { IAccount } from '../../types/account.type'
import { client } from './db/client.db'

export interface IObjectServiceMeta {
  collection_handle: string
  schema_handle: string
}

export interface IObjectServiceMetaWithID {
  collection_handle: string
  schema_handle: string
  id: string
}

const validateCollectionAndSchemaHandles = async (
  client: faunadb.Client,
  collection_handle: string,
  schema_handle: string
) => {
  // Check collection handle
  await client.query(
    q.Paginate(q.Match(q.Index('get_collection_by_handle'), collection_handle))
  )

  // Check schema handle
  const schema: any = await client.query(
    q.Get(q.Match(q.Index('get_schema_by_handle'), schema_handle))
  )

  return schema
}

const validateObjectHandle = async (
  client: faunadb.Client,
  object_handle: string
) => {
  // Check handle uniqueness
  await client.query(
    q.Paginate(q.Match(q.Index('get_object_by_handle'), object_handle))
  )
}

export const createObject = async (
  api_key: string,
  payload: any,
  meta: IObjectServiceMeta
) => {
  const clientDB = client(api_key)
  const { collection_handle, schema_handle } = meta

  await validateCollectionAndSchemaHandles(
    clientDB,
    collection_handle,
    schema_handle
  )
  await validateObjectHandle(clientDB, payload._handle)

  // Create object
  const object: any = await clientDB.query(
    q.Create(q.Collection('object'), {
      data: { ...payload, _schema_handle: meta.schema_handle }
    })
  )
  return {
    id: object.ref.id,
    ...object.data
  }
}

export const getObjectList = async (
  api_key: string,
  meta: IObjectServiceMeta
) => {
  const clientDB = client(api_key)
  const { schema_handle, collection_handle } = meta

  await validateCollectionAndSchemaHandles(
    clientDB,
    collection_handle,
    schema_handle
  )

  // Object list
  const objects: any = await clientDB.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('get_objects_by_schema_handle'), schema_handle)
      ),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  )
  return objects.data.map((o: any) => {
    return {
      id: o.ref.id,
      ...o.data
    }
  })
}

export const getObjectById = async (
  api_key: string,
  meta: IObjectServiceMetaWithID
) => {
  const { collection_handle, schema_handle, id } = meta
  const clientDB = client(api_key)

  const schema = await validateCollectionAndSchemaHandles(
    clientDB,
    collection_handle,
    schema_handle
  )

  // Get object
  const object: any = await clientDB.query(
    q.Get(q.Ref(q.Collection('object'), id))
  )

  return {
    id: object.ref.id,
    schema: {
      id: schema.ref.id,
      ...schema.data
    },
    ...object.data
  }
}

export const updateObjectById = async (
  api_key: string,
  payload: any,
  meta: IObjectServiceMetaWithID
) => {
  const clientDB = client(api_key)
  const { collection_handle, schema_handle, id } = meta

  const schema = await validateCollectionAndSchemaHandles(
    clientDB,
    collection_handle,
    schema_handle
  )
  await validateObjectHandle(clientDB, payload._handle)

  // Update object
  const object: any = await clientDB.query(
    q.Update(q.Ref(q.Collection('object'), id), {
      data: payload
    })
  )

  return {
    id: object.ref.id,
    schema: {
      id: schema.ref.id,
      ...schema.data
    },
    ...object.data
  }
}

export const deleteObjectById = async (
  api_key: string,
  meta: IObjectServiceMetaWithID
) => {
  const clientDB = client(api_key)
  const { collection_handle, schema_handle, id } = meta

  const schema = await validateCollectionAndSchemaHandles(
    clientDB,
    collection_handle,
    schema_handle
  )

  // Delete object
  const object: any = await clientDB.query(
    q.Delete(q.Ref(q.Collection('object'), id))
  )

  return {
    id: object.ref.id,
    schema: {
      id: schema.ref.id,
      ...schema.data
    },
    ...object.data
  }
}
