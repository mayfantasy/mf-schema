import { NextApiRequest, NextApiResponse } from 'next'

import { EApiMethod } from '../../../types/api.type'
import { getAuth } from '../../../helpers/auth.helper'
import { deleteAccountImage } from '../../../server/services/storage.service'
import { IDeleteAccountImagePayload } from '../../../types/storage.type'

const deleteImageRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const { filename } = req.body as IDeleteAccountImagePayload

    if (filename) {
      const result = await deleteAccountImage(filename)
      const response = {
        result
      }
      res.status(200).json(response)
    } else {
      return new Error('File not specified.')
    }
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default deleteImageRoute as any
