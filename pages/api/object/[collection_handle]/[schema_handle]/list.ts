import { EApiMethod } from '../../../../../types/api.type'
import { cors, passOptions } from '../../../../../helpers/api.helper'
import { validatePayload } from '../../../../../server/validators'
import { getAuth } from '../../../../../helpers/auth.helper'
import { getObjectListParamsSchema } from '../../../../../server/validators/object.validator'
import { getObjectList } from '../../../../../server/services/object.service'
import { NextApiRequest, NextApiResponse } from 'next'

const getObjectListRoute = async (req: NextApiRequest, res: NextApiResponse) =>
  await passOptions(req, res, async () => {
    try {
      const auth = (await getAuth(req, res)) || ({} as any)
      const params = req.query as {
        [key: string]: string
      }

      /** Validation */
      validatePayload(getObjectListParamsSchema, params)

      const { collection_handle, schema_handle } = params
      const objects = await getObjectList(auth.api_key, {
        collection_handle,
        schema_handle
      })
      const response = {
        result: objects
      }
      res.status(200).json(response)
    } catch (e) {
      res.status(500).json({
        message: JSON.stringify(e.message)
      })
    }
  })

export default cors([EApiMethod.GET])(getObjectListRoute as any)
