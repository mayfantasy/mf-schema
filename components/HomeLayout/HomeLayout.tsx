import Link from 'next/link'
import HomeHeader from './HomeHeader'
import { pageRoutes } from '../../navigation/page-routes'
import ParticlesBg from './ParticlesBg'

interface IProps {
  children: React.ReactNode
  showLogo?: boolean
}

const HomeLayout = (props: IProps) => {
  const { children, showLogo } = props
  return (
    <div className="layout vertical page-home h-100vh">
      <div className="cb-grey-5 flex-1 relative">
        <HomeHeader showLogo={showLogo || false} />
        <div className="absolute w-100p h-100p top-0 left-0">
          <ParticlesBg />
        </div>
        <div className="absolute top-0 left-0 w-100p h-100p">{children}</div>
      </div>
      {/* <div className="layout horizontal h-70">
        <Link href={pageRoutes.documentation}>
          <a className="layout w-50p cf-white cb-dark-1 justify-center align-center hover-cb-dark-1-07">
            Documentation
          </a>
        </Link>
        <Link href={pageRoutes.features}>
          <a className="layout w-50p cf-black cb-primary justify-center align-center hover-cb-primary-07">
            Features
          </a>
        </Link>
      </div> */}
    </div>
  )
}
export default HomeLayout
