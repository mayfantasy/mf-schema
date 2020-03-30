import { varify } from '../server/jwt'
import { ILoginPayload } from '../types/auth.type'
import { getAccountByEmail } from '../server/services/auth.service'
import { getAccountList } from '../server/services/account.service'
import { IAccount } from '../types/account.type'
import { NextApiRequest, NextApiResponse } from 'next'
import { IBasicAccountInfo } from '../types/account.type'

export const getAuth = async (req: NextApiRequest, res: NextApiResponse) => {
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
  localStorage.setItem('token', token)
}

export const setUser = (user: IBasicAccountInfo) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const removeToken = () => {
  localStorage.removeItem('token')
}

export const removeUser = () => {
  localStorage.removeItem('user')
}

export const getToken = () => {
  try {
    return localStorage.getItem('token')
  } catch (e) {
    console.log(e)
    return null
  }
}

export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const getTier = (): number => {
  if (getUser()) {
    return getUser().tier
  }
  return 100
}
