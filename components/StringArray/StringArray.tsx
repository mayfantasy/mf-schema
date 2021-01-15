import { useState } from 'react'
import { Input, Button, Row, Col } from 'antd'

interface IProps {
  value: string[]
  onChange: (value: string[]) => any
  disabled?: boolean
}
const StringArray = (props: IProps) => {
  const { value, onChange, disabled } = props
  const [array, setArray] = useState<string[]>(value || [])
  const [newValue, setNewValue] = useState('')

  const obmitValue = (v: string[]) => {
    setArray(v)
    onChange(v)
  }

  const onAddNewValue = () => {
    obmitValue([...array, newValue])
    setNewValue('')
  }

  const onItemChange = (v: string, i: number) => {
    const newArray = [
      ...array.slice(0, i),
      v,
      ...array.slice(i + 1, array.length)
    ]
    obmitValue(newArray)
  }

  const onRemoveItem = (i: number) => {
    const newArray = [...array.slice(0, i), ...array.slice(i + 1, array.length)]
    obmitValue(newArray)
  }
  return (
    <div>
      {array.map((item, index) => {
        return (
          <Row key={index} justify="space-between">
            <Col span={19}>
              <Input
                disabled={disabled}
                style={{ marginBottom: '10px' }}
                value={item}
                onChange={(e) => onItemChange(e.target.value, index)}
              />
            </Col>
            <Col span={4}>
              <Button onClick={() => onRemoveItem(index)} type="primary" danger>
                X
              </Button>
            </Col>
          </Row>
        )
      })}
      <br />
      <Row justify="space-between">
        <Col span={19}>
          <Input
            disabled={disabled}
            placeholder="Add new item"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
        </Col>
        <Col span={4}>
          <Button
            disabled={!newValue || disabled}
            type="primary"
            onClick={onAddNewValue}
          >
            Add
          </Button>
        </Col>
      </Row>
    </div>
  )
}
export default StringArray
