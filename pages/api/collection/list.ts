import { NextApiRequest, NextApiResponse } from 'next'

import { EApiMethod } from '../../../types/api.type'
import { validatePayload } from '../../../server/validators'
import { ICreateCollectionPayload } from '../../../types/collection.type'
import { createCollectionPayloadSchema } from '../../../server/validators/collection.validator'
import { getAuth } from '../../../helpers/auth.helper'
import {
  createCollection,
  getCollectionList
} from '../../../server/services/collection.service'

const getCollectionListRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const collections = await getCollectionList(auth.api_key)
    const response = {
      result: collections
    }
    res.status(200).json(response)
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default getCollectionListRoute as any
