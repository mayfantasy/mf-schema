import React, { useEffect, useState } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import Link from 'next/link'
import {
  getToken,
  removeToken,
  removeUser,
  getTier
} from '../../helpers/auth.helper'
import { loginWithTokenRequest } from '../../requests/auth.request'
import { useRouter } from 'next/router'
import { IBasicAccountInfo } from '../../types/account.type'
import { INavItem } from '../../types/navigation.type'
import { sideNavItems } from '../../navigation/side.navigation'
import { headerItems } from '../../navigation/header.navigation'
import { pageRoutes } from '../../navigation/page-routes'
import 'antd/dist/antd.less'

interface IProps {
  children: React.ReactNode
  breadCrumb: INavItem[]
}

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

const PageLayout = (props: IProps) => {
  const { children, breadCrumb } = props
  const [user, setUser] = useState<IBasicAccountInfo | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (window) {
      const token = getToken()
      if (token) {
        if (
          router.pathname !== pageRoutes.register &&
          router.pathname !== pageRoutes.login
        ) {
          loginWithTokenRequest({ token })
            .then((res) => {
              const user = res.data.result.account
              setUser(user)
            })
            .catch((e) => {
              removeToken()
              removeUser()
              if (router.pathname !== pageRoutes.register) {
                router.push(pageRoutes.login)
              }
            })
        } else {
          removeToken()
          removeUser()
        }
      }
    } else {
      console.log('Window not found.')
    }
  }, [])
  const logOut = () => {
    removeToken()
    removeUser()
    window.location.href = pageRoutes.login
  }
  const getDefaultSelectedKeys = () => {
    if (router) {
      const foundNavItem = sideNavItems.find((s) => {
        return s.children && s.children.length
          ? s.children.some((c) => c.url === router.pathname)
          : s.url === router.pathname
      })
      if (foundNavItem) {
        if (foundNavItem.children) {
          const foundChild = foundNavItem.children.find(
            (c) => c.url === router.pathname
          )
          if (foundChild) {
            return [foundChild.key]
          }
          return []
        }
        return [foundNavItem.key]
      }
      return []
    }
    return []
  }

  const $headerHeight = '64px'

  return (
    <>
      <style jsx global>{`
        body {
          // font-family: 'Rajdhani', sans-serif;
          font-family: 'Roboto', sans-serif;
          a {
            &:hover {
              text-decoration: underline;
            }
          }
        }
        .w-max-800 {
          width: 100%;
          max-width: 800px;
        }
        .shadow-1 {
          box-shadow: 0 7px 10px -5px;
        }
        .shadow-2 {
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
        }

        .mf-page-layout {
          .ant-layout {
            background-color: white;
          }
          .ant-select-item-option-selected {
            .ant-select-item-option-content {
              color: white;
            }
          }
          .ant-table tbody > tr.ant-table-row-selected > td {
            background-color: white;
          }
          li.ant-menu-item:first-child {
            margin-top: 0;
          }
          // .ant-menu-item-selected {
          //   & > a {
          //     color: white;
          //     &:hover {
          //       color: white;
          //     }
          //   }
          //   color: white;
          // }
          .ant-menu-item-selected > a {
            color: black;
          }
          .header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding-left: 20px;
            background-color: #fff;
            border-bottom: 1px solid #ccc;
            .logo {
              width: 170px;
              cursor: pointer;
              img {
                width: 100%;
              }
            }
          }
        }
      `}</style>
      <Layout className="mf-page-layout">
        <Header className="header">
          <div className="logo">
            <Link href="/">
              <a>
                <img src="/logo-monfent.png" />
              </a>
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
              style={{ lineHeight: $headerHeight }}
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
            style={{
              // background: '#000',
              height: 'auto'
            }}
            // theme="dark"
          >
            <Menu
              mode="inline"
              // theme="dark"
              style={{ height: '100%', borderRight: 0 }}
              defaultSelectedKeys={getDefaultSelectedKeys()}
              defaultOpenKeys={sideNavItems
                .filter((s) => s.open)
                .map((s) => s.key)}
            >
              {user
                ? sideNavItems
                    .filter((s) => (s.tier ? s.tier >= getTier() : true))
                    .map((s) =>
                      !!s.children && s.children.length ? (
                        <SubMenu key={s.key} title={<b>{s.name}</b>}>
                          {s.children
                            .filter((s) =>
                              s.tier ? s.tier >= getTier() : true
                            )
                            .map((c) => (
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
                      ) : (
                        <Menu.Item key={s.key}>
                          {s.url ? (
                            <Link href={s.url}>
                              <a>{s.name}</a>
                            </Link>
                          ) : (
                            <span>{s.name}</span>
                          )}
                        </Menu.Item>
                      )
                    )
                : []}
            </Menu>
          </Sider>
          <Layout
            style={{
              padding: '0 24px 24px',
              backgroundColor: '#f0f2f3'
              // backgroundImage: 'url("/leaves-pattern-1.png")',
              // backgroundRepeat: 'repeat'
            }}
          >
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
                backgroundColor:
                  router.pathname !== pageRoutes.register &&
                  router.pathname !== pageRoutes.login
                    ? 'white'
                    : 'transparent',
                padding: 24,
                margin: 0,
                minHeight: 280,
                height: `calc(100vh - ${$headerHeight} - 53px - 24px)`,
                overflow: 'scroll'
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  )
}

export default PageLayout
