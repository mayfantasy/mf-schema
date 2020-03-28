import { RequestStatus } from '../../helpers/request'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { IObject } from '../../types/object.type'
import { getUserListRequest } from '../../requests/user.request'
import { Collapse, Table, Alert, Typography } from 'antd'
import UserTable from '../UserTable/UserTable'
import { IUser } from '../../types/user.type'
import Loading from '../Loading/Loading'
import PageHeader from '../PageHeader/PageHeader'

interface IProps {
  currentObject: IObject
}
const ObjectUsers = (props: IProps) => {
  const { currentObject } = props

  /**
   * User List
   */
  const getUserListRequestStatus = new RequestStatus()
  const [userListStatus, setUserListStatus] = useState(
    getUserListRequestStatus.status
  )
  const [userList, setUserList] = useState<IUser[]>([])

  const getUserList = () => {
    setUserListStatus(getUserListRequestStatus.loading())
    if (currentObject) {
      getUserListRequest()
        .then((res) => {
          const schemaHandle = currentObject.schema.handle
          const collectionHandle = currentObject.schema.collection.handle
          const objectId = currentObject.id

          setUserListStatus(getUserListRequestStatus.success())
          const userListRes = res.data.result as IUser[]
          const filteredUserList = userListRes.filter(
            (user) =>
              user.meta &&
              Object.keys(user.meta).some(
                (metaKey) =>
                  user.meta &&
                  typeof user.meta[metaKey] === 'object' &&
                  user.meta[metaKey].length &&
                  user.meta[metaKey].some(
                    (item) =>
                      item.schema_handle === schemaHandle &&
                      item.collection_handle === collectionHandle &&
                      item.id === objectId
                  )
              )
          )
          setUserList(filteredUserList)
        })
        .catch((err) => {
          setUserListStatus(getUserListRequestStatus.error(err))
        })
    }
  }
  useEffect(() => {
    getUserList()
  }, [])

  return userListStatus.loading ? (
    <>
      <br />
      <Loading />
    </>
  ) : userListStatus.error ? (
    <Alert type="error" message={userListStatus.error} />
  ) : userList.length ? (
    <div>
      <br />
      <PageHeader name="Registered Users" />
      {userList.length ? (
        <UserTable users={userList} />
      ) : (
        <Typography.Text type="secondary">
          <small>
            <i>No users found.</i>
          </small>
        </Typography.Text>
      )}
    </div>
  ) : (
    <i>No registered users found.</i>
  )
}
export default ObjectUsers
