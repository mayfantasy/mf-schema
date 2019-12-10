import faunadb, { query as q } from 'faunadb'

export const client = (secret: string) => {
  return new faunadb.Client({
    secret: secret || 'ENV NOT FOUND'
  })
}
