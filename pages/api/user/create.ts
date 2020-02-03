import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '../../../helpers/auth.helper'
import { ICreateUserPayload } from '../../../types/user.type'
import { validatePayload } from '../../../server/validators'
import { createUserPayloadSchema } from '../../../server/validators/user.validator'
import { createUser } from '../../../server/services/user.service'
import { reqWrapper } from '../../../helpers/api.helper'
import { EApiMethod } from '../../../types/api.type'

const createUserRoute = async (req: NextApiRequest, res: NextApiResponse) =>
  await reqWrapper(req, res, async () => {
    const payload = req.body as ICreateUserPayload

    try {
      /** Validation */
      validatePayload(createUserPayloadSchema, payload)

      const auth = (await getAuth(req, res)) || ({} as any)
      const user = await createUser(auth.api_key, payload)
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

export default createUserRoute as any
