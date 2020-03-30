import { Table, Button } from 'antd'
import { IUser } from '../../types/user.type'
import Link from 'next/link'
import Column from 'antd/lib/table/Column'
import { ColumnProps } from 'antd/lib/table'
import { pageRoutes } from '../../navigation/page-routes'
import { tierMap } from '../../helpers/tier.helper'
import TierLink from '../TierLink/TierLink'

interface IProps {
  users: IUser[]
  extraColumns?: ColumnProps<IUser>[]
}

const UserTable = (props: IProps) => {
  const { users, extraColumns } = props

  const columns: ColumnProps<IUser>[] = [
    {
      title: 'Name',
      key: 'name',
      render: (user: IUser) => {
        return (
          <div>
            <TierLink
              tier={tierMap.UPDATE_USER.tier}
              href={`${pageRoutes.updateUser}?id=${user.id}`}
            >
              {user.first_name} {user.last_name}
            </TierLink>
          </div>
        )
      }
    },
    {
      title: 'Username',
      key: 'username',
      dataIndex: 'username'
    },
    {
      title: 'Email',
      key: 'email',
      render: (user: IUser) => {
        return (
          <div>
            <a href={`mailto:${user.email}?Subject=Hello`}>{user.email}</a>
          </div>
        )
      }
    },
    {
      title: 'Phone',
      key: 'phone',
      dataIndex: 'phone'
    },

    ...(extraColumns ? extraColumns : [])
  ]
  return <Table pagination={false} dataSource={users} columns={columns} />
}
export default UserTable
