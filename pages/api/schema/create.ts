import { NextApiRequest, NextApiResponse } from 'next'
import { cors } from '../../../helpers/api.helper'
import { EApiMethod } from '../../../types/api.type'
import { validatePayload } from '../../../server/validators'
import { ICreateCollectionPayload } from '../../../types/collection.type'
import { createCollectionPayloadSchema } from '../../../server/validators/collection.validator'
import { getAuth } from '../../../server/routes/helper'
import { createCollection } from '../../../server/services/collection.service'
import { ICreateSchemaPayload } from '../../../types/schema.type'
import { createSchemaPayloadSchema } from '../../../server/validators/schema.validatior'
import { createSchema } from '../../../server/services/schema.service'

const createSchemaRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const payload = req.body as ICreateSchemaPayload

  try {
    const auth = (await getAuth(req, res)) || ({} as any)

    /** Validation */
    validatePayload(createSchemaPayloadSchema, payload)

    const schema = await createSchema(auth.api_key, payload)
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

export default cors([EApiMethod.POST])(createSchemaRoute as any)
