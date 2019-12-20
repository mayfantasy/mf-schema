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
  Typography
} from 'antd'
import Loading from '../../components/Loading/Loading'
import { ESchemaFieldType, ISchemaFieldDef } from '../../types/schema.type'
import { IObject } from '../../types/object.type'
import Moment from 'moment'
import ImageUploader from '../../components/ImageUploader/ImageUploader'
import FormFieldLabel from '../../components/FormFieldLabel/FormFieldLabel'

interface IFormStructure {
  [key: string]: any
}

const ObjectUpdatePage = () => {
  const router = useRouter()
  const [currentObject, setCurrentObject] = useState<IObject | null>(null)
  const [form, setForm] = useState<IFormStructure>({})
  const [getCurrentObjectStatus, setGetCurrentObjectStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })
  const [updateCurrentObjectStatus, setUpdateCurrentObjectStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })
  const [deleteObjectStatus, setDeleteObjectStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })
  const [handle, setHandle] = useState('')

  /**
   *
   * @param collection_handle
   * @param schema_handle
   * @param id
   * Delete object request
   */
  const deleteCurrentObject = (
    collection_handle: string,
    schema_handle: string,
    id: string
  ) => {
    setDeleteObjectStatus({
      loading: true,
      success: false,
      error: ''
    })
    if (currentObject) {
      let schemaId = currentObject.schema.id
      deleteObjectByIdRequest(collection_handle, schema_handle, id)
        .then((res) => {
          setDeleteObjectStatus({
            loading: false,
            success: true,
            error: ''
          })
          router.push(`/schema/detail?id=${schemaId}`)
        })
        .catch((err) => {
          setDeleteObjectStatus({
            loading: false,
            success: false,
            error: err.message || JSON.stringify(err, null, '  ')
          })
        })
    }
  }

  /**
   *
   * @param collection_handle
   * @param schema_handle
   * @param id
   * Delete object request
   */
  const updateCurrentObject = (
    collection_handle: string,
    schema_handle: string,
    id: string,
    payload: any
  ) => {
    setUpdateCurrentObjectStatus({
      loading: true,
      success: false,
      error: ''
    })
    if (currentObject) {
      let schemaId = currentObject.schema.id
      updateObjectByIdRequest(collection_handle, schema_handle, id, payload)
        .then((res) => {
          setUpdateCurrentObjectStatus({
            loading: false,
            success: true,
            error: ''
          })
        })
        .catch((err) => {
          setUpdateCurrentObjectStatus({
            loading: false,
            success: false,
            error: err.message || JSON.stringify(err, null, '  ')
          })
        })
    }
  }

  /**
   *
   * @param collection_handle
   * @param schema_handle
   * @param id
   * Get current object request
   */
  const getCurrentObject = (
    collection_handle: string,
    schema_handle: string,
    id: string
  ) => {
    setGetCurrentObjectStatus({
      loading: true,
      success: false,
      error: ''
    })
    getObjectByIdRequest(collection_handle, schema_handle, id)
      .then((res) => {
        setGetCurrentObjectStatus({
          loading: false,
          success: true,
          error: ''
        })
        const data = res.data.result
        setCurrentObject(data)
        const formData = { ...data }

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

        console.log(formData)

        setForm(formData)
      })
      .catch((err) => {
        setGetCurrentObjectStatus({
          loading: false,
          success: false,
          error: err.message || JSON.stringify(err, null, '  ')
        })
      })
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
          url: '/schema/list',
          name: 'Schema'
        },
        {
          key: 'objects',
          url: `/schema/detail?id=${
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
    name: string | null,
    grid: number | null,
    helper: string | null
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
      case ESchemaFieldType.image:
        input = (
          <ImageUploader
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
    }
    return (
      <Row style={{ marginBottom: '15px' }} key={key}>
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
          {!!helper && (
            <Typography.Text type="secondary">
              <small>{helper}</small>
            </Typography.Text>
          )}
        </Col>
      </Row>
    )
  }

  return layout(
    <div style={{ width: '70%' }}>
      {!!updateCurrentObjectStatus.error && (
        <Alert
          message={updateCurrentObjectStatus.error}
          type="error"
          closable
        />
      )}
      {!!updateCurrentObjectStatus.success && (
        <Alert message="Object updated successfully." type="success" closable />
      )}
      <br />
      <Card
        title="Update Object"
        extra={
          <Button
            type="primary"
            onClick={handleUpdateObject}
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
        {Object.keys(form).map((key: string) => {
          const foundSchemaDef = currentObject.schema.def.find(
            (d: ISchemaFieldDef) => {
              return d.key === key
            }
          )
          const type = foundSchemaDef ? foundSchemaDef.type : null
          const value = form[key]
          const helper = foundSchemaDef ? foundSchemaDef.helper : null
          const grid = foundSchemaDef ? foundSchemaDef.grid : null
          const name = foundSchemaDef ? foundSchemaDef.name : null
          return (
            !!type && findFormFieldByKey(type, key, value, name, grid, helper)
          )
        })}
        <br />
        <br />
        <br />
        <div>
          <Button
            type="danger"
            onClick={() =>
              deleteCurrentObject(
                router.query.collection_handle as string,
                router.query.schema_handle as string,
                router.query.id as string
              )
            }
          >
            Delete Object
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default ObjectUpdatePage
