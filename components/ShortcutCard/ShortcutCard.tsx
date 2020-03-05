import Link from 'next/link'
import { Icon, Row, Modal, Input, Button } from 'antd'
import { useState } from 'react'

interface IProps {
  id?: string
  title?: string
  description?: string
  url?: string
  isAdd?: boolean
}

const ShortcutCard = (props: IProps) => {
  const { id, title, url, description, isAdd } = props
  const [modalOpen, setModalOpen] = useState(false)

  const [form, setForm] = useState({
    title: title || '',
    url: url || ''
  })
  const onChange = (n: string, v: string) => {
    setForm({
      ...form,
      [n]: v
    })
  }
  const createShortcut = () => {
    console.log('Create: ', form)
  }

  const deleteShortcut = () => {
    if (id) {
      console.log('Delete: ', id)
    }
  }
  return (
    <div>
      <style jsx>
        {`
          .shortcut--general {
            border: 1px solid green;
            padding: 8px;
            height: 200px;
            width: 200px;
            cursor: pointer;
            color: green;
            text-align: center;
          }
          .shortcut-card {
            margin-right: 15px;
            margin-bottom: 15px;
            .title {
              font-size: 1.1rem;
            }
            position: relative;
            .delete-button {
              display: none;
              position: absolute;
              bottom: 5px;
              left: 5px;
              color: red;
            }
            &:hover {
              .delete-button {
                display: initial;
              }
            }
          }
          .helper-text {
            margin-top: 3px;
            color: grey;
            font-size: 0.7rem;
          }
        `}
      </style>
      {!isAdd && title && url && description ? (
        <div className="shortcut-card shortcut--general">
          <Link href={url}>
            <a target="_blank">
              <Row
                style={{ width: '100%', height: '100%' }}
                type="flex"
                justify="center"
                align="middle"
              >
                <div className="title">{title}</div>
              </Row>
            </a>
          </Link>
          <div className="delete-button" onClick={deleteShortcut}>
            <Icon type="close" />
          </div>
        </div>
      ) : (
        <div className="shortcut--general" onClick={() => setModalOpen(true)}>
          <Row
            style={{ width: '100%', height: '100%' }}
            type="flex"
            justify="center"
            align="middle"
          >
            <Icon type="plus" style={{ fontSize: '2rem' }} />
          </Row>
        </div>
      )}
      <Modal
        title="Create Shortcut"
        onOk={() => createShortcut()}
        visible={modalOpen}
        closable={true}
        onCancel={() => {
          console.log('here', modalOpen)
          setModalOpen(false)
          console.log(false)
          Modal.destroyAll()
        }}
      >
        <div>
          <div>
            <h4>Title</h4>
            <Input
              value={form.title}
              onChange={(e) => onChange('title', e.target.value)}
            />
            <div className="helper-text">Exp: "Theme Settings"</div>
          </div>
          <br />
          <div>
            <h4>URL</h4>
            <Input
              value={form.url}
              onChange={(e) => onChange('url', e.target.value)}
            />
            <div className="helper-text">
              Exp: "https://cms.monfent.com/schema/detail?id=254956706394538516"
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ShortcutCard
