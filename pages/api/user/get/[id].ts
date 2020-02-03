import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '../../../../helpers/auth.helper'
import { getUserById } from '../../../../server/services/user.service'
import { reqWrapper } from '../../../../helpers/api.helper'
import { EApiMethod } from '../../../../types/api.type'

const getUserByIdRoute = async (req: NextApiRequest, res: NextApiResponse) =>
  await reqWrapper(req, res, async () => {
    try {
      const auth = (await getAuth(req, res)) || ({} as any)
      const id = req.query.id as string

      if (id) {
        const user = await getUserById(auth.api_key, id)
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
  })
export default getUserByIdRoute as any
