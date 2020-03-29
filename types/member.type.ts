export interface IMember {
  id: string
  username: string
  email: string
  tier: number
  active: boolean
  password: string
}

export interface ICreateMemberPayload {
  username: string
  email: string
  tier: number
  active: boolean
  password: string
}

export interface IUpdateMemberPayload {
  id: string
  username: string
  email: string
  tier: number
  active: boolean
  password: string
}

export interface IMemberTier {
  name: string
  tier: number
  key: string
}
