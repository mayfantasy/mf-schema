import { RequestStatus } from '../../helpers/request'
import { useState, useEffect } from 'react'
import { ICollection } from '../../types/collection.type'
import { useRouter } from 'next/router'
import PageLayout from '../../components/PageLayout/PageLayout'
import Loading from '../../components/Loading/Loading'
import { Alert, Button, Descriptions } from 'antd'
import PageHeader from '../../components/PageHeader/PageHeader'
import { getCollectionByIdRequest } from '../../requests/collection.request'
import FormFieldLabel from '../../components/FormFieldLabel/FormFieldLabel'
import { pageRoutes } from '../../navigation/page-routes'

const CollectionDetailPage = () => {
  /** Router */
  const router = useRouter()

  /** Get Collection Detail */
  const collectionRequestStatus = new RequestStatus()
  const [collectionStatus, setCollectionStatus] = useState(
    collectionRequestStatus.status
  )
  const [collection, setCollection] = useState<ICollection | null>(null)

  const getCollectionDetail = (id: string) => {
    setCollectionStatus(collectionRequestStatus.loading())
    getCollectionByIdRequest(id)
      .then((res) => {
        setCollectionStatus(collectionRequestStatus.success())
        setCollection(res.data.result)
      })
      .catch((err) => {
        setCollectionStatus(collectionRequestStatus.error(err))
      })
  }

  useEffect(() => {
    if (router && router.query && router.query.id) {
      const id = router.query.id as string
      getCollectionDetail(id)
    }
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
          url: pageRoutes.createCollection,
          name: 'List'
        },
        {
          key: 'detail',
          url: `${pageRoutes.collectionDetail}?id=${router.query.id}`,
          name: 'Detail'
        }
      ]}
    >
      {collectionStatus.loading ? (
        <Loading />
      ) : collectionStatus.error ? (
        <Alert type="error" message={collectionStatus.error} />
      ) : collection ? (
        <>
          <PageHeader
            name={collection.name}
            sub={collection.handle}
            buttonLink={`${pageRoutes.updateCollection}?id=${collection.id}`}
            buttonWord="Update Collection"
          />
          <br />
          <div>
            <Descriptions layout="vertical" bordered size="small">
              <Descriptions.Item
                label={
                  <div>
                    <FormFieldLabel>Description</FormFieldLabel>
                  </div>
                }
                key={collection.handle}
              >
                {collection.description}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </>
      ) : (
        <Button onClick={() => getCollectionDetail(router.query.id as string)}>
          Load
        </Button>
      )}
    </PageLayout>
  )
}
export default CollectionDetailPage
