import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { getCollectionListRequest } from '../../requests/collection.request'
import { AxiosError } from 'axios'
import Loading from '../../components/Loading/Loading'
import { Alert } from 'antd'

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
          <pre>{JSON.stringify(collections, null, '  ')}</pre>
        )}
      </div>
    </PageLayout>
  )
}

export default CollectionListPage
