import { Row, Col, Button, Typography } from 'antd'
import Link from 'next/link'

interface IProps {
  name: string
  sub?: string
  button?: React.ReactNode
  buttonLink?: string
  buttonWord?: string
  description?: string
}
const PageHeader = (props: IProps) => {
  const { name, sub, buttonLink, buttonWord, description, button } = props
  return (
    <Row type="flex" justify="space-between">
      <Col span={18}>
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
      {!!buttonLink && (
        <Col span={5}>
          <Row type="flex" justify="end">
            <Link href={buttonLink}>
              <Button type="primary">{buttonWord}</Button>
            </Link>
          </Row>
        </Col>
      )}
      {button || null}
    </Row>
  )
}

export default PageHeader
