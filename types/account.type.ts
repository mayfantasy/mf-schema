export interface IAccount {
  id: string
  tier: number
  email: string
  username: string
  password: string
  db_key: string
  api_key: string
}

export interface IClientCreateAccountPayload {
  email: string
  username: string
  password: string
}

export interface IServerCreateAccountPayload {
  tier: number
  email: string
  username: string
  password: string
  db_key: string
  api_key: string
}

export interface IClientUpdateAccountPayload {
  id: string
  tier?: number
  email?: string
  username?: string
  password?: string
}

export interface IBasicAccountInfo {
  email: string
  username: string
}
