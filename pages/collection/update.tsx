import { RequestStatus } from '../../helpers/request'
import { useState, useEffect } from 'react'
import {
  IUpdateCollectionPayload,
  ICollection
} from '../../types/collection.type'
import { useRouter } from 'next/router'
import PageLayout from '../../components/PageLayout/PageLayout'
import Loading from '../../components/Loading/Loading'
import {
  Alert,
  Button,
  Descriptions,
  Form,
  Row,
  Col,
  Input,
  message,
  Popconfirm,
  Typography
} from 'antd'
import PageHeader from '../../components/PageHeader/PageHeader'
import {
  getCollectionByIdRequest,
  updateCollectionRequest,
  deleteCollectionByIdRequest
} from '../../requests/collection.request'
import FormFieldLabel from '../../components/FormFieldLabel/FormFieldLabel'
import { pageRoutes } from '../../navigation/page-routes'
import Link from 'next/link'
import { useForm } from 'antd/lib/form/Form'
import { required } from 'joi'
import TierWrapper from '../../components/TierButton/TierButton'
import { tierMap } from '../../helpers/tier.helper'
import { QuestionCircleOutlined } from '@ant-design/icons'

const UpdateCollectionPage = () => {
  /** Form */
  const [form] = useForm()
  const onFinish = (values: IUpdateCollectionPayload) => {
    updateCollection(values)
  }

  /** Router */
  const router = useRouter()

  /** Get Collection Detail */
  const getCollectionReq = new RequestStatus()
  const [getCollectionStatus, setGetCollectionStatus] = useState(
    getCollectionReq.status
  )
  const [collection, setCollection] = useState<ICollection | null>(null)

  const getCollectionDetail = (id: string) => {
    setGetCollectionStatus(getCollectionReq.loading())
    getCollectionByIdRequest(id)
      .then((res) => {
        setGetCollectionStatus(getCollectionReq.success())
        setCollection(res.data.result)
      })
      .catch((err) => {
        setGetCollectionStatus(getCollectionReq.error(err))
      })
  }
  useEffect(() => {
    if (router && router.query && router.query.id) {
      const id = router.query.id as string
      getCollectionDetail(id)
    }
  }, [router.query])

  //** Delete Collection */
  const deleteCollectionReq = new RequestStatus()
  const [deleteCollectionStatus, setDeleteCollectionStatus] = useState(
    deleteCollectionReq.status
  )

  const deleteCollection = (id: string) => {
    setDeleteCollectionStatus(deleteCollectionReq.loading())
    deleteCollectionByIdRequest(id)
      .then(() => {
        setDeleteCollectionStatus(deleteCollectionReq.success())
        router.push(pageRoutes.listCollections)
        message.success('Collection delete successfully.')
      })
      .catch((err) => {
        setDeleteCollectionStatus(deleteCollectionReq.error(err))
      })
  }

  //** Update Collection */
  const updateCollectionReq = new RequestStatus()
  const [updateCollectionStatus, setUpdateCollectionStatus] = useState(
    updateCollectionReq.status
  )

  const updateCollection = (payload: IUpdateCollectionPayload) => {
    const id = router.query.id as string
    setUpdateCollectionStatus(updateCollectionReq.loading())
    updateCollectionRequest({
      ...payload
    })
      .then(() => {
        setUpdateCollectionStatus(updateCollectionReq.success())
        getCollectionDetail(id)
      })
      .catch((err) => {
        setUpdateCollectionStatus(updateCollectionReq.error(err))
      })
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'collections',
          name: 'Collections',
          url: pageRoutes.listCollections
        },
        {
          key: 'update',
          name: 'Update'
        }
      ]}
    >
      <div className="w-max-800">
        {updateCollectionStatus.success && (
          <>
            <Alert type="success" message="Collection updated successfully." />
            <br />
          </>
        )}
        {getCollectionStatus.error && (
          <>
            <Alert type="error" message={getCollectionStatus.error} />
            <br />
          </>
        )}
        {updateCollectionStatus.error && (
          <>
            <Alert type="error" message={updateCollectionStatus.error} />
            <br />
          </>
        )}
        {deleteCollectionStatus.error && (
          <>
            <Alert type="error" message={deleteCollectionStatus.error} />
            <br />
          </>
        )}
        {getCollectionStatus.loading ||
        updateCollectionStatus.loading ||
        deleteCollectionStatus.loading ? (
          <Loading />
        ) : collection ? (
          <>
            <PageHeader
              name={collection.name}
              sub={collection.handle}
              description={`ID: ${collection.id}`}
              buttons={
                <Link
                  href={`${pageRoutes.listCollections}?id=${collection.id}`}
                >
                  <Button>Back to List</Button>
                </Link>
              }
            />
            <br />
            <div>
              <Form
                form={form}
                layout="vertical"
                onFinish={(values) =>
                  onFinish(values as IUpdateCollectionPayload)
                }
                initialValues={collection}
              >
                <Row gutter={2}>
                  <Col span={12}>
                    <Form.Item
                      label="Handle"
                      name="handle"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Collection handle is required.'
                        }
                      ]}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Name"
                      name="name"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Collection name is required.'
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
                      name="description"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Please provide collection description'
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
                <br />
                <Row justify="space-between">
                  <TierWrapper tier={tierMap.DELETE_COLLECTION_BY_ID.tier}>
                    <Form.Item shouldUpdate>
                      {() => {
                        return (
                          <Button htmlType="submit" type="primary">
                            Submit
                          </Button>
                        )
                      }}
                    </Form.Item>
                  </TierWrapper>
                  <TierWrapper tier={tierMap.DELETE_COLLECTION_BY_ID.tier}>
                    <Popconfirm
                      title={
                        <Typography.Text type="danger">
                          This collection will be permernently removed,
                          <br />
                          all the schemas and objects under this collection will
                          be removed at the sametime,
                          <br />
                          are you sure?
                        </Typography.Text>
                      }
                      onConfirm={() =>
                        deleteCollection(router.query.id as string)
                      }
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                      <Button type="primary" danger>
                        Delete
                      </Button>
                    </Popconfirm>
                  </TierWrapper>
                </Row>
              </Form>
            </div>
          </>
        ) : (
          <Button
            onClick={() => getCollectionDetail(router.query.id as string)}
          >
            Load
          </Button>
        )}
      </div>
    </PageLayout>
  )
}
export default UpdateCollectionPage
