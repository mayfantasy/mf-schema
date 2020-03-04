import { Controlled as CodeMirror } from 'react-codemirror2'
require('codemirror/mode/javascript/javascript')
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/neo.css'

interface IProps {
  value: string
  onChange?: (v: string) => void
  readOnly?: boolean
}

const CodeEditor = (props: IProps) => {
  const { value, onChange, readOnly } = props
  return (
    <div style={{ border: '1px solid #ccc' }}>
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
