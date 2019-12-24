import { accountDb } from './db/admin.db'
import { query as q } from 'faunadb'
import { IAccount } from '../../types/account.type'
import {
  ICreateUserPayload,
  IUser,
  IUpdateUserInfoPayload,
  IUserLoginPayload
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

  return {
    id: user.ref.id,
    ...user.data
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
  console.log(api_key)
  const clientDB = client(api_key)
  const users: any = await clientDB.query(
    q.Map(
      q.Paginate(q.Match(q.Index('all_users'))),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  )

  console.log('users: ', users)

  const userListData = users.data.map((c: any) => ({
    id: c.ref.id,
    ...c.data
  }))

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
