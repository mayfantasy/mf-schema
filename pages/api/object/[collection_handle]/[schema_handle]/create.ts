import { EApiMethod } from '../../../../../types/api.type'
import { reqWrapper } from '../../../../../helpers/api.helper'
import { validatePayload } from '../../../../../server/validators'
import { getAuth } from '../../../../../helpers/auth.helper'
import { createObjectParamsSchema } from '../../../../../server/validators/object.validator'
import { createObject } from '../../../../../server/services/object.service'
import { NextApiRequest, NextApiResponse } from 'next'

const createObjectRoute = async (req: NextApiRequest, res: NextApiResponse) =>
  await reqWrapper(req, res, async () => {
    const payload = req.body as any

    try {
      const auth = (await getAuth(req, res)) || ({} as any)
      const params = req.query as {
        [key: string]: string
      }

      /** Validation */
      validatePayload(createObjectParamsSchema, params)

      const { collection_handle, schema_handle } = params

      const object = await createObject(auth.api_key, payload, {
        collection_handle,
        schema_handle
      })

      const response = {
        result: object
      }
      res.status(200).json(response)
    } catch (e) {
      res.status(500).json({
        message: JSON.stringify(e.message)
      })
    }
  })

export default createObjectRoute as any
