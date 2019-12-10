import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { getSchemaListRequest } from '../../requests/schema.request'
import { AxiosError } from 'axios'
import Loading from '../../components/Loading/Loading'
import { Alert, Table } from 'antd'
import { ICollection } from '../../types/collection.type'

const columns = [
  {
    title: 'Handle',
    dataIndex: 'handle',
    key: 'handle'
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Collection',
    dataIndex: 'collection',
    render: (collection: ICollection) => <span>{collection.name}</span>
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description'
  }
]

const SchemaListPage = () => {
  const [schemaStatus, setSchemaStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })
  const [schemas, setSchemas] = useState([])
  useEffect(() => {
    setSchemaStatus({
      loading: true,
      success: false,
      error: ''
    })
    getSchemaListRequest()
      .then((res) => {
        setSchemaStatus({
          loading: false,
          success: true,
          error: ''
        })
        setSchemas(res.data.result)
      })
      .catch((err: AxiosError) => {
        setSchemaStatus({
          loading: false,
          success: false,
          error: err.message || JSON.stringify(err)
        })
      })
  }, [])
  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'schema',
          name: 'Schema'
        },
        {
          key: 'create',
          url: '/schema/list',
          name: 'List'
        }
      ]}
    >
      {schemaStatus.error && (
        <Alert message={schemaStatus.error} type="error" closable />
      )}
      <br />
      <div>
        {schemaStatus.loading ? (
          <Loading />
        ) : (
          <Table dataSource={schemas} columns={columns} />
        )}
      </div>
    </PageLayout>
  )
}

export default SchemaListPage
