import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { AxiosError } from 'axios'
import Loading from '../../components/Loading/Loading'
import { Alert, Table, Button } from 'antd'
import { RequestStatus } from '../../helpers/request'
import {
  getUserListRequest,
  deleteUserRequest
} from '../../requests/user.request'
import { IUser } from '../../types/user.type'
import Link from 'next/link'
import UserTable from '../../components/UserTable/UserTable'
import { pageRoutes } from '../../navigation/page-routes'

const UserListPage = () => {
  const userRequestStatus = new RequestStatus()
  const [userStatus, setUserStatus] = useState(userRequestStatus.status)
  const deleteUserRequestStatus = new RequestStatus()
  const [deleteUserStatus, setDeleteUserStatus] = useState(
    userRequestStatus.status
  )
  const [users, setUsers] = useState([])

  /**
   * Get Access Key List
   */
  const getUserList = () => {
    setUserStatus(userRequestStatus.loading())
    getUserListRequest()
      .then((res) => {
        setUserStatus(userRequestStatus.success())
        setUsers(res.data.result)
      })
      .catch((err: AxiosError) => {
        setUserStatus(userRequestStatus.error(err))
      })
  }

  /**
   *
   * @param id
   * Delete Access Key
   */
  const deleteUser = (id: string) => {
    setDeleteUserStatus(deleteUserRequestStatus.loading())
    deleteUserRequest(id)
      .then((res) => {
        setDeleteUserStatus(deleteUserRequestStatus.success())
        getUserList()
      })
      .catch((err: AxiosError) => {
        setDeleteUserStatus(deleteUserRequestStatus.error(err))
      })
  }

  useEffect(() => {
    getUserList()
  }, [])

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (user: IUser) => {
        return (
          <div>
            <Link href={`${pageRoutes.userDetail}?id=${user.id}`}>
              <a>
                {user.first_name} {user.last_name}
              </a>
            </Link>
          </div>
        )
      }
    }
  ]

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'user',
          name: 'User'
        },
        {
          key: 'list',
          url: pageRoutes.listUsers,
          name: 'List'
        }
      ]}
    >
      {userStatus.error && (
        <Alert message={userStatus.error} type="error" closable />
      )}
      {deleteUserStatus.error && (
        <Alert message={deleteUserStatus.error} type="error" closable />
      )}
      <br />
      <div>
        {userStatus.loading || deleteUserStatus.loading ? (
          <Loading />
        ) : (
          <UserTable
            users={users}
            extraColumns={[
              {
                title: 'Actions',
                dataIndex: 'id',
                key: 'action',
                render: (id: string) => (
                  <div>
                    <Button
                      type="danger"
                      disabled={deleteUserStatus.loading || true}
                      onClick={() => deleteUser(id)}
                    >
                      Delete
                    </Button>
                  </div>
                )
              }
            ]}
          />
        )}
      </div>
    </PageLayout>
  )
}

export default UserListPage
