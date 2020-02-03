import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '../../../helpers/auth.helper'
import { IUpdateUserInfoPayload } from '../../../types/user.type'
import { validatePayload } from '../../../server/validators'
import { updateUserPayloadSchema } from '../../../server/validators/user.validator'
import { createUser, updateUser } from '../../../server/services/user.service'
import { reqWrapper } from '../../../helpers/api.helper'
import { EApiMethod } from '../../../types/api.type'

const updateUserRoute = async (req: NextApiRequest, res: NextApiResponse) =>
  await reqWrapper(req, res, async () => {
    const payload = req.body as IUpdateUserInfoPayload
    try {
      const auth = (await getAuth(req, res)) || ({} as any)

      /** Validation */
      validatePayload(updateUserPayloadSchema, payload)

      const user = await updateUser(auth.api_key, payload)
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

export default updateUserRoute as any
