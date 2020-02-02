import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '../../../helpers/auth.helper'
import { cors, passOptions } from '../../../helpers/api.helper'
import { EApiMethod } from '../../../types/api.type'
import { validatePayload } from '../../../server/validators'
import { resetUseremailPayloadSchema } from '../../../server/validators/user-auth.validator'
import { resetUserEmail } from '../../../server/services/user-auth.service'
import { IResetUserEmailPayload } from '../../../types/user.type'

const resetUserEmailRoute = async (req: NextApiRequest, res: NextApiResponse) =>
  await passOptions(req, res, async () => {
    try {
      const auth = (await getAuth(req, res)) || ({} as any)
      const payload = req.body as IResetUserEmailPayload

      validatePayload(resetUseremailPayloadSchema, payload)
      const user = await resetUserEmail(auth.api_key, payload)

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

export default cors([EApiMethod.POST])(resetUserEmailRoute as any)
