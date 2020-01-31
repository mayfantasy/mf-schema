import { IObjectServiceMetaWithID } from './object.type'

export interface IEmailTemplatePayload {
  meta: IObjectServiceMetaWithID
  to_email: string
  data: { [key: string]: string }
}

export interface IEmailObject {
  'email-service': string
  'email-service-address': string
  'email-service-password': string
  'email-title': string
  'email-content': string
}
