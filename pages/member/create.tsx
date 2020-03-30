import { useForm } from 'antd/lib/form/util'
import PageLayout from '../../components/PageLayout/PageLayout'
import { pageRoutes } from '../../navigation/page-routes'
import PageHeader from '../../components/PageHeader/PageHeader'
import { Form, Input, Row, Col, Button, Alert, Switch, Select } from 'antd'
import { confirmPasswordRule, isFormInvalid } from '../../helpers/form.helper'
import FormItemLabel from 'antd/lib/form/FormItemLabel'
import FormFieldLabel from '../../components/FormFieldLabel/FormFieldLabel'
import Link from 'next/link'
import { ICreateMemberPayload } from '../../types/member.type'
import { RequestStatus } from '../../helpers/request'
import { useState } from 'react'
import { createMemberRequest } from '../../requests/member.request'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'
import Loading from '../../components/Loading/Loading'
import { tiers } from '../../helpers/tier.helper'
import { IKeyValue } from '../../types/utils.type'

interface ICreateMemberFormValues extends ICreateMemberPayload {
  confirm_password: string
}

const CreateMemberPage = () => {
  const [form] = useForm()
  const router = useRouter()

  /**
   * ||=================
   * || Create member
   */

  const createMemberReq = new RequestStatus()
  const [createMemberStatus, setCreateMemberStatus] = useState(
    createMemberReq.status
  )

  const createMember = (member: ICreateMemberPayload) => {
    setCreateMemberStatus(createMemberReq.loading())
    createMemberRequest(member)
      .then((res) => {
        setCreateMemberStatus(createMemberReq.success())
        router.push(pageRoutes.listMembers)
      })
      .catch((err: AxiosError) => {
        setCreateMemberStatus(createMemberReq.error(err))
      })
  }

  const onFinish = (values: ICreateMemberFormValues) => {
    console.log(values)
    createMember({
      email: values.email,
      username: values.username,
      password: values.password,
      active: values.active,
      tier: values.tier
    })
  }

  const initialValues: ICreateMemberFormValues = {
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    active: false,
    tier: tiers.writer.tier
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'member',
          name: 'Member',
          url: pageRoutes.listMembers
        },
        {
          key: 'create',
          url: pageRoutes.createMember,
          name: 'Create'
        }
      ]}
    >
      <div style={{ width: '70%' }}>
        <PageHeader
          name="Create Team Member"
          description="Create a team member with different roles"
        />
        <br />
        {createMemberStatus.error && (
          <>
            <Alert type="error" message={createMemberStatus.error} closable />
            <br />
          </>
        )}
        {createMemberStatus.loading ? (
          <Loading />
        ) : createMemberStatus.success ? (
          <Alert type="success" message="Team member created successfully." />
        ) : (
          <Form
            form={form}
            initialValues={initialValues}
            layout="vertical"
            onFinish={(values) => onFinish(values as ICreateMemberFormValues)}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Member name is required.'
                    },
                    {
                      type: 'email',
                      message: 'Invalid email'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: 'Username name is required.'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Active" name="active" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Member Role" name="tier">
                  <Select placeholder="Select a Role">
                    {Object.keys(tiers).map((t) => {
                      return (
                        <Select.Option
                          value={(tiers as IKeyValue)[t].tier}
                          key={t}
                        >
                          {(tiers as IKeyValue)[t].name}
                        </Select.Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Password name is required.'
                    }
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="Confirm Password"
                  name="confirm_password"
                  rules={[
                    {
                      required: true,
                      message: 'Please re-enter your password.'
                    },
                    confirmPasswordRule
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item shouldUpdate>
                  {() => (
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </div>
    </PageLayout>
  )
}
export default CreateMemberPage
