import { message, Upload, Icon, Button, Row } from 'antd'
import { useState } from 'react'
import { RequestStatus } from '../../helpers/request'
import { getToken } from '../../helpers/auth.helper'
import StorageImagesSelector from '../StorageImagesSelector/StorageImagesSelector'
import { IImageListEntry } from '../../types/storage.type'
import ImageViewer from '../ImageViewer/ImageViewer'

interface IProps {
  value: string
  onChange: any
}

const ImageUploader = (props: IProps) => {
  const { value, onChange } = props
  const [imageUrl, setImageUrl] = useState<string | null>(value || null)

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
      <Icon type={uploadStatus.loading ? 'loading' : 'plus'} /> Upload Image
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
          <Icon type="cloud" theme="twoTone" twoToneColor="#00a854" /> Select
          From Library
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
          <Row type="flex">
            <Button type="default" style={{ marginRight: '5px' }}>
              <Icon type="cloud-download" />
              Download
            </Button>
            <Button type="danger" onClick={() => setImageUrl(null)}>
              Remove Image
            </Button>
          </Row>
        </>
      )}
    </>
  )
}
export default ImageUploader
