import { accountDb } from './db/admin.db'
import { query as q } from 'faunadb'
import { IAccount } from '../../types/account.type'
import { client } from './db/client.db'

interface IObjectServiceMeta {
  collection_handle: string
  schema_handle: string
}

interface IObjectServiceMetaWithID {
  collection_handle: string
  schema_handle: string
  id: string
}

export const createObject = async (
  api_key: string,
  payload: any,
  meta: IObjectServiceMeta
) => {
  const clientDB = client(api_key)

  // Check handle uniqueness
  await clientDB.query(
    q.Paginate(q.Match(q.Index('get_object_by_handle'), payload._handle))
  )

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
  const { schema_handle } = meta
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
  const clientDB = client(api_key)
  // const object: any = await clientDB.query(
  //   q.Get(q.Ref(q.Collection('object'), id))
  // )

  // const collectionId = object.data.collection_id

  // const collection: any = await clientDB.query(
  //   q.Get(q.Ref(q.Collection('collection'), object.data.collection_id))
  // )

  // return {
  //   id: object.ref.id,
  //   collection: {
  //     id: collectionId,
  //     ...collection.data
  //   },
  //   ...object.data
  // }
}

export const updateObjectById = async (
  api_key: string,
  payload: any,
  meta: IObjectServiceMetaWithID
) => {
  const clientDB = client(api_key)
  // const object: any = await clientDB.query(
  //   q.Get(q.Ref(q.Collection('object'), id))
  // )

  // const collectionId = object.data.collection_id

  // const collection: any = await clientDB.query(
  //   q.Get(q.Ref(q.Collection('collection'), object.data.collection_id))
  // )

  // return {
  //   id: object.ref.id,
  //   collection: {
  //     id: collectionId,
  //     ...collection.data
  //   },
  //   ...object.data
  // }
}

export const deleteObjectById = async (
  api_key: string,
  meta: IObjectServiceMetaWithID
) => {
  const clientDB = client(api_key)
  // const object: any = await clientDB.query(
  //   q.Get(q.Ref(q.Collection('object'), id))
  // )

  // const collectionId = object.data.collection_id

  // const collection: any = await clientDB.query(
  //   q.Get(q.Ref(q.Collection('collection'), object.data.collection_id))
  // )

  // return {
  //   id: object.ref.id,
  //   collection: {
  //     id: collectionId,
  //     ...collection.data
  //   },
  //   ...object.data
  // }
}
