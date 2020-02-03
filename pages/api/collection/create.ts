import { NextApiRequest, NextApiResponse } from 'next'

import { EApiMethod } from '../../../types/api.type'
import { validatePayload } from '../../../server/validators'
import { ICreateCollectionPayload } from '../../../types/collection.type'
import { createCollectionPayloadSchema } from '../../../server/validators/collection.validator'
import { getAuth } from '../../../helpers/auth.helper'
import { createCollection } from '../../../server/services/collection.service'

const createCollectionRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const payload = req.body as ICreateCollectionPayload

  try {
    /** Validation */
    validatePayload(createCollectionPayloadSchema, payload)
    const auth = (await getAuth(req, res)) || ({} as any)
    const collection = await createCollection(auth.api_key, payload)
    const response = {
      result: collection
    }
    res.status(200).json(response)
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default createCollectionRoute as any
