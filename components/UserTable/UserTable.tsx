import { Table, Button } from 'antd'
import { IUser } from '../../types/user.type'
import Link from 'next/link'
import Column from 'antd/lib/table/Column'
import { ColumnProps } from 'antd/lib/table'
import { pageRoutes } from '../../navigation/page-routes'

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
            <Link href={`${pageRoutes.userDetail}?id=${user.id}`}>
              <a>
                {user.first_name} {user.last_name}
              </a>
            </Link>
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
  return <Table dataSource={users} columns={columns} />
}
export default UserTable
