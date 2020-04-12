import { Controlled as CodeMirror } from 'react-codemirror2'
require('codemirror/mode/javascript/javascript')
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/neo.css'
import { CSSProperties } from 'react'

interface IProps {
  value: string
  onChange?: (v: string) => void
  readOnly?: boolean
  style?: CSSProperties
}

const CodeEditor = (props: IProps) => {
  const { value, onChange, readOnly, style } = props
  return (
    <div style={{ border: '1px solid #ccc', ...style }}>
      <style jsx global>{`
        .CodeMirror {
          height: 100%;
        }
      `}</style>
      <CodeMirror
        value={value}
        options={{
          mode: { name: 'javascript', json: true },
          theme: 'neo',
          lineNumbers: true
        }}
        onBeforeChange={(editor, data, value) => {
          if (!readOnly && onChange) {
            onChange(value)
          }
        }}
        onChange={(editor, data, value) => {}}
      />
    </div>
  )
}

export default CodeEditor
