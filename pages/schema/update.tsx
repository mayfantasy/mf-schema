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
  Spin
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import Loading from '../../components/Loading/Loading'
import router from 'next/router'
import {
  ESchemaFieldType,
  ISchemaFieldDef,
  ISchemaFieldDefKeys,
  IUpdateSchemaPayload,
  ISchema
} from '../../types/schema.type'
import {
  updateSchemaRequest,
  getSchemaById
} from '../../requests/schema.request'
import { AxiosError } from 'axios'
import { enumToKeyArray } from '../../helpers/utils.helper'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PageHeader from '../../components/PageHeader/PageHeader'

interface IUpdateSchemaFormProps<V> {
  handleSubmit: (e: any) => void
  form: WrappedFormUtils<V>
}

/**
 * payload
 * adjusts special form values structure
 * _defKeys: array, schema definition structure, stores the value index
 * _defValues: object, stores the actual value
 */
interface IUpdateSchemaFormValues extends IUpdateSchemaPayload {
  _defKeys: ISchemaFieldDefKeys[]
  _defValues: { [key: string]: any }
}

/**
 * Ensure key uniqueness of each field
 * during modifing the structure
 * (Always increasing)
 */
let fieldIndex = 0

const UpdateSchemaForm = (
  props: IUpdateSchemaFormProps<IUpdateSchemaFormValues>
) => {
  const { form, handleSubmit } = props
  const { getFieldDecorator, getFieldValue } = form
  const [currentSchema, setCurrentSchema] = useState<ISchema | null>(null)
  const [currentSchemaStatus, setCurrentSchemaStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })
  const router = useRouter()

  /**
   *
   * @param schema shema to load to the form
   * Set initial form values based on the schema
   */
  const setInitialFormValues = (schema: ISchema) => {
    const map = (i: number): ISchemaFieldDefKeys => ({
      key: `key-${i}`,
      type: `type-${i}`,
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

  /**
   *
   * @param id schema ID
   * Get current schema by ID
   */
  const getCurrentSchema = (id: string) => {
    setCurrentSchemaStatus({
      loading: true,
      success: false,
      error: ''
    })
    getSchemaById(id as string)
      .then((res) => {
        setCurrentSchemaStatus({
          loading: false,
          success: true,
          error: ''
        })
        const data = res.data.result
        setCurrentSchema(data)
        setInitialFormValues(data)
      })
      .catch((err) => {
        setCurrentSchemaStatus({
          loading: false,
          success: false,
          error: err.message || JSON.stringify(err, null, '  ')
        })
      })
  }

  useEffect(() => {
    const { id } = router.query
    if (id) {
      getCurrentSchema(id as string)
    }
  }, [])

  /**
   *
   * @param key schema definitioin key
   * Remove from schema definition array
   */
  const removeField = (key: string) => {
    const _defKeys: ISchemaFieldDefKeys[] = form.getFieldValue('_defKeys')

    const _newDefKeys = _defKeys.filter((def) => def.key !== key)
    form.setFieldsValue({
      _defKeys: _newDefKeys
    })
  }

  /**
   * Add schema definition field
   */
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

  if (currentSchemaStatus.loading) {
    return <Loading />
  }

  if (currentSchemaStatus.error) {
    return <Alert message={currentSchemaStatus.error} type="error" closable />
  }

  if (!currentSchema) {
    return (
      <Button onClick={() => getCurrentSchema(router.query.id as string)}>
        Load
      </Button>
    )
  }

  if (currentSchema) {
    setInitialFormValues(currentSchema)
  }

  /**
   * Render schema definition form structure
   */
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
                  validateTrigger: ['onChange', 'onBlur']
                })(<InputNumber placeholder="Grid" />)}
              </Form.Item>
            </Col>
            {/* Order */}
            <Col span={5}>
              <Form.Item label="New Line ?" key="new_line">
                {getFieldDecorator(`_defValues[${def.new_line}]`, {
                  valuePropName: 'checked'
                })(<Checkbox />)}
              </Form.Item>
            </Col>
            {/* Show on list */}
            <Col span={5}>
              <Form.Item label="Show in List ?" key="show">
                {getFieldDecorator(`_defValues[${def.show}]`, {
                  valuePropName: 'checked'
                })(<Checkbox />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {/* Helper Text */}
            <Col span={22}>
              <Form.Item label="Helper Text" key="helper">
                {getFieldDecorator(`_defValues[${def.helper}]`)(
                  <Input.TextArea autoSize={{ minRows: 8 }} />
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
      <PageHeader
        name={currentSchema.name}
        sub={currentSchema.handle}
        buttonLink={`/schema/detail?id=${currentSchema.id}`}
        buttonWord="View Schema"
        description={currentSchema.description}
      />
      {/* Meta */}
      <Row>
        <Col span={12}>
          <h3>Collection</h3>
          <Link href={`/collection/detail?id=${currentSchema.collection.id}`}>
            <a>{currentSchema.collection.name}</a>
          </Link>
        </Col>
      </Row>
      <br />
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
            })(<Input disabled />)}
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
          })(<Input.TextArea autoSize={{ minRows: 8 }} />)}
        </Form.Item>
      </Row>

      {/* Schema field */}
      {formItems}
      <br />

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
          Update Schema
        </Button>
      </Form.Item>
    </Form>
  )
}

interface IProps extends FormComponentProps<IUpdateSchemaFormValues> {}

const UpdateSchemaPage = (props: IProps) => {
  const [schemaStatus, setSchemaStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })
  const { form } = props
  const router = useRouter()

  const updateSchema = (payload: IUpdateSchemaPayload) => {
    // Update schema
    setSchemaStatus({
      loading: true,
      success: false,
      error: ''
    })
    updateSchemaRequest(payload)
      .then((res) => {
        setSchemaStatus({
          loading: false,
          success: true,
          error: ''
        })

        // router.push(`/schema/detail?id=${payload.id}`)
      })
      .catch((err: AxiosError) => {
        setSchemaStatus({
          loading: false,
          success: false,
          error: err.message || JSON.stringify(err, null, '  ')
        })
      })
  }

  /**
   *
   * @param e
   * Handle schema update submission
   */
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
        console.log('Merged values:', defs)
        if (router.query.id) {
          updateSchema({
            id: router.query.id as string,
            ...(values.name ? { name: values.name.trim() } : {}),
            ...(values.handle ? { handle: values.handle.trim() } : {}),
            ...(values.description
              ? { description: values.description.trim() }
              : {}),
            def: defs as ISchemaFieldDef[]
          })
        }
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
          key: 'update',
          url: '/schema/update',
          name: 'Update'
        }
      ]}
    >
      {schemaStatus.error && (
        <>
          <Alert message={schemaStatus.error} type="error" closable />
          <br />
        </>
      )}

      <div style={{ height: '70%' }}>
        {schemaStatus.loading ? (
          <Loading />
        ) : (
          <div style={{ width: '70%' }}>
            {schemaStatus.success && (
              <Alert
                message="Schema updated successfully."
                type="success"
                closable
              />
            )}
            <br />
            <UpdateSchemaForm form={form} handleSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </PageLayout>
  )
}

const WrappedSchemaPage = Form.create({ name: 'update-schema' })(
  UpdateSchemaPage
)

export default WrappedSchemaPage
