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
    setUserStatus(userRequestStatus.setLoadingStatus())
    getUserListRequest()
      .then((res) => {
        setUserStatus(userRequestStatus.setSuccessStatus())
        setUsers(res.data.result)
      })
      .catch((err: AxiosError) => {
        setUserStatus(userRequestStatus.setErrorStatus(err))
      })
  }

  /**
   *
   * @param id
   * Delete Access Key
   */
  const deleteUser = (id: string) => {
    setDeleteUserStatus(deleteUserRequestStatus.setLoadingStatus())
    deleteUserRequest(id)
      .then((res) => {
        setDeleteUserStatus(deleteUserRequestStatus.setSuccessStatus())
        getUserList()
      })
      .catch((err: AxiosError) => {
        setDeleteUserStatus(deleteUserRequestStatus.setErrorStatus(err))
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
            <Link href={`/user/detail?id=${user.id}`}>
              <a>
                {user.first_name} {user.last_name}
              </a>
            </Link>
          </div>
        )
      }
    },
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
          url: '/user/list',
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
          <Table dataSource={users} columns={columns} />
        )}
      </div>
    </PageLayout>
  )
}

export default UserListPage
