import React, { useState } from 'react'
import PageLayout from '../components/PageLayout/PageLayout'
import { Form, Input, Tooltip, Checkbox, Button, Row, Alert, Col } from 'antd'
import { createAccountRequest } from '../requests/account.request'
import Loading from '../components/Loading/Loading'
import { ILoginPayload } from '../types/auth.type'
import { loginRequest } from '../requests/auth.request'
import { setToken, setUser } from '../helpers/auth.helper'
import router from 'next/router'
import { AxiosError } from 'axios'
import { RequestStatus } from '../helpers/request'
import Link from 'next/link'
import { pageRoutes } from '../navigation/page-routes'
import { useForm } from 'antd/lib/form/util'
import { isFormInvalid } from '../helpers/form.helper'

const LoginPage = () => {
  const loginRequestStatus = new RequestStatus()
  const [loginStatus, setLoginStatus] = useState(loginRequestStatus.status)
  const [form] = useForm()

  const login = () => {
    const values = form.getFieldsValue()
    setLoginStatus(loginRequestStatus.loading())
    loginRequest(values as ILoginPayload)
      .then((res) => {
        setLoginStatus(loginRequestStatus.success())

        const user = res.data.result.account
        const token = res.data.result.token

        setToken(token)
        setUser(user)

        router.push(pageRoutes.home)
      })
      .catch((err: AxiosError) => {
        console.log(err)
        setLoginStatus(loginRequestStatus.error(err))
      })
  }

  const onFinish = () => {
    login()
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'login-page',
          url: pageRoutes.login,
          name: 'Login'
        }
      ]}
    >
      {loginStatus.error && (
        <Alert message={loginStatus.error} type="error" closable />
      )}
      <br />
      <div style={{ height: '70%' }}>
        {loginStatus.loading ? (
          <Loading />
        ) : loginStatus.success ? (
          <div style={{ color: 'green' }}>Logged in successfully.</div>
        ) : (
          <div style={{ width: '50%' }}>
            <Form
              layout="vertical"
              form={form}
              name="register"
              onFinish={() => onFinish()}
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
                label="Password"
                hasFeedback
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password'
                  }
                ]}
              >
                <Input.Password />
              </Form.Item>
              <br />
              <Form.Item shouldUpdate>
                {() => (
                  <Row justify="space-between" align="middle">
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={isFormInvalid(form)}
                    >
                      Login
                    </Button>
                    <Link href="register">
                      <a>Register</a>
                    </Link>
                  </Row>
                )}
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default LoginPage
