import React, { useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import {
  Form,
  Input,
  Tooltip,
  Checkbox,
  Button,
  Row,
  Alert,
  DatePicker,
  Col
} from 'antd'
import { createAccountRequest } from '../../requests/account.request'
import Loading from '../../components/Loading/Loading'
import { setToken, setUser } from '../../helpers/auth.helper'
import router from 'next/router'
import { AxiosError } from 'axios'
import { RequestStatus } from '../../helpers/request'
import { ICreateUserPayload } from '../../types/user.type'
import { createUserRequest } from '../../requests/user.request'
import { pageRoutes } from '../../navigation/page-routes'
import { useForm } from 'antd/lib/form/Form'
import { confirmPasswordRule, isFormInvalid } from '../../helpers/form.helper'
import PageHeader from '../../components/PageHeader/PageHeader'
import Link from 'next/link'

const CreateUserPage = () => {
  /**
   * ||========
   * || Form
   */
  const [form] = useForm()
  const onFinish = (values: ICreateUserPayload) => {
    createUser(values)
  }

  /**
   * ||================
   * || Create User
   */
  const createUserRequestStatus = new RequestStatus()
  const [createUserStatus, setCreateUserStatus] = useState(
    createUserRequestStatus.status
  )
  const createUser = (values: ICreateUserPayload) => {
    setCreateUserStatus(createUserRequestStatus.loading())
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
        setCreateUserStatus(createUserRequestStatus.success())
        router.push(pageRoutes.listUsers)
      })
      .catch((err: AxiosError) => {
        setCreateUserStatus(createUserRequestStatus.error(err))
      })
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'users',
          name: 'Users',
          url: pageRoutes.listUsers
        },
        {
          key: 'create',
          name: 'Create'
        }
      ]}
    >
      <div className="w-max-800">
        {createUserStatus.error && (
          <>
            <Alert message={createUserStatus.error} type="error" closable />
            <br />
          </>
        )}
        <PageHeader
          name="Create User"
          description="Create user for your website or app."
          buttons={
            <>
              <Link href={pageRoutes.listUsers}>
                <Button>Back to List</Button>
              </Link>
            </>
          }
        />
        <br />
        {createUserStatus.loading ? (
          <Loading />
        ) : createUserStatus.success ? (
          <div style={{ color: 'green' }}>User created successfully.</div>
        ) : (
          <div>
            <Form
              layout="vertical"
              form={form}
              onFinish={(values) => onFinish(values as ICreateUserPayload)}
            >
              <Row gutter={2}>
                <Col span={12}>
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
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: 'Please input the Username'
                      }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={2}>
                <Col span={12}>
                  <Form.Item
                    label="First Name"
                    name="first_name"
                    rules={[
                      {
                        required: true,
                        message: 'Please input the First Name'
                      }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Last Name"
                    name="last_name"
                    rules={[
                      {
                        required: true,
                        message: 'Please input the Last Name'
                      }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={2}>
                <Col span={12}>
                  <Form.Item
                    label="Date of Birth"
                    name="date_of_birth"
                    rules={[
                      {
                        required: true,
                        message: 'Please input the Date of Birth'
                      }
                    ]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phone" name="phone">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={2}>
                <Col span={12}>
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
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Confirm Password"
                    hasFeedback
                    name="confirm"
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your password'
                      },
                      confirmPasswordRule
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
              </Row>

              <br />
              <Form.Item shouldUpdate>
                {() => (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={isFormInvalid(form, [
                      'email',
                      'username',
                      'first_name',
                      'last_name',
                      'date_of_birth',
                      'password',
                      'confirm'
                    ])}
                  >
                    Create
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

export default CreateUserPage
