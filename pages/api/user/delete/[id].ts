import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '../../../../helpers/auth.helper'
import { deleteUserById } from '../../../../server/services/user.service'
import { cors } from '../../../../helpers/api.helper'
import { EApiMethod } from '../../../../types/api.type'

const deleteUserRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const id = req.query.id as string

    /** Validation */
    if (id) {
      const user = await deleteUserById(auth.api_key, id)

      const response = {
        result: user
      }
      res.status(200).json(response)
    } else {
      throw new Error('Invalid user id.')
    }
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default cors([EApiMethod.DELETE])(deleteUserRoute as any)
