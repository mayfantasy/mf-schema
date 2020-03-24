import React, { useState } from 'react'
import PageLayout from '../components/PageLayout/PageLayout'
import { Form, Input, Tooltip, Checkbox, Button, Row, Alert } from 'antd'
import { createAccountRequest } from '../requests/account.request'
import { IClientCreateAccountPayload } from '../types/account.type'
import Loading from '../components/Loading/Loading'
import router from 'next/router'
import { AxiosError } from 'axios'
import { RequestStatus } from '../helpers/request'
import { pageRoutes } from '../navigation/page-routes'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib/form'
import { useForm } from 'antd/lib/form/util'
import { isFormInvalid } from '../helpers/form.helper'

const RegisterPage = () => {
  /**
   * ||=============================
   * || Register Form
   */
  const [form] = useForm()
  const confirmPasswordRule: any = (form: FormInstance) => {
    return {
      validator: (_: any, value: string) => {
        if (!value || form.getFieldValue('password') === value) {
          return Promise.resolve()
        }
        return Promise.reject('The two password you entered do not match.')
      }
    }
  }

  /**
   * ||=============================
   * || Register Status
   */
  const registerRequestStatus = new RequestStatus()
  const [registerStatus, setRegisterStatus] = useState(
    registerRequestStatus.status
  )
  const register = () => {
    const values = form.getFieldsValue()
    setRegisterStatus(registerRequestStatus.loading())
    createAccountRequest({
      email: values.email,
      username: values.username,
      password: values.password
    })
      .then((res) => {
        setRegisterStatus(registerRequestStatus.success())
        router.push(pageRoutes.login)
      })
      .catch((err: AxiosError) => {
        setRegisterStatus(registerRequestStatus.error(err))
      })
  }

  const onFinish = () => {
    register
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'register-page',
          url: pageRoutes.register,
          name: 'register'
        }
      ]}
    >
      {registerStatus.error && (
        <Alert message={registerStatus.error} type="error" closable />
      )}
      <br />
      <div style={{ height: '70%' }}>
        {registerStatus.loading ? (
          <Loading />
        ) : (
          <div style={{ width: '50%' }}>
            <Form
              layout="vertical"
              form={form}
              name="register"
              onFinish={onFinish}
            >
              <Form.Item
                label="E-mail"
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!'
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!'
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Username&nbsp;
                    <Tooltip title="What do you want others to call you?">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                }
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your username',
                    whitespace: true
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                hasFeedback
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password',
                    whitespace: true
                  }
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                hasFeedback
                name="confirm_password"
                rules={[
                  {
                    required: true,
                    message: 'Please re-enter your password',
                    whitespace: true
                  },
                  confirmPasswordRule
                ]}
              >
                <Input.Password />
              </Form.Item>
              <br />
              <Form.Item shouldUpdate>
                {() => (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={isFormInvalid(form)}
                  >
                    Register
                  </Button>
                )}
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default RegisterPage
