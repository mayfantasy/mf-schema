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

export const confirmPasswordRule: any = (form: FormInstance) => {
  return {
    validator: (_: any, value: string) => {
      if (!value || form.getFieldValue('password') === value) {
        return Promise.resolve()
      }
      return Promise.reject('The two password you entered do not match.')
    }
  }
}
