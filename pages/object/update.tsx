import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import {
  getObjectByIdRequest,
  deleteObjectByIdRequest,
  updateObjectByIdRequest
} from '../../requests/object.request'
import PageLayout from '../../components/PageLayout/PageLayout'
import {
  Alert,
  Button,
  Card,
  Input,
  Row,
  Col,
  InputNumber,
  Checkbox,
  DatePicker,
  Typography,
  Popconfirm,
  Icon,
  Collapse
} from 'antd'
import Loading from '../../components/Loading/Loading'
import {
  ESchemaFieldType,
  ISchemaFieldDef,
  ISchema
} from '../../types/schema.type'
import { IObject } from '../../types/object.type'
import Moment from 'moment'
import ImageUploader from '../../components/ImageUploader/ImageUploader'
import FormFieldLabel from '../../components/FormFieldLabel/FormFieldLabel'
import { RequestStatus } from '../../helpers/request'
import StringArray from '../../components/StringArray/StringArray'
import ObjectUsers from '../../components/ObjectUsers/ObjectUsers'
import RichTextField from '../../components/RichTextField/RichTextField'
import { pageRoutes } from '../../navigation/page-routes'
import StringSingleSelect from '../../components/StringSingleSelect/StringSingleSelect'
import StringMultiSelect from '../../components/StringMultiSelect/StringMultiSelect'
import ImageViewer from '../../components/ImageViewer/ImageViewer'
import PageHeader from '../../components/PageHeader/PageHeader'
import Link from 'next/link'

interface IFormStructure {
  [key: string]: any
}

const ObjectUpdatePage = () => {
  const router = useRouter()
  const [form, setForm] = useState<IFormStructure>({})
  const [handle, setHandle] = useState('')

  /**
   * Get current object
   */

  const [currentObject, setCurrentObject] = useState<IObject | null>(null)
  const currentObjectRequestStatus = new RequestStatus()
  const [getCurrentObjectStatus, setGetCurrentObjectStatus] = useState(
    currentObjectRequestStatus.status
  )
  const getCurrentObject = (
    collection_handle: string,
    schema_handle: string,
    id: string
  ) => {
    setGetCurrentObjectStatus(currentObjectRequestStatus.loading())
    getObjectByIdRequest(collection_handle, schema_handle, id)
      .then((res) => {
        setGetCurrentObjectStatus(currentObjectRequestStatus.success())
        const data = res.data.result as IObject
        setCurrentObject(data)
        const formData = data.schema.def.reduce((a, c) => {
          a[c.key] = data[c.key] || null
          return a
        }, {} as { [key: string]: any })

        // convert datepicker value to moment
        data.schema.def.forEach((d: ISchemaFieldDef) => {
          if (d.type === ESchemaFieldType.datepicker) {
            formData[d.key] = Moment(data[d.key])
          }
        })

        setHandle(data._handle)

        delete formData.id
        delete formData.schema
        delete formData._schema_handle
        delete formData._handle

        setForm(formData)
      })
      .catch((err) => {
        setGetCurrentObjectStatus(currentObjectRequestStatus.error(err))
      })
  }

  /**
   * Update object
   */
  const updateCurrentObjectRequestStatus = new RequestStatus()
  const [updateCurrentObjectStatus, setUpdateCurrentObjectStatus] = useState(
    updateCurrentObjectRequestStatus.status
  )
  const updateCurrentObject = (
    collection_handle: string,
    schema_handle: string,
    id: string,
    payload: any
  ) => {
    setUpdateCurrentObjectStatus(updateCurrentObjectRequestStatus.loading())
    if (currentObject) {
      updateObjectByIdRequest(collection_handle, schema_handle, id, payload)
        .then((res) => {
          setUpdateCurrentObjectStatus(
            updateCurrentObjectRequestStatus.success()
          )
        })
        .catch((err) => {
          setUpdateCurrentObjectStatus(
            updateCurrentObjectRequestStatus.error(err)
          )
        })
    }
  }

  /**
   * Delete object
   */
  const deleteCurrentObjectRequestStatus = new RequestStatus()
  const [deleteObjectStatus, setDeleteObjectStatus] = useState(
    deleteCurrentObjectRequestStatus.status
  )

  const deleteCurrentObject = (
    collection_handle: string,
    schema_handle: string,
    id: string
  ) => {
    setDeleteObjectStatus(deleteCurrentObjectRequestStatus.loading())
    if (currentObject) {
      let schemaId = currentObject.schema.id
      deleteObjectByIdRequest(collection_handle, schema_handle, id)
        .then((res) => {
          setDeleteObjectStatus(deleteCurrentObjectRequestStatus.success())
          router.push(`${pageRoutes.schemaDetail}?id=${schemaId}`)
        })
        .catch((err) => {
          setDeleteObjectStatus(deleteCurrentObjectRequestStatus.error(err))
        })
    }
  }

  useEffect(() => {
    const { id, schema_handle, collection_handle } = router.query
    if (id && schema_handle && collection_handle) {
      getCurrentObject(
        collection_handle as string,
        schema_handle as string,
        id as string
      )
    }
  }, [])

  const layout = (content: React.ReactNode) => (
    <PageLayout
      breadCrumb={[
        {
          key: 'schema',
          url: pageRoutes.listSchemas,
          name: 'Schema'
        },
        {
          key: 'objects',
          url: `${pageRoutes.schemaDetail}?id=${
            currentObject ? currentObject.schema.id : ''
          }`,
          name: 'Objects'
        },
        {
          key: 'update',
          name: 'Update'
        }
      ]}
    >
      {content}
    </PageLayout>
  )

  if (getCurrentObjectStatus.loading || updateCurrentObjectStatus.loading) {
    return layout(<Loading />)
  }

  if (getCurrentObjectStatus.error) {
    return layout(
      <Alert message={getCurrentObjectStatus.error} type="error" closable />
    )
  }

  if (!currentObject) {
    return layout(
      <Button
        onClick={() =>
          getCurrentObject(
            router.query.collection_handle as string,
            router.query.schema_handle as string,
            router.query.id as string
          )
        }
      >
        Load
      </Button>
    )
  }

  const handleUpdateObject = () => {
    const values = {
      _handle: handle,
      ...form
    }
    const { collection_handle, schema_handle, id } = router.query
    updateCurrentObject(
      collection_handle as string,
      schema_handle as string,
      id as string,
      values
    )
  }

  /**
   *
   * @param e field event
   * @param type schema field type
   * @param key schema field key
   * Handle create object form change
   */
  const handleFieldChange = (e: any, type: ESchemaFieldType, key: string) => {
    let value: any
    switch (type) {
      case ESchemaFieldType.string:
        value = e.target.value
        break
      case ESchemaFieldType.number:
        value = e
        break
      case ESchemaFieldType.boolean:
        value = e.target.checked
        break
      case ESchemaFieldType.textarea:
        value = e.target.value
        break
      case ESchemaFieldType.datepicker:
        value = e
      case ESchemaFieldType.image:
        value = e
        break
      case ESchemaFieldType.string_array:
        value = e
        break
      case ESchemaFieldType.rich_text:
        value = e
        break
      case ESchemaFieldType.string_single_select:
        value = e
        break
      case ESchemaFieldType.string_multi_select:
        value = e
        break
      default:
        value = e.target.value
    }
    if (form) {
      const newForm: IFormStructure = { ...form }
      newForm[key] = value
      setForm(newForm)
    }
  }

  const findFormFieldByKey = (
    type: ESchemaFieldType,
    key: string,
    value: any,
    options: any[],
    name: string | null,
    grid: number | null,
    helper: string | null,
    helper_image: string | null
  ) => {
    let input
    switch (type) {
      case ESchemaFieldType.string:
        input = (
          <Input
            style={{ width: '100%' }}
            value={value}
            onChange={(e: any) => handleFieldChange(e, type, key)}
          />
        )
        break
      case ESchemaFieldType.number:
        input = (
          <InputNumber
            style={{ width: '100%' }}
            value={value}
            onChange={(e: any) => handleFieldChange(e, type, key)}
          />
        )
        break
      case ESchemaFieldType.boolean:
        input = (
          <div>
            <Checkbox
              checked={value}
              onChange={(e: any) => handleFieldChange(e, type, key)}
            />
          </div>
        )
        break
      case ESchemaFieldType.textarea:
        input = (
          <Input.TextArea
            style={{ width: '100%' }}
            value={value}
            autoSize={{ minRows: 8 }}
            onChange={(e: any) => handleFieldChange(e, type, key)}
          />
        )
        break
      case ESchemaFieldType.datepicker:
        input = (
          <div>
            <DatePicker
              value={value}
              onChange={(e: any) => handleFieldChange(e, type, key)}
            />
          </div>
        )
        break
      case ESchemaFieldType.image:
        input = (
          <ImageUploader
            value={value}
            onChange={(e: any) => handleFieldChange(e, type, key)}
          />
        )
        break
      case ESchemaFieldType.string_array:
        input = (
          <StringArray
            value={value}
            onChange={(v: string[]) => {
              handleFieldChange(v, type, key)
            }}
          />
        )
        break
      case ESchemaFieldType.rich_text:
        input = (
          <RichTextField
            value={value}
            onChange={(v: string) => {
              handleFieldChange(v, type, key)
            }}
          />
        )
        break
      case ESchemaFieldType.string_single_select:
        input = (
          <StringSingleSelect
            value={value}
            options={options}
            onChange={(v: string) => handleFieldChange(v, type, key)}
          />
        )
        break
      case ESchemaFieldType.string_multi_select:
        input = (
          <StringMultiSelect
            value={value}
            options={options}
            onChange={(v: string[]) => handleFieldChange(v, type, key)}
          />
        )
        break
      default:
        input = (
          <Input
            value={value}
            onChange={(e: any) => handleFieldChange(e, type, key)}
          />
        )
    }
    return (
      <Row
        style={{
          marginBottom: '15px',
          padding: '15px',
          borderLeft: '3px solid #eee',
          backgroundColor: '#f6f7f8',
          borderRadius: '3px'
        }}
        key={key}
      >
        <Col span={Number(grid || 24)}>
          <FormFieldLabel>
            <Typography.Text strong style={{ color: 'black' }}>
              {key}
            </Typography.Text>
            &nbsp;&nbsp;
            <Typography.Text type="secondary">
              <small>{name}</small>
            </Typography.Text>
          </FormFieldLabel>
          {input}
          <br />
          <div>
            {!!helper && (
              <Typography.Text type="secondary">
                <small>{helper}</small>
              </Typography.Text>
            )}
          </div>

          <div>
            {!!helper_image && (
              <>
                <style jsx global>{`
                  .helper-image__collapse {
                    .ant-collapse-header {
                      padding: 0 !important;
                      margin-bottom: 10px;
                    }
                    .ant-collapse-content-box {
                      padding: 0 !important;
                    }
                  }
                `}</style>
                <Collapse
                  bordered={false}
                  className="helper-image__collapse"
                  expandIcon={({ isActive }) => (
                    <Icon
                      style={{ marginLeft: '60px' }}
                      type="caret-right"
                      rotate={isActive ? 90 : 0}
                    />
                  )}
                >
                  <Collapse.Panel
                    style={{
                      backgroundColor: '#f6f7f8',
                      borderRadius: 4,
                      border: 0,
                      overflow: 'hidden'
                    }}
                    header={
                      <Typography.Text>
                        <small>Helper Image</small>
                      </Typography.Text>
                    }
                    key="1"
                  >
                    <Typography.Text type="secondary">
                      <ImageViewer src={helper_image} width="300px" />
                    </Typography.Text>
                  </Collapse.Panel>
                </Collapse>
              </>
            )}
          </div>
        </Col>
      </Row>
    )
  }

  return layout(
    <Row type="flex">
      <Col span={13}>
        {!!updateCurrentObjectStatus.error && (
          <Alert
            message={updateCurrentObjectStatus.error}
            type="error"
            closable
          />
        )}
        {!!updateCurrentObjectStatus.success && (
          <Alert
            message="Object updated successfully."
            type="success"
            closable
          />
        )}
        <br />

        <div>
          <PageHeader
            name="Update Object"
            buttons={
              <div>
                <Link
                  href={`${pageRoutes.schemaDetail}?id=${currentObject.schema.id}`}
                >
                  <Button>Back to Schema</Button>
                </Link>
                &nbsp;
                <Button
                  type="primary"
                  onClick={handleUpdateObject}
                  disabled={!handle}
                >
                  Save Object
                </Button>
              </div>
            }
            description={`Schema ID: ${currentObject.schema.id}
Schema Name: ${currentObject.schema.name}
Schema Handle: ${currentObject.schema.handle}
Object ID: ${currentObject.id}`}
          />
        </div>
        <br />
        <Row>
          <Col span={12}>
            <FormFieldLabel>Handle</FormFieldLabel>
            <Input
              value={handle}
              onChange={(e: any) => setHandle(e.target.value)}
            />
            <br />
            <Typography.Text type="secondary">
              <small>Unique Object Handle</small>
            </Typography.Text>
          </Col>
        </Row>
        <br />
        <br />
        {Object.keys(form).map((key: string) => {
          const foundSchemaDef = currentObject.schema.def.find(
            (d: ISchemaFieldDef) => {
              return d.key === key
            }
          )
          const type = foundSchemaDef ? foundSchemaDef.type : null
          const value = form[key]
          const options = foundSchemaDef ? foundSchemaDef.options : null
          const helper = foundSchemaDef ? foundSchemaDef.helper : null
          const helper_image = foundSchemaDef
            ? foundSchemaDef.helper_image
            : null
          const grid = foundSchemaDef ? foundSchemaDef.grid : null
          const name = foundSchemaDef ? foundSchemaDef.name : null
          return (
            !!type &&
            findFormFieldByKey(
              type,
              key,
              value,
              options || [],
              name,
              grid,
              helper,
              helper_image
            )
          )
        })}
        <br />
        <br />
        <br />
        <div>
          <Popconfirm
            title="Are you sure？"
            onConfirm={() =>
              deleteCurrentObject(
                router.query.collection_handle as string,
                router.query.schema_handle as string,
                router.query.id as string
              )
            }
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
          >
            <Button type="danger">Delete Object</Button>
          </Popconfirm>
        </div>
      </Col>
      <Col span={11}>
        <div style={{ paddingLeft: '15px' }}>
          <ObjectUsers currentObject={currentObject} />
        </div>
      </Col>
    </Row>
  )
}

export default ObjectUpdatePage
