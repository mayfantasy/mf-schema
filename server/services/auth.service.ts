import { accountDb } from './db/admin.db'
import { query as q } from 'faunadb'
import { env } from '../../config/env.config'

export const getAccountByEmail = async (email: string) => {
  const account = await accountDb.query<any>(
    q.Get(q.Match(q.Index('get_account_by_email'), email))
  )

  const accountData = { ...account.data }
  delete accountData.password

  return { id: account.ref.id, ...accountData }
}

export const getAccountByEmailAndPassword = async (
  email: string,
  password: string
) => {
  const account = await accountDb.query<any>(
    q.Get(
      q.Match(q.Index('get_account_by_email_and_password'), [email, password])
    )
  )

  const accountData = { ...account.data }
  delete accountData.password

  return { id: account.ref.id, ...accountData }
}
