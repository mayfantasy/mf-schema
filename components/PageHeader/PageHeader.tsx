import { Row, Col, Button, Typography } from 'antd'
import Link from 'next/link'

interface IProps {
  name: string
  sub?: string
  buttons?: React.ReactNode
  description?: string
}
const PageHeader = (props: IProps) => {
  const { name, sub, description, buttons } = props
  return (
    <Row type="flex" justify="space-between">
      <Col span={12}>
        <h2>
          <Typography.Text strong>{name}</Typography.Text>
          {!!sub && (
            <Typography.Text>
              &nbsp;&nbsp;
              <small>{sub}</small>
            </Typography.Text>
          )}
        </h2>
        {!!description && (
          <Typography.Text style={{ whiteSpace: 'pre' }} type="secondary">
            {description}
          </Typography.Text>
        )}
      </Col>
      <Col span={12}>
        <Row type="flex" justify="end" gutter={1}>
          {buttons}
        </Row>
      </Col>
    </Row>
  )
}

export default PageHeader
