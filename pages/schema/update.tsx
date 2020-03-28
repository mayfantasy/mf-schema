import React, { useState, useEffect } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { Form, Button, Alert, Row, Col, Input } from 'antd'
import Loading from '../../components/Loading/Loading'
import {
  ISchemaFieldDef,
  IUpdateSchemaPayload,
  ISchema,
  ESchemaFieldType
} from '../../types/schema.type'
import {
  updateSchemaRequest,
  getSchemaByIdRequest
} from '../../requests/schema.request'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { RequestStatus } from '../../helpers/request'
import { pageRoutes } from '../../navigation/page-routes'
import PageHeader from '../../components/PageHeader/PageHeader'
import Link from 'next/link'
import FormFieldLabel from '../../components/FormFieldLabel/FormFieldLabel'
import { useForm } from 'antd/lib/form/util'
import SchemaField from '../../components/shema/SchemaField'

interface IProps {}

const UpdateSchemaPage = (props: IProps) => {
  const metaForm = useForm()[0]
  const defForm = useForm()[0]
  const newFieldForm = useForm()[0]

  const [activeDefKey, setActiveDefKey] = useState<string | null>(null)
  /**
   * || ===============================
   * || Get Current Schema when page loads
   */
  const router = useRouter()
  useEffect(() => {
    const { id } = router.query
    if (id) {
      getCurrentSchema(id as string)
    }
  }, [])

  /**
   * || ===============
   * || Current schema
   */
  const [currentSchema, setCurrentSchema] = useState<ISchema | null>(null)

  const schemaRequestStatus = new RequestStatus()
  const [currentSchemaStatus, setCurrentSchemaStatus] = useState(
    schemaRequestStatus.status
  )

  const getCurrentSchema = (id: string) => {
    setCurrentSchemaStatus(schemaRequestStatus.loading())
    getSchemaByIdRequest(id as string)
      .then((res) => {
        setCurrentSchemaStatus(schemaRequestStatus.success())
        const data = res.data.result
        setCurrentSchema(data)
      })
      .catch((err) => {
        setCurrentSchemaStatus(schemaRequestStatus.error(err))
      })
  }

  /**
   * || ===============
   * || Update schema
   */
  const updateSchemaRequestStatus = new RequestStatus()
  const [updateSchemaStatus, setUpdateSchemaStatus] = useState(
    updateSchemaRequestStatus.status
  )
  const updateSchema = (payload: IUpdateSchemaPayload) => {
    // Update schema
    setUpdateSchemaStatus(updateSchemaRequestStatus.loading())
    updateSchemaRequest(payload)
      .then((res) => {
        setUpdateSchemaStatus(updateSchemaRequestStatus.success())
      })
      .catch((err: AxiosError) => {
        setUpdateSchemaStatus(updateSchemaRequestStatus.error(err))
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
          key: 'edit',
          url: pageRoutes.updateSchema,
          name: 'Edit'
        }
      ]}
    >
      {content}
    </PageLayout>
  )

  /**
   * || ==============================================
   * || Handle loading, error and none-data states
   */

  if (!currentSchema) {
    return layout(
      currentSchemaStatus.loading ? (
        <Loading />
      ) : currentSchemaStatus.error ? (
        <Alert message={currentSchemaStatus.error} type="error" closable />
      ) : (
        <Button onClick={() => getCurrentSchema(router.query.id as string)}>
          Load
        </Button>
      )
    )
  }

  const initialMetaFormValues = {
    name: currentSchema.name,
    handle: currentSchema.handle,
    description: currentSchema.description
  }

  /**
   * ||==========================
   * || Handle def modification
   */
  const removeField = (index: number) => {
    const values = defForm.getFieldsValue()
    const def = currentSchema.def
    const newDef = [...def.slice(0, index), ...def.slice(index + 1, def.length)]
    setCurrentSchema({
      ...currentSchema,
      def: newDef
    })
    setActiveDefKey(null)
  }

  const onMoveUpItem = (index: number) => {
    const newDef = [...currentSchema.def]
    const origItem = newDef[index]
    const upItem = newDef[index - 1]
    newDef[index] = upItem
    newDef[index - 1] = origItem
    setCurrentSchema({
      ...currentSchema,
      def: newDef
    })
  }

  const onMoveDownItem = (index: number) => {
    const newDef = [...currentSchema.def]
    const origItem = newDef[index]
    const upItem = newDef[index + 1]
    newDef[index] = upItem
    newDef[index + 1] = origItem
    setCurrentSchema({
      ...currentSchema,
      def: newDef
    })
    console.log(index)
  }

  const onEditDef = (key: string | null) => {
    const def = currentSchema.def.find((d) => d.key === key)
    if (def) {
      defForm.setFieldsValue(def)
      setActiveDefKey(def.key)
    } else {
      setActiveDefKey(null)
    }
  }

  const onConfirmEditDef = (index: number) => {
    const values = defForm.getFieldsValue()
    const def = currentSchema.def
    const newDef = [
      ...def.slice(0, index),
      values as ISchemaFieldDef,
      ...def.slice(index + 1, def.length)
    ]
    setCurrentSchema({
      ...currentSchema,
      def: newDef
    })
    console.log(currentSchema)
    setActiveDefKey(null)
  }

  /**
   * ||======================
   * || Submit schema update
   */
  const onSubmit = () => {
    const meta = metaForm.getFieldsValue()
    updateSchema({
      id: currentSchema.id,
      name: meta.name,
      handle: meta.handle,
      description: meta.description,
      def: currentSchema.def
    })
  }

  /**
   * ||======================
   * || Submit button
   */
  const SubmitButton = (
    <Button type="primary" onClick={onSubmit} disabled={!!activeDefKey}>
      Submit
    </Button>
  )

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
      ...(currentSchema ? currentSchema.def : []),
      newFieldForm.getFieldsValue() as ISchemaFieldDef
    ] as ISchemaFieldDef[]

    setCurrentSchema({
      ...currentSchema,
      def: newDef
    })

    // Clear new field form
    newFieldForm.setFieldsValue(initialNewFieldValues)
  }

  /**
   * ||====================================
   * || Layout
   */
  return layout(
    <>
      {updateSchemaStatus.error && (
        <>
          <Alert message={updateSchemaStatus.error} type="error" closable />
          <br />
        </>
      )}

      <div style={{ height: '70%' }}>
        {updateSchemaStatus.loading ? (
          <Loading />
        ) : (
          <div style={{ width: '100%', maxWidth: '800px' }}>
            {updateSchemaStatus.success && (
              <Alert
                message="Schema updated successfully."
                type="success"
                closable
              />
            )}
            <br />
            <PageHeader
              name={currentSchema.name}
              sub={currentSchema.handle}
              buttons={
                <Row>
                  <Link
                    href={`${pageRoutes.schemaDetail}?id=${currentSchema.id}`}
                  >
                    <Button type="default">View Schema</Button>
                  </Link>
                  &nbsp;
                  <Link
                    href={`${pageRoutes.updateSchemaFromJson}?id=${currentSchema.id}`}
                  >
                    <Button type="default">Edit from JSON</Button>
                  </Link>
                  &nbsp;
                  {SubmitButton}
                  {!currentSchema && (
                    <Link href={pageRoutes.createSchemaFromJson}>
                      <Button>Create from JSON</Button>
                    </Link>
                  )}
                </Row>
              }
              description={currentSchema ? currentSchema.description : ''}
            />
            <br />
            <br />

            {/* Meta */}
            <div>
              <Link
                href={`${pageRoutes.collectionDetail}?id=${currentSchema.collection.id}`}
              >
                <a>{currentSchema.collection.name}</a>
              </Link>
            </div>
            <br />

            <Form
              name="meta"
              layout="vertical"
              form={metaForm}
              initialValues={initialMetaFormValues}
              onFinish={(values: any) => console.log(values)}
            >
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
              {currentSchema.def.map((d, i) => (
                <SchemaField
                  form={defForm}
                  def={d}
                  index={i}
                  editMode={activeDefKey === d.key}
                  onConfirmEditDef={onConfirmEditDef}
                  onEditDef={onEditDef}
                  removeField={removeField}
                  schemaDefLength={currentSchema.def.length}
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
            <Row justify="end">{SubmitButton}</Row>
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

export default UpdateSchemaPage
