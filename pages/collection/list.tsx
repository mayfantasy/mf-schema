import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { getCollectionListRequest } from '../../requests/collection.request'
import { AxiosError } from 'axios'
import Loading from '../../components/Loading/Loading'
import { Alert, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { ICollection } from '../../types/collection.type'
import Link from 'next/link'

const columns: ColumnProps<ICollection>[] = [
  {
    title: 'Handle',
    key: 'handle',
    render: (collection: ICollection) => {
      return (
        <div>
          <Link href={`/collection/detail?id=${collection.id}`}>
            <a>{collection.name}</a>
          </Link>
        </div>
      )
    }
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description'
  }
]

const CollectionListPage = () => {
  const [collectionStatus, setCollectionStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })
  const [collections, setCollections] = useState([])
  useEffect(() => {
    setCollectionStatus({
      loading: true,
      success: false,
      error: ''
    })
    getCollectionListRequest()
      .then((res) => {
        setCollectionStatus({
          loading: false,
          success: true,
          error: ''
        })
        setCollections(res.data.result)
      })
      .catch((err: AxiosError) => {
        setCollectionStatus({
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
          key: 'collection',
          name: 'Collection'
        },
        {
          key: 'create',
          url: '/collection/list',
          name: 'List'
        }
      ]}
    >
      {collectionStatus.error && (
        <Alert message={collectionStatus.error} type="error" closable />
      )}
      <br />
      <div>
        {collectionStatus.loading ? (
          <Loading />
        ) : (
          <Table dataSource={collections} columns={columns} />
        )}
      </div>
    </PageLayout>
  )
}

export default CollectionListPage
