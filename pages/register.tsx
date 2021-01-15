import React, { useState } from 'react'
import PageLayout from '../components/PageLayout/PageLayout'
import { Form, Input, Tooltip, Checkbox, Button, Row, Alert, Card } from 'antd'
import { createAccountRequest } from '../requests/account.request'
import { IClientCreateAccountPayload } from '../types/account.type'
import Loading from '../components/Loading/Loading'
import router from 'next/router'
import { AxiosError } from 'axios'
import { RequestStatus } from '../helpers/request'
import { pageRoutes } from '../navigation/page-routes'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib/form'
import { useForm } from 'antd/lib/form/Form'
import { isFormInvalid, confirmPasswordRule } from '../helpers/form.helper'
import PageHeader from '../components/PageHeader/PageHeader'

const RegisterPage = () => {
  /**
   * ||=============================
   * || Register Form
   */
  const [form] = useForm()

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
    register()
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'register-page',
          url: pageRoutes.register,
          name: 'Register'
        }
      ]}
    >
      <Row justify="center" align="middle">
        <Card className="shadow-1" style={{ width: '100%', maxWidth: '500px' }}>
          <PageHeader name="Register" />
          {registerStatus.error && (
            <Alert message={registerStatus.error} type="error" closable />
          )}
          <br />
          <div>
            {registerStatus.loading ? (
              <Loading />
            ) : (
              <div>
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
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Register
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
          </div>
        </Card>
      </Row>
    </PageLayout>
  )
}

export default RegisterPage
