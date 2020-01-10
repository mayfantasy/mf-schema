import { useState, useEffect } from 'react'
import 'react-quill/dist/quill.snow.css'
import Loading from '../Loading/Loading'
import dynamic from 'next/dynamic'

const Editor = dynamic({
  loader: () => import('react-quill'),
  loading: () => <Loading />,
  ssr: false
})

interface IProps {
  value: string
  onChange: (value: string) => any
}

const RichTextField = (props: IProps) => {
  const { value, onChange } = props

  return (
    <div>
      <Editor
        theme="snow"
        value={value}
        onChange={(t: string) => onChange(t)}
        modules={{
          toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' }
            ],
            ['link', 'image'],
            ['clean']
          ],
          clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false
          }
        }}
        formats={[
          'header',
          'font',
          'size',
          'bold',
          'italic',
          'underline',
          'strike',
          'blockquote',
          'list',
          'bullet',
          'indent',
          'link',
          'image'
        ]}
        style={{ backgroundColor: 'white' }}
        placeholder="Edit content..."
      />
    </div>
  )
}

export default RichTextField
