import { accountDb } from './db/admin.db'
import { query as q } from 'faunadb'
import { getAccountNoPassData } from './helper'

export const getAccountByEmail = async (email: string) => {
  try {
    /**
     * ||=========================
     * || Check if it's an account
     */
    const account = await accountDb.query<any>(
      q.Get(q.Match(q.Index('get_account_by_email'), email))
    )

    return { id: account.ref.id, ...account.data }
  } catch (e) {
    /**
     * ||=========================
     * || Check if it's a member
     */
    const account = await accountDb.query<any>(
      q.Get(q.Match(q.Index('get_member_by_email'), email))
    )

    const accountData = getAccountNoPassData(account.data)

    return { id: account.ref.id, ...accountData }
  }
}

export const getAccountByEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    /**
     * ||=========================
     * || Check if it's an account
     */
    const account = await accountDb.query<any>(
      q.Get(
        q.Match(q.Index('get_account_by_email_and_password'), [email, password])
      )
    )

    return { id: account.ref.id, ...account.data }
  } catch (e) {
    /**
     * ||=========================
     * || Check if it's a member
     */
    const account = await accountDb.query<any>(
      q.Get(
        q.Match(q.Index('get_member_by_email_and_password'), [email, password])
      )
    )

    const accountData = getAccountNoPassData(account.data)
    return { id: account.ref.id, ...accountData }
  }
}
