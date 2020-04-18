import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { AxiosError } from 'axios'
import Loading from '../../components/Loading/Loading'
import { Alert, Table, Button, Row } from 'antd'
import { RequestStatus } from '../../helpers/request'
import {
  getUserListRequest,
  deleteUserRequest
} from '../../requests/user.request'
import { IUser } from '../../types/user.type'
import Link from 'next/link'
import UserTable from '../../components/UserTable/UserTable'
import { pageRoutes } from '../../navigation/page-routes'
import { PlusCircleOutlined } from '@ant-design/icons'
import PageHeader from '../../components/PageHeader/PageHeader'
import TierWrapper from '../../components/TierButton/TierButton'
import { tierMap } from '../../helpers/tier.helper'

const UserListPage = () => {
  const userRequestStatus = new RequestStatus()
  const [userStatus, setUserStatus] = useState(userRequestStatus.status)

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

  useEffect(() => {
    getUserList()
  }, [])

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'users',
          name: 'Users'
        }
      ]}
    >
      <PageHeader
        name="Users"
        buttons={
          <TierWrapper tier={tierMap.CREATE_USER.tier}>
            <Link href={pageRoutes.createUser}>
              <Button type="primary">
                <PlusCircleOutlined /> Add User
              </Button>
            </Link>
          </TierWrapper>
        }
      />
      {userStatus.error && (
        <Alert message={userStatus.error} type="error" closable />
      )}

      <br />
      <div>
        {userStatus.loading ? <Loading /> : <UserTable users={users} />}
      </div>
    </PageLayout>
  )
}

export default UserListPage
