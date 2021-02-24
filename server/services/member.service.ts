import { accountDb } from './db/admin.db'
import { query as q } from 'faunadb'
import { IAccount } from '../../types/account.type'
import {
  ICreateMemberPayload,
  IMember,
  IUpdateMemberPayload
} from '../../types/member.type'
import { getAccountProfileData } from './helper'

/**
 * ||=========================
 * || Create member
 */
export const createMember = async (
  db_key: string,
  api_key: string,
  account_id: string,
  payload: ICreateMemberPayload
) => {
  // Check email uniqueness
  // 1. Email in existing members already being checked by 'get_member_by_email'
  // 2. Email in existing accounts
  const account = (await accountDb.query(
    q.Paginate(q.Match(q.Index('get_account_by_email'), payload.email), {
      size: 500
    })
  )) as any

  if (!account.data.length) {
    // Create member
    const member: any = await accountDb.query(
      q.Create(q.Collection('member'), {
        data: {
          ...payload,
          db_key,
          api_key,
          account_id
        }
      })
    )

    const memberData = getAccountProfileData(member.data)

    return {
      id: member.ref.id,
      ...memberData
    }
  } else {
    throw new Error('Account already exist.')
  }
}

/**
 * ||=========================
 * || Update member
 */
export const updateMember = async (
  db_key: string,
  api_key: string,
  account_id: string,
  payload: IUpdateMemberPayload
) => {
  const _payload = { ...payload }
  if (!_payload.password) {
    delete _payload.password
  }

  // Update member
  const member: any = await accountDb.query(
    q.Update(q.Ref(q.Collection('member'), _payload.id), {
      data: { ..._payload, db_key, api_key, account_id }
    })
  )

  const memberData = getAccountProfileData(member.data)

  return {
    id: member.ref.id,
    ...memberData
  }
}

/**
 * ||=========================
 * || Get member list
 */
export const getMemberList = async (account_id: string) => {
  const members: any = await accountDb.query(
    q.Map(
      q.Paginate(q.Match(q.Index('get_members_by_account_id'), account_id), {
        size: 500
      }),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  )

  const memberListData = members.data.map((c: any) => {
    const memberData = getAccountProfileData(c.data)
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
export const getMemberById = async (id: string) => {
  const member: any = await accountDb.query(
    q.Get(q.Ref(q.Collection('member'), id))
  )

  const memberData = getAccountProfileData(member.data)

  return {
    id: member.ref.id,
    ...memberData
  }
}

/**
 * ||=========================
 * || Delete member
 */
export const deleteMemberById = async (id: string) => {
  // Delete object
  const member: any = await accountDb.query(
    q.Delete(q.Ref(q.Collection('member'), id))
  )

  const memberData = getAccountProfileData(member)

  return {
    id: member.ref.id,
    ...memberData
  }
}
