import React, { useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout/PageLayout'
import { Typography, Row, Col } from 'antd'
import { getUser } from '../helpers/auth.helper'
import { useRouter } from 'next/router'
import { IBasicAccountInfo } from '../types/account.type'
import Loading from '../components/Loading/Loading'
import { pageRoutes } from '../navigation/page-routes'
import ShortcutCard from '../components/ShortcutCard/ShortcutCard'

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
        <Typography>Shortcuts</Typography>
        <div>
          <Row type="flex" gutter={1}>
            <ShortcutCard
              id="asdfasdfasdfasdf"
              title="Collections asdf afea fasefasefasdfa ceaefa sefasefaw"
              description="Collection List list here, and there, and here, and there, and so on, butt this is just a test"
              url={pageRoutes.listCollections}
            />
            <ShortcutCard isAdd={true} />
          </Row>
        </div>
      </PageLayout>
    </>
  )
}

export default HomePage
