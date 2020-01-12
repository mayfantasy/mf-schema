export interface INavItem {
  key: string
  url?: string
  name: string | React.ReactNode
  children?: INavItem[]
  open?: boolean
}
