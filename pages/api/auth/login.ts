import { NextApiResponse, NextApiRequest } from 'next'

import { EApiMethod } from '../../../types/api.type'
import { ILoginPayload } from '../../../types/auth.type'
import { validatePayload } from '../../../server/validators'
import { loginPayloadSchema } from '../../../server/validators/auth.validator'
import { getAccountByEmailAndPassword } from '../../../server/services/auth.service'
import { sign } from '../../../server/jwt'
import { IBasicAccountInfo } from '../../../types/account.type'

const loginRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const payload = req.body as ILoginPayload

  try {
    // /** Validator */
    validatePayload(loginPayloadSchema, payload)

    const { email, password } = payload
    const account = await getAccountByEmailAndPassword(email, password)
    const token = sign(account)

    const response = {
      result: {
        token,
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

export default loginRoute as any
