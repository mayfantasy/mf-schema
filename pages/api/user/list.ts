import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '../../../helpers/auth.helper'
import { getUserList } from '../../../server/services/user.service'

import { EApiMethod } from '../../../types/api.type'

const getUserListRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const user = await getUserList(auth.api_key)
    const response = {
      result: user
    }
    res.status(200).json(response)
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default getUserListRoute as any
