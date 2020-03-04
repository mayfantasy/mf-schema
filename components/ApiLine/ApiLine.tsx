import { EApiMethod } from '../../types/api.type'
import { Row } from 'antd'

interface IProps {
  method: EApiMethod
  description: string
  route: string
}

const ApiLine = (props: IProps) => {
  const { method, description, route } = props

  const GET_COLOR = { fg: '#72aff8', bg: '#edf3fa' }
  const POST_COLOR = { fg: '#70c995', bg: '#ecf6f1' }
  const PUT_COLOR = { fg: '#f0a44b', bg: '#faf2e8' }
  const DELETE_COLOR = { fg: '#e74f48', bg: '#f8e9e9' }

  return (
    <div>
      <style jsx>{`
        .api-line {
          padding: 5px 5px;
          border-radius: 3px;
          margin-bottom: 10px;
          .api-method {
            width: 80px;
            font-weight: bold;
            color: white;
            text-align: center;
            border-radius: 3px;
            padding: 5px 5px;
            margin-right: 10px;
          }
          .api-route {
            margin-right: 10px;
            font-size: 0.8rem;
          }
          .api-description {
            color: grey;
          }
          &.GET {
            border: 1px solid #72aff8;
            background-color: #edf3fa;
            .api-method {
              background-color: #72aff8;
            }
          }
          &.POST {
            border: 1px solid #70c995;
            background-color: #ecf6f1;
            .api-method {
              background-color: #70c995;
            }
          }
          &.PUT {
            border: 1px solid #f0a44b;
            background-color: #faf2e8;
            .api-method {
              background-color: #f0a44b;
            }
          }
          &.DELETE {
            border: 1px solid #e74f48;
            background-color: #f8e9e9;
            .api-method {
              background-color: #e74f48;
            }
          }
        }
      `}</style>
      <div className={`api-line ${method}`}>
        <Row type="flex" align="middle">
          <div className="api-method">{method}</div>
          <div>
            <code className="api-route">
              <strong>{route}</strong>
            </code>
            <div className="api-description">
              <small>{description}</small>
            </div>
          </div>
        </Row>
      </div>
    </div>
  )
}

export default ApiLine
