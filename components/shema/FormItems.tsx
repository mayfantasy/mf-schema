import {
  Row,
  Col,
  Card,
  Icon,
  Form,
  Input,
  Select,
  InputNumber,
  Checkbox
} from 'antd'
import FormFieldLabel from '../FormFieldLabel/FormFieldLabel'
import {
  ISchemaFieldDefKeys,
  ICreateSchemaFormValues,
  ESchemaFieldType,
  IUpdateSchemaFormValues
} from '../../types/schema.type'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { enumToKeyArray } from '../../helpers/utils.helper'
import { removeField } from '../../helpers/schema/form'

interface IProps {
  form: WrappedFormUtils<ICreateSchemaFormValues | IUpdateSchemaFormValues>
  isCreate: boolean
}
const FormItems = (props: IProps) => {
  const { form, isCreate } = props
  const { getFieldDecorator, getFieldValue } = form
  const _defKeys = getFieldValue('_defKeys')
  return (
    <>
      {_defKeys.map((def: ISchemaFieldDefKeys, index: number) => (
        <Row key={index}>
          <Col span={24}>
            <Card
              size="small"
              title="Field Definition"
              extra={
                _defKeys.length > 1 ? (
                  <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => removeField(form, def.key)}
                  />
                ) : null
              }
              style={{ width: '100%' }}
            >
              <Row type="flex" gutter={2} align="middle">
                {/* Key */}
                <Col span={11}>
                  <Form.Item
                    label={<FormFieldLabel>Key</FormFieldLabel>}
                    required={true}
                    key="key"
                  >
                    {getFieldDecorator(`_defValues[${def.key}]`, {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: 'Key is required'
                        }
                      ]
                    })(<Input placeholder="Key" />)}
                  </Form.Item>
                </Col>

                {/* Type */}
                <Col span={11}>
                  <Form.Item
                    label={<FormFieldLabel>Type</FormFieldLabel>}
                    required={true}
                    key="type"
                  >
                    {getFieldDecorator(`_defValues[${def.type}]`, {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: 'Type is required'
                        }
                      ]
                    })(
                      <Select placeholder="Select a type">
                        {enumToKeyArray(ESchemaFieldType).map((t) => (
                          <Select.Option value={t} key={t}>
                            {t}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row type="flex" gutter={2} align="middle">
                {/* Name */}
                <Col span={22}>
                  <Form.Item
                    label={<FormFieldLabel>Name</FormFieldLabel>}
                    required={true}
                    key="name"
                  >
                    {getFieldDecorator(`_defValues[${def.name}]`, {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: 'Name is required'
                        }
                      ]
                    })(<Input placeholder="Name" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row type="flex" gutter={2} align="middle">
                {/* Grid */}
                <Col span={5}>
                  <Form.Item
                    label={<FormFieldLabel>Grid</FormFieldLabel>}
                    key="grid"
                  >
                    {getFieldDecorator(`_defValues[${def.grid}]`, {
                      ...(isCreate ? { initialValue: 24 } : {}),
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [
                        {
                          validator: (
                            rule: any,
                            value: number,
                            callback: any
                          ) => {
                            if (value > 24 || value < 1) {
                              callback(
                                'Please input a number between 1 and 24.'
                              )
                            } else {
                              callback()
                            }
                          }
                        }
                      ]
                    })(<InputNumber placeholder="Grid" min={1} max={24} />)}
                  </Form.Item>
                </Col>
                {/* Order */}
                <Col span={5}>
                  <Form.Item
                    label={<FormFieldLabel>Order</FormFieldLabel>}
                    key="order"
                  >
                    {getFieldDecorator(`_defValues[${def.order}]`, {
                      ...(isCreate ? { initialValue: 1 } : {}),
                      validateTrigger: ['onChange', 'onBlur']
                    })(<InputNumber placeholder="Grid" />)}
                  </Form.Item>
                </Col>
                {/* New Line */}
                <Col span={5}>
                  <Form.Item
                    label={<FormFieldLabel>New Line ?</FormFieldLabel>}
                    key="new_line"
                  >
                    {getFieldDecorator(`_defValues[${def.new_line}]`, {
                      valuePropName: 'checked'
                    })(<Checkbox />)}
                  </Form.Item>
                </Col>
                {/* Show on list */}
                <Col span={5}>
                  <Form.Item
                    label={<FormFieldLabel>Show in List ?</FormFieldLabel>}
                    key="show"
                  >
                    {getFieldDecorator(`_defValues[${def.show}]`, {
                      ...(isCreate ? { initialValue: false } : {}),
                      valuePropName: 'checked'
                    })(<Checkbox />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                {/* Helper Text */}
                <Col span={22}>
                  <Form.Item
                    label={<FormFieldLabel>Helper Text</FormFieldLabel>}
                    key="helper"
                  >
                    {getFieldDecorator(`_defValues[${def.helper}]`)(
                      <Input.TextArea autoSize={{ minRows: 8 }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      ))}
    </>
  )
}
export default FormItems
