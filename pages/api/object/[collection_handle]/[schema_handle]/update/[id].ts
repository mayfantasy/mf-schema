import { EApiMethod } from '../../../../../../types/api.type'
import { cors } from '../../../../../../helpers/api.helper'
import { validatePayload } from '../../../../../../server/validators'
import { getAuth } from '../../../../../../helpers/auth.helper'
import { updateObjectParamsSchema } from '../../../../../../server/validators/object.validator'
import { updateObjectById } from '../../../../../../server/services/object.service'
import { NextApiRequest, NextApiResponse } from 'next'

const updateObjectByIdRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const params = req.query as {
      [key: string]: string
    }
    const payload = req.body

    /** Validation */
    validatePayload(updateObjectParamsSchema, params)

    const { collection_handle, schema_handle, id } = params

    const object = await updateObjectById(auth.api_key, payload, {
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
}

export default cors([EApiMethod.PUT])(updateObjectByIdRoute as any)
