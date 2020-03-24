import { FormInstance } from 'antd/lib/form'

export const isFormInvalid = (
  form: FormInstance,
  touchedNameList?: string[]
) => {
  return (
    !(touchedNameList
      ? touchedNameList.every((t) => form.isFieldTouched(t))
      : form.isFieldsTouched(true)) ||
    !!form.getFieldsError().filter(({ errors }) => errors.length).length
  )
}
