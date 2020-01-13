import { WrappedFormUtils } from 'antd/lib/form/Form'
import {
  ISchemaFieldDefKeys,
  ICreateSchemaFormValues,
  IUpdateSchemaFormValues,
  ISchema
} from '../../types/schema.type'
/**
 * Add schema definition field
 */
export const addField = (
  form: WrappedFormUtils<ICreateSchemaFormValues | IUpdateSchemaFormValues>,
  fieldIndex: number
) => {
  const _defKeys = form.getFieldValue('_defKeys') as ISchemaFieldDefKeys[]
  const newDefs = _defKeys.concat({
    key: `key-${fieldIndex}`,
    type: `type-${fieldIndex}`,
    options: `options-${fieldIndex}`,
    name: `name-${fieldIndex}`,
    helper: `helper-${fieldIndex}`,
    order: `order-${fieldIndex}`,
    grid: `grid-${fieldIndex}`,
    new_line: `new_line-${fieldIndex}`,
    show: `show-${fieldIndex}`
  })

  form.setFieldsValue({
    _defKeys: newDefs
  })
}

/**
 *
 * @param key schema definitioin key
 * Remove from schema definition array_defKeys
 */
export const removeField = (
  form: WrappedFormUtils<ICreateSchemaFormValues | IUpdateSchemaFormValues>,
  key: string
) => {
  const _defKeys: ISchemaFieldDefKeys[] = form.getFieldValue('_defKeys')

  const _newDefKeys = _defKeys.filter((def) => def.key !== key)
  form.setFieldsValue({
    _defKeys: _newDefKeys
  })
}

/**
 *
 * @param schema shema to load to the form
 * Set initial form values based on the schema
 */
export const setInitialFormValues = (
  form: WrappedFormUtils<ICreateSchemaFormValues | IUpdateSchemaFormValues>,
  schema: ISchema
) => {
  const { getFieldDecorator } = form
  const map = (i: number): ISchemaFieldDefKeys => ({
    key: `key-${i}`,
    type: `type-${i}`,
    options: `options-${i}`,
    name: `name-${i}`,
    helper: `helper-${i}`,
    order: `order-${i}`,
    grid: `grid-${i}`,
    new_line: `new_line-${i}`,
    show: `show-${i}`
  })
  getFieldDecorator('name', { initialValue: schema.name })
  getFieldDecorator('handle', { initialValue: schema.handle })
  getFieldDecorator('description', { initialValue: schema.description })
  getFieldDecorator('_defKeys', {
    initialValue: schema.def.map((d, i) => map(i))
  })
  const defValues = schema.def.reduce((a, c, i) => {
    return {
      ...a,
      [map(i)['key']]: c.key,
      [map(i)['type']]: c.type,
      [map(i)['options']]: c.options,
      [map(i)['name']]: c.name,
      [map(i)['helper']]: c.helper,
      [map(i)['order']]: c.order,
      [map(i)['grid']]: c.grid,
      [map(i)['new_line']]: c.new_line,
      [map(i)['show']]: c.show
    }
  }, {} as { [key: string]: any })

  Object.keys(defValues).forEach((k) => {
    getFieldDecorator(`_defValues[${k}]`, {
      initialValue: defValues[k]
    })
  })
}
