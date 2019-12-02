import React, { useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { Form, Input, Tooltip, Icon, Checkbox, Button, Row, Alert } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { createAccountRequest } from '../../requests/account.request'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import Loading from '../../components/Loading/Loading'
import { setToken, setUser } from '../../helpers/auth.helper'
import router from 'next/router'
import { ICreateCollectionPayload } from '../../types/collection.type'
import { createCollectionRequest } from '../../requests/collection.request'
import { AxiosError } from 'axios'

interface ICreateCollectionFormProps<V> {
  handleSubmit: (e: any) => void
  form: WrappedFormUtils<V>
}

const CreateCollectionForm = (
  props: ICreateCollectionFormProps<ICreateCollectionPayload>
) => {
  const { form, handleSubmit } = props
  const { getFieldDecorator } = form

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  }

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 16,
        offset: 8
      }
    }
  }
  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
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
      <Form.Item label="Description" hasFeedback>
        {getFieldDecorator('description', {
          rules: [
            {
              required: true,
              message: 'Please input the collection desctiption'
            }
          ]
        })(<Input.TextArea />)}
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  )
}

interface IProps extends FormComponentProps<ICreateCollectionPayload> {}

const CreateCollectionPage = (props: IProps) => {
  const [collectionStatus, setCollectionStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })
  const { form } = props

  const handleSubmit = (e: any) => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setCollectionStatus({
          loading: true,
          success: false,
          error: ''
        })
        createCollectionRequest({
          name: values.name,
          handle: values.handle,
          description: values.description
        })
          .then((res) => {
            setCollectionStatus({
              loading: false,
              success: true,
              error: ''
            })

            router.push('/collection/list')
          })
          .catch((err: AxiosError) => {
            setCollectionStatus({
              loading: false,
              success: false,
              error: err.message || JSON.stringify(err, null, '  ')
            })
          })
        console.log('Received values of form: ', values)
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
          url: '/collection/create',
          name: 'Create'
        }
      ]}
    >
      {collectionStatus.error && (
        <Alert message={collectionStatus.error} type="error" closable />
      )}
      <br />
      <div style={{ height: '70%' }}>
        {collectionStatus.loading ? (
          <Loading />
        ) : collectionStatus.success ? (
          <div style={{ color: 'green' }}>Collection created successfully.</div>
        ) : (
          <div style={{ width: '70%' }}>
            <CreateCollectionForm form={form} handleSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </PageLayout>
  )
}

const WrappedCollectionPage = Form.create({ name: 'collection' })(
  CreateCollectionPage
)

export default WrappedCollectionPage
