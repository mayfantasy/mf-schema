import { Modal } from 'antd'
import { useState } from 'react'

interface IProps {
  src: string
  width?: string
  title?: string
}

const ImageViewer = (props: IProps) => {
  const { src, width, title } = props
  const [open, toggle] = useState(false)
  return (
    <>
      <img
        style={{
          width: width || '300px'
        }}
        src={src}
        onClick={() => toggle(true)}
      />
      <style jsx global>{`
        .image-viewer {
          width: 90% !important;
          max-width: 1000px;
        }
      `}</style>
      <Modal
        className="image-viewer"
        onCancel={() => {
          toggle(false)
          Modal.destroyAll()
        }}
        title={title || 'Image'}
        visible={open}
        footer={false}
      >
        <img src={src} style={{ width: '100%' }} />
      </Modal>
    </>
  )
}

export default ImageViewer
