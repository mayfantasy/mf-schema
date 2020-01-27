import { IApiMethod } from '../../types/api.type'
import { Row } from 'antd'

interface IProps {
  method: IApiMethod
  description: string
  route: string
}

const ApiLine = (props: IProps) => {
  const { method, description, route } = props
  const getColor = () => {
    let c: { fg: string; bg: string } = { fg: '', bg: '' }
    switch (method) {
      case 'GET':
        c = { fg: '#72aff8', bg: '#edf3fa' }
        break
      case 'POST':
        c = { fg: '#70c995', bg: '#ecf6f1' }
        break
      case 'PUT':
        c = { fg: '#f0a44b', bg: '#faf2e8' }
        break
      case 'DELETE':
        c = { fg: '#e74f48', bg: '#f8e9e9' }
        break
      default:
        const _c: never = method
        break
    }
    return c
  }
  return (
    <>
      <style jsx>{`
        .api-line {
          padding: 5px 5px;
          border: 1px solid ${getColor().fg};
          border-radius: 3px;
          margin-bottom: 10px;
          background-color: ${getColor().bg};
          .api-method {
            width: 80px;
            font-weight: bold;
            color: white;
            text-align: center;
            border-radius: 3px;
            background-color: ${getColor().fg};
            padding: 5px 5px;
            margin-right: 10px;
          }
          .api-route {
            margin-right: 10px;
          }
          .api-description {
            color: grey;
          }
        }
      `}</style>
      <div className="api-line">
        <Row type="flex" align="middle">
          <div className="api-method">{method}</div>
          <code className="api-route">
            <strong>{route}</strong>
          </code>
          <div className="api-description">
            <small>{description}</small>
          </div>
        </Row>
      </div>
    </>
  )
}

export default ApiLine
