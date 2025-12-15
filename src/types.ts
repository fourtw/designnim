import type { DonationToken } from './lib/constants'
import type { FundraiserData } from './hooks/useFundraising'

// Legacy type for backward compatibility (can be removed later)
export type Fundraiser = {
  id: string
  name: string
  location: string
  description: string
  targetAmount: number
  raisedAmount: number
  targetToken: DonationToken
  impactFocus: string
  imageUrl: string
  walletAddress: `0x${string}`
}

// New type based on smart contract
export type FundraiserFromContract = FundraiserData & {
  // Additional frontend-only fields
  imageUrl?: string
  impactFocus?: string
}


