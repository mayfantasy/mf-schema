import { accountDb } from './db/admin.db'
import { query as q } from 'faunadb'
import { IAccount } from '../../types/account.type'
import {
  ICreateMemberPayload,
  IMember,
  IUpdateMemberPayload
} from '../../types/member.type'
import { client } from './db/client.db'
import { createMemberCollectionIfNotExist } from './db/create-collection.db'

/**
 * ||=========================
 * || Create member
 */
export const createMember = async (
  api_key: string,
  payload: ICreateMemberPayload
) => {
  const clientDB = client(api_key)
  await createMemberCollectionIfNotExist(clientDB)

  // Check email uniqueness
  await clientDB.query(
    q.Paginate(q.Match(q.Index('get_member_by_email'), payload.email))
  )

  // Create member
  const member: any = await clientDB.query(
    q.Create(q.Collection('member'), {
      data: payload
    })
  )

  const memberData = { ...member.data }
  delete memberData.password

  return {
    id: member.ref.id,
    ...memberData
  }
}

/**
 * ||=========================
 * || Update member
 */
export const updateMember = async (
  api_key: string,
  payload: IUpdateMemberPayload
) => {
  const clientDB = client(api_key)

  const _payload = { ...payload }
  if (!_payload.password) {
    delete _payload.password
  }

  // Update member
  const member: any = await clientDB.query(
    q.Update(q.Ref(q.Collection('member'), _payload.id), {
      data: _payload
    })
  )

  const memberData = { ...member.data }
  delete memberData.password

  return {
    id: member.ref.id,
    ...memberData
  }
}

/**
 * ||=========================
 * || Get member list
 */
export const getMemberList = async (api_key: string) => {
  const clientDB = client(api_key)
  await createMemberCollectionIfNotExist(clientDB)

  const members: any = await clientDB.query(
    q.Map(
      q.Paginate(q.Match(q.Index('all_members'))),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  )

  const memberListData = members.data.map((c: any) => {
    const memberData = { ...c.data }
    delete memberData.password
    return {
      id: c.ref.id,
      ...memberData
    }
  })

  return memberListData
}

/**
 * ||=========================
 * || Get member by ID
 */
export const getMemberById = async (api_key: string, id: string) => {
  const clientDB = client(api_key)
  const member: any = await clientDB.query(
    q.Get(q.Ref(q.Collection('member'), id))
  )

  const memberData = { ...member.data }
  delete memberData.password

  return {
    id: member.ref.id,
    ...memberData
  }
}

/**
 * ||=========================
 * || Delete member
 */
export const deleteMemberById = async (api_key: string, id: string) => {
  const clientDB = client(api_key)

  // Delete object
  const member: any = await clientDB.query(
    q.Delete(q.Ref(q.Collection('member'), id))
  )

  return {
    id: member.ref.id,
    ...member.data
  }
}
