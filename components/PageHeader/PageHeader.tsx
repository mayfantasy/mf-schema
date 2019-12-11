import { Row, Col, Button } from 'antd'
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
          <b>{name}</b>
          {!!sub && (
            <span>
              &nbsp;&nbsp;
              <small>{sub}</small>
            </span>
          )}
        </h2>
        {!!description && <p>{description}</p>}
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
