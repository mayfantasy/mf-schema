import { NextApiRequest, NextApiResponse } from 'next'

import { EApiMethod } from '../../../types/api.type'
import { ICreateAccessKeyPayload } from '../../../types/access-key.type'
import { validatePayload } from '../../../server/validators'
import { createAccessKeyPayloadSchema } from '../../../server/validators/access-key.validator'
import { getAuth } from '../../../helpers/auth.helper'
import { createAccessKey } from '../../../server/services/access-key.service'

const createAccessKeyRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const payload = req.body as ICreateAccessKeyPayload
  /** Validation */
  validatePayload(createAccessKeyPayloadSchema, payload)
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const accessKey = await createAccessKey(
      auth.api_key,
      auth.account_id,
      payload
    )
    const response = {
      result: accessKey
    }
    res.status(200).json(response)
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default createAccessKeyRoute as any
