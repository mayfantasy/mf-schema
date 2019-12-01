import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  Default,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript'
import { basicModelConfig } from '../../../config/db.config'

import Workspace from './workspace.model'

@Table({ modelName: 'feed_template', ...basicModelConfig })
class FeedTemplate extends Model<FeedTemplate> {
  @AllowNull(false)
  @Unique
  @Column({ type: DataType.TEXT })
  name!: string

  @Column({ type: DataType.TEXT })
  description!: string

  @Default([])
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  display_names!: string[]

  @Default([])
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  fields!: string[]

  @Default([])
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  definitions!: string[]

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  country_id!: string

  @ForeignKey(() => Workspace)
  @Column
  workspace_id!: number

  @BelongsTo(() => Workspace)
  workspace!: Workspace
}

export default FeedTemplate
