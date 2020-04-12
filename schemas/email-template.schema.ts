import { IStoreSchema, ESchemaFieldType } from '../types/schema.type'

export const emailSchema: IStoreSchema = {
  name: 'Email Template',
  collection_id: '__PUT_A_COLLECTION_ID_HERE__',
  handle: 'email_template',
  description:
    'Email template schema that support basic mustache syntax and used on send email api.',
  def: [
    {
      key: 'email-service',
      type: ESchemaFieldType.string,
      name: 'Email Service Name',
      helper: "e.g. 'hotmail', 'gmail' etc.",
      order: 1,
      grid: 8,
      show: false
    },
    {
      key: 'email-service-address',
      type: ESchemaFieldType.string,
      name: 'Email Service Address',
      helper: "e.g. 'your-service-email@gmail.com'",
      order: 1,
      grid: 8,
      show: false
    },
    {
      key: 'email-service-password',
      type: ESchemaFieldType.string,
      name: 'Email Service Password',
      helper: `Example:
123456
`,
      order: 1,
      grid: 8,
      show: false
    },
    {
      key: 'email-title',
      type: ESchemaFieldType.string,
      name: 'Email Title',
      helper: `Example:
Website Customer General Quote
`,
      order: 1,
      grid: 24,
      show: false
    },
    {
      key: 'email-content',
      type: ESchemaFieldType.rich_text,
      name: 'Email Content',
      helper: `Example:
Customer Name: {{name}}
Email: {{email}}
Content:
{{content}}

Note:
Variables can be passed in by 
using the build-in send-mail API 
`,
      order: 1,
      grid: 24,
      show: false
    }
  ]
}
