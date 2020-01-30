import Koa from 'koa'
import { varify } from '../jwt'
import { ILoginPayload } from '../../types/auth.type'
import { getAccountByEmail } from '../services/auth.service'
import { handleRxp } from '../../helpers/utils.helper'
import { getAccountList } from '../services/account.service'
import { IAccount } from '../../types/account.type'
import { NextApiRequest, NextApiResponse } from 'next'

export const getAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.url)
  const token = req.headers['authentication'] as string
  const accessKey = req.headers['x-acc-k'] as string

  try {
    if (token) {
      const user = varify(token)
      const email = ((user as any).data as ILoginPayload).email

      const account = await getAccountByEmail(email)

      const api_key = account.api_key
      return { api_key, account_id: account.id }
    } else if (accessKey) {
      const accounts = await getAccountList()
      const foundAccount = accounts.find((a: IAccount) =>
        a.access_keys.includes(accessKey)
      )

      const api_key = foundAccount.api_key
      return { api_key, account_id: foundAccount.id }
    } else {
      throw new Error('Unauthenticated.')
    }
  } catch (e) {
    res.status(401).json({
      message: 'Unauthenticated.'
    })
  }
}
