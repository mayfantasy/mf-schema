import { Button } from 'antd'
import Link from 'next/link'
import { pageRoutes } from '../../navigation/page-routes'

interface IProps {
  showLogo: boolean
}

const HomeHeader = (props: IProps) => {
  const { showLogo } = props
  return (
    <div className="absolute w-100p top-0 left-0  h-70 z-3">
      <nav className="w-100p h-100p ph-20 layout horizontal space-between align-center">
        <div>
          {showLogo && (
            <Link href={pageRoutes.home}>
              <img className="w-200 pointer" src="/logo-monfent.png" />
            </Link>
          )}
        </div>
        <div>
          {/* <Link href={pageRoutes.about}>
            <a className="btn-link">About</a>
          </Link>
          &nbsp;
          <Link href={pageRoutes.features}>
            <a className="btn-link">Features</a>
          </Link>
          &nbsp;
          <Link href={pageRoutes.documentation}>
            <a className="btn-link">Documentation</a>
          </Link>
          &nbsp;&nbsp; */}
          {/* <Link href={pageRoutes.pricing.url}>
            <a className="btn-primary">Pricing</a>
          </Link> */}
          {/* &nbsp; */}
          <Link href={pageRoutes.register}>
            <a>
              <Button type="primary">Sign Up Now</Button>
            </a>
          </Link>
          &nbsp;&nbsp;
          <Link href={pageRoutes.login}>
            <a>
              <Button type="primary">Login</Button>
            </a>
          </Link>
        </div>
      </nav>
    </div>
  )
}
export default HomeHeader
