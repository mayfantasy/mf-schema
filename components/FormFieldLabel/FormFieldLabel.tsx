interface IProps {
  children: React.ReactNode
}
const FormFieldLabel = (props: IProps) => {
  const { children } = props
  return (
    <div style={{ marginBottom: '5px', display: 'inline-block' }}>
      <label style={{ color: 'black' }}>
        <b>{children}</b>
      </label>
    </div>
  )
}
export default FormFieldLabel
