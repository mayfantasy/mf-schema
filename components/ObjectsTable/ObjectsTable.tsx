import { Table, Button, Badge } from 'antd'
import Link from 'next/link'
import { ISchema } from '../../types/schema.type'
import { useState } from 'react'
import { getObjectListRequest } from '../../requests/object.request'
import { IObject } from '../../types/object.type'
import { pageRoutes } from '../../navigation/page-routes'
import { downloadXlsxFile } from '../../helpers/utils.helper'
import { IKeyValue } from '../../types/utils.type'
import { convertObjectsToXlsxData } from '../../helpers/object.helper'
import {
  DownloadOutlined,
  CheckCircleTwoTone,
  CloseCircleOutlined
} from '@ant-design/icons'

interface IProps {
  currentSchema: ISchema
  objectList: IObject[]
}

const ObjectsTable = (props: IProps) => {
  const { currentSchema, objectList } = props
  const [selectedRows, setSelectedRows] = useState([])

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

  /**
   * Row Selection
   */
  const rowSelection = {
    onChange: (_: any, _selectedRows: any) => {
      setSelectedRows(_selectedRows)
    }
  }

  const onDownloadObjects = () => {
    const data = convertObjectsToXlsxData(
      selectedRows,
      currentSchema.def.map((d) => d.key)
    )
    downloadXlsxFile(document, data, 'object-download')
  }
  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <Badge count={selectedRows.length}>
          <Button onClick={onDownloadObjects} disabled={!selectedRows.length}>
            <DownloadOutlined /> Download Selected
          </Button>
        </Badge>
      </div>
      <Table
        rowSelection={rowSelection}
        dataSource={objectList}
        pagination={false}
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
                  <CheckCircleTwoTone twoToneColor="#52c41a" />
                ) : (
                  <CloseCircleOutlined twoToneColor="#eb2f96" />
                )
              ) : typeof value === 'object' && value.length ? (
                <div>
                  {(value as string[]).map((v, i) => (
                    <div key={i}>
                      [{i + 1}] {v}
                    </div>
                  ))}
                </div>
              ) : f.includes('img_src') || f.includes('img-src') ? (
                <img style={{ width: '50px' }} src={value} />
              ) : (
                value
              )
            }
          }))
        ]}
      />
    </div>
  )
}
export default ObjectsTable
