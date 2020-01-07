import PageHeader from '../../components/PageHeader/PageHeader'
import { RequestStatus } from '../../helpers/request'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  IUserWithoutPassword,
  IUserSchemaMetaItem
} from '../../types/user.type'
import { getUserByIdRequest } from '../../requests/user.request'
import PageLayout from '../../components/PageLayout/PageLayout'
import { Alert, Button, Descriptions } from 'antd'
import Loading from '../../components/Loading/Loading'
import FormFieldLabel from '../../components/FormFieldLabel/FormFieldLabel'
import UserSchemaMeta from '../../components/UserSchemaMeta/UserSchemaMeta'

const UserDetailPage = () => {
  /** User Request */
  const userRequestStatus = new RequestStatus()
  const [userStatus, setUserStatus] = useState(userRequestStatus.status)
  const [user, setUser] = useState<IUserWithoutPassword | null>(null)
  const router = useRouter()

  const getUser = (id: string) => {
    setUserStatus(userRequestStatus.setLoadingStatus())
    getUserByIdRequest(id)
      .then((res) => {
        setUserStatus(userRequestStatus.setSuccessStatus())
        setUser(res.data.result)
      })
      .catch((err) => {
        setUserStatus(userRequestStatus.setErrorStatus(err))
      })
  }

  useEffect(() => {
    const id = router.query.id
    if (id) {
      getUser(id as string)
    }
  }, [])

  /**
   * Set content
   */
  let content = <></>
  const layout = (c: React.ReactNode) => (
    <PageLayout
      breadCrumb={[
        {
          key: 'user',
          url: '/user/list',
          name: 'User'
        },
        {
          key: 'detail',
          name: 'Detail'
        }
      ]}
    >
      <div>{c}</div>
    </PageLayout>
  )

  if (userStatus.error) {
    content = <Alert message={userStatus.error} type="error" closable />
    return layout(content)
  }

  if (userStatus.loading) {
    content = <Loading />
    return layout(content)
  }

  /**
   * If schema is not found, show load schema button
   */
  if (!user) {
    content = (
      <Button onClick={() => getUser(router.query.id as string)}>Load</Button>
    )
    return layout(content)
  } else {
    const userWithoutMeta = { ...user }
    delete userWithoutMeta.meta
    const meta = user.meta
    content = (
      <div>
        <PageHeader
          name={`${user.last_name} ${user.first_name}`}
          sub={`${user.email}, ${user.phone}`}
          buttonLink={`/user/update?id=${user.id}`}
          buttonWord="Update User"
        />
        <br />
        <br />
        <div>
          <Descriptions layout="vertical" bordered size="small">
            {Object.keys(userWithoutMeta).map((key: string) => {
              return (
                <Descriptions.Item
                  label={
                    <div>
                      <FormFieldLabel>{key}</FormFieldLabel>
                    </div>
                  }
                  key={key}
                >
                  {(user as any)[key]}
                </Descriptions.Item>
              )
            })}
          </Descriptions>
        </div>
        {
          <>
            <br />
            {meta &&
              Object.keys(meta).length &&
              Object.keys(meta).map((key: any) => {
                if (
                  meta[key].length &&
                  meta[key].every(
                    (o: any) => o.schema_handle && o.collection_handle && o.id
                  )
                ) {
                  const schemaHandle = meta[key][0].schema_handle
                  const collectionHandle = meta[key][0].collection_handle
                  const objectIds = meta[key].map(
                    (item: IUserSchemaMetaItem) => item.id
                  )
                  return (
                    <>
                      <UserSchemaMeta
                        key={key}
                        collectionHandle={collectionHandle}
                        schemaHandle={schemaHandle}
                        objectIds={objectIds}
                      />
                      <br />
                    </>
                  )
                } else {
                  return (
                    <>
                      <Descriptions layout="vertical" bordered size="small">
                        <Descriptions.Item
                          label={
                            <div>
                              <FormFieldLabel>{key}</FormFieldLabel>
                            </div>
                          }
                          key={key}
                        >
                          {JSON.stringify((meta as any)[key], null, ' ')}
                        </Descriptions.Item>
                      </Descriptions>
                      <br />
                    </>
                  )
                }
              })}
          </>
        }
      </div>
    )
    return layout(content)
  }
}
export default UserDetailPage
