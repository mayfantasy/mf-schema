export interface IAccessKey {
  id: string
  key: string
  name: string
  description: string
}

export interface ICreateAccessKeyPayload {
  name: string
  description: string
}
