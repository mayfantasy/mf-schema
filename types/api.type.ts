export type IApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export interface IApiItem {
  method: IApiMethod
  route: string
  description: string
}
