import React, { useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { Form, Input, Tooltip, Icon, Checkbox, Button, Row, Alert } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { createAccountRequest } from '../../requests/account.request'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import Loading from '../../components/Loading/Loading'
import { setToken, setUser } from '../../helpers/auth.helper'
import router from 'next/router'
import { createAccessKeyRequest } from '../../requests/access-key.request'
import { AxiosError } from 'axios'
import { ICreateAccessKeyPayload } from '../../types/access-key.type'
import { RequestStatus } from '../../helpers/request'
import { pageRoutes } from '../../navigation/page-routes'

interface ICreateAccessKeyFormProps<V> {
  handleSubmit: (e: any) => void
  form: WrappedFormUtils<V>
}

const CreateAccessKeyForm = (
  props: ICreateAccessKeyFormProps<ICreateAccessKeyPayload>
) => {
  const { form, handleSubmit } = props
  const { getFieldDecorator } = form

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="Name">
        {getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: 'Please input the access-key name'
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Description" hasFeedback>
        {getFieldDecorator('description', {
          rules: [
            {
              required: true,
              message: 'Please input the access-key desctiption'
            }
          ]
        })(<Input.TextArea autoSize={{ minRows: 8 }} />)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  )
}

interface IProps extends FormComponentProps<ICreateAccessKeyPayload> {}

const CreateAccessKeyPage = (props: IProps) => {
  const accessKeyRequestStatus = new RequestStatus()
  const [accessKeyStatus, setAccessKeyStatus] = useState(
    accessKeyRequestStatus.status
  )
  const { form } = props

  const handleSubmit = (e: any) => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setAccessKeyStatus(accessKeyRequestStatus.loading())
        createAccessKeyRequest({
          name: values.name,
          description: values.description
        } as any)
          .then((res) => {
            setAccessKeyStatus(accessKeyRequestStatus.success())

            router.push(pageRoutes.listAccessKeys)
          })
          .catch((err: AxiosError) => {
            setAccessKeyStatus(accessKeyRequestStatus.error(err))
          })
      }
    })
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'access-key',
          name: 'AccessKey'
        },
        {
          key: 'create',
          url: pageRoutes.createAccessKey,
          name: 'Create'
        }
      ]}
    >
      {accessKeyStatus.error && (
        <Alert message={accessKeyStatus.error} type="error" closable />
      )}
      <br />
      <div style={{ height: '70%' }}>
        {accessKeyStatus.loading ? (
          <Loading />
        ) : accessKeyStatus.success ? (
          <div style={{ color: 'green' }}>AccessKey created successfully.</div>
        ) : (
          <div style={{ width: '70%' }}>
            <CreateAccessKeyForm form={form} handleSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </PageLayout>
  )
}

const WrappedAccessKeyPage = Form.create({ name: 'access-key' })(
  CreateAccessKeyPage
)

export default WrappedAccessKeyPage
