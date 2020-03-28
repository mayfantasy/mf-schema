import React, { useState, useEffect } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { Alert, Button } from 'antd'
import Loading from '../../components/Loading/Loading'
import PageHeader from '../../components/PageHeader/PageHeader'
import router, { useRouter } from 'next/router'
import { ISchema } from '../../types/schema.type'
import {
  updateSchemaRequest,
  getSchemaByIdRequest
} from '../../requests/schema.request'
import { AxiosError } from 'axios'
import { RequestStatus } from '../../helpers/request'
import { pageRoutes } from '../../navigation/page-routes'

import dynamic from 'next/dynamic'
import Link from 'next/link'
const CodeEditor = dynamic({
  loader: () => import('../../components/CodeEditor/CodeEditor'),
  loading: () => <Loading />,
  ssr: false
})

const UpdateSchemaFromJsonPage = () => {
  const [error, setError] = useState('')
  const [currentSchemaJSON, setCurrentSchemaJSON] = useState<string>('')

  /**
   * ||========================
   * || Update schema
   */
  const updateSchemaReq = new RequestStatus()
  const [updateSchemaStatus, setUpdateSchemaStatus] = useState(
    updateSchemaReq.status
  )
  const updateSchema = () => {
    try {
      const schema = JSON.parse(currentSchemaJSON) as ISchema
      setUpdateSchemaStatus(updateSchemaReq.loading())
      // Update schema
      updateSchemaRequest({
        id: schema.id,
        name: schema.name,
        handle: schema.handle,
        description: schema.description,
        def: schema.def
      })
        .then((res) => {
          setUpdateSchemaStatus(updateSchemaReq.success())
        })
        .catch((err: AxiosError) => {
          setUpdateSchemaStatus(updateSchemaReq.error(err))
        })
    } catch (e) {
      setError(e.message)
    }
  }
  const handleSubmit = () => {
    updateSchema()
  }

  /**
   * ||=======================
   * || Get current schema
   */
  const getCurrentSchemaReq = new RequestStatus()
  const [getCurrentSchemaStatus, setGetCurrentSchemaStatus] = useState(
    getCurrentSchemaReq.status
  )
  const getCurrentSchema = (id: string) => {
    setGetCurrentSchemaStatus(getCurrentSchemaReq.loading())
    getSchemaByIdRequest(id as string)
      .then((res) => {
        setGetCurrentSchemaStatus(getCurrentSchemaReq.success())
        const data = res.data.result
        setCurrentSchemaJSON(JSON.stringify(data, null, ' '))
      })
      .catch((err) => {
        setGetCurrentSchemaStatus(getCurrentSchemaReq.error(err))
      })
  }

  const router = useRouter()
  useEffect(() => {
    const { id } = router.query
    if (id) {
      getCurrentSchema(id as string)
    }
  }, [])

  const layout = (content: React.ReactNode) => {
    return (
      <PageLayout
        breadCrumb={[
          {
            key: 'schema',
            url: pageRoutes.listSchemas,
            name: 'Schema'
          },
          {
            key: 'update-schema-from-json',
            url: pageRoutes.updateSchemaFromJson,
            name: 'Update From JSON'
          }
        ]}
      >
        {content}
      </PageLayout>
    )
  }

  if (!currentSchemaJSON) {
    return layout(
      getCurrentSchemaStatus.loading ? (
        <Loading />
      ) : getCurrentSchemaStatus.error ? (
        <Alert message={getCurrentSchemaStatus.error} type="error" closable />
      ) : (
        <Button onClick={() => getCurrentSchema(router.query.id as string)}>
          Load
        </Button>
      )
    )
  }

  return layout(
    <div style={{ width: '70%' }}>
      {updateSchemaStatus.error && (
        <Alert
          message={updateSchemaStatus.error}
          type="error"
          closable
          style={{ marginBottom: '5px' }}
        />
      )}
      {error && <Alert message="JSON is not valid." type="error" closable />}
      <br />
      <div>
        <PageHeader
          name="Update Schema from JSON"
          buttons={
            <>
              <Link href={`${pageRoutes.schemaDetail}?id=${router.query.id}`}>
                <Button type="default">View Schema</Button>
              </Link>
            </>
          }
        />
      </div>
      <br />
      <div>
        {updateSchemaStatus.loading ? (
          <Loading />
        ) : (
          <div style={{ width: '100%', maxWidth: '800px' }}>
            {updateSchemaStatus.success && (
              <>
                <Alert message="Schema updated successfully." type="success" />
                <br />
              </>
            )}
            <CodeEditor
              value={currentSchemaJSON}
              onChange={(value: string) => {
                setCurrentSchemaJSON(value)
              }}
            />
            <br />
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={!currentSchemaJSON.trim()}
            >
              Update
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UpdateSchemaFromJsonPage
