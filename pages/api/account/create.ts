import { NextApiRequest, NextApiResponse } from 'next'
import { cors } from '../../../helpers/api.helper'
import { EApiMethod } from '../../../types/api.type'
import { validatePayload } from '../../../server/validators'
import { IClientCreateAccountPayload } from '../../../types/account.type'
import { clientCreateAccountPayloadSchema } from '../../../server/validators/account.validator'
import { createAccount } from '../../../server/services/account.service'

const createAccountRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const payload = req.body as IClientCreateAccountPayload
  /** Validation */
  validatePayload(clientCreateAccountPayloadSchema, payload)
  try {
    const account = await createAccount(payload)
    const response = {
      result: account
    }
    res.status(200).json(response)
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default cors([EApiMethod.POST])(createAccountRoute as any)
