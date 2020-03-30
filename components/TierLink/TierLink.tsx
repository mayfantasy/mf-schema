import { getTier } from '../../helpers/auth.helper'
import Link from 'next/link'

interface IProps {
  children: string | React.ReactNode
  tier: number
  href: string
}
const TierLink = (props: IProps) => {
  const { children, tier, href } = props
  const userTier = getTier()
  return userTier <= tier ? (
    <Link href={href}>
      <a>{children}</a>
    </Link>
  ) : (
    <span>{children}</span>
  )
}
export default TierLink
