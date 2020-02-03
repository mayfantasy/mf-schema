import { NextApiRequest, NextApiResponse } from 'next'

import { EApiMethod } from '../../../../types/api.type'
import { validatePayload } from '../../../../server/validators'
import { ICreateCollectionPayload } from '../../../../types/collection.type'
import { createCollectionPayloadSchema } from '../../../../server/validators/collection.validator'
import { getAuth } from '../../../../helpers/auth.helper'
import {
  createCollection,
  getCollectionList,
  getCollectionById
} from '../../../../server/services/collection.service'

const getCollectionListRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const id = req.query.id as string

    /** Validation */
    if (id) {
      const collection = await getCollectionById(auth.api_key, id)
      const response = {
        result: collection
      }
      res.status(200).json(response)
    } else {
      throw new Error('Invalid Collection ID.')
    }
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default getCollectionListRoute as any
