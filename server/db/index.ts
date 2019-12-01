import { Sequelize } from 'sequelize-typescript'
import { env } from '../../config/env.config'

export const dbConnection = new Sequelize({
  database: env.DB_NAME,
  dialect: 'postgres',
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  modelPaths: [__dirname + '/models/*.model.ts']
})
