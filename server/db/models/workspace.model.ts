import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique
} from 'sequelize-typescript'
import { basicModelConfig } from '../../../config/db.config'

@Table({ modelName: 'workspace', ...basicModelConfig })
class Workspace extends Model<Workspace> {
  @AllowNull(false)
  @Unique
  @Column({ type: DataType.TEXT })
  name!: string

  @Column({ type: DataType.TEXT })
  description!: string
}

export default Workspace
