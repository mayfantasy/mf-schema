import { CheckCircleTwoTone, CloseCircleOutlined } from '@ant-design/icons'
import { Row } from 'antd'

interface IProps {
  name: string
  value: any
}

const SchemaKeyField = (props: IProps) => {
  const { name, value } = props
  const renderValue = () => {
    switch (typeof value) {
      case 'string':
        return value || '--'
      case 'number':
        return value || 0
      case 'boolean':
        return value ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : (
          <CloseCircleOutlined twoToneColor="#eb2f96" />
        )
      default:
        return value || '--'
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>{name}:</div>
      <div style={{ backgroundColor: '#f3f4f5', padding: '2px 5px' }}>
        <b>{renderValue()}</b>
      </div>
    </div>
  )
}

export default SchemaKeyField
