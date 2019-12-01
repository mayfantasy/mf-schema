import Axios, { AxiosError } from 'axios'
const api = Axios.create({
  baseURL: '/api'
})

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
