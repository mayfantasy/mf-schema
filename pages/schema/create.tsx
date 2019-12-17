import React, { useState, useEffect } from 'react'
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
  InputNumber,
  DatePicker,
  Spin
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { createAccountRequest } from '../../requests/account.request'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import Loading from '../../components/Loading/Loading'
import { setToken, setUser } from '../../helpers/auth.helper'
import router from 'next/router'
import {
  ICreateSchemaPayload,
  ESchemaFieldType,
  ISchemaFieldDef,
  ISchemaFieldDefKeys
} from '../../types/schema.type'
import { createSchemaRequest } from '../../requests/schema.request'
import { AxiosError } from 'axios'
import { enumToKeyArray } from '../../helpers/utils.helper'
import Moment from 'moment'
import { string } from 'prop-types'
import { getCollectionListRequest } from '../../requests/collection.request'
import { ICollection } from '../../types/collection.type'

interface ICreateSchemaFormProps<V> {
  handleSubmit: (e: any) => void
  form: WrappedFormUtils<V>
}

interface ICreateSchemaFormValues extends ICreateSchemaPayload {
  _defKeys: ISchemaFieldDefKeys[]
  _defValues: { [key: string]: any }
}

let fieldIndex = 0

const CreateSchemaForm = (
  props: ICreateSchemaFormProps<ICreateSchemaFormValues>
) => {
  const { form, handleSubmit } = props
  const { getFieldDecorator, getFieldValue } = form
  const [collectionList, setCollectionList] = useState<ICollection[]>([])
  const [collectionStatus, setCollectionStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })

  useEffect(() => {
    setCollectionStatus({
      loading: true,
      success: false,
      error: ''
    })
    getCollectionListRequest()
      .then((res) => {
        setCollectionStatus({
          loading: false,
          success: true,
          error: ''
        })
        setCollectionList(res.data.result)
      })
      .catch((err: AxiosError) => {
        setCollectionStatus({
          loading: false,
          success: false,
          error: err.message || JSON.stringify(err, null, '  ')
        })
      })
  }, [])

  const removeField = (key: string) => {
    const _defKeys: ISchemaFieldDefKeys[] = form.getFieldValue('_defKeys')

    const _newDefKeys = _defKeys.filter((def) => def.key !== key)
    form.setFieldsValue({
      _defKeys: _newDefKeys
    })
  }

  const addField = () => {
    const _defKeys = form.getFieldValue('_defKeys') as ISchemaFieldDefKeys[]
    const newDefs = _defKeys.concat({
      key: `key-${fieldIndex}`,
      type: `type-${fieldIndex}`,
      name: `name-${fieldIndex}`,
      helper: `helper-${fieldIndex}`,
      order: `order-${fieldIndex}`,
      grid: `grid-${fieldIndex}`,
      new_line: `new_line-${fieldIndex}`,
      show: `show-${fieldIndex}`
    })
    fieldIndex++

    form.setFieldsValue({
      _defKeys: newDefs
    })
  }

  getFieldDecorator('_defKeys', { initialValue: [] as ISchemaFieldDefKeys[] })
  const _defKeys = getFieldValue('_defKeys')

  const formItems = _defKeys.map((def: ISchemaFieldDefKeys, index: number) => (
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
              <Form.Item label="Name" required={true} key="name">
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
              <Form.Item label="Grid" key="grid">
                {getFieldDecorator(`_defValues[${def.grid}]`, {
                  initialValue: 24,
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      validator: (rule: any, value: number, callback: any) => {
                        if (value > 24 || value < 1) {
                          callback('Please input a number between 1 and 24.')
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
              <Form.Item label="Order" key="order">
                {getFieldDecorator(`_defValues[${def.order}]`, {
                  initialValue: 1,
                  validateTrigger: ['onChange', 'onBlur']
                })(<InputNumber placeholder="Grid" />)}
              </Form.Item>
            </Col>
            {/* New Line */}
            <Col span={5}>
              <Form.Item label="New Line ?" key="new_line">
                {getFieldDecorator(`_defValues[${def.new_line}]`, {
                  valuePropName: 'checked',
                  initialValue: false
                })(<Checkbox />)}
              </Form.Item>
            </Col>
            {/* Show on list */}
            <Col span={5}>
              <Form.Item label="Show in List ?" key="show">
                {getFieldDecorator(`_defValues[${def.show}]`, {
                  valuePropName: 'checked',
                  initialValue: false
                })(<Checkbox />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {/* Helper Text */}
            <Col span={22}>
              <Form.Item label="Helper Text" key="helper">
                {getFieldDecorator(`_defValues[${def.helper}]`)(
                  <Input.TextArea />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  ))

  return (
    <Form layout="vertical" onSubmit={handleSubmit}>
      {/* Meta */}
      <Row>
        <Col span={12}>
          {collectionStatus.loading ? (
            <Spin />
          ) : collectionStatus.error ? (
            <Alert message={collectionStatus.error} type="error" closable />
          ) : (
            <Form.Item label="Collection" required={true} key="collection_id">
              {getFieldDecorator(`collection_id`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Collection is required'
                  }
                ]
              })(
                <Select placeholder="Select a Collection">
                  {collectionList.map((c) => (
                    <Select.Option value={c.id} key={c.id}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )}
        </Col>
      </Row>
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
        const { _defKeys, _defValues } = values
        const defs = (_defKeys as ISchemaFieldDefKeys[]).map((def) => {
          const obj = {} as { [key: string]: any }

          Object.keys(def).forEach((key) => {
            obj[key] = _defValues[(def as any)[key]]
          })
          return obj
        })

        // Create schema
        setSchemaStatus({
          loading: true,
          success: false,
          error: ''
        })
        createSchemaRequest({
          name: values.name,
          handle: values.handle,
          description: values.description,
          def: defs as ISchemaFieldDef[],
          collection_id: values.collection_id
        })
          .then((res) => {
            setSchemaStatus({
              loading: false,
              success: true,
              error: ''
            })

            router.push('/schema/list')
          })
          .catch((err: AxiosError) => {
            setSchemaStatus({
              loading: false,
              success: false,
              error: err.message || JSON.stringify(err, null, '  ')
            })
          })
      }
    })
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'schema',
          url: '/schema/list',
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

const WrappedSchemaPage = Form.create({ name: 'create-schema' })(
  CreateSchemaPage
)

export default WrappedSchemaPage
