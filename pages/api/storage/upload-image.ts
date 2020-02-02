import { NextApiRequest, NextApiResponse } from 'next'
import { cors, passOptions } from '../../../helpers/api.helper'
import { EApiMethod } from '../../../types/api.type'
import { getAuth } from '../../../helpers/auth.helper'
import { uploadImage } from '../../../server/services/storage.service'
import { validateUpload } from '../../../server/validators'
import { uploadSchema } from '../../../server/validators/storage.validator'
import { format } from 'date-fns'
import formidable from 'formidable'

const uploadImageRoute = async (req: any, res: NextApiResponse) =>
  await passOptions(req, res, async () => {
    try {
      const auth = (await getAuth(req, res)) || ({} as any)
      const accountId = auth.account_id

      const form = new formidable.IncomingForm()
      form.parse(req, async (err, fields, files) => {
        /** Validation */
        validateUpload(uploadSchema, files)

        const file = (files as any).mf_image_uploader

        if (file) {
          const { path, name } = file
          const result = await uploadImage(
            `${path}`,
            name,
            `images/_account_${accountId}`,
            format(new Date(), 'yyyy-MM-dd')
          )
          const response = {
            result
          }
          res.status(200).json(response)
        } else {
          return new Error('File not found.')
        }
      })
    } catch (e) {
      res.status(500).json({
        message: JSON.stringify(e.message)
      })
    }
  })

export default cors([EApiMethod.POST])(uploadImageRoute as any)
export const config = {
  api: {
    bodyParser: false
  }
}
