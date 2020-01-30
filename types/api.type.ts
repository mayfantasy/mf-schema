export enum EApiMethod {
  'GET' = 'GET',
  'POST' = 'POST',
  'PUT' = 'PUT',
  'DELETE' = 'DELETE'
}
export interface IApiItem {
  method: EApiMethod
  route: string
  description: string
}
