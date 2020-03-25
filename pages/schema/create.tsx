import React, { useState, useEffect } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { Form, Button, Alert, Row, Col, Input, Select } from 'antd'
import Loading from '../../components/Loading/Loading'
import {
  ISchemaFieldDef,
  ESchemaFieldType,
  ICreateSchemaPayload
} from '../../types/schema.type'
import { createSchemaRequest } from '../../requests/schema.request'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { RequestStatus } from '../../helpers/request'
import { pageRoutes } from '../../navigation/page-routes'
import PageHeader from '../../components/PageHeader/PageHeader'
import Link from 'next/link'
import FormFieldLabel from '../../components/FormFieldLabel/FormFieldLabel'
import { useForm } from 'antd/lib/form/util'

import { getCollectionListRequest } from '../../requests/collection.request'
import { ICollection } from '../../types/collection.type'
import SchemaField from '../../components/shema/SchemaField'

const CreateSchemaPage = () => {
  const metaForm = useForm()[0]
  const defForm = useForm()[0]
  const newFieldForm = useForm()[0]

  const [activeDefKey, setActiveDefKey] = useState<string | null>(null)
  const [newSchema, setNewSchema] = useState<ICreateSchemaPayload | null>(null)

  /**
   * ||==========================
   * || Collection List
   */
  const [collectionList, setCollectionList] = useState<ICollection[]>([])
  const collectionListRequestStatus = new RequestStatus()
  const [collectionListStatus, setCollectionListStatus] = useState(
    collectionListRequestStatus.status
  )
  const getCollections = () => {
    setCollectionListStatus(collectionListRequestStatus.loading())
    getCollectionListRequest()
      .then((res) => {
        setCollectionListStatus(collectionListRequestStatus.success())
        setCollectionList(res.data.result)
      })
      .catch((err: AxiosError) => {
        setCollectionListStatus(collectionListRequestStatus.error(err))
      })
  }

  /**
   * ||==========================
   * || Get Collection list when page loads
   */
  useEffect(() => {
    if (window) {
      getCollections()
    }
  }, [])

  /**
   * || ===============
   * || Create schema
   */
  const router = useRouter()
  const createSchemaRequestStatus = new RequestStatus()
  const [createSchemaStatus, setCreateSchemaStatus] = useState(
    createSchemaRequestStatus.status
  )

  const createSchema = (schema: ICreateSchemaPayload) => {
    // Create schema
    setCreateSchemaStatus(createSchemaRequestStatus.loading())
    createSchemaRequest({
      name: schema.name,
      handle: schema.handle,
      description: schema.description,
      def: schema.def,
      collection_id: schema.collection_id
    })
      .then((res) => {
        setCreateSchemaStatus(createSchemaRequestStatus.success())
        router.push(pageRoutes.listSchemas)
      })
      .catch((err: AxiosError) => {
        setCreateSchemaStatus(createSchemaRequestStatus.error(err))
      })
  }

  /**
   * || ==============================================
   * || Layout
   */
  const layout = (content: React.ReactNode) => (
    <PageLayout
      breadCrumb={[
        {
          key: 'schema',
          url: pageRoutes.listSchemas,
          name: 'Schema'
        },
        {
          key: 'create',
          url: pageRoutes.createSchema,
          name: 'Create'
        }
      ]}
    >
      {content}
    </PageLayout>
  )

  /**
   * ||==========================
   * || Handle def modification
   */
  const removeField = (index: number) => {
    if (newSchema) {
      const values = defForm.getFieldsValue()
      const def = newSchema.def
      const newDef = [
        ...def.slice(0, index),
        ...def.slice(index + 1, def.length)
      ]
      setNewSchema({
        ...newSchema,
        def: newDef
      })
      setActiveDefKey(null)
    }
  }

  const onMoveUpItem = (index: number) => {
    if (newSchema) {
      const newDef = [...newSchema.def]
      const origItem = newDef[index]
      const upItem = newDef[index - 1]
      newDef[index] = upItem
      newDef[index - 1] = origItem
      setNewSchema({
        ...newSchema,
        def: newDef
      })
    }
  }

  const onMoveDownItem = (index: number) => {
    if (newSchema) {
      const newDef = [...newSchema.def]
      const origItem = newDef[index]
      const upItem = newDef[index + 1]
      newDef[index] = upItem
      newDef[index + 1] = origItem
      setNewSchema({
        ...newSchema,
        def: newDef
      })
      console.log(index)
    }
  }

  const onEditDef = (key: string | null) => {
    if (newSchema) {
      const def = newSchema.def.find((d) => d.key === key)
      if (def) {
        defForm.setFieldsValue(def)
        setActiveDefKey(def.key)
      } else {
        setActiveDefKey(null)
      }
    }
  }

  const onConfirmEditDef = (index: number) => {
    if (newSchema) {
      const values = defForm.getFieldsValue()
      const def = newSchema.def
      const newDef = [
        ...def.slice(0, index),
        values as ISchemaFieldDef,
        ...def.slice(index + 1, def.length)
      ]
      setNewSchema({
        ...newSchema,
        def: newDef
      })
      console.log(newSchema)
      setActiveDefKey(null)
    }
  }

  /**
   * ||======================
   * || Submit schema Create
   */
  const onSubmit = () => {
    if (newSchema) {
      const meta = metaForm.getFieldsValue()
      createSchema({ ...newSchema, ...meta })
    }
  }

  const initialNewFieldValues: ISchemaFieldDef = {
    type: ESchemaFieldType.string,
    key: '',
    name: '',
    helper: '',
    order: 1,
    grid: 24,
    new_line: false,
    show: false,
    options: [],
    helper_image: ''
  }

  /**
   * ||=====================================
   * || Add confirmed new field to new schema
   */
  const onConfirmAddNewField = () => {
    const newDef = [
      ...(newSchema ? newSchema.def : []),
      newFieldForm.getFieldsValue() as ISchemaFieldDef
    ] as ISchemaFieldDef[]

    setNewSchema({
      ...metaForm.getFieldsValue(),
      def: newDef
    } as ICreateSchemaPayload)

    // Clear new field form
    newFieldForm.setFieldsValue(initialNewFieldValues)
  }

  /**
   * ||==================
   * || Submit button
   */
  const submitButton = (
    <Button
      type="primary"
      onClick={onSubmit}
      disabled={!(newSchema && newSchema.def.length && !activeDefKey)}
    >
      Submit
    </Button>
  )

  /**
   * ||====================================
   * || Layout
   */
  return layout(
    <>
      {createSchemaStatus.error && (
        <>
          <Alert message={createSchemaStatus.error} type="error" closable />
          <br />
        </>
      )}

      <div style={{ height: '70%' }}>
        {createSchemaStatus.loading ? (
          <Loading />
        ) : (
          <div style={{ width: '100%', maxWidth: '800px' }}>
            {createSchemaStatus.success && (
              <Alert
                message="Schema created successfully."
                type="success"
                closable
              />
            )}
            <br />
            <PageHeader
              name="Create Schema"
              buttons={
                <Row>
                  <Link href={pageRoutes.listSchemas}>
                    <Button type="default">Back to list</Button>
                  </Link>
                  &nbsp;
                  {submitButton}
                </Row>
              }
            />
            <br />
            <br />

            {/* Meta */}
            <Form name="meta" layout="vertical" form={metaForm}>
              <Row gutter={2}>
                <Col span={12}>
                  {collectionList ? (
                    <Form.Item
                      label={<FormFieldLabel>Collection</FormFieldLabel>}
                      required={true}
                      key="collection_id"
                      name="collection_id"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: 'Collection is required'
                        }
                      ]}
                      validateTrigger={['onChange', 'onBlur']}
                    >
                      <Select placeholder="Select a Collection">
                        {collectionList.map((c) => (
                          <Select.Option value={c.id} key={c.id}>
                            {c.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    <Loading />
                  )}
                </Col>
              </Row>
              <Row gutter={2}>
                <Col span={12}>
                  <Form.Item
                    label={<FormFieldLabel>Name</FormFieldLabel>}
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: 'Please input the schema name'
                      }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<FormFieldLabel>Handle</FormFieldLabel>}
                    name="handle"
                    rules={[
                      {
                        required: true,
                        message: 'Please input the schema handle'
                      }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label={<FormFieldLabel>Description</FormFieldLabel>}
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: 'Please input the schema description'
                      }
                    ]}
                    hasFeedback
                  >
                    <Input.TextArea autoSize={{ minRows: 8 }} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Form layout="vertical" form={defForm}>
              {(newSchema ? newSchema.def : []).map((d, i) => (
                <SchemaField
                  key={d.key}
                  form={defForm}
                  def={d}
                  index={i}
                  editMode={activeDefKey === d.key}
                  onConfirmEditDef={onConfirmEditDef}
                  onEditDef={onEditDef}
                  removeField={removeField}
                  schemaDefLength={newSchema ? newSchema.def.length : 0}
                  onMoveUpItem={onMoveUpItem}
                  onMoveDownItem={onMoveDownItem}
                  onOptionsChange={(v: string[]) =>
                    defForm.setFieldsValue({
                      options: v
                    })
                  }
                  onHelperImageChange={(image: string) =>
                    defForm.setFieldsValue({
                      helper_image: image
                    })
                  }
                />
              ))}
            </Form>
            <br />
            <Form
              layout="vertical"
              form={newFieldForm}
              initialValues={initialNewFieldValues}
            >
              {/* <pre>
                {JSON.stringify(newFieldForm.getFieldsError(), null, ' ')}
              </pre> */}
              <SchemaField
                form={newFieldForm}
                def={newFieldForm.getFieldsValue() as ISchemaFieldDef}
                title="New Field"
                onConfirmEditButtonText="Confirm add"
                index={0}
                editMode={true}
                onConfirmEditDef={onConfirmAddNewField}
                schemaDefLength={1}
                onOptionsChange={(v: string[]) =>
                  newFieldForm.setFieldsValue({
                    options: v
                  })
                }
                onHelperImageChange={(image: string) =>
                  newFieldForm.setFieldsValue({
                    helper_image: image
                  })
                }
              />
            </Form>

            <br />
            <Row justify="end">{submitButton}</Row>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        )}
      </div>
    </>
  )
}

export default CreateSchemaPage
