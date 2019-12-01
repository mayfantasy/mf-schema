import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  BelongsToMany,
  Default
} from 'sequelize-typescript'
import { basicModelConfig } from '../../../config/db.config'
import { EPrivileges } from '../../../types/privilege.type'
import User from './user.model'
import UserRole from './user-role.model'

@Table({ modelName: 'role', ...basicModelConfig })
class Role extends Model<Role> {
  @AllowNull(false)
  @Unique
  @Column({ type: DataType.TEXT })
  name!: string

  @Column({ type: DataType.TEXT })
  description!: string

  @Default([])
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  privileges!: EPrivileges[]

  @BelongsToMany(() => User, () => UserRole)
  users!: User[]
}

export default Role
