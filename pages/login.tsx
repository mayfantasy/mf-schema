import React, { useState } from 'react'
import PageLayout from '../components/PageLayout/PageLayout'
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
import { createAccountRequest } from '../requests/account.request'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import Loading from '../components/Loading/Loading'
import { ILoginPayload } from '../types/auth.type'
import { loginRequest } from '../requests/auth.request'
import { setToken, setUser } from '../helpers/auth.helper'
import router from 'next/router'
import { AxiosError } from 'axios'
import { RequestStatus } from '../helpers/request'
import Link from 'next/link'
import { pageRoutes } from '../navigation/page-routes'

interface ILoginFormProps<V> {
  handleSubmit: (e: any) => void
  form: WrappedFormUtils<V>
}

const LoginForm = (props: ILoginFormProps<ILoginPayload>) => {
  const { form, handleSubmit } = props
  const { getFieldDecorator } = form

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
      <Form.Item label="Password" hasFeedback>
        {getFieldDecorator('password', {
          rules: [
            {
              required: true,
              message: 'Please input your password'
            }
          ]
        })(<Input.Password />)}
      </Form.Item>
      <Form.Item>
        <Row type="flex" justify="space-between">
          <Col>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Col>
          <Col>
            <Link href="register">
              <a>Register</a>
            </Link>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  )
}

interface IProps extends FormComponentProps<ILoginPayload> {}

const LoginPage = (props: IProps) => {
  const loginRequestStatus = new RequestStatus()
  const [loginStatus, setLoginStatus] = useState(loginRequestStatus.status)
  const { form } = props

  const handleSubmit = (e: any) => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setLoginStatus(loginRequestStatus.loading())
        loginRequest({
          email: values.email,
          password: values.password
        })
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
    })
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
            <LoginForm form={form} handleSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </PageLayout>
  )
}

const WrappedLoginPage = Form.create({ name: 'login' })(LoginPage)

export default WrappedLoginPage
