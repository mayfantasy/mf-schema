import { accountDb } from './db/admin.db'
import { query as q } from 'faunadb'
import { IAccount } from '../../types/account.type'
import {
  ICreateUserPayload,
  IUser,
  IUpdateUserInfoPayload,
  IUserLoginPayload,
  IUpdateUserMetaPayload,
  IDeleteUserMetaItemPayload
} from '../../types/user.type'
import { client } from './db/client.db'
import { generateUserJWTToken } from './user_jwt'

export const createUser = async (
  api_key: string,
  payload: ICreateUserPayload
) => {
  const clientDB = client(api_key)

  // Check email uniqueness
  await clientDB.query(
    q.Paginate(q.Match(q.Index('get_user_by_email'), payload.email))
  )

  // Create user
  const user: any = await clientDB.query(
    q.Create(q.Collection('user'), {
      data: payload
    })
  )

  const userData = { ...user.data }
  delete userData.password

  return {
    id: user.ref.id,
    ...userData
  }
}

export const updateUser = async (
  api_key: string,
  payload: IUpdateUserInfoPayload
) => {
  const clientDB = client(api_key)

  // Update user
  const user: any = await clientDB.query(
    q.Update(q.Ref(q.Collection('user'), payload.id), {
      data: payload
    })
  )

  return {
    id: user.ref.id,
    ...user.data
  }
}

export const getUserList = async (api_key: string) => {
  const clientDB = client(api_key)
  const users: any = await clientDB.query(
    q.Map(
      q.Paginate(q.Match(q.Index('all_users'))),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  )

  const userListData = users.data.map((c: any) => {
    const userData = { ...c.data }
    delete userData.password
    return {
      id: c.ref.id,
      ...userData
    }
  })

  return userListData
}

export const getUserById = async (api_key: string, id: string) => {
  const clientDB = client(api_key)
  const user: any = await clientDB.query(q.Get(q.Ref(q.Collection('user'), id)))

  const userData = { ...user.data }
  delete userData.password

  return {
    id: user.ref.id,
    ...userData
  }
}

export const getUserByEmail = async (api_key: string, email: string) => {
  const clientDB = client(api_key)

  const user: any = await clientDB.query(
    q.Get(q.Match(q.Index('get_user_by_email'), [email]))
  )

  return {
    id: user.ref.id,
    ...user.data
  }
}

export const deleteUserById = async (api_key: string, id: string) => {
  const clientDB = client(api_key)

  // Delete object
  const user: any = await clientDB.query(
    q.Delete(q.Ref(q.Collection('user'), id))
  )

  return {
    id: user.ref.id,
    ...user.data
  }
}

export const updateUserMeta = async (
  api_key: string,
  id: string,
  payload: IUpdateUserMetaPayload
) => {
  const clientDB = client(api_key)
  const user: any = await clientDB.query(q.Get(q.Ref(q.Collection('user'), id)))
  const { key, value } = payload

  const meta = user.meta || {}

  // Update user
  const updatedUser: any = await clientDB.query(
    q.Update(q.Ref(q.Collection('user'), id), {
      data: { meta: { ...meta, [key]: value } }
    })
  )

  const userData = updatedUser.data
  delete userData.password
  return {
    id: updatedUser.ref.id,
    ...userData
  }
}

export const deleteUserMeta = async (
  api_key: string,
  id: string,
  payload: IDeleteUserMetaItemPayload
) => {
  const clientDB = client(api_key)
  const user: any = await clientDB.query(q.Get(q.Ref(q.Collection('user'), id)))
  const { key } = payload

  const meta = user.data.meta || {}

  if (meta[key]) {
    meta[key] = null
  } else {
    throw new Error(`[${key}] not found in user meta.`)
  }

  // Update user
  const updatedUser: any = await clientDB.query(
    q.Update(q.Ref(q.Collection('user'), id), {
      data: { meta }
    })
  )

  const userData = updatedUser.data
  delete userData.password

  return {
    id: updatedUser.ref.id,
    ...userData
  }
}
