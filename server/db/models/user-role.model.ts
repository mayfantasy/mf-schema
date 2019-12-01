import { Table, Column, Model, ForeignKey } from 'sequelize-typescript'
import Role from './role.model'
import User from './user.model'
import { basicModelConfig } from '../../../config/db.config'

@Table({ modelName: 'user_role', ...basicModelConfig })
class UserRole extends Model<UserRole> {
  @ForeignKey(() => User)
  @Column
  userId!: number

  @ForeignKey(() => Role)
  @Column
  roleId!: number
}

export default UserRole
