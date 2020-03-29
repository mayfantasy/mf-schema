import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { AxiosError } from 'axios'
import Loading from '../../components/Loading/Loading'
import { Alert, Table, Button, Row } from 'antd'
import { RequestStatus } from '../../helpers/request'
import {
  getMemberListRequest,
  deleteMemberRequest
} from '../../requests/member.request'
import { IMember } from '../../types/member.type'

import Link from 'next/link'
import { pageRoutes } from '../../navigation/page-routes'
import { memberTiers } from '../../helpers/member.helper'
import { IKeyValue } from '../../types/utils.type'
import {
  CheckCircleTwoTone,
  CloseCircleOutlined,
  CheckCircleOutlined,
  CiCircleFilled,
  PlusCircleFilled,
  PlusCircleOutlined
} from '@ant-design/icons'
import PageHeader from '../../components/PageHeader/PageHeader'

const MemberListPage = () => {
  const createMemberReq = new RequestStatus()
  const [createMemberStatus, setCreateMemberStatus] = useState(
    createMemberReq.status
  )

  const [members, setMembers] = useState([])

  /**
   * Get Access Key List
   */
  const getMemberList = () => {
    setCreateMemberStatus(createMemberReq.loading())
    getMemberListRequest()
      .then((res) => {
        setCreateMemberStatus(createMemberReq.success())
        setMembers(res.data.result)
      })
      .catch((err: AxiosError) => {
        setCreateMemberStatus(createMemberReq.error(err))
      })
  }

  useEffect(() => {
    getMemberList()
  }, [])

  const columns = [
    {
      title: 'Username',
      key: 'username',
      render: (member: IMember) => {
        return (
          <div>
            <Link href={`${pageRoutes.updateMember}?id=${member.id}`}>
              <a>{member.username}</a>
            </Link>
          </div>
        )
      }
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email'
    },
    {
      title: 'Role',
      key: 'role',
      render: (member: IMember) => (
        <span>{(memberTiers as IKeyValue)[member.tier].name}</span>
      )
    },
    {
      title: 'Active',
      key: 'status',
      render: (member: IMember) =>
        member.active ? (
          <CheckCircleOutlined style={{ color: 'green' }} />
        ) : (
          <CloseCircleOutlined style={{ color: 'red' }} />
        )
    }

    // {
    //   title: 'Actions',
    //   render: (member: IMember) => {
    //     return (
    //       <div>
    //         <Link href={`${pageRoutes.updateMember}?id=${member.id}`}>
    //           <Button type="primary">Update</Button>
    //         </Link>
    //       </div>
    //     )
    //   }
    // }
  ]

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'member',
          name: 'Member'
        },
        {
          key: 'list',
          url: pageRoutes.listMembers,
          name: 'List'
        }
      ]}
    >
      {createMemberStatus.error && (
        <Alert message={createMemberStatus.error} type="error" closable />
      )}

      <Row justify="end"></Row>
      <PageHeader
        name="Team Members"
        buttons={
          <Link href={pageRoutes.createMember}>
            <Button type="primary">
              <PlusCircleOutlined /> Add Team Member
            </Button>
          </Link>
        }
      />
      <br />
      <div>
        {createMemberStatus.loading ? (
          <Loading />
        ) : (
          <Table dataSource={members} columns={columns} />
        )}
      </div>
    </PageLayout>
  )
}

export default MemberListPage
