import { accountDb } from './db/admin.db'
import { query as q } from 'faunadb'
import { IAccount } from '../../types/account.type'

export const getAccountByEmail = async (email: string) => {
  const account = accountDb.query<any>(q.Get(q.Match(q.Index('email'), email)))
  return account
}
