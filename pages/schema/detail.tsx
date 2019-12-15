import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import {
  getSchemaListRequest,
  getSchemaById
} from '../../requests/schema.request'
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
  Typography
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
        console.log(err)
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

    getSchemaById(id)
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
      {c}
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
          console.log(err)
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
     * Retrieve fields that tag as show in list
     */
    const getShownFields = () => {
      if (currentSchema.def) {
        return currentSchema.def
          .filter((field) => field.show)
          .map((field) => field.key)
      }
      return []
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
          <h3>Data Structure</h3>
          <Descriptions bordered>
            {currentSchema.def.map((d) => {
              return (
                <Descriptions.Item
                  label={
                    <div>
                      <div>
                        <b>{d.key}</b>
                      </div>
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
        </div>
        <br />

        <h3 style={{ marginBottom: 16 }}>API</h3>
        <List
          header={<div>Header</div>}
          footer={<div>Footer</div>}
          bordered
          dataSource={[
            {
              head: '[List][GET]',
              content: `/api/object/${currentSchema.collection.handle}/${currentSchema.handle}/list`
            },
            {
              head: '[Create][POST]',
              content: `/api/object/${currentSchema.collection.handle}/${currentSchema.handle}/create`
            },
            {
              head: '[Read][GET]',
              content: `/api/object/${currentSchema.collection.handle}/${currentSchema.handle}/:id`
            },
            {
              head: '[Update][PUT]',
              content: `/api/object/${currentSchema.collection.handle}/${currentSchema.handle}/update/:id`
            },
            {
              head: '[Delete][DELETE]',
              content: `/api/object/${currentSchema.collection.handle}/${currentSchema.handle}/delete/:id`
            }
          ]}
          renderItem={(item) => (
            <List.Item>
              <span style={{ width: '120px', display: 'inline-block' }}>
                <Typography.Text mark>{item.head}</Typography.Text>
              </span>{' '}
              {item.content}
            </List.Item>
          )}
        />
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
                <Button type="primary" onClick={handleSaveObject}>
                  Save Object
                </Button>
              }
            >
              <Row>
                <Col span={12}>
                  <label>
                    <b>Handle</b>
                  </label>
                  <br />
                  <Input
                    value={handle}
                    onChange={(e: any) => setHandle(e.target.value)}
                  />
                  <br />
                  <small>Unique Object Handle</small>
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
                        style={{ width: '100%' }}
                        value={value}
                        onChange={(e: any) => handleFieldChange(e, type, key)}
                      />
                    )
                    break
                  case ESchemaFieldType.datepicker:
                    input = (
                      <DatePicker
                        value={value}
                        onChange={(e: any) => handleFieldChange(e, type, key)}
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
                      <label>
                        <b>{key}</b> <small>{name}</small>
                      </label>
                      <br />
                      {input}
                      <br />
                      <small>{helper}</small>
                    </Col>
                  </Row>
                )
              })}
            </Card>
          )}
        </div>

        {!!objectList.length && (
          <Table
            dataSource={objectList}
            columns={[
              {
                title: 'Handle',
                dataIndex: '_handle',
                key: '_handle',
                render: (handle: string, row: any) => (
                  <Link
                    href={`/object/update?id=${row.id}&schema_handle=${currentSchema.handle}&collection_handle=${currentSchema.collection.handle}`}
                  >
                    {handle}
                  </Link>
                )
              },
              ...getShownFields().map((f) => ({
                title: f,
                dataIndex: f,
                key: f,
                render: (value: any) => {
                  return typeof value === 'boolean' ? (
                    value ? (
                      <Icon
                        type="check-circle"
                        theme="twoTone"
                        twoToneColor="#52c41a"
                      />
                    ) : (
                      <Icon
                        type="close-circle"
                        theme="twoTone"
                        twoToneColor="#eb2f96"
                      />
                    )
                  ) : (
                    value
                  )
                }
              }))
            ]}
          />
        )}
      </>
    )
  }

  return layout(content)
}

export default SchemaListPage
