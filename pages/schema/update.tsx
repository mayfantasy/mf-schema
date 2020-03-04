import React, { useState, useEffect } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { Form, Button, Alert } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import Loading from '../../components/Loading/Loading'
import {
  ISchemaFieldDef,
  ISchemaFieldDefKeys,
  IUpdateSchemaPayload,
  ISchema,
  IUpdateSchemaFormValues
} from '../../types/schema.type'
import {
  updateSchemaRequest,
  getSchemaByIdRequest
} from '../../requests/schema.request'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { setInitialFormValues } from '../../helpers/schema/form'
import { RequestStatus } from '../../helpers/request'
import SchemaForm from '../../components/shema/Form'
import { pageRoutes } from '../../navigation/page-routes'

interface IUpdateSchemaFormProps<V> {
  handleSubmit: (e: any) => void
  form: WrappedFormUtils<V>
}

const UpdateSchemaForm = (
  props: IUpdateSchemaFormProps<IUpdateSchemaFormValues>
) => {
  const { form, handleSubmit } = props
  const [currentSchema, setCurrentSchema] = useState<ISchema | null>(null)

  const schemaRequestStatus = new RequestStatus()
  const [currentSchemaStatus, setCurrentSchemaStatus] = useState(
    schemaRequestStatus.status
  )
  const router = useRouter()

  /**
   *
   * @param id schema ID
   * Get current schema by ID
   */
  const getCurrentSchema = (id: string) => {
    setCurrentSchemaStatus(schemaRequestStatus.loading())
    getSchemaByIdRequest(id as string)
      .then((res) => {
        setCurrentSchemaStatus(schemaRequestStatus.success())
        const data = res.data.result
        setCurrentSchema(data)
        setInitialFormValues(form, data)
      })
      .catch((err) => {
        setCurrentSchemaStatus(schemaRequestStatus.error(err))
      })
  }

  /**
   * Get Current Schema when page loads
   */
  useEffect(() => {
    const { id } = router.query
    if (id) {
      getCurrentSchema(id as string)
    }
  }, [])

  /**
   * Handle loading, error and none-data states
   */
  if (currentSchemaStatus.loading) {
    return <Loading />
  }

  if (currentSchemaStatus.error) {
    return <Alert message={currentSchemaStatus.error} type="error" closable />
  }

  if (!currentSchema) {
    return (
      <Button onClick={() => getCurrentSchema(router.query.id as string)}>
        Load
      </Button>
    )
  }

  /**
   * Set initial Form values
   */
  if (currentSchema) {
    setInitialFormValues(form, currentSchema)
  }

  return (
    <SchemaForm
      form={form}
      currentSchema={currentSchema}
      handleSubmit={handleSubmit}
    />
  )
}

interface IProps extends FormComponentProps<IUpdateSchemaFormValues> {}

const UpdateSchemaPage = (props: IProps) => {
  const schemaRequestStatus = new RequestStatus()
  const [schemaStatus, setSchemaStatus] = useState(schemaRequestStatus.status)

  const { form } = props
  const router = useRouter()

  const updateSchema = (payload: IUpdateSchemaPayload) => {
    // Update schema
    setSchemaStatus(schemaRequestStatus.loading())
    updateSchemaRequest(payload)
      .then((res) => {
        setSchemaStatus(schemaRequestStatus.success())
      })
      .catch((err: AxiosError) => {
        setSchemaStatus(schemaRequestStatus.error(err))
      })
  }

  /**
   *
   * @param e
   * Handle schema update submission
   */
  const handleSubmit = (e: any) => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { _defKeys, _defValues } = values
        const defs = (_defKeys as ISchemaFieldDefKeys[]).map((def) => {
          const obj = {} as { [key: string]: any }

          Object.keys(def).forEach((key) => {
            obj[key] = _defValues[(def as any)[key]]
          })
          return obj
        })
        if (router.query.id) {
          updateSchema({
            id: router.query.id as string,
            ...(values.name ? { name: values.name.trim() } : {}),
            ...(values.handle ? { handle: values.handle.trim() } : {}),
            ...(values.description
              ? { description: values.description.trim() }
              : {}),
            def: defs.map((d) => ({
              ...d,
              key: d.key.trim(),
              name: d.name ? d.name.trim() : '',
              helper: d.helper ? d.helper.trim() : ''
            })) as ISchemaFieldDef[]
          })
        }
      }
    })
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
          key: 'update',
          url: pageRoutes.updateSchema,
          name: 'Update'
        }
      ]}
    >
      {schemaStatus.error && (
        <>
          <Alert message={schemaStatus.error} type="error" closable />
          <br />
        </>
      )}

      <div style={{ height: '70%' }}>
        {schemaStatus.loading ? (
          <Loading />
        ) : (
          <div style={{ width: '100%', maxWidth: '800px' }}>
            {schemaStatus.success && (
              <Alert
                message="Schema updated successfully."
                type="success"
                closable
              />
            )}
            <br />
            <UpdateSchemaForm form={form} handleSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </PageLayout>
  )
}

const WrappedSchemaPage = Form.create({ name: 'update-schema' })(
  UpdateSchemaPage
)

export default WrappedSchemaPage
