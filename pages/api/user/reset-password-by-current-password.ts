import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '../../../helpers/auth.helper'
import { cors } from '../../../helpers/api.helper'
import { EApiMethod } from '../../../types/api.type'
import { validatePayload } from '../../../server/validators'
import { resetUserPasswordByCurrentPasswordPayloadSchema } from '../../../server/validators/user-auth.validator'
import { resetUserPasswordByCurrentPassword } from '../../../server/services/user-auth.service'
import { IResetUserPasswordByCurrentPasswordPayload } from '../../../types/user.type'

const resetUserPasswordByCurrentPasswordRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const payload = req.body as IResetUserPasswordByCurrentPasswordPayload

    /** Validation */
    validatePayload(resetUserPasswordByCurrentPasswordPayloadSchema, payload)

    const user = await resetUserPasswordByCurrentPassword(auth.api_key, payload)

    const response = {
      result: user
    }
    res.status(200).json(response)
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default cors([EApiMethod.POST])(
  resetUserPasswordByCurrentPasswordRoute as any
)
