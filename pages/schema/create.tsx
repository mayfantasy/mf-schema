import React, { useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Checkbox,
  Button,
  Row,
  Alert,
  Col,
  Card,
  Select,
  InputNumber
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { createAccountRequest } from '../../requests/account.request'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import Loading from '../../components/Loading/Loading'
import { setToken, setUser } from '../../helpers/auth.helper'
import router from 'next/router'
import { ICreateSchemaPayload, ESchemaFieldType } from '../../types/schema.type'
import { createSchemaRequest } from '../../requests/schema.request'
import { AxiosError } from 'axios'
import { enumToKeyArray } from '../../helpers/utils.helper'

interface ICreateSchemaFormProps<V> {
  handleSubmit: (e: any) => void
  form: WrappedFormUtils<V>
}

interface ICreateSchemaFormValues extends ICreateSchemaPayload {
  _defKeys: any[]
  _defValues: { [key: string]: any }
}

let fieldIndex = 0

const CreateSchemaForm = (
  props: ICreateSchemaFormProps<ICreateSchemaFormValues>
) => {
  const { form, handleSubmit } = props
  const { getFieldDecorator, getFieldValue } = form

  const removeField = (key: string) => {
    const _defKeys: Array<{ key: string; type: string }> = form.getFieldValue(
      '_defKeys'
    )

    if (_defKeys.length === 1) {
      return
    }

    const _newDefKeys = _defKeys.filter((def) => def.key !== key)
    form.setFieldsValue({
      _defKeys: _newDefKeys
    })
  }

  const addField = () => {
    const _defKeys = form.getFieldValue('_defKeys')
    const newDefs = _defKeys.concat({
      key: `key-${fieldIndex}`,
      type: `type-${fieldIndex}`
    })
    fieldIndex++

    form.setFieldsValue({
      _defKeys: newDefs
    })
  }

  const handleSelectTypeChange = (type: ESchemaFieldType, key: string) => {
    const _defKeys = form.getFieldValue('_defKeys')
    const _defValues = form.getFieldValue('_defValues')

    const findDefKey = _defKeys.find((def: any) => def.key === key)

    const keyIndex = findDefKey.key.split('-')[1]

    let value
    switch (type) {
      case ESchemaFieldType.string:
        value = ''
        break
      case ESchemaFieldType.number:
        value = 0
        break
      case ESchemaFieldType.boolean:
        value = false
        break
      case ESchemaFieldType.array:
        value = []
        break
      case ESchemaFieldType.object:
        value = {}
        break
      default:
        value = ''
    }

    const newDefKey = findDefKey
    newDefKey['value'] = `value-${keyIndex}`

    const newDefValues = _defValues
    newDefValues[`value-${keyIndex}`] = value
  }

  getFieldDecorator('_defKeys', { initialValue: [] })
  const _defKeys = getFieldValue('_defKeys')

  const formItems = _defKeys.map((def: any, index: number) => (
    <Row key={index}>
      <Col span={24}>
        <Card
          size="small"
          title="Small size card"
          extra={
            _defKeys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => removeField(def.key)}
              />
            ) : null
          }
          style={{ width: '100%' }}
        >
          <Row type="flex" gutter={2} align="middle">
            {/* Key */}
            <Col span={11}>
              <Form.Item label="Key" required={true} key="key">
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
              <Form.Item label="Type" required={true} key="type">
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
                  <Select
                    placeholder="Select a type"
                    onChange={(e: ESchemaFieldType) =>
                      handleSelectTypeChange(e, def.key)
                    }
                  >
                    {enumToKeyArray(ESchemaFieldType).map((t) => (
                      <Select.Option value={t} key={t}>
                        {t}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>

            {/* Value */}
            <Col span={11}>
              {form.getFieldsValue()['_defValues'][def.type] ===
                ESchemaFieldType.number && (
                <Form.Item label="Value" required={true} key="value">
                  {getFieldDecorator(`_defValues[${def.value}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: 'Type is required'
                      }
                    ]
                  })(<InputNumber />)}
                </Form.Item>
              )}
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  ))

  return (
    <Form layout="vertical" onSubmit={handleSubmit}>
      {/* Meta */}
      <Row gutter={2}>
        <Col span={12}>
          <Form.Item label="Name">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please input the schema name'
                }
              ]
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Handle">
            {getFieldDecorator('handle', {
              rules: [
                {
                  required: true,
                  message: 'Please input the schema handle'
                }
              ]
            })(<Input />)}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Form.Item label="Description" hasFeedback>
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: 'Please input the schema desctiption'
              }
            ]
          })(<Input.TextArea />)}
        </Form.Item>
      </Row>

      {/* Schema field */}
      {formItems}

      {/* Add schema field */}
      <Row>
        <Form.Item>
          <Button type="dashed" onClick={addField}>
            <Icon type="plus" /> Add field
          </Button>
        </Form.Item>
      </Row>

      {/* Submit */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  )
}

interface IProps extends FormComponentProps<ICreateSchemaFormValues> {}

const CreateSchemaPage = (props: IProps) => {
  const [schemaStatus, setSchemaStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })
  const { form } = props

  const handleSubmit = (e: any) => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // setSchemaStatus({
        //   loading: true,
        //   success: false,
        //   error: ''
        // })
        // createSchemaRequest({
        //   name: values.name,
        //   handle: values.handle,
        //   description: values.description
        // } as any)
        //   .then((res) => {
        //     setSchemaStatus({
        //       loading: false,
        //       success: true,
        //       error: ''
        //     })

        //     router.push('/schema/list')
        //   })
        //   .catch((err: AxiosError) => {
        //     setSchemaStatus({
        //       loading: false,
        //       success: false,
        //       error: err.message || JSON.stringify(err, null, '  ')
        //     })
        //   })
        console.log('Received values of form: ', values)
        const { _defKeys, _defValues } = values
        const defs = _defKeys.map((def) => {
          const obj = {} as { [key: string]: any }
          Object.keys(def).forEach((key) => {
            obj[key] = _defValues[def[key]]
          })
          return obj
        })
        console.log('Merged values:', defs)
      }
    })
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'schema',
          name: 'Schema'
        },
        {
          key: 'create',
          url: '/schema/create',
          name: 'Create'
        }
      ]}
    >
      {schemaStatus.error && (
        <Alert message={schemaStatus.error} type="error" closable />
      )}
      <br />
      <div style={{ height: '70%' }}>
        {schemaStatus.loading ? (
          <Loading />
        ) : schemaStatus.success ? (
          <div style={{ color: 'green' }}>Schema created successfully.</div>
        ) : (
          <div style={{ width: '70%' }}>
            <CreateSchemaForm form={form} handleSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </PageLayout>
  )
}

const WrappedSchemaPage = Form.create({ name: 'schema' })(CreateSchemaPage)

export default WrappedSchemaPage
