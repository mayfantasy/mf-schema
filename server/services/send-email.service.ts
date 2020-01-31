import { mailService } from './mail.service'
import { getObjectById } from './object.service'
import { parseMustache } from '../../helpers/utils.helper'
import { IObjectServiceMetaWithID } from '../../types/object.type'
import { IEmailObject } from '../../types/email.type'

export const sendEmail = async (
  api_key: string,
  meta: IObjectServiceMetaWithID,
  to_email: string,
  data: { [key: string]: string }
) => {
  const emailObj: IEmailObject = await getObjectById(api_key, meta)

  if (
    !(
      emailObj['email-service'] &&
      emailObj['email-service-address'] &&
      emailObj['email-service-password']
    )
  ) {
    throw new Error(
      '[email-service], [email-service-address], [email-service-password] are required for email service.'
    )
  }

  if (!(emailObj['email-title'] && emailObj['email-content'])) {
    throw new Error(
      '[email-title], [email-content] are required for email service.'
    )
  }

  await mailService(
    {
      service: emailObj['email-service'],
      auth: {
        user: emailObj['email-service-address'],
        pass: emailObj['email-service-password']
      }
    },
    {
      from: emailObj['email-service-address'],
      to: to_email,
      subject: emailObj['email-title'],
      html: parseMustache(emailObj['email-content'], data)
    }
  )

  return {
    sucess: true
  }
}
