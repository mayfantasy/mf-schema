import Dragger from 'antd/lib/upload/Dragger'
import { message, Button, Progress, Alert } from 'antd'
import { useState } from 'react'
import { getToken } from '../../helpers/auth.helper'
import { updateOrCreateByHandleRequest } from '../../requests/object.request'
import Loading from '../Loading/Loading'
import { ISchema } from '../../types/schema.type'
import { downloadXlsxFile } from '../../helpers/utils.helper'
import {
  DownloadOutlined,
  InboxOutlined,
  UploadOutlined
} from '@ant-design/icons'

interface IProps {
  collection_handle: string
  schema_handle: string
  schema: ISchema
}
const ImportObjectsBox = (props: IProps) => {
  const { collection_handle, schema_handle, schema } = props
  const [parseResult, setParseResult] = useState<any[]>([])
  const apiToken = getToken()

  /** Object Import */
  const initImportStatus = {
    loading: false,
    done: false,
    update: 0,
    create: 0
  }
  const [importErrors, setImportErrors] = useState<string[]>([])
  const [importStatus, setImportStatus] = useState(initImportStatus)

  const onImportProducts = async () => {
    let status = { ...importStatus }
    const errors = [...importErrors]
    setImportStatus({
      ...status,
      loading: true
    })
    for (let i = 0; i < parseResult.length; i++) {
      try {
        const res = await updateOrCreateByHandleRequest(
          collection_handle,
          schema_handle,
          parseResult[i]._handle,
          parseResult[i]
        )
        status = {
          ...status,
          update: status.update + (res.data.result.isUpdate ? 1 : 0),
          create: status.create + (res.data.result.isUpdate ? 0 : 1)
        }
      } catch (e) {
        errors.push(`${parseResult[i]._handle}: ${e.message}`)
      }
    }
    status = {
      ...status,
      loading: false,
      done: true
    }
    setImportStatus(status)
    setImportErrors(errors)
  }

  const onDownloadTemplate = () => {
    const keys = ['_handle', ...schema.def.map((d) => d.key).sort()]
    downloadXlsxFile(document, [keys], `${schema.handle}-template`)
  }
  return (
    <>
      <style jsx>{`
        .import-objects-box {
          margin: 15px 0;
        }
      `}</style>
      <div className="import-objects-box">
        <div style={{ marginBottom: '8px' }}>
          <Button onClick={onDownloadTemplate}>
            <DownloadOutlined /> Download Template
          </Button>
        </div>
        <Dragger
          {...{
            name: 'mf_xlsx_uploader',
            multiple: true,
            headers: { Authentication: apiToken || '' },
            accept:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            action: `/api/object/${collection_handle}/${schema_handle}/parse`,
            onChange(info) {
              const { status } = info.file
              if (status !== 'uploading') {
              }
              if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`)
                setParseResult(info.file.response.result)
                setImportStatus(initImportStatus)
                setImportErrors([])
              } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`)
              }
            }
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Dragger>
        {/* Parse and Import results */}
        {parseResult && !!parseResult.length && (
          <div>
            <br />
            <Alert
              style={{ marginBottom: '8px' }}
              message={
                <div>
                  <b>{parseResult.length}</b> objects parsed from this file.
                </div>
              }
            />
            {/* Import Results */}
            {importStatus.loading && <Loading />}
            {importStatus.done && (
              <div style={{ marginBottom: '8px' }}>
                <div>
                  <Alert
                    style={{ marginBottom: '8px' }}
                    type="success"
                    message={
                      <div>
                        <b>{importStatus.update}</b> updated,{' '}
                        <b>{importStatus.create}</b> created.
                      </div>
                    }
                  />
                  <div>Please reload the object list.</div>
                </div>

                {!!importErrors.length && (
                  <div>
                    {importErrors.map((e, i) => (
                      <Alert key={i} message={e} type="error" />
                    ))}
                  </div>
                )}
              </div>
            )}
            {!importStatus.done && (
              <div>
                <Button
                  type="primary"
                  onClick={async () => {
                    await onImportProducts()
                  }}
                  disabled={importStatus.loading}
                >
                  <UploadOutlined />{' '}
                  {importStatus.loading ? 'Importing...' : 'Import'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
export default ImportObjectsBox
