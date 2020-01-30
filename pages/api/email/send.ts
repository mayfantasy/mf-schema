import { NextApiRequest, NextApiResponse } from 'next'
import { cors } from '../../../helpers/api.helper'
import { EApiMethod } from '../../../types/api.type'
import { validatePayload } from '../../../server/validators'
import { getAuth } from '../../../server/routes/helper'
import { IObjectServiceMetaWithID } from '../../../server/services/object.service'
import { sendEmailPayloadSchema } from '../../../server/validators/email.validator'
import { sendEmail } from '../../../server/services/send-email.service'

const updateSchemaRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const auth = (await getAuth(req, res)) || ({} as any)
    const payload = req.body as {
      meta: IObjectServiceMetaWithID
      to_email: string
      data: { [key: string]: string }
    }

    /** Validation */
    validatePayload(sendEmailPayloadSchema, payload)

    const user = await sendEmail(
      auth.api_key,
      payload.meta,
      payload.to_email,
      payload.data
    )

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

export default cors([EApiMethod.POST])(updateSchemaRoute as any)
