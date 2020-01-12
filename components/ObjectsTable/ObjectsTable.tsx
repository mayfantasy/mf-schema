import { Icon, Table } from 'antd'
import Link from 'next/link'
import { ISchema } from '../../types/schema.type'
import { useState } from 'react'
import { getObjectListRequest } from '../../requests/object.request'
import { IObject } from '../../types/object.type'
import { pageRoutes } from '../../navigation/page-routes'

interface IProps {
  currentSchema: ISchema
  objectList: IObject[]
}

const ObjectsTable = (props: IProps) => {
  const { currentSchema, objectList } = props

  /**
   * Retrieve fields that tag as show in list
   */
  const getShownFields = () => {
    if (currentSchema.def) {
      return currentSchema.def
        .filter((field) => field.show)
        .map((field) => field.key)
    }
    return []
  }
  return (
    <Table
      dataSource={objectList}
      columns={[
        {
          title: 'Handle',
          dataIndex: '_handle',
          key: '_handle',
          render: (handle: string, row: any) => (
            <Link
              href={`${pageRoutes.updateObject}?id=${row.id}&schema_handle=${currentSchema.handle}&collection_handle=${currentSchema.collection.handle}`}
            >
              {handle}
            </Link>
          )
        },
        ...getShownFields().map((f) => ({
          title: f,
          dataIndex: f,
          key: f,
          render: (value: any) => {
            return typeof value === 'boolean' ? (
              value ? (
                <Icon
                  type="check-circle"
                  theme="twoTone"
                  twoToneColor="#52c41a"
                />
              ) : (
                <Icon
                  type="close-circle"
                  theme="twoTone"
                  twoToneColor="#eb2f96"
                />
              )
            ) : (
              value
            )
          }
        }))
      ]}
    />
  )
}
export default ObjectsTable
