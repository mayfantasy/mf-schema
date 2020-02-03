import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '../../../helpers/auth.helper'
import { reqWrapper } from '../../../helpers/api.helper'
import { EApiMethod } from '../../../types/api.type'
import { validatePayload } from '../../../server/validators'
import { userSendRecoverEmailPayloadSchema } from '../../../server/validators/user-auth.validator'
import { sendRecoverEmail } from '../../../server/services/user-auth.service'
import { IUserSendRecoverEmailPayload } from '../../../types/user.type'

const sendRecoverEmailRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) =>
  await reqWrapper(req, res, async () => {
    try {
      const auth = (await getAuth(req, res)) || ({} as any)
      const payload = req.body as IUserSendRecoverEmailPayload

      /** Validation */
      validatePayload(userSendRecoverEmailPayloadSchema, payload)

      const user = await sendRecoverEmail(auth.api_key, payload)

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

export default sendRecoverEmailRoute as any
