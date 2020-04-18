import React, { useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import PageHeader from '../../components/PageHeader/PageHeader'
import { Form, Input, Tooltip, Checkbox, Button, Row, Alert, Col } from 'antd'
import { createAccountRequest } from '../../requests/account.request'
import Loading from '../../components/Loading/Loading'
import { setToken, setUser } from '../../helpers/auth.helper'
import router from 'next/router'
import { ICreateCollectionPayload } from '../../types/collection.type'
import { createCollectionRequest } from '../../requests/collection.request'
import { AxiosError } from 'axios'
import { RequestStatus } from '../../helpers/request'
import { pageRoutes } from '../../navigation/page-routes'
import Link from 'next/link'
import { isFormInvalid } from '../../helpers/form.helper'
import { useForm } from 'antd/lib/form/util'

const CreateCollectionPage = () => {
  const [form] = useForm()
  /**
   * ||==================
   * || Create Collection
   */
  const collectionRequestStatus = new RequestStatus()
  const [collectionStatus, setCollectionStatus] = useState(
    collectionRequestStatus.status
  )
  const createCollection = (values: ICreateCollectionPayload) => {
    setCollectionStatus(collectionRequestStatus.loading())
    createCollectionRequest({
      name: values.name,
      handle: values.handle,
      description: values.description
    } as any)
      .then((res) => {
        setCollectionStatus(collectionRequestStatus.success())

        router.push(pageRoutes.listCollections)
      })
      .catch((err: AxiosError) => {
        setCollectionStatus(collectionRequestStatus.error(err))
      })
  }

  const onFinish = (values: ICreateCollectionPayload) => {
    createCollection(values)
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'collections',
          name: 'Collections'
        },
        {
          key: 'create',
          name: 'Create'
        }
      ]}
    >
      <div className="w-max-800">
        <PageHeader
          name="Create Collection"
          buttons={
            <Link href={pageRoutes.listCollections}>
              <Button>Back to List</Button>
            </Link>
          }
        />
        <br />
        {collectionStatus.error && (
          <Alert message={collectionStatus.error} type="error" closable />
        )}
        <br />
        <div>
          {collectionStatus.loading ? (
            <Loading />
          ) : collectionStatus.success ? (
            <Alert type="success" message="Collection created successfully." />
          ) : (
            <div>
              <Form
                form={form}
                layout="vertical"
                onFinish={(values) =>
                  onFinish(values as ICreateCollectionPayload)
                }
              >
                <Row gutter={2}>
                  <Col span={12}>
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: 'Please input the collection name'
                        }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Handle"
                      name="handle"
                      rules={[
                        {
                          required: true,
                          message: 'Please input the collection handle'
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
                      label="Description"
                      hasFeedback
                      name="description"
                      rules={[
                        {
                          required: true,
                          message: 'Please input the collection desctiption'
                        }
                      ]}
                    >
                      <Input.TextArea
                        autoSize={{
                          minRows: 8
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Form.Item shouldUpdate>
                    {() => (
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={isFormInvalid(form, [
                          'name',
                          'handle',
                          'description'
                        ])}
                      >
                        Create
                      </Button>
                    )}
                  </Form.Item>
                </Row>
              </Form>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default CreateCollectionPage
