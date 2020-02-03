import { NextApiRequest, NextApiResponse } from 'next'
import { validatePayload } from '../../../server/validators'
import { loginWithTokenSchema } from '../../../server/validators/auth.validator'
import { varify } from '../../../server/jwt'
import { ILoginPayload } from '../../../types/auth.type'
import { getAccountByEmail } from '../../../server/services/auth.service'
import { IBasicAccountInfo } from '../../../types/account.type'

import { EApiMethod } from '../../../types/api.type'

const loginWithTokenRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const payload = req.body as {
    token: string
  }

  try {
    /** Validation */
    validatePayload(loginWithTokenSchema, payload)

    const token = payload.token
    const user = varify(token)

    const email = ((user as any).data as ILoginPayload).email
    const account = await getAccountByEmail(email)

    const response = {
      result: {
        account: {
          email: account.email,
          username: account.username
        } as IBasicAccountInfo
      }
    }
    res.status(200).json(response)
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default loginWithTokenRoute as any
