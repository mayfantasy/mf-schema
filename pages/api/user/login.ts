import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '../../../helpers/auth.helper'
import { reqWrapper } from '../../../helpers/api.helper'
import { EApiMethod } from '../../../types/api.type'
import { ILoginPayload } from '../../../types/auth.type'
import { validatePayload } from '../../../server/validators'
import { userLoginPayloadSchema } from '../../../server/validators/user-auth.validator'
import { loginUser } from '../../../server/services/user-auth.service'
import micro from 'micro'

const loginUserRoute = async (req: NextApiRequest, res: NextApiResponse) =>
  await reqWrapper(req, res, async () => {
    try {
      const auth = (await getAuth(req, res)) || ({} as any)
      const payload = req.body as ILoginPayload

      /** Validation */
      validatePayload(userLoginPayloadSchema, payload)

      const user = await loginUser(auth.api_key, payload)

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

export default loginUserRoute as any
