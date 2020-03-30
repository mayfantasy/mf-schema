import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { getCollectionListRequest } from '../../requests/collection.request'
import { AxiosError } from 'axios'
import Loading from '../../components/Loading/Loading'
import { Alert, Table, Row, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { ICollection } from '../../types/collection.type'
import Link from 'next/link'
import { RequestStatus } from '../../helpers/request'
import { pageRoutes } from '../../navigation/page-routes'
import { PlusCircleOutlined } from '@ant-design/icons'
import PageHeader from '../../components/PageHeader/PageHeader'
import TierLink from '../../components/TierLink/TierLink'
import { tierMap } from '../../helpers/tier.helper'
import TierWrapper from '../../components/TierButton/TierButton'

const columns: ColumnProps<ICollection>[] = [
  {
    title: 'Handle',
    key: 'handle',
    render: (collection: ICollection) => {
      return (
        <div>
          <TierLink
            tier={tierMap.GET_COLLECTION_BY_ID.tier}
            href={`${pageRoutes.collectionDetail}?id=${collection.id}`}
          >
            {collection.name}
          </TierLink>
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
  /** Get Collection List */
  const collectionRequestStatus = new RequestStatus()
  const [collectionStatus, setCollectionStatus] = useState(
    collectionRequestStatus.loading()
  )
  const [collections, setCollections] = useState([])

  useEffect(() => {
    setCollectionStatus(collectionRequestStatus.loading())
    getCollectionListRequest()
      .then((res) => {
        setCollectionStatus(collectionRequestStatus.success())
        setCollections(res.data.result)
      })
      .catch((err: AxiosError) => {
        setCollectionStatus(collectionRequestStatus.error(err))
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
          key: 'list',
          url: pageRoutes.listCollections,
          name: 'List'
        }
      ]}
    >
      <PageHeader
        name="Collections"
        buttons={
          <TierWrapper tier={tierMap.CREATE_COLLECTION.tier}>
            <Link href={pageRoutes.createCollection}>
              <Button type="primary">
                <PlusCircleOutlined /> Add Collection
              </Button>
            </Link>
          </TierWrapper>
        }
      />
      {collectionStatus.error && (
        <Alert message={collectionStatus.error} type="error" closable />
      )}

      <br />
      <div>
        {collectionStatus.loading ? (
          <Loading />
        ) : (
          <Table
            pagination={false}
            dataSource={collections}
            columns={columns}
          />
        )}
      </div>
    </PageLayout>
  )
}

export default CollectionListPage
