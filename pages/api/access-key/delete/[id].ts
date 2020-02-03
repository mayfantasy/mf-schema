import { NextApiRequest, NextApiResponse } from 'next'

import { EApiMethod } from '../../../../types/api.type'
import { getAuth } from '../../../../helpers/auth.helper'
import {
  getAccessKeyList,
  deleteAccessKeyById
} from '../../../../server/services/access-key.service'

const getAccessKeyListRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const id = req.query.id as string
    const accessKey = await deleteAccessKeyById(
      auth.api_key,
      auth.account_id,
      id
    )
    const response = {
      result: accessKey
    }

    res.status(200).json(response)
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default getAccessKeyListRoute as any
