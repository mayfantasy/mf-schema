import { EApiMethod } from '../../../../../../types/api.type'
import { cors, passOptions } from '../../../../../../helpers/api.helper'
import { validatePayload } from '../../../../../../server/validators'
import { getAuth } from '../../../../../../helpers/auth.helper'
import { deleteObjectByIdParamsSchema } from '../../../../../../server/validators/object.validator'
import { deleteObjectById } from '../../../../../../server/services/object.service'
import { NextApiRequest, NextApiResponse } from 'next'

const deleteObjectByIdRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) =>
  await passOptions(req, res, async () => {
    try {
      const auth = (await getAuth(req, res)) || ({} as any)
      const params = req.query as {
        [key: string]: string
      }

      /** Validation */
      validatePayload(deleteObjectByIdParamsSchema, params)

      const { collection_handle, schema_handle, id } = params
      const object = await deleteObjectById(auth.api_key, {
        collection_handle,
        schema_handle,
        id
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
export default cors([EApiMethod.DELETE])(deleteObjectByIdRoute as any)
