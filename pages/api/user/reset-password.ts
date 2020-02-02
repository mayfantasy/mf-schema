import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '../../../helpers/auth.helper'
import { cors, passOptions } from '../../../helpers/api.helper'
import { EApiMethod } from '../../../types/api.type'
import { validatePayload } from '../../../server/validators'
import { userResetPasswordPayloadSchema } from '../../../server/validators/user-auth.validator'
import { resetUserPassword } from '../../../server/services/user-auth.service'
import { IUserResetPasswordPayload } from '../../../types/user.type'

const resetPasswordRoute = async (req: NextApiRequest, res: NextApiResponse) =>
  await passOptions(req, res, async () => {
    try {
      const auth = (await getAuth(req, res)) || ({} as any)
      const payload = req.body as IUserResetPasswordPayload
      const { signature, password } = payload

      /** Validation */
      validatePayload(userResetPasswordPayloadSchema, payload)

      const user = await resetUserPassword(auth.api_key, signature, password)

      const response = {
        result: user
      }
      res.status(200).json(response)
    } catch (e) {
      res.status(500).json({
        message: JSON.stringify(e.message)
      })
    }
  })

export default cors([EApiMethod.POST])(resetPasswordRoute as any)
