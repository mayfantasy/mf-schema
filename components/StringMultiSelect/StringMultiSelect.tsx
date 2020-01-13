import { Select } from 'antd'

interface IProps {
  value: string[]
  options: string[]
  onChange: (value: string[]) => void
}

const StringMultiSelect = (props: IProps) => {
  const { value, onChange, options } = props
  return (
    <div style={{ display: 'inline-block', width: '100%' }}>
      <Select
        mode="multiple"
        value={value}
        style={{ width: '100%' }}
        onChange={onChange}
      >
        {options.map((o) => (
          <Select.Option key={o} value={o}>
            {o}
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}
export default StringMultiSelect
