import React, { useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { Form, Input, Tooltip, Icon, Checkbox, Button, Row, Alert } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { createAccountRequest } from '../../requests/account.request'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import Loading from '../../components/Loading/Loading'
import { setToken, setUser } from '../../helpers/auth.helper'
import router from 'next/router'
import { ICreateSchemaPayload } from '../../types/schema.type'
import { createSchemaRequest } from '../../requests/schema.request'
import { AxiosError } from 'axios'

interface ICreateSchemaFormProps<V> {
  handleSubmit: (e: any) => void
  form: WrappedFormUtils<V>
}

const CreateSchemaForm = (
  props: ICreateSchemaFormProps<ICreateSchemaPayload>
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
              message: 'Please input the schema name'
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Handle">
        {getFieldDecorator('handle', {
          rules: [
            {
              required: true,
              message: 'Please input the schema handle'
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Description" hasFeedback>
        {getFieldDecorator('description', {
          rules: [
            {
              required: true,
              message: 'Please input the schema desctiption'
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

interface IProps extends FormComponentProps<ICreateSchemaPayload> {}

const CreateSchemaPage = (props: IProps) => {
  const [schemaStatus, setSchemaStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })
  const { form } = props

  const handleSubmit = (e: any) => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setSchemaStatus({
          loading: true,
          success: false,
          error: ''
        })
        createSchemaRequest({
          name: values.name,
          handle: values.handle,
          description: values.description
        } as any)
          .then((res) => {
            setSchemaStatus({
              loading: false,
              success: true,
              error: ''
            })

            router.push('/schema/list')
          })
          .catch((err: AxiosError) => {
            setSchemaStatus({
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
          key: 'schema',
          name: 'Schema'
        },
        {
          key: 'create',
          url: '/schema/create',
          name: 'Create'
        }
      ]}
    >
      {schemaStatus.error && (
        <Alert message={schemaStatus.error} type="error" closable />
      )}
      <br />
      <div style={{ height: '70%' }}>
        {schemaStatus.loading ? (
          <Loading />
        ) : schemaStatus.success ? (
          <div style={{ color: 'green' }}>Schema created successfully.</div>
        ) : (
          <div style={{ width: '70%' }}>
            <CreateSchemaForm form={form} handleSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </PageLayout>
  )
}

const WrappedSchemaPage = Form.create({ name: 'schema' })(CreateSchemaPage)

export default WrappedSchemaPage
