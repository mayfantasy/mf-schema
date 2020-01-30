import { RequestStatus } from '../../helpers/request'
import { useState, useEffect } from 'react'
import { getSchemaByHandleRequest } from '../../requests/schema.request'
import { getObjectListRequest } from '../../requests/object.request'
import Loading from '../Loading/Loading'
import { Alert, Descriptions } from 'antd'
import ObjectsTable from '../ObjectsTable/ObjectsTable'
import { ISchema } from '../../types/schema.type'
import FormFieldLabel from '../FormFieldLabel/FormFieldLabel'

interface IProps {
  schemaHandle: string
  collectionHandle: string
  objectIds: string[]
}

const UserSchemaMeta = (props: IProps) => {
  const { collectionHandle, schemaHandle, objectIds } = props

  const [objectList, setObjectList] = useState<any[]>([])
  const [currentSchema, setCurrentSchema] = useState<ISchema | null>(null)

  /** Object List Request */
  const objectRequestStatus = new RequestStatus()
  const [objectStatus, setObjectStatus] = useState(objectRequestStatus.status)

  const getObjectList = () => {
    setObjectStatus(objectRequestStatus.loading())
    getObjectListRequest(collectionHandle, schemaHandle)
      .then((res) => {
        setObjectStatus(objectRequestStatus.success())
        const objectList = res.data.result
        setObjectList(objectList)
      })
      .catch((err) => {
        setObjectStatus(objectRequestStatus.error(err))
      })
  }

  /** Current Schema Request */
  const schemaRequestStatus = new RequestStatus()
  const [schemaStatus, setSchemaStatus] = useState(schemaRequestStatus.status)

  const getCurrentSchema = () => {
    setSchemaStatus(schemaRequestStatus.loading())
    getSchemaByHandleRequest(schemaHandle)
      .then((res) => {
        setSchemaStatus(schemaRequestStatus.success())
        const currentSchema = res.data.result
        setCurrentSchema(currentSchema)
        getObjectList()
      })
      .catch((err) => {
        setSchemaStatus(schemaRequestStatus.error(err))
      })
  }

  useEffect(() => {
    if (collectionHandle && schemaHandle && objectIds) {
      getCurrentSchema()
    }
  }, [])

  const displayObjectList = objectList.filter((o) => objectIds.includes(o.id))

  return (
    <div>
      {schemaStatus.loading || objectStatus.loading ? (
        <Loading />
      ) : currentSchema && objectList ? (
        <Descriptions layout="vertical" bordered size="small">
          <Descriptions.Item
            label={
              <div>
                <FormFieldLabel>{schemaHandle}</FormFieldLabel>
              </div>
            }
          >
            <ObjectsTable
              currentSchema={currentSchema}
              objectList={displayObjectList}
            />
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Descriptions layout="vertical" bordered size="small">
          <Descriptions.Item
            label={
              <div>
                <FormFieldLabel>{schemaHandle}</FormFieldLabel>
              </div>
            }
          >
            {JSON.stringify(objectIds, null, ' ')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </div>
  )
}
export default UserSchemaMeta
