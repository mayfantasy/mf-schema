import { NextApiRequest, NextApiResponse } from 'next'

import { EApiMethod } from '../../../../types/api.type'
import { validatePayload } from '../../../../server/validators'
import { getAuth } from '../../../../helpers/auth.helper'
import { ISchemaListQuery } from '../../../../types/schema.type'
import { getSchemaListQuerySchema } from '../../../../server/validators/schema.validatior'
import {
  getSchemaList,
  getSchemaById
} from '../../../../server/services/schema.service'

const getSchemaByIdRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const id = req.query.id as string

    if (id) {
      const schema = await getSchemaById(auth.api_key, id)
      const response = {
        result: schema
      }
      res.status(200).json(response)
    } else {
      throw new Error('Invalid Schema ID.')
    }
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default getSchemaByIdRoute as any
