import faunadb, { query as q } from 'faunadb'
import { env } from '../../../config/env.config'

export const master = new faunadb.Client({
  secret: env.MF_SCHEMA_MASTER_KEY || 'ENV NOT FOUND'
})

export const accountDb = new faunadb.Client({
  secret: env.MF_SCHEMA_ACCOUNT_DB_KEY || 'ENV NOT FOUND'
})
