import type { DonationToken } from './lib/constants'

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


