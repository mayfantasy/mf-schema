import Axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { getToken } from '../helpers/auth.helper'
const api = Axios.create({
  baseURL: '/api'
})

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken()
    const _config = {
      ...config,
      headers: {
        Authentication: token || ''
      }
    }
    return _config
  },
  (err: AxiosError) => {
    const error = err.response
      ? err.response.data
        ? err.response.data
        : err.response || 'Internal error.'
      : 'Internal error.'
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (res: any) => {
    return res
  },
  (err: AxiosError) => {
    const error = err.response
      ? err.response.data
        ? err.response.data
        : err.response || 'Internal error.'
      : 'Internal error.'
    return Promise.reject(error)
  }
)

export { api }
