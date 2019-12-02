export interface ICreateCollectionPayload {
  name: string
  handle: string
  description: string
}

export interface ICollection {
  id: string
  name: string
  handle: string
  description: string
}

export interface IUpdateCollectionPayload {
  id: string
  name?: string
  handle?: string
  description?: string
}
