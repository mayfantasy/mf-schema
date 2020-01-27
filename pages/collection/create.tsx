import React, { useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import PageHeader from '../../components/PageHeader/PageHeader'
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Checkbox,
  Button,
  Row,
  Alert,
  Col
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { createAccountRequest } from '../../requests/account.request'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import Loading from '../../components/Loading/Loading'
import { setToken, setUser } from '../../helpers/auth.helper'
import router from 'next/router'
import { ICreateCollectionPayload } from '../../types/collection.type'
import { createCollectionRequest } from '../../requests/collection.request'
import { AxiosError } from 'axios'
import { RequestStatus } from '../../helpers/request'
import { pageRoutes } from '../../navigation/page-routes'

interface ICreateCollectionFormProps<V> {
  handleSubmit: (e: any) => void
  form: WrappedFormUtils<V>
}

const CreateCollectionForm = (
  props: ICreateCollectionFormProps<ICreateCollectionPayload>
) => {
  const { form, handleSubmit } = props
  const { getFieldDecorator } = form

  return (
    <Form onSubmit={handleSubmit}>
      <Row gutter={2}>
        <Col span={12}>
          <Form.Item label="Name">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please input the collection name'
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
                  message: 'Please input the collection handle'
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
                message: 'Please input the collection desctiption'
              }
            ]
          })(<Input.TextArea autoSize={{ minRows: 8 }} />)}
        </Form.Item>
      </Row>
      <Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Row>
    </Form>
  )
}

interface IProps extends FormComponentProps<ICreateCollectionPayload> {}

const CreateCollectionPage = (props: IProps) => {
  /** Create Collection */
  const collectionRequestStatus = new RequestStatus()
  const [collectionStatus, setCollectionStatus] = useState(
    collectionRequestStatus.status
  )
  const { form } = props

  const handleSubmit = (e: any) => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setCollectionStatus(collectionRequestStatus.loading())
        createCollectionRequest({
          name: values.name,
          handle: values.handle,
          description: values.description
        } as any)
          .then((res) => {
            setCollectionStatus(collectionRequestStatus.success())

            router.push(pageRoutes.listCollections)
          })
          .catch((err: AxiosError) => {
            setCollectionStatus(collectionRequestStatus.error(err))
          })
      }
    })
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'collection',
          name: 'Collection'
        },
        {
          key: 'create',
          url: pageRoutes.createCollection,
          name: 'Create'
        }
      ]}
    >
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <PageHeader
          name="Create Collection"
          buttonLink="/collection/list"
          buttonWord="Back"
        />
        <br />
        {collectionStatus.error && (
          <Alert message={collectionStatus.error} type="error" closable />
        )}
        <br />
        <div>
          {collectionStatus.loading ? (
            <Loading />
          ) : collectionStatus.success ? (
            <Alert type="success" message="Collection created successfully." />
          ) : (
            <div>
              <CreateCollectionForm form={form} handleSubmit={handleSubmit} />
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

const WrappedCollectionPage = Form.create({ name: 'collection' })(
  CreateCollectionPage
)

export default WrappedCollectionPage
