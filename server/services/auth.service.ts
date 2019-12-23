import { accountDb } from './db/admin.db'
import { query as q } from 'faunadb'

export const getAccountByEmail = async (email: string) => {
  const account = accountDb.query<any>(
    q.Get(q.Match(q.Index('get_account_by_email'), email))
  )
  return account
}

export const getAccountByEmailAndPassword = async (
  email: string,
  password: string
) => {
  const account = accountDb.query<any>(
    q.Get(
      q.Match(q.Index('get_account_by_email_and_password'), [email, password])
    )
  )
  return account
}
