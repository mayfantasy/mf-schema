import React, { useState } from 'react'
import PageLayout from '../components/PageLayout/PageLayout'
import { Form, Input, Tooltip, Icon, Checkbox, Button, Row, Alert } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { createAccountRequest } from '../requests/account.request'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import Loading from '../components/Loading/Loading'
import { ILoginPayload } from '../types/auth.type'
import { loginRequest } from '../requests/auth.request'
import { setToken, setUser } from '../helpers/auth.helper'
import router from 'next/router'
import { AxiosError } from 'axios'

interface ILoginFormProps<V> {
  handleSubmit: (e: any) => void
  form: WrappedFormUtils<V>
}

const LoginForm = (props: ILoginFormProps<ILoginPayload>) => {
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
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  )
}

interface IProps extends FormComponentProps<ILoginPayload> {}

const LoginPage = (props: IProps) => {
  const [loginStatus, setLoginStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })
  const { form } = props

  const handleSubmit = (e: any) => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setLoginStatus({
          loading: true,
          success: false,
          error: ''
        })
        loginRequest({
          email: values.email,
          password: values.password
        })
          .then((res) => {
            setLoginStatus({
              loading: false,
              success: true,
              error: ''
            })

            const user = res.data.result.account
            const token = res.data.result.token

            setToken(token)
            setUser(user)

            router.push('/')
          })
          .catch((err: AxiosError) => {
            setLoginStatus({
              loading: false,
              success: false,
              error: err.message || JSON.stringify(err)
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
          key: 'login-page',
          url: '/login',
          name: 'Login'
        }
      ]}
    >
      {loginStatus.error && (
        <Alert message={loginStatus.error} type="error" closable />
      )}
      <br />
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ height: '70%' }}
      >
        {loginStatus.loading ? (
          <Loading />
        ) : loginStatus.success ? (
          <div style={{ color: 'green' }}>Logged in successfully.</div>
        ) : (
          <div style={{ width: '50%' }}>
            <LoginForm form={form} handleSubmit={handleSubmit} />
          </div>
        )}
      </Row>
    </PageLayout>
  )
}

const WrappedLoginPage = Form.create({ name: 'login' })(LoginPage)

export default WrappedLoginPage
