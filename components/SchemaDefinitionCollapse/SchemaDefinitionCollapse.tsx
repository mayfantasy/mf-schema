import { ISchemaFieldDef } from '../../types/schema.type'
import { Collapse, Descriptions } from 'antd'
import ImageViewer from '../ImageViewer/ImageViewer'
import FormFieldLabel from '../FormFieldLabel/FormFieldLabel'

interface IProps {
  defs: ISchemaFieldDef[]
}

const SchemaDefinitionCollapse = (props: IProps) => {
  const { defs } = props
  return (
    <Collapse activeKey="1" bordered={false}>
      <Collapse.Panel header="Data Definition" key="1">
        <Descriptions
          layout="vertical"
          bordered
          size="small"
          style={{ overflowX: 'scroll' }}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          {defs.map((d) => {
            return (
              <Descriptions.Item
                label={
                  <div>
                    <FormFieldLabel>{d.key}</FormFieldLabel>

                    <div>
                      <small>{d.name}</small>
                    </div>
                  </div>
                }
                key={d.key}
              >
                <pre>{d.helper}</pre>

                {d.helper_image && (
                  <>
                    <br />
                    <div>
                      <ImageViewer src={d.helper_image} />
                    </div>
                  </>
                )}
                <div></div>
              </Descriptions.Item>
            )
          })}
        </Descriptions>
      </Collapse.Panel>
    </Collapse>
  )
}

export default SchemaDefinitionCollapse
