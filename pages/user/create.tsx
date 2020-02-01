import React, { useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Checkbox,
  Button,
  Row,
  Alert,
  DatePicker,
  Col
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { createAccountRequest } from '../../requests/account.request'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import Loading from '../../components/Loading/Loading'
import { setToken, setUser } from '../../helpers/auth.helper'
import router from 'next/router'
import { AxiosError } from 'axios'
import { RequestStatus } from '../../helpers/request'
import { ICreateUserPayload } from '../../types/user.type'
import { createUserRequest } from '../../requests/user.request'
import { pageRoutes } from '../../navigation/page-routes'

interface ICreateUserFormProps<V> {
  handleSubmit: (e: any) => void
  form: WrappedFormUtils<V>
}

const CreateUserForm = (props: ICreateUserFormProps<ICreateUserPayload>) => {
  const [confirmDirty, setConfirmDirty] = useState(false)
  const { form, handleSubmit } = props
  const { getFieldDecorator } = form

  const handleConfirmBlur = (e: any) => {
    const { value } = e.target
    setConfirmDirty(confirmDirty || !!value)
  }

  const compareToFirstPassword = (rule: any, value: any, callback: any) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }
  const validateToNextPassword = (rule: any, value: any, callback: any) => {
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="E-mail">
        {getFieldDecorator('email', {
          rules: [
            {
              type: 'email',
              message: 'The input is not valid E-mail!'
            },
            {
              required: true,
              message: 'Please input your E-mail!'
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Username">
        {getFieldDecorator('username', {
          rules: [
            {
              required: true,
              message: 'Please input the Username'
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Row gutter={2}>
        <Col span={12}>
          <Form.Item label="First Name">
            {getFieldDecorator('first_name', {
              rules: [
                {
                  required: true,
                  message: 'Please input the First Name'
                }
              ]
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Last Name">
            {getFieldDecorator('last_name', {
              rules: [
                {
                  required: true,
                  message: 'Please input the Last Name'
                }
              ]
            })(<Input />)}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={2}>
        <Col span={12}>
          <Form.Item label="Date of Birth">
            {getFieldDecorator('date_of_birth', {
              rules: [
                {
                  required: true,
                  message: 'Please input the Date of Birth'
                }
              ]
            })(<DatePicker style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Phone">
            {getFieldDecorator('phone', {
              // rules: [
              //   {
              //     required: true,
              //     message: 'Please input the access-key name'
              //   }
              // ]
            })(<Input />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={2}>
        <Col span={12}>
          <Form.Item label="Password" hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password'
                },
                {
                  validator: validateToNextPassword
                }
              ]
            })(<Input.Password />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Confirm Password" hasFeedback>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password'
                },
                {
                  validator: compareToFirstPassword
                }
              ]
            })(<Input.Password onBlur={handleConfirmBlur} />)}
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  )
}

interface IProps extends FormComponentProps<ICreateUserPayload> {}

const CreateUserPage = (props: IProps) => {
  const userRequestStatus = new RequestStatus()
  const [userStatus, setUserStatus] = useState(userRequestStatus.status)
  const { form } = props

  const handleSubmit = (e: any) => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setUserStatus(userRequestStatus.loading())
        createUserRequest({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          username: values.username,
          date_of_birth: values.date_of_birth,
          password: values.password,
          phone: values.phone || ''
        } as any)
          .then((res) => {
            setUserStatus(userRequestStatus.success())
            router.push(pageRoutes.listUsers)
          })
          .catch((err: AxiosError) => {
            setUserStatus(userRequestStatus.error(err))
          })
      }
    })
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'user',
          name: 'AccessKey'
        },
        {
          key: 'create',
          url: pageRoutes.createUser,
          name: 'Create'
        }
      ]}
    >
      {userStatus.error && (
        <Alert message={userStatus.error} type="error" closable />
      )}
      <br />
      <div style={{ height: '70%' }}>
        {userStatus.loading ? (
          <Loading />
        ) : userStatus.success ? (
          <div style={{ color: 'green' }}>User created successfully.</div>
        ) : (
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <CreateUserForm form={form} handleSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </PageLayout>
  )
}

const WrappedUserPage = Form.create({ name: 'user' })(CreateUserPage)

export default WrappedUserPage
