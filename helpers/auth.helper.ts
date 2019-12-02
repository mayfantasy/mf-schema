import { IBasicAccountInfo } from '../types/account.type'

export const setToken = (token: string) => {
  window.localStorage.setItem('token', token)
}

export const setUser = (user: IBasicAccountInfo) => {
  window.localStorage.setItem('user', JSON.stringify(user))
}

export const removeToken = () => {
  window.localStorage.removeItem('token')
}

export const removeUser = () => {
  window.localStorage.removeItem('user')
}

export const getToken = () => {
  return window.localStorage.getItem('token')
}

export const getUser = () => {
  const user = window.localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}
