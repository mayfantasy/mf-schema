import ImageUploader from '../ImageUploader/ImageUploader'
import { Button, Row, Col } from 'antd'
import { useEffect } from 'react'
import {
  LeftCircleFilled,
  RightCircleFilled,
  PlusCircleFilled
} from '@ant-design/icons'

interface IProps {
  value: string[] | null
  onChange: (value: string[]) => void
}
const ImageArrayUploader = (props: IProps) => {
  const { value, onChange } = props

  /**
   * ||==================
   * || Actions
   */
  const onImageUploaderChange = (e: string, i: number) => {
    const newValue = [...(value || [])]
    newValue.splice(i, 1, e)
    onChange(newValue)
  }

  const onAddNewImage = () => {
    onChange([...(value || []), ''])
  }

  const onMoveToLeft = (i: number) => {
    const newValues = [...(value || [])]

    const l = newValues[i]
    const r = newValues[i - 1]

    newValues[i - 1] = l
    newValues[i] = r

    onChange(newValues)
  }

  const onMoveToRight = (i: number) => {
    const newValues = [...(value || [])]

    const l = newValues[i]
    const r = newValues[i + 1]

    newValues[i + 1] = l
    newValues[i] = r

    onChange(newValues)
  }

  const onRemoveImage = (i: number) => {
    const newValues = [...(value || [])]
    newValues.splice(i, 1)
    onChange(newValues)
  }

  /**
   * ||==================
   * || Render
   */
  return (
    <>
      <Row gutter={2}>
        {value &&
          !!value.length &&
          value.map((v, i) => (
            <Col
              key={i}
              xs={8}
              style={{
                marginBottom: '20px',
                padding: '8px'
              }}
            >
              <div
                style={{
                  border: '1px solid #e4e5e6',
                  borderRadius: '3px'
                }}
              >
                <div
                  style={{
                    padding: '8px'
                  }}
                >
                  <ImageUploader
                    value={v}
                    onChange={(e: string) => onImageUploaderChange(e, i)}
                  />
                </div>
                <Row
                  style={{
                    padding: '10px',
                    backgroundColor: 'white'
                  }}
                  justify="space-between"
                >
                  <Col>
                    <Button
                      type="link"
                      disabled={!i}
                      onClick={() => onMoveToLeft(i)}
                    >
                      <LeftCircleFilled /> Move to Left
                    </Button>
                    &nbsp;
                    <Button
                      type="link"
                      disabled={i === value.length - 1}
                      onClick={() => onMoveToRight(i)}
                    >
                      Move to Right <RightCircleFilled />
                    </Button>
                  </Col>
                  <Col>
                    <Button type="link" danger onClick={() => onRemoveImage(i)}>
                      Remove
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          ))}
        <div style={{ padding: '10px' }}>
          <Button onClick={onAddNewImage} type="primary">
            <PlusCircleFilled /> Add Image
          </Button>
        </div>
      </Row>
    </>
  )
}

export default ImageArrayUploader
