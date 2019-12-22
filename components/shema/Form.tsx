import {
  IUpdateSchemaFormValues,
  ICreateSchemaFormValues,
  ISchema
} from '../../types/schema.type'
import Form, { WrappedFormUtils } from 'antd/lib/form/Form'
import { Row, Col, Input, Button, Icon, Select, Alert } from 'antd'
import Link from 'next/link'
import FormFieldLabel from '../FormFieldLabel/FormFieldLabel'
import FormItems from './FormItems'
import { addField } from '../../helpers/schema/form'
import PageHeader from '../../components/PageHeader/PageHeader'
import { useEffect, useState } from 'react'
import { getCollectionListRequest } from '../../requests/collection.request'
import { AxiosError } from 'axios'
import { RequestStatus } from '../../helpers/request'
import { ICollection } from '../../types/collection.type'
import Loading from '../Loading/Loading'

/**
 * Ensure key uniqueness of each field
 * during modifing the structure
 * (Always increasing)
 */
let defIndex = 0

interface IProps {
  form: WrappedFormUtils<ICreateSchemaFormValues | IUpdateSchemaFormValues>
  currentSchema?: ISchema
  handleSubmit: any
}
const SchemaForm = (props: IProps) => {
  const { form, currentSchema, handleSubmit } = props
  const { getFieldDecorator } = form

  const formItems = <FormItems isCreate={!currentSchema} form={form} />

  const [collectionList, setCollectionList] = useState<ICollection[]>([])

  const collectionListRequestStatus = new RequestStatus()
  const [collectionStatus, setCollectionStatus] = useState(
    collectionListRequestStatus.status
  )

  /**
   * Get Collection list
   */
  const getCollections = () => {
    setCollectionStatus(collectionListRequestStatus.setLoadingStatus())
    getCollectionListRequest()
      .then((res) => {
        setCollectionStatus(collectionListRequestStatus.setSuccessStatus())
        setCollectionList(res.data.result)
      })
      .catch((err: AxiosError) => {
        setCollectionStatus(collectionListRequestStatus.setErrorStatus(err))
      })
  }

  /**
   * Get Collection list when page loads
   */
  useEffect(() => {
    if (!currentSchema) {
      getCollections()
    }
  }, [])

  /**
   * Handle loading, error and none-data states
   */
  let collectionListField: React.ReactNode
  if (collectionStatus.loading) {
    collectionListField = <Loading />
  } else if (collectionStatus.error) {
    collectionListField = (
      <Alert message={collectionStatus.error} type="error" closable />
    )
  } else if (!currentSchema) {
    collectionListField = (
      <Row>
        <Col span={12}>
          <Form.Item
            label={<FormFieldLabel>Collection</FormFieldLabel>}
            required={true}
            key="collection_id"
          >
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
        </Col>
      </Row>
    )
  }

  return (
    <Form layout="vertical" onSubmit={handleSubmit}>
      <PageHeader
        name={currentSchema ? currentSchema.name : 'Create Schema'}
        sub={currentSchema ? currentSchema.handle : ''}
        buttonLink={
          currentSchema
            ? `/schema/detail?id=${currentSchema.id}`
            : '/schema/list'
        }
        buttonWord={currentSchema ? 'View Schema' : 'Back'}
        description={currentSchema ? currentSchema.description : ''}
      />
      <br />
      <br />
      {/* Meta */}
      {!currentSchema && collectionListField}
      {!!currentSchema && (
        <Row>
          <Col span={12}>
            <Link href={`/collection/detail?id=${currentSchema.collection.id}`}>
              <a>{currentSchema.collection.name}</a>
            </Link>
          </Col>
        </Row>
      )}
      <br />
      <Row gutter={2}>
        <Col span={12}>
          <Form.Item label={<FormFieldLabel>Name</FormFieldLabel>}>
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
          <Form.Item label={<FormFieldLabel>Handle</FormFieldLabel>}>
            {getFieldDecorator('handle', {
              rules: [
                {
                  required: true,
                  message: 'Please input the schema handle'
                }
              ]
            })(<Input disabled={!!currentSchema} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Form.Item
          label={<FormFieldLabel>Description</FormFieldLabel>}
          hasFeedback
        >
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
          <Button
            type="dashed"
            onClick={() => {
              addField(form, defIndex)
              defIndex++
            }}
          >
            <Icon type="plus" /> Add field
          </Button>
        </Form.Item>
      </Row>

      {/* Submit */}
      <Row type="flex" justify="space-between">
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {currentSchema ? 'Update Schema' : 'Create Schema'}
          </Button>
        </Form.Item>
        {currentSchema ? (
          <Button href={`/schema/detail?id=${currentSchema.id}`}>
            Back to Detail
          </Button>
        ) : (
          <Button href={'/schema/list'}>Back to List</Button>
        )}
      </Row>
    </Form>
  )
}
export default SchemaForm
