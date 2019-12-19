import { message, Upload, Icon, Button } from 'antd'
import { useState } from 'react'

interface IProps {
  value: string
  onChange: any
}

const ImageUploader = (props: IProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
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
      const url = info.file.response.result[1].mediaLink
      setImageUrl(url)
      console.log(url)
    }
  }

  const uploadButton = (
    <div>
      <Icon type={uploadStatus.loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  )

  return (
    <>
      <Upload
        accept="image/*"
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={true}
        action="/api/upload/image"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        Upload
      </Upload>
    </>
  )
}
export default ImageUploader
