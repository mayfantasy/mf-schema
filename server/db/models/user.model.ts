import {
  Table,
  Column,
  Model,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  DataType,
  AllowNull,
  Unique,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
  Default
} from 'sequelize-typescript'
import Role from './role.model'
import { basicModelConfig } from '../../../config/db.config'
import { EPrivileges } from '../../../types/privilege.type'
import UserRole from './user-role.model'

@Table({ modelName: 'user', ...basicModelConfig })
class User extends Model<User> {
  @AllowNull(false)
  @Unique
  @Column({ type: DataType.TEXT })
  name!: string

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.TEXT })
  email!: string

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  password!: string

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  active!: boolean

  @Default([])
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  privileges!: EPrivileges[]

  @BelongsToMany(() => Role, () => UserRole)
  roles!: Role[]
}

export default User
