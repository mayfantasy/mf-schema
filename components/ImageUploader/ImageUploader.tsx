import { message, Upload, Icon, Button } from 'antd'
import { useState } from 'react'

interface IProps {
  value: string
  onChange: any
}

const ImageUploader = (props: IProps) => {
  const { value, onChange } = props
  const [imageUrl, setImageUrl] = useState<string | null>(value || null)
  const [uploadStatus, setUploadStatus] = useState({
    loading: false,
    success: false,
    error: ''
  })
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
      setUploadStatus({
        loading: true,
        success: false,
        error: ''
      })
      return
    }
    if (info.file.status === 'done') {
      setUploadStatus({
        loading: false,
        success: true,
        error: ''
      })
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

  return (
    <>
      <div>
        <Upload
          accept="image/*"
          name="avatar"
          className="avatar-uploader"
          showUploadList={false}
          action="/api/upload/image"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {uploadButton}
        </Upload>
      </div>

      {!!imageUrl && (
        <>
          <br />
          <div style={{ maxWidth: '500px' }}>
            <img style={{ width: '100%' }} src={imageUrl || ''} />
          </div>
          <br />
          <div>
            <a href={imageUrl || ''}>{imageUrl}</a>
          </div>
          <br />
          <div>
            <Button type="danger" onClick={() => setImageUrl(null)}>
              Remove Image
            </Button>
          </div>
        </>
      )}
    </>
  )
}
export default ImageUploader
