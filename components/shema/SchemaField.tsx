import {
  Row,
  Col,
  Collapse,
  Card,
  Button,
  Input,
  Form,
  Select,
  InputNumber,
  Checkbox
} from 'antd'
import {
  EditOutlined,
  CaretUpOutlined,
  CaretDownOutlined
} from '@ant-design/icons'
import { ISchemaFieldDef, ESchemaFieldType } from '../../types/schema.type'
import FormFieldLabel from '../FormFieldLabel/FormFieldLabel'
import SchemaKeyField from '../SchemaKeyField/SchemaKeyField'
import { enumToKeyArray } from '../../helpers/utils.helper'
import StringArray from '../StringArray/StringArray'
import ImageUploader from '../ImageUploader/ImageUploader'
import ImageViewer from '../ImageViewer/ImageViewer'
import { FormInstance } from 'antd/lib/form'

interface IProps {
  def: ISchemaFieldDef
  title?: string
  index: number
  editMode: boolean
  onConfirmEditDef: (index: number) => void
  onConfirmEditButtonText?: string
  onEditDef?: (key: string | null) => void
  onMoveUpItem?: (index: number) => void
  onMoveDownItem?: (index: number) => void
  removeField?: (index: number) => void
  schemaDefLength: number
  onOptionsChange: (value: string[]) => void
  onHelperImageChange: (image: string) => void
  form: FormInstance
}

const SchemaField = (props: IProps) => {
  const {
    def,
    index,
    editMode,
    onConfirmEditDef,
    onEditDef,
    removeField,
    schemaDefLength,
    onMoveUpItem,
    onMoveDownItem,
    onOptionsChange,
    onHelperImageChange,
    title,
    onConfirmEditButtonText,
    form
  } = props
  return (
    <Row key={def.key} style={{ marginBottom: '10px' }}>
      <Col span={24}>
        <Collapse defaultActiveKey={['1']}>
          <Collapse.Panel
            header={title || `Field Definition [${index + 1}]`}
            key="1"
          >
            <Card
              bordered={false}
              size="small"
              title={
                editMode && (
                  <Row>
                    <Form.Item shouldUpdate>
                      {() => {
                        return (
                          <Button
                            type="primary"
                            onClick={() => onConfirmEditDef(index)}
                            disabled={
                              form
                                ? !(
                                    form.getFieldValue('key') &&
                                    form.getFieldValue('type') &&
                                    form.getFieldValue('name')
                                  )
                                : false
                            }
                          >
                            {onConfirmEditButtonText || 'Confirm Edit'}
                          </Button>
                        )
                      }}
                    </Form.Item>
                    {onEditDef && (
                      <>
                        &nbsp;
                        <Button type="default" onClick={() => onEditDef(null)}>
                          Cancel Edit
                        </Button>
                      </>
                    )}

                    {removeField && (
                      <>
                        &nbsp;
                        <Button
                          type="danger"
                          onClick={() => removeField(index)}
                        >
                          Remove Field
                        </Button>
                      </>
                    )}
                  </Row>
                )
              }
              extra={
                schemaDefLength > 0 && onMoveUpItem && onMoveDownItem ? (
                  <>
                    {!editMode && onEditDef && (
                      <>
                        <EditOutlined onClick={() => onEditDef(def.key)} />
                        &nbsp;&nbsp;
                      </>
                    )}
                    <CaretUpOutlined
                      style={{
                        ...(index === 0 ? { color: '#ccc' } : {})
                      }}
                      onClick={() => {
                        if (index !== 0) {
                          onMoveUpItem(index)
                        }
                      }}
                    />
                    &nbsp;&nbsp;
                    <CaretDownOutlined
                      style={{
                        ...(index === schemaDefLength - 1
                          ? { color: '#ccc' }
                          : {})
                      }}
                      onClick={() => {
                        if (index !== schemaDefLength - 1) {
                          onMoveDownItem(index)
                        }
                      }}
                    />
                  </>
                ) : null
              }
              style={{ width: '100%' }}
            >
              <Row gutter={2} align="middle">
                {/* Key */}
                <Col span={12}>
                  {editMode ? (
                    <Form.Item
                      label={<FormFieldLabel>Key</FormFieldLabel>}
                      name="key"
                      required={true}
                      key="key"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: 'Key is required'
                        }
                      ]}
                    >
                      <Input placeholder="Key" />
                    </Form.Item>
                  ) : (
                    <SchemaKeyField name="Key" value={def.key} />
                  )}
                </Col>

                {/* Type */}
                <Col span={12}>
                  {editMode ? (
                    <Form.Item
                      label={<FormFieldLabel>Type</FormFieldLabel>}
                      name="type"
                      required={true}
                      key="type"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: 'Type is required'
                        }
                      ]}
                      validateTrigger={['onChange', 'onBlur']}
                    >
                      <Select placeholder="Select a type">
                        {enumToKeyArray(ESchemaFieldType).map((t) => (
                          <Select.Option value={t} key={t}>
                            {t}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    <SchemaKeyField name="Type" value={def.type} />
                  )}
                </Col>
              </Row>
              <br />
              <Row gutter={2} align="middle">
                {/* Name */}
                <Col span={24}>
                  {editMode ? (
                    <Form.Item
                      label={<FormFieldLabel>Name</FormFieldLabel>}
                      required={true}
                      key="name"
                      name="name"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: 'Name is required'
                        }
                      ]}
                      validateTrigger={['onChange', 'onBlur']}
                    >
                      <Input placeholder="Name" />
                    </Form.Item>
                  ) : (
                    <SchemaKeyField name="Name" value={def.name} />
                  )}
                </Col>
              </Row>
              <br />
              <Row gutter={2} align="middle">
                {/* Grid */}
                <Col span={6}>
                  {editMode ? (
                    <Form.Item
                      label={<FormFieldLabel>Grid</FormFieldLabel>}
                      key="grid"
                      name="grid"
                      rules={[
                        {
                          validator: (
                            rule: any,
                            value: number,
                            callback: any
                          ) => {
                            if (value > 24 || value < 1) {
                              callback(
                                'Please input a number between 1 and 24.'
                              )
                            } else {
                              callback()
                            }
                          }
                        }
                      ]}
                      validateTrigger={['onChange', 'onBlur']}
                    >
                      <InputNumber placeholder="Grid" min={1} max={24} />
                    </Form.Item>
                  ) : (
                    <SchemaKeyField name="Grid" value={def.grid} />
                  )}
                </Col>
                {/* Order */}
                <Col span={6}>
                  {editMode ? (
                    <Form.Item
                      label={<FormFieldLabel>Order</FormFieldLabel>}
                      key="order"
                      name="order"
                      validateTrigger={['onChange', 'onBlur']}
                    >
                      <InputNumber placeholder="Order" />
                    </Form.Item>
                  ) : (
                    <SchemaKeyField name="Order" value={def.order} />
                  )}
                </Col>

                {/* New Line */}
                <Col span={6}>
                  {editMode ? (
                    <Form.Item
                      label={<FormFieldLabel>New Line ?</FormFieldLabel>}
                      key="new_line"
                      name="new_line"
                      valuePropName="checked"
                    >
                      <Checkbox />
                    </Form.Item>
                  ) : (
                    <SchemaKeyField name="New Line ?" value={def.new_line} />
                  )}
                </Col>

                {/* Show on list */}
                <Col span={6}>
                  {editMode ? (
                    <Form.Item
                      label={<FormFieldLabel>Show in List ?</FormFieldLabel>}
                      key="show"
                      name="show"
                      valuePropName="checked"
                    >
                      <Checkbox />
                    </Form.Item>
                  ) : (
                    <SchemaKeyField name="Show in Table ?" value={def.show} />
                  )}
                </Col>
              </Row>
              <br />
              {/* Options */}
              {editMode ? (
                <Form.Item shouldUpdate noStyle>
                  {() => {
                    const enabled =
                      form.getFieldValue('type') ===
                        ESchemaFieldType.string_single_select ||
                      form.getFieldValue('type') ===
                        ESchemaFieldType.string_multi_select

                    return enabled ? (
                      <Row>
                        <Col span={24}>
                          <Form.Item
                            label={<FormFieldLabel>Options</FormFieldLabel>}
                            name="options"
                            shouldUpdate
                          >
                            <StringArray
                              disabled={
                                !(
                                  form.getFieldValue('type') ===
                                    ESchemaFieldType.string_single_select ||
                                  form.getFieldValue('type') ===
                                    ESchemaFieldType.string_multi_select
                                )
                              }
                              value={form.getFieldValue('options') || []}
                              onChange={(v) => onOptionsChange(v)}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    ) : null
                  }}
                </Form.Item>
              ) : (
                <SchemaKeyField
                  name="Options"
                  value={
                    <div>
                      {(def.options || []).map((o, i) => (
                        <div key={i} style={{ marginBottom: '5px' }}>
                          [{i + 1}] {o}
                        </div>
                      ))}
                    </div>
                  }
                />
              )}

              <br />

              <Row>
                {/* Helper Text */}
                <Col span={24}>
                  {editMode ? (
                    <Form.Item
                      label={<FormFieldLabel>Helper Text</FormFieldLabel>}
                      key="helper"
                      name="helper"
                    >
                      <Input.TextArea autoSize={{ minRows: 8 }} />
                    </Form.Item>
                  ) : (
                    <SchemaKeyField name="Helper" value={def.helper} />
                  )}
                </Col>
              </Row>
              <br />
              <Row>
                {/* Helper Image */}
                <Col span={24}>
                  {editMode ? (
                    <Form.Item
                      label={<FormFieldLabel>Helper Image</FormFieldLabel>}
                      key="helper_image"
                      name="helper_image"
                    >
                      <ImageUploader
                        value={def.helper_image || ''}
                        onChange={(image: string) => onHelperImageChange(image)}
                      />
                    </Form.Item>
                  ) : (
                    <SchemaKeyField
                      name="Helper Image"
                      value={
                        def.helper_image ? (
                          <ImageViewer src={def.helper_image} />
                        ) : null
                      }
                    />
                  )}
                </Col>
              </Row>
            </Card>
          </Collapse.Panel>
        </Collapse>
      </Col>
    </Row>
  )
}

export default SchemaField
