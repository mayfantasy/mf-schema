import { AxiosError } from 'axios'

export class RequestStatus {
  status = {
    loading: false,
    success: false,
    error: ''
  }

  loading = () => {
    this.status = {
      loading: true,
      success: false,
      error: ''
    }
    return this.status
  }

  success = () => {
    this.status = {
      loading: false,
      success: true,
      error: ''
    }
    return this.status
  }

  error = (err: AxiosError) => {
    this.status = {
      loading: false,
      success: false,
      error: err.message || JSON.stringify(err, null, '  ')
    }
    return this.status
  }
}
