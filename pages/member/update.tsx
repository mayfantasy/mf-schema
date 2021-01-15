import { useForm } from 'antd/lib/form/Form'
import PageLayout from '../../components/PageLayout/PageLayout'
import { pageRoutes } from '../../navigation/page-routes'
import PageHeader from '../../components/PageHeader/PageHeader'
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Alert,
  Switch,
  Select,
  Popconfirm
} from 'antd'
import { confirmPasswordRule, isFormInvalid } from '../../helpers/form.helper'
import FormItemLabel from 'antd/lib/form/FormItemLabel'
import FormFieldLabel from '../../components/FormFieldLabel/FormFieldLabel'
import Loading from '../../components/Loading/Loading'
import { useState, useEffect } from 'react'
import { RequestStatus } from '../../helpers/request'
import {
  deleteMemberRequest,
  getMemberByIdRequest,
  updateMemberByIdRequest
} from '../../requests/member.request'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { IMember, IUpdateMemberPayload } from '../../types/member.type'
import { tiers, tierMap } from '../../helpers/tier.helper'
import { IKeyValue } from '../../types/utils.type'
import Link from 'next/link'
import { QuestionCircleOutlined } from '@ant-design/icons'
import TierWrapper from '../../components/TierButton/TierButton'

interface IUpdateMemberFormValues extends IUpdateMemberPayload {
  confirm_password: string
}

const UpdateMemberPage = () => {
  const [form] = useForm()
  const router = useRouter()

  const [currentMember, setCurrentMember] = useState<IMember | null>(null)

  /**
   * ||=================
   * || Current member
   */
  const currentMemberReq = new RequestStatus()
  const [currentMemberStatus, setCurrentMemberStatus] = useState(
    currentMemberReq.status
  )
  const getCurrentMember = () => {
    const id = router.query.id as string
    if (id) {
      setCurrentMemberStatus(currentMemberReq.loading())
      getMemberByIdRequest(id)
        .then((res) => {
          setCurrentMemberStatus(currentMemberReq.success())
          setCurrentMember(res.data.result)
        })
        .catch((err: AxiosError) => {
          setCurrentMemberStatus(currentMemberReq.error(err))
        })
    }
  }

  useEffect(() => {
    getCurrentMember()
  }, [])

  /**
   * ||=================
   * || Update member
   */
  const updateMemberReq = new RequestStatus()
  const [updateMemberStatus, setUpdateMemberStatus] = useState(
    updateMemberReq.status
  )
  const updateMember = (values: IUpdateMemberPayload) => {
    setUpdateMemberStatus(updateMemberReq.loading())
    updateMemberByIdRequest(values)
      .then((res) => {
        setUpdateMemberStatus(updateMemberReq.success())
        getCurrentMember()
      })
      .catch((err: AxiosError) => {
        setUpdateMemberStatus(updateMemberReq.error(err))
      })
  }

  const onFinish = (values: IUpdateMemberFormValues) => {
    const id = router.query.id as string
    const v = { ...values, id }
    delete v.confirm_password
    updateMember(v)
  }

  /**
   * ||=================
   * || Delete member
   */

  const deleteMemberReq = new RequestStatus()
  const [deleteMemberStatus, setDeleteMemberStatus] = useState(
    deleteMemberReq.status
  )
  const deleteMember = (id: string) => {
    setDeleteMemberStatus(deleteMemberReq.loading())
    deleteMemberRequest(id)
      .then((res) => {
        setDeleteMemberStatus(deleteMemberReq.success())
        router.push(pageRoutes.listMembers)
      })
      .catch((err: AxiosError) => {
        setDeleteMemberStatus(deleteMemberReq.error(err))
      })
  }

  /**
   * ||================
   * || Layout
   */
  const layout = (content: React.ReactNode) => (
    <PageLayout
      breadCrumb={[
        {
          key: 'members',
          name: 'Members',
          url: pageRoutes.listMembers
        },
        {
          key: 'update',
          name: 'Update'
        }
      ]}
    >
      {content}
    </PageLayout>
  )

  if (!currentMember) {
    return layout(
      currentMemberStatus.loading ? (
        <Loading />
      ) : currentMemberStatus.error ? (
        <Alert message={currentMemberStatus.error} type="error" closable />
      ) : (
        <Button onClick={() => getCurrentMember()}>Load</Button>
      )
    )
  }

  return layout(
    <div className="w-max-800">
      <PageHeader
        name="Update Team Member"
        buttons={
          <>
            <Link href={pageRoutes.listMembers}>
              <Button>Back to list</Button>
            </Link>
          </>
        }
      />
      <br />
      {updateMemberStatus.error ? (
        <>
          <Alert type="error" message={updateMemberStatus.error} />
          <br />
        </>
      ) : updateMemberStatus.success ? (
        <>
          <Alert type="success" message="Member updated successfully" />
          <br />
        </>
      ) : null}

      {updateMemberStatus.loading ? (
        <Loading />
      ) : (
        <Form
          form={form}
          onFinish={(values) => onFinish(values as IUpdateMemberFormValues)}
          layout="vertical"
          initialValues={currentMember}
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
              <Form.Item
                label="Active"
                name="active"
                rules={[
                  {
                    required: true
                  }
                ]}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label="Member Role"
                name="tier"
                rules={[
                  {
                    required: true
                  }
                ]}
              >
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
              <Form.Item label="Password" name="password">
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label="Confirm Password"
                name="confirm_password"
                rules={[confirmPasswordRule]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>
              <Form.Item shouldUpdate>
                {() => (
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                )}
              </Form.Item>
            </Col>
            <Col>
              <TierWrapper tier={tierMap.DELETE_MEMBER.tier}>
                <Popconfirm
                  title="Are you sure？"
                  onConfirm={() => deleteMember(currentMember.id)}
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                >
                  <Button type="danger">Delete Member</Button>
                </Popconfirm>
              </TierWrapper>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  )
}
export default UpdateMemberPage
