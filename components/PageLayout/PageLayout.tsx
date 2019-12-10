import React, { useEffect, useState } from 'react'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'
import 'antd/dist/antd.css'
import './PageLayout.scss'
import Link from 'next/link'
import { getToken, removeToken, removeUser } from '../../helpers/auth.helper'
import { loginWithTokenRequest } from '../../requests/auth.request'
import router from 'next/router'
import { IBasicAccountInfo } from '../../types/account.type'

interface INavItem {
  key: string
  url?: string
  name: string | React.ReactNode
  children?: INavItem[]
}

interface IProps {
  children: React.ReactNode
  breadCrumb: INavItem[]
}

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

const headerItems: INavItem[] = [
  {
    key: 'register',
    url: '/register',
    name: 'Register'
  },
  {
    key: 'login',
    url: '/login',
    name: 'Login'
  }
]

const sideNavItems: INavItem[] = [
  {
    key: 'collection',
    name: (
      <span>
        <Icon type="user" />
        Collection
      </span>
    ),
    children: [
      {
        key: 'create',
        url: '/collection/create',
        name: 'Create'
      },
      {
        key: 'list',
        url: '/collection/list',
        name: 'List'
      }
    ]
  },
  {
    key: 'schema',
    name: (
      <span>
        <Icon type="build" />
        Schema
      </span>
    ),
    children: [
      {
        key: 'create',
        url: '/schema/create',
        name: 'Create'
      },
      {
        key: 'list',
        url: '/schema/list',
        name: 'List'
      }
    ]
  }
]

const PageLayout = (props: IProps) => {
  const { children, breadCrumb } = props
  const [user, setUser] = useState<IBasicAccountInfo | null>(null)
  useEffect(() => {
    if (window) {
      const token = getToken()
      if (token) {
        loginWithTokenRequest({ token })
          .then((res) => {
            const user = res.data.result.account
            setUser(user)
          })
          .catch((e) => {
            removeToken()
            removeUser()
            if (router.pathname !== '/register') {
              router.push('/login')
            }
          })
      }
    } else {
      console.log('Window not found.')
    }
  }, [])
  const logOut = () => {
    removeToken()
    removeUser()
    window.location.href = '/login'
  }
  return (
    <Layout className="mf-page-layout">
      <Header className="header" style={{ background: '#fff' }}>
        <div className="logo">
          <Link href="/">
            <img src="/logo.color.500.png" />
          </Link>
        </div>
        {user ? (
          <div>
            @{user.username}{' '}
            <small>
              <a onClick={logOut}>Logout</a>
            </small>
          </div>
        ) : (
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            {headerItems.map((item) => (
              <Menu.Item key={item.key}>
                {item.url ? (
                  <Link href={item.url}>
                    <a>{item.name}</a>
                  </Link>
                ) : (
                  <span>{item.name}</span>
                )}
              </Menu.Item>
            ))}
          </Menu>
        )}
      </Header>
      <Layout>
        <Sider
          width={user ? 200 : 0}
          style={{ background: '#000', height: '100vh' }}
          theme="dark"
        >
          <Menu mode="inline" style={{ height: '100%', borderRight: 0 }}>
            {user
              ? sideNavItems.map((s) => (
                  <SubMenu key={s.key} title={s.name}>
                    {!!s.children &&
                      s.children.map((c) => (
                        <Menu.Item key={c.key}>
                          {c.url ? (
                            <Link href={c.url}>
                              <a>{c.name}</a>
                            </Link>
                          ) : (
                            <span>{c.name}</span>
                          )}
                        </Menu.Item>
                      ))}
                  </SubMenu>
                ))
              : []}
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          {!!breadCrumb && (
            <Breadcrumb style={{ margin: '16px 0' }}>
              {breadCrumb.map((b) => (
                <Breadcrumb.Item key={b.key}>
                  {b.url ? (
                    <Link href={b.url}>
                      <a>{b.name}</a>
                    </Link>
                  ) : (
                    <span>{b.name}</span>
                  )}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          )}

          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default PageLayout
