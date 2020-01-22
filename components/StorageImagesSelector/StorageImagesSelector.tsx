import { RequestStatus } from '../../helpers/request'
import { useState, useEffect } from 'react'
import { getAccountImagesRequest } from '../../requests/storage.request'
import './StorageImagesSelector.scss'
import { Row, Col, Icon, Button, Modal, Alert } from 'antd'
import Link from 'next/link'
import Loading from '../Loading/Loading'

interface IProps {
  onSelect: (img: string) => void
  open: boolean
  onToggle: (open: boolean) => void
}

const StorageImagesSelector = (props: IProps) => {
  const { onSelect, open, onToggle } = props

  // OnSelect
  const [activeImage, setActiveImage] = useState('')

  // Get account images
  const req = new RequestStatus()
  const [status, setStatus] = useState(req.status)
  const [images, setImages] = useState<string[]>([])

  const getAccountImagegs = () => {
    setStatus(req.loading())
    getAccountImagesRequest()
      .then((res) => {
        const images = res.data.result
        setImages(images)
        setStatus(req.success())
      })
      .catch((err) => {
        setStatus(req.error(err))
      })
  }

  useEffect(() => {
    getAccountImagegs()
  }, [])

  const onOk = () => {
    onSelect(activeImage)
    setActiveImage('')
    onToggle(false)
    Modal.destroyAll()
  }

  const onCancel = () => {
    onToggle(false)
  }

  return (
    <>
      <Modal
        title="Select Image"
        visible={open}
        onOk={onOk}
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
          <Button
            disabled={!activeImage}
            key="submit"
            type="primary"
            onClick={onOk}
          >
            Ok
          </Button>
        ]}
        onCancel={onCancel}
      >
        {status.loading ? (
          <Loading />
        ) : status.error ? (
          <Alert type="error" message={status.error} />
        ) : (
          <div className="storage-images-selector">
            <Row type="flex" gutter={1}>
              {images.map((img) => {
                const isActive = activeImage === img
                return (
                  <Col span={4}>
                    <Row
                      className={`image-item__container ${
                        isActive ? 'active' : ''
                      }`}
                      type="flex"
                      justify="center"
                      align="middle"
                      onClick={() => {
                        if (isActive) {
                          setActiveImage('')
                        } else {
                          setActiveImage(img)
                        }
                      }}
                    >
                      <div className="image-item__wrapper">
                        <img className="image-item" src={img} />
                        {isActive && (
                          <Icon
                            className="selected-icon"
                            type="check-circle"
                            theme="twoTone"
                          />
                        )}
                      </div>
                    </Row>
                  </Col>
                )
              })}
            </Row>
          </div>
        )}
      </Modal>
    </>
  )
}

export default StorageImagesSelector
