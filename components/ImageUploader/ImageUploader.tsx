import { message, Upload, Button, Row } from 'antd'
import { useState, useEffect } from 'react'
import { RequestStatus } from '../../helpers/request'
import { getToken } from '../../helpers/auth.helper'
import StorageImagesSelector from '../StorageImagesSelector/StorageImagesSelector'
import { IImageListEntry } from '../../types/storage.type'
import ImageViewer from '../ImageViewer/ImageViewer'
import {
  PlusCircleOutlined,
  LoadingOutlined,
  CloudTwoTone,
  CloudDownloadOutlined
} from '@ant-design/icons'

interface IProps {
  value: string
  onChange: any
}

const ImageUploader = (props: IProps) => {
  const { value, onChange } = props
  const [imageUrl, setImageUrl] = useState<string | null>(value || null)

  useEffect(() => {
    setImageUrl(value)
  }, [value])

  const [imageSelectorOpen, setImageSelectorOpen] = useState(false)

  /** Upload image */
  const uploadRequestStatus = new RequestStatus()
  const [uploadStatus, setUploadStatus] = useState(uploadRequestStatus.status)
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setUploadStatus(uploadRequestStatus.loading())
      return
    }
    if (info.file.status === 'done') {
      setUploadStatus(uploadRequestStatus.success())
      const url = info.file.response.result[1].mediaLink
      setImageUrl(url)
      onChange(url)
    }
  }

  const uploadButton = (
    <Button type="primary">
      {uploadStatus.loading ? <LoadingOutlined /> : <PlusCircleOutlined />}{' '}
      Upload Image
    </Button>
  )

  const apiToken = getToken()

  return (
    <>
      <div>
        <Upload
          accept="image/*"
          headers={{ Authentication: apiToken || '' }}
          name="mf_image_uploader"
          showUploadList={false}
          action="/api/storage/upload-image"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {uploadButton}
        </Upload>{' '}
        <Button onClick={() => setImageSelectorOpen(true)}>
          <CloudTwoTone /> Select From Library
        </Button>
      </div>

      <StorageImagesSelector
        open={imageSelectorOpen}
        onToggle={setImageSelectorOpen}
        onSelect={(v: IImageListEntry) => {
          setImageUrl(v.link)
          onChange(v.link)
        }}
      />
      {!!imageUrl && (
        <>
          <br />
          <div style={{ maxWidth: '500px' }}>
            <ImageViewer src={imageUrl || ''} />
          </div>
          <br />
          <Row>
            <Button type="default" style={{ marginRight: '5px' }}>
              <CloudDownloadOutlined />
              Download
            </Button>
            <Button
              type="danger"
              onClick={() => {
                setImageUrl(null)
                onChange(null)
              }}
            >
              Remove Image
            </Button>
          </Row>
        </>
      )}
    </>
  )
}
export default ImageUploader
