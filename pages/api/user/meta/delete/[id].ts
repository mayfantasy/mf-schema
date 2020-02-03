import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '../../../../../helpers/auth.helper'
import {
  updateUserMeta,
  deleteUserMeta
} from '../../../../../server/services/user.service'

import { EApiMethod } from '../../../../../types/api.type'
import {
  IUpdateUserMetaPayload,
  IDeleteUserMetaItemPayload
} from '../../../../../types/user.type'
import { validatePayload } from '../../../../../server/validators'
import {
  updateUserMetaPayloadSchema,
  deleteUserMetaPayloadSchema
} from '../../../../../server/validators/user.validator'

const deleteUserMetaItemRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const payload = req.body as IDeleteUserMetaItemPayload

  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const id = req.query.id as string

    /** Validation */
    validatePayload(deleteUserMetaPayloadSchema, payload)

    if (id) {
      const user = await deleteUserMeta(auth.api_key, id, payload)

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

export default deleteUserMetaItemRoute as any
