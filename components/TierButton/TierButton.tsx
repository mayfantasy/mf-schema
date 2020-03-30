import { getTier } from '../../helpers/auth.helper'

interface IProps {
  tier: number
  children: React.ReactNode
}
const TierWrapper = (props: IProps) => {
  const { children, tier } = props
  const userTier = getTier()
  return userTier <= tier ? <>{children}</> : null
}

export default TierWrapper
