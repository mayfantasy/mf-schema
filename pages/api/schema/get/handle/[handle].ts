import { NextApiRequest, NextApiResponse } from 'next'
import { cors } from '../../../../../helpers/api.helper'
import { EApiMethod } from '../../../../../types/api.type'
import { getAuth } from '../../../../../helpers/auth.helper'
import { getSchemaByHandle } from '../../../../../server/services/schema.service'

const getSchemaByHandleRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const handle = req.query.handle as string

    if (handle) {
      const schema = await getSchemaByHandle(auth.api_key, handle)
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

export default cors([EApiMethod.GET])(getSchemaByHandleRoute as any)
