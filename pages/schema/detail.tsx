import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { getSchemaByIdRequest } from '../../requests/schema.request'
import { AxiosError } from 'axios'
import Loading from '../../components/Loading/Loading'
import {
  Alert,
  Table,
  Button,
  Row,
  Col,
  Input,
  InputNumber,
  Checkbox,
  DatePicker,
  Card,
  Descriptions,
  Icon,
  List,
  Typography,
  Collapse
} from 'antd'
import { ICollection } from '../../types/collection.type'
import {
  ISchema,
  ISchemaFieldDef,
  ESchemaFieldType
} from '../../types/schema.type'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PageHeader from '../../components/PageHeader/PageHeader'
import moment from 'moment'
import {
  createObjectRequest,
  getObjectListRequest
} from '../../requests/object.request'
import ImageUploader from '../../components/ImageUploader/ImageUploader'
import FormFieldLabel from '../../components/FormFieldLabel/FormFieldLabel'
import ObjectsTable from '../../components/ObjectsTable/ObjectsTable'
import StringArray from '../../components/StringArray/StringArray'
import RichTextField from '../../components/RichTextField/RichTextField'

interface IFormStructureItem {
  value: any
  meta: ISchemaFieldDef
}

interface IFormStructure {
  [key: string]: IFormStructureItem
}

const SchemaListPage = () => {
  const [schemaStatus, setSchemaStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })
  const [objectListStatus, setObjectListStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })
  const [objectCreateStatus, setObjectCreateStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })
  const [objectList, setObjectList] = useState<any[]>([])
  const [currentSchema, setCurrentSchema] = useState<ISchema | null>(null)
  const [form, setForm] = useState<IFormStructure | null>(null)
  const [handle, setHandle] = useState('')

  const router = useRouter()

  /**
   *
   * @param collection_handle Collection handle
   * @param schema_handle Schema handle
   * Get object list by collection handle and schema handle
   */
  const getObjectList = (collection_handle: string, schema_handle: string) => {
    setObjectListStatus({
      loading: true,
      success: false,
      error: ''
    })
    getObjectListRequest(collection_handle, schema_handle)
      .then((res) => {
        setObjectListStatus({
          loading: false,
          success: true,
          error: ''
        })
        setObjectList(res.data.result)
      })
      .catch((err) => {
        setObjectListStatus({
          loading: false,
          success: false,
          error: err.message || JSON.stringify(err)
        })
      })
  }

  /**
   *
   * @param id Schema ID
   * Load schema by ID
   */
  const getCurrentSchema = (id: string) => {
    setSchemaStatus({
      loading: true,
      success: false,
      error: ''
    })

    getSchemaByIdRequest(id)
      .then((res) => {
        setSchemaStatus({
          loading: false,
          success: true,
          error: ''
        })
        const schema = res.data.result as ISchema
        setCurrentSchema(schema)
        getObjectList(schema.collection.handle, schema.handle)
      })
      .catch((err: AxiosError) => {
        setSchemaStatus({
          loading: false,
          success: false,
          error: err.message || JSON.stringify(err)
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
   * Set content
   */
  let content = <></>
  const layout = (c: React.ReactNode) => (
    <PageLayout
      breadCrumb={[
        {
          key: 'schema',
          url: '/schema/list',
          name: 'Schema'
        },
        {
          key: 'detail',
          name: 'Detail'
        }
      ]}
    >
      <div style={{ width: '70%' }}>{c}</div>
    </PageLayout>
  )

  if (schemaStatus.error) {
    content = <Alert message={schemaStatus.error} type="error" closable />
    return layout(content)
  }

  if (schemaStatus.loading) {
    content = <Loading />
    return layout(content)
  }

  /**
   * If schema is not found, show load schema button
   */
  if (!currentSchema) {
    content = (
      <Button onClick={() => getCurrentSchema(router.query.id as string)}>
        Load
      </Button>
    )
    return layout(content)
  } else {
    /**
     * Add schema defined object
     */
    const handleAddObject = () => {
      const initialDef = currentSchema.def.reduce((a, c) => {
        let value
        switch (c.type) {
          case ESchemaFieldType.string:
            value = ''
            break
          case ESchemaFieldType.number:
            value = 0
            break
          case ESchemaFieldType.boolean:
            value = false
            break
          case ESchemaFieldType.textarea:
            value = ''
            break
          case ESchemaFieldType.datepicker:
            value = moment()
            break
          case ESchemaFieldType.image:
            value = ''
          case ESchemaFieldType.string_array:
            value = ''
          case ESchemaFieldType.rich_text:
            value = ''
          default:
            value = ''
        }
        a[c.key] = {
          value,
          meta: c
        }
        return a
      }, {} as IFormStructure)
      setForm(initialDef)
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
          break
        case ESchemaFieldType.image:
          value = e
        case ESchemaFieldType.string_array:
          value = e
        case ESchemaFieldType.rich_text:
          value = e
          break
        default:
          value = e.target.value
      }
      if (form) {
        const newForm: IFormStructure = { ...form }
        newForm[key] = {
          meta: form[key].meta,
          value
        }
        setForm(newForm)
      }
    }

    /**
     *
     * @param collection_handle
     * @param schema_handle
     * @param values
     * Create object request
     */
    const createObject = (
      collection_handle: string,
      schema_handle: string,
      values: any
    ) => {
      setObjectCreateStatus({
        loading: true,
        success: false,
        error: ''
      })
      createObjectRequest(collection_handle, schema_handle, values)
        .then((res) => {
          setObjectCreateStatus({
            loading: false,
            success: true,
            error: ''
          })
          getObjectList(collection_handle, schema_handle)
          setForm(null)
          setHandle('')
        })
        .catch((err) => {
          setObjectCreateStatus({
            loading: false,
            success: false,
            error: err.message || JSON.stringify(err)
          })
        })
    }

    /**
     * Handle click create object
     */
    const handleSaveObject = () => {
      if (form && handle) {
        const formValues = Object.keys(form).reduce((a, c) => {
          let value
          switch (form[c].meta.type) {
            case ESchemaFieldType.datepicker:
              value = form[c].value.format('YYYY-MM-DD')
              break
            default:
              value = form[c].value
          }
          a[c] = value
          return a
        }, {} as { [key: string]: any })

        const values = {
          ...formValues,
          _handle: handle
        }
        createObject(
          currentSchema.collection.handle,
          currentSchema.handle,
          values
        )
      }
    }

    /**
     * Set Page content
     */
    content = (
      <>
        <div>
          <PageHeader
            name={currentSchema.name}
            sub={currentSchema.handle}
            buttonLink={`/schema/update?id=${currentSchema.id}`}
            buttonWord="Edit Schema"
            description={currentSchema.description}
          />
        </div>
        <br />

        <div>
          <Collapse bordered={false}>
            <Collapse.Panel header="Data Definition" key="1">
              <Descriptions
                layout="vertical"
                bordered
                size="small"
                style={{ overflowX: 'scroll' }}
                column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
              >
                {currentSchema.def.map((d) => {
                  return (
                    <Descriptions.Item
                      label={
                        <div>
                          <FormFieldLabel>{d.key}</FormFieldLabel>

                          <div>
                            <small>{d.name}</small>
                          </div>
                        </div>
                      }
                      key={d.key}
                    >
                      {d.helper}
                    </Descriptions.Item>
                  )
                })}
              </Descriptions>
            </Collapse.Panel>
          </Collapse>
        </div>
        <br />

        <Collapse bordered={false}>
          <Collapse.Panel header="API" key="1">
            <Descriptions
              layout="vertical"
              bordered
              size="small"
              column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
              style={{ overflowX: 'scroll' }}
            >
              {[
                {
                  head: 'List - GET',
                  content: `/api/object/${currentSchema.collection.handle}/${currentSchema.handle}/list`,
                  helper: 'Get the object list.'
                },
                {
                  head: 'Create - POST',
                  content: `/api/object/${currentSchema.collection.handle}/${currentSchema.handle}/create`,
                  helper: 'Create an object.'
                },
                {
                  head: 'Read - GET',
                  content: `/api/object/${currentSchema.collection.handle}/${currentSchema.handle}/get/:id`,
                  helper: 'Get the object by its ID.'
                },
                {
                  head: 'Update - PUT',
                  content: `/api/object/${currentSchema.collection.handle}/${currentSchema.handle}/update/:id`,
                  helper: 'Update the object by its ID.'
                },
                {
                  head: 'Delete - DELETE',
                  content: `/api/object/${currentSchema.collection.handle}/${currentSchema.handle}/delete/:id`,
                  helper: 'Delete the object by its ID.'
                }
              ].map((item, index) => {
                return (
                  <Descriptions.Item
                    label={
                      <div>
                        <FormFieldLabel>{item.head}</FormFieldLabel>
                        <div>
                          <small>{item.helper}</small>
                        </div>
                      </div>
                    }
                    key={index}
                  >
                    {item.content}
                  </Descriptions.Item>
                )
              })}
            </Descriptions>
          </Collapse.Panel>
        </Collapse>

        <br />
        <div style={{ marginBottom: '20px' }}>
          <Row>
            <Col>
              <Button onClick={handleAddObject} type="primary">
                Add Object
              </Button>
            </Col>
          </Row>
        </div>
        {objectCreateStatus.loading ? (
          <Loading />
        ) : objectCreateStatus.error ? (
          <Alert message={objectCreateStatus.error} type="error" closable />
        ) : null}
        <div>
          {!!form && (
            <Card
              title="Add Object"
              extra={
                <Button
                  type="primary"
                  onClick={handleSaveObject}
                  disabled={!handle}
                >
                  Save Object
                </Button>
              }
            >
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
              {Object.keys(form).map((field) => {
                const type = form[field].meta.type
                const key = form[field].meta.key
                const name = form[field].meta.name
                const grid = form[field].meta.grid
                const newLine = form[field].meta.new_line
                const show = form[field].meta.show
                const helper = form[field].meta.helper
                const value = form[field].value
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
                      <Checkbox
                        checked={value}
                        onChange={(e: any) => handleFieldChange(e, type, key)}
                      />
                    )
                    break
                  case ESchemaFieldType.textarea:
                    input = (
                      <Input.TextArea
                        autoSize={{ minRows: 8 }}
                        style={{ width: '100%' }}
                        value={value}
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
                          console.log(v)
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
                  default:
                    input = (
                      <Input
                        value={value}
                        onChange={(e: any) => handleFieldChange(e, type, key)}
                      />
                    )
                    break
                }
                return (
                  <Row style={{ marginBottom: '15px' }} key={key}>
                    <Col span={Number(grid)}>
                      <FormFieldLabel>{key}</FormFieldLabel>&nbsp;&nbsp;
                      <Typography.Text type="secondary">
                        <small>{name}</small>
                      </Typography.Text>
                      {input}
                      <br />
                      {!!helper && (
                        <Typography.Text type="secondary">
                          <small>{helper}</small>
                        </Typography.Text>
                      )}
                    </Col>
                  </Row>
                )
              })}
            </Card>
          )}
        </div>

        {!!objectList.length && (
          <>
            <br />
            <ObjectsTable
              currentSchema={currentSchema}
              objectList={objectList}
            />
          </>
        )}
      </>
    )
  }

  return layout(content)
}

export default SchemaListPage
