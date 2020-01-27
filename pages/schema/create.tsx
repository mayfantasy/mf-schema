import React, { useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { Form, Alert } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import Loading from '../../components/Loading/Loading'
import router from 'next/router'
import {
  ISchemaFieldDef,
  ISchemaFieldDefKeys,
  ICreateSchemaFormValues
} from '../../types/schema.type'
import { createSchemaRequest } from '../../requests/schema.request'
import { AxiosError } from 'axios'
import { RequestStatus } from '../../helpers/request'
import SchemaForm from '../../components/shema/Form'
import { pageRoutes } from '../../navigation/page-routes'

interface ICreateSchemaFormProps<V> {
  handleSubmit: (e: any) => void
  form: WrappedFormUtils<V>
}

const CreateSchemaForm = (
  props: ICreateSchemaFormProps<ICreateSchemaFormValues>
) => {
  const { form, handleSubmit } = props
  const { getFieldDecorator } = form

  /** Intialize empty _defKeys */
  getFieldDecorator('_defKeys', {
    initialValue: [] as ISchemaFieldDefKeys[]
  })

  return <SchemaForm form={form} handleSubmit={handleSubmit} />
}

interface IProps extends FormComponentProps<ICreateSchemaFormValues> {}

const CreateSchemaPage = (props: IProps) => {
  const schemaRequestStatus = new RequestStatus()
  const [schemaStatus, setSchemaStatus] = useState(schemaRequestStatus.status)
  const { form } = props

  const createSchema = (
    values: ICreateSchemaFormValues,
    defs: ISchemaFieldDef[]
  ) => {
    // Create schema
    setSchemaStatus(schemaRequestStatus.loading())
    createSchemaRequest({
      name: values.name,
      handle: values.handle,
      description: values.description,
      def: defs as ISchemaFieldDef[],
      collection_id: values.collection_id
    })
      .then((res) => {
        setSchemaStatus(schemaRequestStatus.success())

        router.push(pageRoutes.listSchemas)
      })
      .catch((err: AxiosError) => {
        setSchemaStatus(schemaRequestStatus.error(err))
      })
  }

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

        // Create schema
        createSchema(values, defs as ISchemaFieldDef[])
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
          key: 'create',
          url: pageRoutes.createSchema,
          name: 'Create'
        }
      ]}
    >
      {schemaStatus.error && (
        <Alert message={schemaStatus.error} type="error" closable />
      )}
      <br />
      <div style={{ height: '70%' }}>
        {schemaStatus.loading ? (
          <Loading />
        ) : schemaStatus.success ? (
          <div style={{ color: 'green' }}>Schema created successfully.</div>
        ) : (
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <CreateSchemaForm form={form} handleSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </PageLayout>
  )
}

const WrappedSchemaPage = Form.create({ name: 'create-schema' })(
  CreateSchemaPage
)

export default WrappedSchemaPage
