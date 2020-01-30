import { NextApiRequest, NextApiResponse } from 'next'
import { cors } from '../../../helpers/api.helper'
import { EApiMethod } from '../../../types/api.type'
import { getAuth } from '../../../server/routes/helper'
import { getAccessKeyList } from '../../../server/services/access-key.service'

const getAccessKeyListRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const accessKeys = await getAccessKeyList(auth.api_key)
    const response = {
      result: accessKeys
    }

    res.status(200).json(response)
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default cors([EApiMethod.GET])(getAccessKeyListRoute as any)
