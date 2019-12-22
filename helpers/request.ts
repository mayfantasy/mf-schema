import { AxiosError } from 'axios'

export class RequestStatus {
  status = {
    loading: false,
    success: false,
    error: ''
  }

  setLoadingStatus = () => {
    this.status = {
      loading: true,
      success: false,
      error: ''
    }
    return this.status
  }

  setSuccessStatus = () => {
    this.status = {
      loading: false,
      success: true,
      error: ''
    }
    return this.status
  }

  setErrorStatus = (err: AxiosError) => {
    this.status = {
      loading: false,
      success: false,
      error: err.message || JSON.stringify(err, null, '  ')
    }
    return this.status
  }
}
