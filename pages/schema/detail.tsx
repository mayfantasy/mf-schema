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
import { RequestStatus } from '../../helpers/request'
import { pageRoutes } from '../../navigation/page-routes'
import SingleSelect from '../../components/StringSingleSelect/StringSingleSelect'
import MultiSelect from '../../components/StringMultiSelect/StringMultiSelect'
import ApiLine from '../../components/ApiLine/ApiLine'
import { IApiItem, EApiMethod } from '../../types/api.type'
import ImageViewer from '../../components/ImageViewer/ImageViewer'

import dynamic from 'next/dynamic'
import ImportObjectsBox from '../../components/ImportObjectsBox/ImportObjectsBox'
import {
  EditOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  ImportOutlined,
  CodeFilled,
  CodeOutlined
} from '@ant-design/icons'
import TierWrapper from '../../components/TierButton/TierButton'
import { tierMap } from '../../helpers/tier.helper'
const CodeEditor = dynamic({
  loader: () => import('../../components/CodeEditor/CodeEditor'),
  loading: () => <Loading />,
  ssr: false
})

interface IFormStructureItem {
  value: any
  meta: ISchemaFieldDef
}

interface IFormStructure {
  [key: string]: IFormStructureItem
}

const SchemaListPage = () => {
  /** Get Schema */
  const schemaRequestStatus = new RequestStatus()
  const [schemaStatus, setSchemaStatus] = useState(schemaRequestStatus.status)

  /** Get Object List */
  const objectListRequestStatus = new RequestStatus()
  const [objectListStatus, setObjectListStatus] = useState(
    objectListRequestStatus.status
  )

  /** Create Object */
  const createObjectRequestStatus = new RequestStatus()
  const [objectCreateStatus, setObjectCreateStatus] = useState(
    createObjectRequestStatus.status
  )

  const [objectList, setObjectList] = useState<any[]>([])
  const [currentSchema, setCurrentSchema] = useState<ISchema | null>(null)
  const [form, setForm] = useState<IFormStructure | null>(null)
  const [handle, setHandle] = useState('')

  /** Import Objects Section Toggle */
  const [importBoxOpen, setImportBoxOpen] = useState(false)

  /** Hide API section toggle */
  const [hideAPI, setHideAPI] = useState(true)

  const router = useRouter()

  /**
   *
   * @param collection_handle Collection handle
   * @param schema_handle Schema handle
   * Get object list by collection handle and schema handle
   */
  const getObjectList = (collection_handle: string, schema_handle: string) => {
    setObjectListStatus(objectListRequestStatus.loading())
    getObjectListRequest(collection_handle, schema_handle)
      .then((res) => {
        setObjectListStatus(objectListRequestStatus.success())
        setObjectList(res.data.result)
      })
      .catch((err) => {
        setObjectListStatus(objectListRequestStatus.error(err))
      })
  }

  /**
   *
   * @param id Schema ID
   * Load schema by ID
   */
  const getCurrentSchema = (id: string) => {
    setSchemaStatus(schemaRequestStatus.loading())

    getSchemaByIdRequest(id)
      .then((res) => {
        setSchemaStatus(schemaRequestStatus.success())
        const schema = res.data.result as ISchema
        setCurrentSchema(schema)
        getObjectList(schema.collection.handle, schema.handle)
      })
      .catch((err: AxiosError) => {
        setSchemaStatus(schemaRequestStatus.error(err))
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
          url: pageRoutes.listSchemas,
          name: 'Schema'
        },
        {
          key: 'detail',
          name: 'Detail'
        }
      ]}
    >
      <div>{c}</div>
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
          case ESchemaFieldType.password:
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
            value = []
          case ESchemaFieldType.rich_text:
            value = ''
          case ESchemaFieldType.string_single_select:
            value = ''
          case ESchemaFieldType.string_multi_select:
            value = []
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
        case ESchemaFieldType.password:
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
        case ESchemaFieldType.string_single_select:
          value = e
        case ESchemaFieldType.string_multi_select:
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
      setObjectCreateStatus(createObjectRequestStatus.loading())
      createObjectRequest(collection_handle, schema_handle, values)
        .then((res) => {
          setObjectCreateStatus(createObjectRequestStatus.success())
          getObjectList(collection_handle, schema_handle)
          setForm(null)
          setHandle('')
        })
        .catch((err) => {
          setObjectCreateStatus(createObjectRequestStatus.error(err))
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

    const apiLines: IApiItem[] = [
      {
        method: EApiMethod.GET,
        route: `/api/object/${currentSchema.collection.handle}/${currentSchema.handle}/list`,
        description: 'Get the object list.'
      },
      {
        method: EApiMethod.POST,
        route: `/api/object/${currentSchema.collection.handle}/${currentSchema.handle}/create`,
        description: 'Create an object.'
      },
      {
        method: EApiMethod.GET,
        route: `/api/object/${currentSchema.collection.handle}/${currentSchema.handle}/get/:id`,
        description: 'Get the object by its ID.'
      },
      {
        method: EApiMethod.PUT,
        route: `/api/object/${currentSchema.collection.handle}/${currentSchema.handle}/update/:id`,
        description: 'Update the object by its ID.'
      },
      {
        method: EApiMethod.DELETE,
        route: `/api/object/${currentSchema.collection.handle}/${currentSchema.handle}/delete/:id`,
        description: 'Delete the object by its ID.'
      }
    ]

    /**
     * Set Page content
     */
    content = (
      <Row gutter={2}>
        <Col span={hideAPI ? 24 : 13}>
          <div>
            <PageHeader
              name={currentSchema.name}
              sub={currentSchema.handle}
              buttons={
                <div>
                  <TierWrapper tier={tierMap.UPDATE_SCHEMA.tier}>
                    <>
                      <Link
                        href={`${pageRoutes.updateSchema}?id=${currentSchema.id}`}
                      >
                        <Button type="primary">
                          <EditOutlined />
                          Edit Schema
                        </Button>
                      </Link>
                      &nbsp;
                    </>
                  </TierWrapper>
                  <TierWrapper tier={tierMap.UPDATE_SCHEMA.tier}>
                    <>
                      <Link
                        href={`${pageRoutes.updateSchemaFromJson}?id=${currentSchema.id}`}
                      >
                        <Button type="default">
                          <CodeOutlined />
                          Edit from JSON
                        </Button>
                      </Link>
                      &nbsp;
                    </>
                  </TierWrapper>

                  <Button type="default" onClick={() => setHideAPI(!hideAPI)}>
                    {hideAPI ? (
                      <StepBackwardOutlined />
                    ) : (
                      <StepForwardOutlined />
                    )}
                    &nbsp;
                    {hideAPI ? 'Show API' : 'Hide API'}
                  </Button>
                </div>
              }
              description={currentSchema.description}
            />
          </div>

          <br />
          <div style={{ marginBottom: '20px' }}>
            <TierWrapper tier={tierMap.CREATE_OBJECT.tier}>
              <>
                <Button onClick={handleAddObject} type="primary">
                  <PlusCircleOutlined /> Add Object
                </Button>
                &nbsp;
              </>
            </TierWrapper>
            {!!objectListRequestStatus.loading && (
              <TierWrapper tier={tierMap.GET_OBJECT_LIST.tier}>
                <Button
                  onClick={() =>
                    getObjectList(
                      currentSchema.collection.handle,
                      currentSchema.handle
                    )
                  }
                >
                  <ReloadOutlined /> Reload Objects
                </Button>
              </TierWrapper>
            )}
            <TierWrapper tier={tierMap.CREATE_OBJECT.tier}>
              <>
                &nbsp;
                <Button onClick={() => setImportBoxOpen(!importBoxOpen)}>
                  <ImportOutlined />{' '}
                  {importBoxOpen ? 'Close Import' : 'Import Objects'}
                </Button>
              </>
            </TierWrapper>
          </div>
          {importBoxOpen && (
            <ImportObjectsBox
              collection_handle={currentSchema.collection.handle}
              schema_handle={currentSchema.handle}
              schema={currentSchema}
            />
          )}
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
                  const options = form[field].meta.options || []
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
                    case ESchemaFieldType.password:
                      input = (
                        <Input.Password
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
                            onChange={(e: any) =>
                              handleFieldChange(e, type, key)
                            }
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
                        <SingleSelect
                          value={value}
                          options={options}
                          onChange={(v: string) =>
                            handleFieldChange(v, type, key)
                          }
                        />
                      )
                      break
                    case ESchemaFieldType.string_multi_select:
                      input = (
                        <MultiSelect
                          value={value || []}
                          options={options}
                          onChange={(v: string[]) =>
                            handleFieldChange(v, type, key)
                          }
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

          {objectListStatus.loading ? (
            <div>
              <Loading />
              &nbsp;&nbsp; <span>Loading Objects...</span>
            </div>
          ) : !!objectList.length ? (
            <>
              <br />
              <ObjectsTable
                currentSchema={currentSchema}
                objectList={objectList}
              />
            </>
          ) : (
            <i style={{ color: '#ccc' }}>No object found.</i>
          )}
        </Col>
        {!hideAPI && (
          <Col span={11}>
            <div style={{ padding: '0 0 0 15px' }}>
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
                          <div>{d.helper}</div>

                          {d.helper_image && (
                            <>
                              <br />
                              <div>
                                <ImageViewer src={d.helper_image} />
                              </div>
                            </>
                          )}
                          <div></div>
                        </Descriptions.Item>
                      )
                    })}
                  </Descriptions>
                </Collapse.Panel>
              </Collapse>

              <Collapse bordered={false}>
                <Collapse.Panel header="API" key="1">
                  {apiLines.map((api) => (
                    <ApiLine
                      key={api.route}
                      method={api.method}
                      route={api.route}
                      description={api.description}
                    />
                  ))}
                </Collapse.Panel>
              </Collapse>

              <Collapse bordered={false}>
                <Collapse.Panel header="JSON" key="1">
                  <CodeEditor
                    value={JSON.stringify(currentSchema, null, '   ')}
                    readOnly={true}
                    onChange={() => {}}
                  />
                </Collapse.Panel>
              </Collapse>
            </div>
          </Col>
        )}
      </Row>
    )
  }

  return layout(content)
}

export default SchemaListPage
