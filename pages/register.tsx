import React, { useState } from 'react'
import PageLayout from '../components/PageLayout/PageLayout'
import { Form, Input, Tooltip, Icon, Checkbox, Button, Row, Alert } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { createAccountRequest } from '../requests/account.request'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { IClientCreateAccountPayload } from '../types/account.type'
import Loading from '../components/Loading/Loading'
import router from 'next/router'
import { AxiosError } from 'axios'
import { RequestStatus } from '../helpers/request'
import { pageRoutes } from '../navigation/page-routes'

interface IRegistrationFormProps<V> {
  handleSubmit: (e: any) => void
  form: WrappedFormUtils<V>
}

const RegistrationForm = (
  props: IRegistrationFormProps<IClientCreateAccountPayload>
) => {
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

  const checkedAgreement = (rule: any, value: any, callback: any) => {
    if (!value) {
      callback('Please confirm that you have read the agreement')
    } else {
      callback()
    }
  }

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
      <Form.Item
        label={
          <span>
            Username&nbsp;
            <Tooltip title="What do you want others to call you?">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>
        }
      >
        {getFieldDecorator('username', {
          rules: [
            {
              required: true,
              message: 'Please input your username',
              whitespace: true
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
            },
            {
              validator: validateToNextPassword
            }
          ]
        })(<Input.Password />)}
      </Form.Item>
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
      <Form.Item {...tailFormItemLayout}>
        {getFieldDecorator('agreement', {
          rules: [
            {
              validator: checkedAgreement
            }
          ],
          valuePropName: 'checked'
        })(
          <Checkbox>
            I have read the <a href="">agreement</a>
          </Checkbox>
        )}
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}

interface IProps extends FormComponentProps<IClientCreateAccountPayload> {}

const RegisterPage = (props: IProps) => {
  /** Register */
  const registerRequestStatus = new RequestStatus()
  const [registerStatus, setRegisterStatus] = useState(
    registerRequestStatus.status
  )
  const { form } = props

  const handleSubmit = (e: any) => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
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
    })
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
            <RegistrationForm form={form} handleSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </PageLayout>
  )
}

const WrappedRegisterPage = Form.create({ name: 'register' })(RegisterPage)

export default WrappedRegisterPage
