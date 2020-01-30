import { varify } from '../server/jwt'
import { ILoginPayload } from '../types/auth.type'
import { getAccountByEmail } from '../server/services/auth.service'
import { getAccountList } from '../server/services/account.service'
import { IAccount } from '../types/account.type'
import { NextApiRequest, NextApiResponse } from 'next'
import { IBasicAccountInfo } from '../types/account.type'

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

export const setToken = (token: string) => {
  window.localStorage.setItem('token', token)
}

export const setUser = (user: IBasicAccountInfo) => {
  window.localStorage.setItem('user', JSON.stringify(user))
}

export const removeToken = () => {
  window.localStorage.removeItem('token')
}

export const removeUser = () => {
  window.localStorage.removeItem('user')
}

export const getToken = () => {
  return window.localStorage.getItem('token')
}

export const getUser = () => {
  const user = window.localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}
