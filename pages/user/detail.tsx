import PageHeader from '../../components/PageHeader/PageHeader'
import { RequestStatus } from '../../helpers/request'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { IUserWithoutPassword } from '../../types/user.type'
import { getUserByIdRequest } from '../../requests/user.request'
import PageLayout from '../../components/PageLayout/PageLayout'
import { Alert, Button, Descriptions } from 'antd'
import Loading from '../../components/Loading/Loading'
import FormFieldLabel from '../../components/FormFieldLabel/FormFieldLabel'

const UserDetailPage = () => {
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
            {Object.keys(user).map((key: string) => {
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
      </div>
    )
    return layout(content)
  }
}
export default UserDetailPage
