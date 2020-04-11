import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { getSchemaListRequest } from '../../requests/schema.request'
import { AxiosError } from 'axios'
import Loading from '../../components/Loading/Loading'
import { Alert, Table, Select, Row, Button } from 'antd'
import { ICollection } from '../../types/collection.type'
import { ISchema } from '../../types/schema.type'
import Link from 'next/link'
import { RequestStatus } from '../../helpers/request'
import { getCollectionListRequest } from '../../requests/collection.request'
import FormFieldLabel from '../../components/FormFieldLabel/FormFieldLabel'
import { pageRoutes } from '../../navigation/page-routes'
import { PlusCircleOutlined } from '@ant-design/icons'
import PageHeader from '../../components/PageHeader/PageHeader'
import TierWrapper from '../../components/TierButton/TierButton'
import { tierMap } from '../../helpers/tier.helper'
import TierLink from '../../components/TierLink/TierLink'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name: string, schema: ISchema) => (
      <div>
        <TierLink
          href={`${pageRoutes.schemaDetail}?id=${schema.id}`}
          tier={tierMap.GET_SCHEMA_BY_ID.tier}
        >
          {name}
        </TierLink>
        <br />
        <small>{schema.handle}</small>
      </div>
    )
  },
  {
    title: 'Collection',
    dataIndex: 'collection',
    render: (collection: ICollection) => (
      <div>
        <TierLink
          href={`${pageRoutes.updateCollection}?id=${collection.id}`}
          tier={tierMap.GET_COLLECTION_BY_ID.tier}
        >
          {collection.name}
        </TierLink>
      </div>
    )
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description'
  }
]

const SchemaListPage = () => {
  /** Get Schema List*/
  const schemaListRequest = new RequestStatus()
  const [schemaStatus, setSchemaStatus] = useState(schemaListRequest.status)
  const [schemas, setSchemas] = useState([])

  const getSchemaList = (collection_id: string) => {
    setSchemaStatus(schemaListRequest.loading())
    getSchemaListRequest({ collection_id })
      .then((res) => {
        setSchemaStatus(schemaListRequest.success())
        setSchemas(res.data.result)
      })
      .catch((err: AxiosError) => {
        setSchemaStatus(schemaListRequest.error(err))
      })
  }

  /** Get Collection List */
  const collectionListRequest = new RequestStatus()
  const [collectionStatus, setCollectionStatus] = useState(
    schemaListRequest.status
  )
  const [collections, setCollections] = useState<ICollection[]>([])

  const getCollectionList = () => {
    setCollectionStatus(collectionListRequest.loading())
    getCollectionListRequest()
      .then((res) => {
        setCollectionStatus(collectionListRequest.success())
        setCollections(res.data.result)
      })
      .catch((err: AxiosError) => {
        setCollectionStatus(collectionListRequest.error(err))
      })
  }

  useEffect(() => {
    getSchemaList('')
    getCollectionList()
  }, [])

  const handleSelectCollection = (id: string) => {
    getSchemaList(id)
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'schema',
          name: 'Schema'
        },
        {
          key: 'create',
          url: pageRoutes.listSchemas,
          name: 'List'
        }
      ]}
    >
      <PageHeader
        name="Schemas"
        buttons={
          <TierWrapper tier={tierMap.CREATE_SCHEMA.tier}>
            <Link href={pageRoutes.createSchema}>
              <Button type="primary">
                <PlusCircleOutlined /> Add Schema
              </Button>
            </Link>
          </TierWrapper>
        }
      />
      <br />
      <div>
        {collectionStatus.loading ? (
          'Loading Collections...'
        ) : collectionStatus.error ? (
          <Alert type="error" message={collectionStatus.error} />
        ) : (
          <Row justify="space-between" align="middle">
            <div>
              <div>
                <FormFieldLabel>Filter by Collection</FormFieldLabel>
              </div>
              <Select
                defaultValue=""
                style={{ width: 300 }}
                onChange={handleSelectCollection}
              >
                <Select.Option value="">All</Select.Option>
                {collections.map((c) => (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Row>
        )}
      </div>

      {schemaStatus.error && (
        <Alert message={schemaStatus.error} type="error" closable />
      )}
      <br />
      <div>
        {schemaStatus.loading ? (
          <Loading />
        ) : (
          <Table
            size="small"
            bordered
            pagination={false}
            dataSource={schemas}
            columns={columns}
          />
        )}
      </div>
    </PageLayout>
  )
}

export default SchemaListPage
