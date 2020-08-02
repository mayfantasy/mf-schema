import { Modal } from 'antd'
import { useState } from 'react'
import { isPdf } from '../../helpers/utils.helper'

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
      {!isPdf(src) ? (
        <img
          style={{
            width: width || '300px',
            maxWidth: '100%'
          }}
          src={src}
          onClick={() => toggle(true)}
        />
      ) : (
        <img src="/pdf_file_icon.png" style={{ width: '100px' }} />
      )}
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
        {!isPdf(src) ? (
          <img src={src} style={{ width: '100%' }} />
        ) : (
          <img src="/pdf_file_icon.png" style={{ width: '100px' }} />
        )}
      </Modal>
    </>
  )
}

export default ImageViewer
