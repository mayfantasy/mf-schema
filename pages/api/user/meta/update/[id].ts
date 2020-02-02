import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '../../../../../helpers/auth.helper'
import { updateUserMeta } from '../../../../../server/services/user.service'
import { cors, passOptions } from '../../../../../helpers/api.helper'
import { EApiMethod } from '../../../../../types/api.type'
import { IUpdateUserMetaPayload } from '../../../../../types/user.type'
import { validatePayload } from '../../../../../server/validators'
import { updateUserMetaPayloadSchema } from '../../../../../server/validators/user.validator'

const updateUserMetaRoute = async (req: NextApiRequest, res: NextApiResponse) =>
  await passOptions(req, res, async () => {
    const payload = req.body as IUpdateUserMetaPayload

    try {
      const auth = (await getAuth(req, res)) || ({} as any)
      const id = req.query.id as string

      /** Validation */
      validatePayload(updateUserMetaPayloadSchema, payload)

      if (id) {
        const user = await updateUserMeta(auth.api_key, id, payload)

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

export default cors([EApiMethod.POST])(updateUserMetaRoute as any)
