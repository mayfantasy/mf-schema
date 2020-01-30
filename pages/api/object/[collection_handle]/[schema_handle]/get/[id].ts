import { EApiMethod } from '../../../../../../types/api.type'
import { cors } from '../../../../../../helpers/api.helper'
import { validatePayload } from '../../../../../../server/validators'
import { getAuth } from '../../../../../../helpers/auth.helper'
import { getObjectByIdParamsSchema } from '../../../../../../server/validators/object.validator'
import { getObjectById } from '../../../../../../server/services/object.service'
import { NextApiRequest, NextApiResponse } from 'next'

const getObjectByIdRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)

    const params = req.query as { [key: string]: string }

    /** Validation */
    validatePayload(getObjectByIdParamsSchema, params)

    const { collection_handle, schema_handle, id } = params
    const object = await getObjectById(auth.api_key, {
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

export default cors([EApiMethod.GET])(getObjectByIdRoute as any)
