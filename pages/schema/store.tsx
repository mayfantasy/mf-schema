import PageLayout from '../../components/PageLayout/PageLayout'
import { pageRoutes } from '../../navigation/page-routes'
import { Row, Table, Button, Modal } from 'antd'
import PageHeader from '../../components/PageHeader/PageHeader'
import { emailSchema } from '../../schemas/email-template.schema'
import { productSchema } from '../../schemas/product-template.schema'
import { ColumnsType } from 'antd/lib/table'
import { IStoreSchema } from '../../types/schema.type'
import SchemaDefinitionCollapse from '../../components/SchemaDefinitionCollapse/SchemaDefinitionCollapse'
import { useState } from 'react'
import Loading from '../../components/Loading/Loading'
import dynamic from 'next/dynamic'
import { CopyOutlined } from '@ant-design/icons'
import Link from 'next/link'

const CodeEditor = dynamic({
  loader: () => import('../../components/CodeEditor/CodeEditor'),
  loading: () => <Loading />,
  ssr: false
})

const SchemaStorePage = () => {
  const [current, setCurrent] = useState<{
    name: string
    description: string | React.ReactNode
    schema: IStoreSchema
    type: 'definition' | 'json'
  } | null>(null)
  const [open, setOpen] = useState(false)
  /**
   * || ==============================================
   * || Columns
   */
  const columns: ColumnsType<IStoreSchema> = [
    {
      title: 'Name',
      key: 'name',
      render: (schema: IStoreSchema) => {
        return <b>{schema.name}</b>
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (schema: IStoreSchema) => {
        return (
          <div>
            <Button
              onClick={() => {
                setCurrent({
                  name: 'Definition',
                  description: '',
                  schema,
                  type: 'definition'
                })
                setOpen(true)
              }}
            >
              Definition
            </Button>
            &nbsp;
            <Button
              type="primary"
              onClick={() => {
                setCurrent({
                  name: 'JSON',
                  description: (
                    <div>
                      To create this schema, copy this JSON and phase to{' '}
                      <Link href={pageRoutes.createSchemaFromJson}>
                        <a>Create From JSON</a>
                      </Link>
                    </div>
                  ),
                  schema,
                  type: 'json'
                })
                setOpen(true)
              }}
            >
              JSON
            </Button>
          </div>
        )
      }
    }
  ]

  /**
   * || ==============================================
   * || Layout
   */
  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'schema',
          url: pageRoutes.listSchemas,
          name: 'Schema'
        },
        {
          key: 'store',
          url: pageRoutes.schemaStore,
          name: 'Store'
        }
      ]}
    >
      <PageHeader
        name="Schema Store"
        description="Some well designed schemas"
      />
      <br />
      <Table
        dataSource={[emailSchema, productSchema]}
        columns={columns}
        bordered
        size="small"
        pagination={false}
      />
      <br />

      {/* Definition Modal */}

      <Modal
        title={current ? current.name : ''}
        visible={open}
        closable={true}
        onOk={() => {
          setOpen(false)
          Modal.destroyAll()
        }}
        onCancel={() => {
          setOpen(false)
          Modal.destroyAll()
        }}
      >
        <div
          style={{
            height: '60vh',
            overflow: 'scroll'
          }}
        >
          {current && current.type === 'definition' && (
            <div>
              <SchemaDefinitionCollapse defs={current.schema.def} />
            </div>
          )}
          {current && current.type === 'json' && (
            <div>
              <div>{current.description}</div>
              <br />
              <CodeEditor
                style={{ height: '100%' }}
                value={JSON.stringify(current.schema, null, '   ')}
                readOnly={true}
                onChange={() => {}}
              />
            </div>
          )}
        </div>
      </Modal>
      {/* JSON Modal */}
    </PageLayout>
  )
}

export default SchemaStorePage
