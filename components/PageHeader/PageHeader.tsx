import { Row, Col, Button, Typography } from 'antd'
import Link from 'next/link'

interface IProps {
  name: string
  sub?: string
  buttonLink?: string
  buttonWord?: string
  description?: string
}
const PageHeader = (props: IProps) => {
  const { name, sub, buttonLink, buttonWord, description } = props
  return (
    <Row type="flex" justify="space-between">
      <Col>
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
          <Typography.Text type="secondary">{description}</Typography.Text>
        )}
      </Col>
      {!!buttonLink && (
        <Col>
          <Link href={buttonLink}>
            <Button type="primary">{buttonWord}</Button>
          </Link>
        </Col>
      )}
    </Row>
  )
}

export default PageHeader
