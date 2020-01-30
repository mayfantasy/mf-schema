import { NextApiRequest, NextApiResponse } from 'next'
import { cors } from '../../../helpers/api.helper'
import { EApiMethod } from '../../../types/api.type'
import { getAuth } from '../../../helpers/auth.helper'
import { getAccountImages } from '../../../server/services/storage.service'

const getImageListRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const accountId = auth.account_id
    const images = await getAccountImages(`images/_account_${accountId}`)
    const response = {
      result: images
    }
    res.status(200).json(response)
  } catch (e) {
    res.status(500).json({
      message: JSON.stringify(e.message)
    })
  }
}

export default cors([EApiMethod.POST])(getImageListRoute as any)
