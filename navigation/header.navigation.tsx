import { INavItem } from '../types/navigation.type'
import { pageRoutes } from './page-routes'

export const headerItems: INavItem[] = [
  {
    key: 'register',
    url: pageRoutes.register,
    name: 'Register'
  },
  {
    key: 'login',
    url: pageRoutes.login,
    name: 'Login'
  }
]
