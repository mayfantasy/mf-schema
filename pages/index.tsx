import React, { useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout/PageLayout'
import { Typography } from 'antd'
import { getUser } from '../helpers/auth.helper'
import { useRouter } from 'next/router'
import { IBasicAccountInfo } from '../types/account.type'
import Loading from '../components/Loading/Loading'
import { pageRoutes } from '../navigation/page-routes'

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
            <Typography.Text
              strong
              style={{ color: '#1890ff', fontSize: '20px' }}
            >
              {user.username}
            </Typography.Text>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </PageLayout>
  )
}

export default HomePage
