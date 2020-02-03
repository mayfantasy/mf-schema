import { NextApiRequest, NextApiResponse } from 'next'

import { EApiMethod } from '../../../types/api.type'
import { validatePayload } from '../../../server/validators'
import { getAuth } from '../../../helpers/auth.helper'
import { ISchemaListQuery } from '../../../types/schema.type'
import { getSchemaListQuerySchema } from '../../../server/validators/schema.validatior'
import { getSchemaList } from '../../../server/services/schema.service'

const getSchemaListRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const query = req.query as ISchemaListQuery

    /** Validation */
    validatePayload(getSchemaListQuerySchema, query)

    const schemas = await getSchemaList(auth.api_key, query)
    const response = {
      result: schemas
    }
    res.status(200).json(response)
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default getSchemaListRoute as any
