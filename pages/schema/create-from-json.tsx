import React, { useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { Alert, Button } from 'antd'
import Loading from '../../components/Loading/Loading'
import PageHeader from '../../components/PageHeader/PageHeader'
import router from 'next/router'
import { ISchema } from '../../types/schema.type'
import { createSchemaRequest } from '../../requests/schema.request'
import { AxiosError } from 'axios'
import { RequestStatus } from '../../helpers/request'
import { pageRoutes } from '../../navigation/page-routes'

import dynamic from 'next/dynamic'
const CodeEditor = dynamic({
  loader: () => import('../../components/CodeEditor/CodeEditor'),
  loading: () => <Loading />,
  ssr: false
})

const CreateSchemaFromJsonPage = () => {
  const req = new RequestStatus()
  const [schemaStatus, setSchemaStatus] = useState(req.status)
  const [json, setJson] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    try {
      const schema = JSON.parse(json) as ISchema
      // Create schema
      createSchemaRequest({
        name: schema.name,
        handle: schema.handle,
        description: schema.description,
        def: schema.def,
        collection_id: schema.collection_id
      })
        .then((res) => {
          setSchemaStatus(req.success())
          router.push(pageRoutes.listSchemas)
        })
        .catch((err: AxiosError) => {
          setSchemaStatus(req.error(err))
        })
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'schema',
          url: pageRoutes.listSchemas,
          name: 'Schema'
        },
        {
          key: 'create-schema-from-json',
          url: pageRoutes.createSchemaFromJson,
          name: 'Create From JSON'
        }
      ]}
    >
      <div style={{ width: '70%' }}>
        {schemaStatus.error && (
          <Alert
            message={schemaStatus.error}
            type="error"
            closable
            style={{ marginBottom: '5px' }}
          />
        )}
        {error && <Alert message="JSON is not valid." type="error" closable />}
        <br />
        <div>
          <PageHeader
            name="Create Schema from JSON"
            description="If you are copying from other schema, you must change the schema_handle field."
          />
        </div>
        <br />
        <div>
          {schemaStatus.loading ? (
            <Loading />
          ) : schemaStatus.success ? (
            <div style={{ color: 'green' }}>Schema created successfully.</div>
          ) : (
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <CodeEditor
                value={json}
                onChange={(value: string) => {
                  setJson(value)
                }}
              />
              <br />
              <Button
                type="primary"
                onClick={handleSubmit}
                disabled={!json.trim()}
              >
                Create
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default CreateSchemaFromJsonPage
