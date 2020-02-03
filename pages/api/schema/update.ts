import { NextApiRequest, NextApiResponse } from 'next'

import { EApiMethod } from '../../../types/api.type'
import { validatePayload } from '../../../server/validators'
import { getAuth } from '../../../helpers/auth.helper'
import {
  ISchemaListQuery,
  IUpdateSchemaPayload
} from '../../../types/schema.type'
import {
  getSchemaListQuerySchema,
  updateSchemaPayloadSchema
} from '../../../server/validators/schema.validatior'
import {
  getSchemaList,
  updateSchema
} from '../../../server/services/schema.service'

const updateSchemaRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const payload = req.body as IUpdateSchemaPayload

    /** Validation */
    validatePayload(updateSchemaPayloadSchema, payload)

    const schema = await updateSchema(auth.api_key, payload)
    const response = {
      result: schema
    }
    res.status(200).json(response)
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default updateSchemaRoute as any
