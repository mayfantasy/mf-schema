import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { AxiosError } from 'axios'
import Loading from '../../components/Loading/Loading'
import { Alert, Table, Button, Row, Tag } from 'antd'
import { RequestStatus } from '../../helpers/request'
import {
  getMemberListRequest,
  deleteMemberRequest
} from '../../requests/member.request'
import { IMember } from '../../types/member.type'

import Link from 'next/link'
import { pageRoutes } from '../../navigation/page-routes'
import { tiers, findTierNameByLevel } from '../../helpers/tier.helper'
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
        <span>{findTierNameByLevel(member.tier)}</span>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (member: IMember) =>
        member.active ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
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
          key: 'members',
          name: 'Members'
        },
        {
          key: 'list',
          name: 'List'
        }
      ]}
    >
      {createMemberStatus.error && (
        <>
          <Alert message={createMemberStatus.error} type="error" closable />
          <br />
        </>
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
          <Table
            className="shadow-2"
            size="small"
            bordered
            dataSource={members}
            columns={columns}
            pagination={false}
          />
        )}
      </div>
    </PageLayout>
  )
}

export default MemberListPage
