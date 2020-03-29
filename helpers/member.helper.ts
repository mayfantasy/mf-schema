import { IMemberTier } from '../types/member.type'

export const memberTiers = {
  2: {
    name: 'Admin',
    tier: 2,
    key: 'admin'
  } as IMemberTier,
  3: {
    name: 'Writer',
    tier: 3,
    key: 'writer'
  } as IMemberTier
}
