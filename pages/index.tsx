import React, { useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout/PageLayout'
import { Typography, Row, Col } from 'antd'
import { getUser } from '../helpers/auth.helper'
import { useRouter } from 'next/router'
import { IBasicAccountInfo } from '../types/account.type'
import Loading from '../components/Loading/Loading'
import { pageRoutes } from '../navigation/page-routes'
import ShortcutCard from '../components/ShortcutCard/ShortcutCard'
import { IShortcutForm } from '../types/shortcut.type'
import { RequestStatus } from '../helpers/request'
import {
  createShortcutRequest,
  getShortcutListRequest,
  deleteShortcutRequest
} from '../requests/shortcut.request'
import ShortcutList from '../components/ShortcutList/ShortcutList'

const HomePage = () => {
  const [user, setUser] = useState<IBasicAccountInfo | null>(null)
  const router = useRouter()
  useEffect(() => {
    const user = getUser() as IBasicAccountInfo
    if (user) {
      setUser(user)
    } else {
      router.push(pageRoutes.login)
    }
  }, [])

  return (
    <>
      <PageLayout
        breadCrumb={[
          {
            key: 'home-page',
            url: pageRoutes.home,
            name: 'Home'
          }
        ]}
      >
        {user ? (
          <div>
            <div>
              Welcome,
              <br />
              <Typography.Title level={3}>{user.username}</Typography.Title>
            </div>
          </div>
        ) : (
          <Loading />
        )}
        <br />
        <ShortcutList />
      </PageLayout>
    </>
  )
}

export default HomePage
