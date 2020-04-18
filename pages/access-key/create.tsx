import React, { useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { Form, Input, Button, Alert } from 'antd'
import Loading from '../../components/Loading/Loading'
import { setToken, setUser } from '../../helpers/auth.helper'
import router from 'next/router'
import { createAccessKeyRequest } from '../../requests/access-key.request'
import { AxiosError } from 'axios'
import { ICreateAccessKeyPayload } from '../../types/access-key.type'
import { RequestStatus } from '../../helpers/request'
import { pageRoutes } from '../../navigation/page-routes'
import { useForm } from 'antd/lib/form/util'
import { isFormInvalid } from '../../helpers/form.helper'
import PageHeader from '../../components/PageHeader/PageHeader'
import Link from 'next/link'

const CreateAccessKeyPage = () => {
  /**
   * ||==================
   * || Create Access Key
   */
  const accessKeyRequestStatus = new RequestStatus()
  const [accessKeyStatus, setAccessKeyStatus] = useState(
    accessKeyRequestStatus.status
  )
  const createAccessKey = (values: ICreateAccessKeyPayload) => {
    setAccessKeyStatus(accessKeyRequestStatus.loading())
    createAccessKeyRequest({
      name: values.name,
      description: values.description
    } as any)
      .then((res) => {
        setAccessKeyStatus(accessKeyRequestStatus.success())

        router.push(pageRoutes.listAccessKeys)
      })
      .catch((err: AxiosError) => {
        setAccessKeyStatus(accessKeyRequestStatus.error(err))
      })
  }

  /**
   * ||===================
   * || Form
   */
  const [form] = useForm()
  const onFinish = (values: ICreateAccessKeyPayload) => {
    createAccessKey(values)
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'access-key',
          name: 'Access Key',
          url: pageRoutes.listAccessKeys
        },
        {
          key: 'create',
          url: pageRoutes.createAccessKey,
          name: 'Create'
        }
      ]}
    >
      <div className="w-max-800">
        {accessKeyStatus.error && (
          <Alert message={accessKeyStatus.error} type="error" closable />
        )}
        <br />
        <PageHeader
          name="Create Access Key"
          description="Create access key for your website or app."
          buttons={
            <>
              <Link href={pageRoutes.listAccessKeys}>
                <Button>Back to List</Button>
              </Link>
            </>
          }
        />
        <br />
        {accessKeyStatus.loading ? (
          <Loading />
        ) : accessKeyStatus.success ? (
          <div style={{ color: 'green' }}>AccessKey created successfully.</div>
        ) : (
          <div>
            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => onFinish(values as ICreateAccessKeyPayload)}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please input the access-key name'
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Description"
                hasFeedback
                name="description"
                rules={[
                  {
                    required: true,
                    message: 'Please input the access-key desctiption'
                  }
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 8 }} />
              </Form.Item>
              <Form.Item shouldUpdate>
                {() => (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={isFormInvalid(form, ['name', 'description'])}
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

export default CreateAccessKeyPage
