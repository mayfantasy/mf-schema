import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { getSchemaListRequest } from '../../requests/schema.request'
import { AxiosError } from 'axios'
import Loading from '../../components/Loading/Loading'
import { Alert, Table, Select } from 'antd'
import { ICollection } from '../../types/collection.type'
import { ISchema } from '../../types/schema.type'
import Link from 'next/link'
import { RequestStatus } from '../../helpers/request'
import { getCollectionListRequest } from '../../requests/collection.request'
import FormFieldLabel from '../../components/FormFieldLabel/FormFieldLabel'
import { pageRoutes } from '../../navigation/page-routes'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name: string, schema: ISchema) => (
      <div>
        <Link href={`${pageRoutes.schemaDetail}?id=${schema.id}`}>
          <a target="_blank">{name}</a>
        </Link>
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
        <Link href={`${pageRoutes.collectionDetail}?id=${collection.id}`}>
          {collection.name}
        </Link>
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
      <div>
        {collectionStatus.loading ? (
          'Loading Collections...'
        ) : collectionStatus.error ? (
          <Alert type="error" message={collectionStatus.error} />
        ) : (
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
          <Table pagination={false} dataSource={schemas} columns={columns} />
        )}
      </div>
    </PageLayout>
  )
}

export default SchemaListPage
