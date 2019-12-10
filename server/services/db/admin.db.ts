import faunadb, { query as q } from 'faunadb'
import { env } from '../../../config/env.config'

export const accountDb = new faunadb.Client({
  secret: env.MF_SCHEMA_ACCOUNT_DB_KEY || 'ENV NOT FOUND'
})
